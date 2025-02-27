
% Bibliotecas HTTP
:- use_module(library(http/http_server)).
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_parameters)).
:- use_module(library(http/http_client)).
% Bibliotecas JSON
:- use_module(library(http/json_convert)).
%:- use_module(library(http/http_json)).
:- use_module(library(http/json)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_open)).

 :- json_object
 (name:string,shortName:string)+[type=node].
:- json_object
   (list(node)).
:- json_object req(startTime:integer, startNode:string, destNode:string).

:- json_object liga(no1:string,no2:string,path:string).

:- json_object reque(caminho:list(liga), tempo:integer).

:- json_object resAStar(caminho:list(string),percursos:list(string),tempo:integer).
:- json_object resAStarList(lista:list(resAStar)).

:- json_object resBestFirst(caminho:list(string),percursos:list(string),tempo:integer).

:- json_object genetic_response(drivers:list(number),workblocks:list(string)).

:- json_object affectDriversMdvT(driverMecNumber:string).
:- json_object affectDriversMdv(driverMecNumber:string, workBlockList:list(string)).
:- json_object affectDriversListMdv(lista:list(affectDriversMdv),listaError:list(string)).

%Dynamic Fact
:- dynamic nodes/6.
:- dynamic linhas/5.
:- dynamic liga/3.
:- dynamic melhor_caminho/2.
:- dynamic melhor_horario/3.
:- dynamic vehicleduty/3.
:- dynamic workblock/4.
:- dynamic horario/3.
:- dynamic driver/1.
:- dynamic horariomotorista/5.

%horarios para testes
%horario('3', [63000, 63480, 63780, 64080, 64620]).
%horario('1', [61200, 61740, 62040, 62340, 62820]).
%horario('11', [65220, 65700, 65940]).
%horario('8', [70500,71000,71500]).
%horario('5', [75000,75500,76000]).


% Relacao entre pedidos HTTP e predicados que os processam
:- http_handler('/plannings/GeneratorAllSolutions', doGeradorSolucoes, []).
:- http_handler('/plannings/A*', doAStar, []).
:- http_handler('/plannings/BestFirst', doBestFirst, []).
:- http_handler('/plannings/Genetic', doGenetic, []).
:- http_handler('/plannings/AffectDrivers', doAfetarDrivers, []).

% Criacao de servidor HTTP no porto 'Port'
server(Port) :-
        http_server(http_dispatch, [port(Port)]).

stop(Port):-
        http_stop_server(Port,[]).

doBestFirst(Request):-
         http_read_json(Request, JSON, [json_object(dict)]),
         reloadData(JSON.deploy),
         atom_string(Node1,JSON.startNode),
         atom_string(Node2,JSON.destNode),


         (
             bestfs(Node1,Node2,LCaminho,Lpercurso,JSON.startTime,MomentoChegada)
         ,V=resBestFirst(LCaminho,Lpercurso,MomentoChegada);
         V=resBestFirst([],[],0)
         ),

         prolog_to_json(V, JSONObject),
         reply_json(JSONObject, [{}]).

doAStar(Request):-
         http_read_json(Request, JSON, [json_object(dict)]),
         reloadData(JSON.deploy),
         atom_string(Node1,JSON.startNode),
         atom_string(Node2,JSON.destNode),


         %%EDIT FROM HERE
         findall(resAStar(Cam,CamL,Custo),aStar(JSON.startTime,Node1,Node2,Cam,CamL,Custo),R),
         V=resAStarList(R),

         prolog_to_json(V, JSONObject),
         reply_json(JSONObject, [json_object(dict)]).

doGeradorSolucoes(Request):-
         http_read_json(Request, JSON, [json_object(dict)]),
         reloadData(JSON.deploy),
         atom_string(Node1,JSON.startNode),
         atom_string(Node2,JSON.destNode),
         plan_hor_mot(JSON.startTime,Node1,Node2,LCaminho,Tempo),

         transformReply(LCaminho,NewList),

         R = reque(NewList,Tempo),

         prolog_to_json(R, JSONObject),
         reply_json(JSONObject, [json_object(dict)]).

doGenetic(Request):-

        http_read_json(Request,JSON,[json_object(dict)]),
        reloadData(JSON.deploy),

        atom_string(VeicDuty,JSON.veicDutyId),

        gera_genetico(VeicDuty,JSON.duration),


        resultado(_,Pop),

        extract_elem(Pop,Elem),
        vehicleduty(VeicDuty,_,Wks),
        Res = genetic_response(Elem,Wks),

        prolog_to_json(Res,JSONObject),
        reply_json(JSONObject, [json_object(dict)]).


teste():-
 reloadData(0),
(retractall(afetarDrivers_data(_)),!;true), asserta(afetarDrivers_data('1/23/2021')),
    (retractall(logErros(_)),!;true),
afetarDrivers,
 findall(affectDriversMdv(Driver1,ListWb), (driverDuty(Driver,ListWb),atom_string(Driver,Driver1)), Lr),
 write(Lr).

doAfetarDrivers(Request):-

        http_read_json(Request,JSON,[json_object(dict)]),
        reloadData(JSON.deploy),

        D is JSON.day,
        M is JSON.month,
        Y is JSON.year,
        term_to_atom(M/D/Y,R),

 (retractall(afetarDrivers_data(_)),!;true), asserta(afetarDrivers_data(R)),
    (retractall(logErros(_)),!;true),

        afetarDrivers,

      findall(affectDriversMdv(Driver1,ListWb), (driverDuty(Driver,ListWb),atom_string(Driver,Driver1)), Lr),
       findall(E, logErros(E), Le),
Res = affectDriversListMdv(Lr,Le),



        prolog_to_json(Res,JSONObject),
        prolog_to_json(Res,_),

        % sendAffectedDriverDutiesToMdv(JSON.deploy, Res),

        reply_json(JSONObject, [json_object(dict)]).


extract_elem([X*_|_],X).







sendAffectedDriverDutiesToMdv(Deploy,JSONObject):-
  (Deploy==1,(URLMDV = 'http://mdv-g39-01.azurewebsites.net');
        (URLMDV = 'https://localhost:44343')),!,
        sendDriverDuties(URLMDV,JSONObject).

sendDriverDuties(URL,_):-

   atom_concat(URL,'/mdvapi/PlannedDriverDuty', CompleteURL),


    http_post(CompleteURL, [_], _,[ cert_verify_hook(cert_accept_any), request_header('Authorization'='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InJvZ2VybmlvQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlJvZ2VyaW8iLCJEYXRlT2ZCaXJ0aCI6IjcvMjEvMTk5MyIsImV4cCI6MTYxMzYwMDQxOCwiaXNzIjoicm9nZXIuY29tIiwiYXVkIjoicm9nZXIuY29tIn0.AtKnp80t6KfwxSSBLBmUofr4mjRMWNH0tJGRzQBpyWM') ]).






reloadData(Deploy):-
        (Deploy==1,(URL = 'http://lapr5-20s5-mdr.herokuapp.com', URLMDV = 'http://mdv-g39-01.azurewebsites.net');
        (URL = 'http://localhost:3000', URLMDV = 'https://localhost:44343')),!,
        getNodes(URL),
        getLines(URL),
        getTrips(URLMDV),
        getWorkBlocksAndVehicleDuty(URLMDV),
        getDrivers(URLMDV),
         gera_ligacoes.

transformReply([],[]).
transformReply([(AtomNo1,AtomNo2,AtomPath)|L],[X|NewList]):-
        atom_string(AtomNo1,No1),
        atom_string(AtomNo2,No2),
        atom_string(AtomPath,Path),
        X = liga(No1,No2,Path),
        transformReply(L,NewList).

%Obtem nos do MDR
getNodes(URL):-
    retractall(nodes(_,_,_,_,_,_)),
   atom_concat(URL,'/api/node/listByQuery?sortby=shortName', CompleteURL),



    http_get(CompleteURL, Reply,[json_object(dict), request_header('Authorization'='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InJvZ2VybmlvQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlJvZ2VyaW8iLCJEYXRlT2ZCaXJ0aCI6IjcvMjEvMTk5MyIsImV4cCI6MTYxMzYwMDQxOCwiaXNzIjoicm9nZXIuY29tIiwiYXVkIjoicm9nZXIuY29tIn0.AtKnp80t6KfwxSSBLBmUofr4mjRMWNH0tJGRzQBpyWM')]),

    %Lists Nodes in JSON are located in Reply
 % http_get(CompleteURL, Reply, [json_object(dict)]),
% http_open(CompleteURL, Reply, [request_header('Authorization'='Bearer
% eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InJvZ2VybmlvQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlJvZ2VyaW8iLCJEYXRlT2ZCaXJ0aCI6IjcvMjEvMTk5MyIsImV4cCI6MTYxMzYwMDQxOCwiaXNzIjoicm9nZXIuY29tIiwiYXVkIjoicm9nZXIuY29tIn0.AtKnp80t6KfwxSSBLBmUofr4mjRMWNH0tJGRzQBpyWM')]),
%

   splitHeadNode(Reply).


% First we will separate the node located in the head of the List
splitHeadNode([]).
splitHeadNode([X|L]):-
   createNode(X),
   splitHeadNode(L).


%Create node facts
createNode(X):-(X.isDepot == "true",!,D = 't';D = 'f'),
   (X.isReliefPoint== "true",!,R = 't';R = 'f'),!,
   %JSON comes with atom and we want it as strings
   atom_string(N,X.name),
   atom_string(M,X.shortName),

   assertz(nodes(N,M,R,D,X.longitude,X.latitude)),
   !.



%Obtain list of lines and transform json to Reply
getLines(URL):-
   retractall(linhas(_,_,_,_,_)),
     atom_concat(URL,'/api/line/listByQuery?sortBy=name', CompleteURL),
    http_get(CompleteURL, Reply,[json_object(dict), request_header('Authorization'='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InJvZ2VybmlvQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlJvZ2VyaW8iLCJEYXRlT2ZCaXJ0aCI6IjcvMjEvMTk5MyIsImV4cCI6MTYxMzYwMDQxOCwiaXNzIjoicm9nZXIuY29tIiwiYXVkIjoicm9nZXIuY29tIn0.AtKnp80t6KfwxSSBLBmUofr4mjRMWNH0tJGRzQBpyWM')]),

     %http_open(CompleteURL, Reply, [request_header('Authorization'='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InJvZ2VybmlvQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlJvZ2VyaW8iLCJEYXRlT2ZCaXJ0aCI6IjcvMjEvMTk5MyIsImV4cCI6MTYxMzYwMDQxOCwiaXNzIjoicm9nZXIuY29tIiwiYXVkIjoicm9nZXIuY29tIn0.AtKnp80t6KfwxSSBLBmUofr4mjRMWNH0tJGRzQBpyWM')]),

   splitHeadLine(URL,Reply).


% Separate the Line located in the head of the List of Lines
splitHeadLine(_,[]).
splitHeadLine(URL,[X|L]):-
   getPaths(URL,X,List),

   %Obtain list name
   atom_string(R,X.name),

   createLine(R,List),
   splitHeadLine(URL,L).




%Will make a request type get to obtain paths from specific line
getPaths(URL,X,List):-

    %Transform key from string to atom
    atom_string(S,X.key),

    atom_concat(URL,'/api/line/paths/',Old),

    %Concatenate url and the id from list to return list of paths
    atom_concat(Old,S,Url),

       http_get(Url, Reply,[json_object(dict), request_header('Authorization'='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InJvZ2VybmlvQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlJvZ2VyaW8iLCJEYXRlT2ZCaXJ0aCI6IjcvMjEvMTk5MyIsImV4cCI6MTYxMzYwMDQxOCwiaXNzIjoicm9nZXIuY29tIiwiYXVkIjoicm9nZXIuY29tIn0.AtKnp80t6KfwxSSBLBmUofr4mjRMWNH0tJGRzQBpyWM')]),


    %Lines Line paths to Reply
   % http_get(Url, Reply, [json_object(dict)]),
 %  http_open(Url, Reply, [request_header('Authorization'='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InJvZ2VybmlvQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlJvZ2VyaW8iLCJEYXRlT2ZCaXJ0aCI6IjcvMjEvMTk5MyIsImV4cCI6MTYxMzYwMDQxOCwiaXNzIjoicm9nZXIuY29tIiwiYXVkIjoicm9nZXIuY29tIn0.AtKnp80t6KfwxSSBLBmUofr4mjRMWNH0tJGRzQBpyWM')]),


    List=Reply.paths.




% Receives name line and List of paths from that line
createLine(_,[]):-!.
createLine(Nome,[X|L]):-
   %save the key without it being string
   atom_string(Num,X.key),

   %Will fill all variables that will be used to create fact linhas
   newgetPathSums(X.pathSegments,Listnodes,Min,Dist),

   assertz(linhas(Nome,Num,Listnodes,Min,Dist)),
   %write('Line was created'),
   %write(Nome),nl,write(Num),nl,write(Listnodes),nl,write(Min),nl,write(Dist),nl,
   createLine(Nome,L).



%X represent one pathsegment
getPathSegmentSums([],[],0,0):-!.
getPathSegmentSums([X|L],Listnodes,Min,Dist):-
   %Adiciona sempre os nos na segunda posicao

   getPathSegmentSums(L,Listnodes1,Min1,Dist1),
   %Soma minutos
   Min is Min1+X.duration,
   %Soma distancias
   Dist is Dist1+X.distance,

   atom_string(Newnode,X.node2),

   Listnodes = [Newnode|Listnodes1].



%adicionar primeiro no do primeiro segmento a lista
newgetPathSums([X|L],Newlist,M,D):-

   atom_string(Nodestr,X.node1),

   getPathSegmentSums([X|L],List,M,D),
   Newlist = [Nodestr|List].

 getTrips(URL):-
   retractall(horario(_,_,_)),
     atom_concat(URL,'/mdvapi/trip', CompleteURL),
    http_get(CompleteURL, Reply,[json_object(dict),cert_verify_hook(cert_accept_any), request_header('Authorization'='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6Im1kdi5nMDM5QGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlJvZ2VyaW8iLCJEYXRlT2ZCaXJ0aCI6IjIxLzA3LzE5OTMiLCJleHAiOjE2MTM1MDI1MzQsImlzcyI6InJvZ2VyLmNvbSIsImF1ZCI6InJvZ2VyLmNvbSJ9.6k9gz3Z9F3plyXInyo08yCWnmCNZDSH9sjCXS2ISXhY')]),

     %http_open(CompleteURL, Reply, [request_header('Authorization'='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InJvZ2VybmlvQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlJvZ2VyaW8iLCJEYXRlT2ZCaXJ0aCI6IjcvMjEvMTk5MyIsImV4cCI6MTYxMzYwMDQxOCwiaXNzIjoicm9nZXIuY29tIiwiYXVkIjoicm9nZXIuY29tIn0.AtKnp80t6KfwxSSBLBmUofr4mjRMWNH0tJGRzQBpyWM')]),

   splitTrips(URL,Reply).


% Separate multiple trips received in the reply
splitTrips(_,[]):-!.
splitTrips(URL,[X|L]):-

   atom_string(TripId,X.key),
   atom_string(PathId,X.pathId),
   assertz(horario(PathId,TripId,X.passingTimes)),

   splitTrips(URL,L).


getWorkBlocksAndVehicleDuty(URL):-
   retractall(workblock(_,_,_,_)),
   retractall(vehicleduty(_,_,_)),
     atom_concat(URL,'/mdvapi/WorkBlocks', CompleteURL),
    http_get(CompleteURL, Reply,[json_object(dict),cert_verify_hook(cert_accept_any), request_header('Authorization'='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6Im1kdi5nMDM5QGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlJvZ2VyaW8iLCJEYXRlT2ZCaXJ0aCI6IjIxLzA3LzE5OTMiLCJleHAiOjE2MTM1MDI1MzQsImlzcyI6InJvZ2VyLmNvbSIsImF1ZCI6InJvZ2VyLmNvbSJ9.6k9gz3Z9F3plyXInyo08yCWnmCNZDSH9sjCXS2ISXhY')]),

     %http_open(CompleteURL, Reply, [request_header('Authorization'='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6InJvZ2VybmlvQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlJvZ2VyaW8iLCJEYXRlT2ZCaXJ0aCI6IjcvMjEvMTk5MyIsImV4cCI6MTYxMzYwMDQxOCwiaXNzIjoicm9nZXIuY29tIiwiYXVkIjoicm9nZXIuY29tIn0.AtKnp80t6KfwxSSBLBmUofr4mjRMWNH0tJGRzQBpyWM')]),

   splitWorkBlocks(URL,Reply).


% Separate the Line located in the head of the List of Lines
splitWorkBlocks(_,[]):-!.
splitWorkBlocks(URL,[X|L]):-

   %Resolve facts of vehicleDuties
   atom_string(VehicleD,X.vehicleDutyCode),

   atom_string(Code, X.code),
   atom_string(Data,X.date),
   assertz(workblock(Code,X.trips,X.startTime,X.endTime)),
   !,
   ((vehicleduty(VehicleD,_,_),!,verifyVehicleDuty(VehicleD,Code));!,true,asserta(vehicleduty(VehicleD,Data,[Code]))),

   %Add facts of workblocks
   splitWorkBlocks(URL,L).


verifyVehicleDuty(VehicId,Wb):-
        retract(vehicleduty(VehicId,Data,L)),
        verifyIfWorkExists(L,Wb,NewList),
        assertz(vehicleduty(VehicId,Data,NewList)).

verifyIfWorkExists(OldList, Id, NewList):-
        member(Id,OldList),!,NewList=OldList;
        %append(OldList,[Id],NewList)
        appendWorkBlockInRightPlaceByStartingTime(OldList,Id,NewList).

appendWorkBlockInRightPlaceByStartingTime(OldList,Id,Result):-
        workblock(Id,_,Starting,_),
        obtainSplitedList(Starting,OldList,[],FirstPartOfList,LastPartOfList),
        append(FirstPartOfList,[Id],NewList),
        append(NewList,LastPartOfList,Result).

obtainSplitedList(_,[],List,List,[]):-!.
obtainSplitedList(Starting,[X|L],List,Begin,Last):-
        (workblock(X,_,TimeTemp,_);fail),

        TimeTemp<Starting,!,append(List,[X],NewList),obtainSplitedList(Starting,L,NewList,Begin,Last);Begin=List,Last=[X|L].


getDrivers(URL):-
        retractall(driver(_)),
        retractall(horariomotorista(_,_,_,_,_)),
     atom_concat(URL,'/mdvapi/Driver', CompleteURL),
    http_get(CompleteURL, Reply,[json_object(dict),cert_verify_hook(cert_accept_any), request_header('Authorization'='Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6Im1kdi5nMDM5QGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlJvZ2VyaW8iLCJEYXRlT2ZCaXJ0aCI6IjIxLzA3LzE5OTMiLCJleHAiOjE2MTM1MDI1MzQsImlzcyI6InJvZ2VyLmNvbSIsImF1ZCI6InJvZ2VyLmNvbSJ9.6k9gz3Z9F3plyXInyo08yCWnmCNZDSH9sjCXS2ISXhY')]),

splitDrivers(Reply).

splitDrivers([]):-!.
splitDrivers([X|Y]):-
   atom_string(DriverId,X.mechanographicNumber),
   assertz(driver(DriverId)),
   gerarDefaultHorario(DriverId),
   splitDrivers(Y).

%Cria um horario default para o condutor consumido do mdv
gerarDefaultHorario(Driv):-
        HcomecaTrabalhar is 28800,
        HfimTrabalhar is 64800,
        DuracaoTotalTrabalho is 28800,
        ListaBlocos = [21600,7200],
        assertz(horariomotorista(Driv,HcomecaTrabalhar,HfimTrabalhar,DuracaoTotalTrabalho,ListaBlocos)).


gera_ligacoes:-
retractall(liga(_,_,_)),
findall(_,((nodes(_,No1,t,f,_,_);
% esta linha sera alterada pois o nosso dominio assume que um depot e
% sempre relief point
nodes(_,No1,t,t,_,_)),
(nodes(_,No2,t,f,_,_);
nodes(_,No2,t,t,_,_)),
No1\==No2,
linhas(_,N,LNos,_,_),
ordem_membros(No1,No2,LNos),
assertz(liga(No1,No2,N))),_).

ordem_membros(No1,No2,[No1|L]):- member(No2,L),!.
ordem_membros(No1,No2,[_|L]):- ordem_membros(No1,No2,L).

caminho(Noi,Nof,LCaminho):-caminho(Noi,Nof,[],LCaminho).
caminho(No,No,Lusadas,Lfinal):-reverse(Lusadas,Lfinal).
caminho(No1,Nof,Lusadas,Lfinal):-
liga(No1,No2,N),
\+member((_,_,N),Lusadas),
\+member((No2,_,_),Lusadas),
\+member((_,No2,_),Lusadas),
caminho(No2,Nof,[(No1,No2,N)|Lusadas],Lfinal).



plan_hor_mot(Passing_inicio,Noi,Nof,LCaminho,Tempo):-


   (ver_melhor_caminho(Passing_inicio,Noi,Nof);true),

   %Depois de ser executado predicado ver_melhor_caminho, o melhor_caminho no topo da base de conhecimentos, sera o melhor tempo para o melhor caminho

   retract(melhor_caminho(LCaminho,Tempo)).

%Ciclo para verificar qual o melhor caminho
ver_melhor_caminho(Passing_inicio,Noi,Nof):-
   %adiciona no topo da lista um melhor_caminho com um tempo elevado
   asserta(melhor_caminho(_,100000)),

   %Verifica os caminhos disponiveis do Noinicial ao Nofinal
   caminho(Noi,Nof,LCaminho),

   %Predicado e chamado com o objetivo de verificar cada caminho(conjunto de percursos) existentes dentro da LCaminho(Lista de caminhos)

  ((atualiza_melhor(Passing_inicio,LCaminho),fail);fail).


% Passing_Inicio e quando comeca o horario do motorista
% LCaminho e o conjunto de percursos
atualiza_melhor(Passing_inicio,LCaminho):-

   %Obtem o melhor_caminho
   melhor_caminho(_,Melhor_tempo),

   %calcula os horarios para a lista de percursos
   (calcula_horario_do_caminho(Passing_inicio,LCaminho,Tempo_caminho);fail),

   Tempo_caminho<Melhor_tempo,retract(melhor_caminho(_,_)),
   asserta(melhor_caminho(LCaminho,Tempo_caminho)).




%Calcula melhor horario do caminho recebido
% Quando acabar de verificar o melhor horario para todos os percurso vai
% inicializar o tempo a 0
 calcula_horario_do_caminho(_,[],0):-!.
calcula_horario_do_caminho(Passing_inicio,[(No1,No2,P)|L],Tempo):-

  %inicializa melhor horario
  asserta(melhor_horario(P,_,100000)),

  %chama predicado que vai encontrar melhor horario e adiciona-lo ao topo dos factos
  (atualiza_melhor_horario(Passing_inicio,No1,P);true),

  %obtem melhor horario do percurso (P),List de passing times e o tempo que esperou ate inicializar horario
  retract(melhor_horario(P,List,Tempo_espera)),
  %Obtem tempo de passagem no ultimo no do percurso que sera o proximo passing_inicio
  getPositionFromNode(P,No1,List,Passing_inicio_perc),

  getPositionFromNode(P,No2,List,Novo_Passing),


  %obtem tempo de duracao do percurso e a diferenca entre pontos de rendicao/depot
  Duracao is Novo_Passing - Passing_inicio_perc,

  %Calcula proximo percurso da lista
  calcula_horario_do_caminho(Novo_Passing,L,Tempo1),

  %Recursivamente obtem valor do tempo que esperou ate inicializar o percurso, a duracao do percurso + o tempo anterior dos outros percursos
  Tempo is Tempo1 + Tempo_espera + Duracao.


% Verifica qual o melhor horario para um percurso desde o momento que se
% comeca a espera (Passing)
atualiza_melhor_horario(Passing,No1, Path):-
   %procura horario para o percurso
   horario(Path,_,[X|L]),

   getPositionFromNode(Path,No1,[X|L],P),

   %Se o horario comecar depois do tempo que comeca a espera, calcula-se o tempo de espera
   (( Passing<P,Tempo_espera is P - Passing);fail),
    %Vai ao topo ver melhor horario para o percurso do momento, se o N(Tempo de espera) for maior que o Tempo_espera do atual, ele retira o melhor, e adiciona o novo com os respetivos dados do horario
   melhor_horario(Path,_,N),
   ((Tempo_espera<N,
    retract(melhor_horario(_,_,_)),asserta(melhor_horario(Path,[X|L],Tempo_espera)))
   ;fail).



getPositionFromNode(Path,No1,[X|L],NewPassing):-
        !,linhas(_,Path,ListaNodos,_,_),
        element_at(No1,ListaNodos,Pos),
        (   ground(X),
        getElement(NewPassing,[X|L],Pos);fail).

getElement(Valor,[X|_],0):-Valor is X,!.
getElement(Valor,[_|L],K):- K1 is K-1,getElement(Valor,L,K1).

element_at(X,[X|_],0):-!.
element_at(X,[_|L],K) :- element_at(X,L,K1), K is K1 + 1.







%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%Implementacao do A* adaptado
aStar(Hinit,Orig,Dest,Cam,CamL,Custo):-
        aStar2(Hinit,Dest,[(_,Hinit,[Orig],[])],Cam,CamL,Custo).


aStar2(Hinit,Dest,[(_,Ha,[Dest|T],Linhas)|_],Cam,CamL,Custo):-
        reverse([Dest|T],Cam),reverse(Linhas,CamL), Custo is (Ha-Hinit).

aStar2(Hinit,Dest,[(_,Ha,LA,Linhas)|Outros],Cam,CamL,Custo):-
        LA=[Act|_],
        findall((HEX,HaX,[X|LA],[Linha|Linhas]),
                (Dest\==Act,ligaCustos(Ha,Act,X,HcustoX,Linha),\+ member(X,LA), \+ member(Linha,Linhas),
                 HaX is HcustoX + Ha, estimativa(X,Dest,EstX),
                 HEX is HaX +EstX),Novos),
        append(Outros,Novos,Todos),
        sort(Todos,TodosOrd),
        aStar2(Hinit,Dest,TodosOrd,Cam,CamL,Custo).


% Estimativa do tempo que demora em linha reta do Nodo1 ao Nodo2
estimativa(Nodo1,Nodo2,Estimativa):-
        velocidadeMedia(Vm),
        nodes(_,Nodo1,_,_,X1,Y1),
        nodes(_,Nodo2,_,_,X2,Y2),
        Dist is sqrt((X1-X2)^2+(Y1-Y2)^2),
        Estimativa is Dist/Vm.

% Obtem a maior velocidade media de todas as linhas
velocidadeMedia(Vm):-
        findall(Vel,(linhas(_,_,_,Tempo,Dist),Vel is Dist/Tempo),Lista),
        max_list(Lista,Vm).


% Obtem um No X, com ligacao direta ao No Act (ambos de
% recolha/rendicao), e obtem os seus respetivos tempos de demora T e
% Percurso Per a que pertencem para todos os horarios
%
% Obtem o percurso usando liga/3, obtem a posicao nos horarios de cada
% nodo usando posPer/3, obtem o horario usando horario/2,obtem a hora
% de cada um colocando a posicao do Nodo e lista de horarios em nth0/3,
% verifica se a hora atual e inferior a hora a que o autocarro
% passa,calcula a diferenca entre as horas dos nodos, calcula o seu
% valor absoluto e no final retorna esse valor absoluto mais 120
% segundos (que e o tempo de espera pelo autocarro)

ligaCustos(Ha,Act,X,T,Per):-
        liga(Act,X,Per),posPer(Per,Act,PosAct),posPer(Per,X,PosX),
        horario(Per,_,Lista),nth0(PosAct,Lista,TAct),Ha<TAct,Tespera is TAct-Ha,
        nth0(PosX,Lista,TX),Dif is TAct-TX,
        abs(Dif,AbsDif), T is AbsDif+120+Tespera.


% Obtem a posicao de um no num percurso
posPer(Per,Nodo,Pos):-
        linhas(_,Per,ListaNodos,_,_), nth0(Pos,ListaNodos,Nodo).





% inicio do best first

%metodo que obtem o resultado do bestfirst e calcula o momento de chegada ao destino

calx([H1|[H2|T2]],[H3|T3],PassingTime,MomentoChegada):-
calx2([H1|[H2|T2]],[H3|T3],PassingTime,MomentoChegada),!.


calx2([_],_,Lastpassingtime,Lastpassingtime):- !.


calx2([H1|[H2|T2]],[H3|T3],Lastpassingtime,MomentoChegada):-

linhas(_,H3,Perc,_,_),


nth0(PosAct,Perc,H1),


horario(H3,_,ListaHorario),

nth0(PosAct,ListaHorario,Tempoespera),

Lastpassingtime=<Tempoespera,





nth0(Posd,Perc,H2),

Posd>PosAct,

nth0(Posd,ListaHorario,LastpassingTime),




calx2([H2|T2],T3,LastpassingTime,MomentoChegada).



% algoritmo best first adaptado ao problema


bestfs(Orig,Dest,Cam,Lreverse,PassingTime,MomentoChegada):-

bestfs2(Dest,(0,[Orig]),Cam,[],Lreverse),!,
calx(Cam,Lreverse,PassingTime,MomentoChegada).



bestfs2(Dest,(_,[Dest|T]),Cam,Listapathspercorridos,Lreverse):-

reverse([Dest|T],Cam),

reverse(Listapathspercorridos, Lreverse),

!.




bestfs2(Dest,(Ca,LA),Cam,Listapathspercorridos,Lreverse):-

LA=[Act|_],

findall((EstX,CaX,[X|LA],[Hp|Listapathspercorridos]),
(

liga(Act,X,Hp),

estimativabf(Act,X,Cx),

\+member(X,LA),
estimativabf(X,Dest,EstX),



CaX is Ca+Cx)
 ,Novos),


sort(Novos,NovosOrd),
%NovosOrd = [(_,Cm,Melhor,Listpath)|_], comentado porque fiz a altera��o sugerida pelo regente
proximo(NovosOrd,Cm,Melhor,Listpath),

bestfs2(Dest,(Cm,Melhor),Cam,Listpath,Lreverse).





estimativabf(Nodo1,Nodo2,Estimativa):-

nodes(_,Nodo1,_,_,X1,Y1),
nodes(_,Nodo2,_,_,X2,Y2),
Estimativa is sqrt((X1-X2)^2+(Y1-Y2)^2).


proximo([(_,Cm,Melhor,Listpath)|_],Cm,Melhor,Listpath).
proximo([_|L],Cm,Melhor,Listpath):- proximo(L,Cm,Melhor,Listpath).


%factos para testes
%horario('3', [63000, 63480, 63780, 64080, 64620]).
%horario('1', [61200, 61740, 62040, 62340, 62820]).
%horario('11', [65220, 65700, 65940]).
%horario('8', [70500,71000,71500]).
%horario('5', [75000,75500,76000]).

%lista_motoristas_nworkblocks('12',[('276',2),('5188',3),('16690',2),('18107',6)]).
%lista_motoristas_nworkblocks('VeicDutT01',[('276',1),('5188',1)]).
%lista_motoristas_nworkblocks('VeicDutT02',[('276',1),('5188',2),('16690',1)]).


% Vehicle duties passam a ter este formato
% vehicleduty(ID,Data,ListaWorkBlocks)
%vehicleduty('12','1/2/2000',['12','211','212','213','214','215','216','217','218','219','220','221','222']).
%vehicleduty('13','1/2/2000',['223','224','225','226','227','228','229','230']).
%vehicleduty('14','1/2/2000',['231','232']).



%workblock('12',['459'],34080,37620).
%workblock('211',['31','63'],37620,41220).
%workblock('212',['33','65'],41220,44820).
%workblock('213',['35','67'],44820,48420).
%workblock('214',['37','69'],48420,52020).
%workblock('215',['39','71'],52020,55620).
%workblock('216',['41','73'],55620,59220).
%workblock('217',['43','75'],59220,62820).
%workblock('218',['45','77'],62820,66420).
%workblock('219',['48','82'],66420,70020).
%workblock('220',['52','86'],70020,73620).
%workblock('221',['56','432'],73620,77220).
%workblock('222',['460'],77220,77340).

%workblock('223',['459'],34080,37620).
%workblock('224',['31','63'],37620,41220).
%workblock('225',['33','65'],41220,44820).
%workblock('226',['35','67'],44820,48420).
%workblock('227',['37','69'],48420,52020).
%workblock('228',['39','71'],52020,55620).
%workblock('229',['41','73'],55620,59220).
%workblock('230',['43','75'],59220,62820).

%workblock('231',['56','432'],34090,34195).
%workblock('232',['460'],34195,34300).

% Dps do tiago mudar a valida��o para n explodir sem prefs isto deixa de
% ser necess�rio

pref_horario('5188',28800,64800 ). %das 8:00h �s 18:00h
pref_horario('16690',0,36000).     %das 00:00h �s 10:00h
pref_horario('18107',0,86400).     %das 00:00h �s 24:00h

pref_horario('1', 0, 36000). %das 00:00h �s 10:00h
pref_horario('2', 0,86400).  %das 00:00h �s 24:00h
pref_horario('276',36000, 72000). %das 10:00h �s 20:00h
pref_horario('999',36000, 72000). %das 10:00h �s 20:00h

%ASSERTS INICIAIS
%Utilizados no genetico
:-asserta(percentagem_melhor_manter(0.25)).
:-asserta(duracao_maxima(10)).
:-asserta(avaliacaoexp(1)).
:-asserta(estabiliz(4)).
:-asserta(selected_vehicle_duty('12')).
:-asserta(max_delay_time(0)). %Tempo máximo de atraso
:-asserta(first_meal_start_time(39600)). %Hora de inicio da primeira refeicao
:-asserta(first_meal_end_time(54000)). %Hora de fim da primeira refeicao
:-asserta(second_meal_start_time(64800)). %Hora de inicio da segunda refeicao
:-asserta(second_meal_end_time(79200)). %Hora de fim da primeira refeicao
:-asserta(nightshift_start_time(72000)). %Hora de inicio do periodo noturno
:-asserta(nightshift_end_time(28800)). %Hora de fim do periodo noturno
:-asserta(max_day_overtime(0)). % duracao maxima de trabalho extra durante o dia
:-asserta(max_night_overtime(0)). % duracao maxima de trabalho extra durante a noite
:-asserta(max_consecutive_hours(14400,10)). % numero maximo de horas consecutivas que o motorista pode fazer em segundos
:-asserta(max_work_hours(28800,10)). % numero maximo de horas que o motorista pode fazer no total em segundos
:-asserta(rest_hour(3600,10)). %duracao da pausa apos um bloco de 4 horas e respetiva penalizacao aquando da nao cumpricao da mesma
:-asserta(max_time_during_meal(10800)).% numero maximo que o motorista pode trabalhar durante periodo de refeicao
:-asserta(meal_break_time(3600,8)). % duracao da pausa de refeicao e respetiva penalizacao aquando da nao cumpricao da mesma
:-asserta(pref_horario_pen(1)). % penalizacao da soft constraint da preferencia de horario do motorista
:-asserta(resultado(_)).
:-dynamic t/3.


% NOVO ALGORITMO (SPRINT D)
%Facts
:-dynamic logErros/1.
:-dynamic rangevd/3.
:-dynamic t/4.
:-dynamic t/5.
:-dynamic driver/1.
:-dynamic horariomotorista/5.
:-dynamic d/5.

percentagem_margem_carga(0.2). %N�mero em percentagem, define qual a margem extra que as horas de trabalho dos condutores devem ter sobre as horas de trabalho necess�rios de vehicleduties

%driver('2').
%driver('1').
%driver('276').
%driver('999').

% horariomotorista(IdMotorista,Hcome�aTrabalhar,HacabaTrabalhar,DuracaoTotalCondu�ao,ListaDuracaoBlocosTrabalho)
%horariomotorista('2',25200,61200,28800, [21600,7200]).
%horariomotorista('276',25200,61200,28800, [21600,7200]).
%horariomotorista('1',25200,61200,28800, [21600,7200]).
%horariomotorista('999',25200,61200,28800, [21600,7200]).



t(25200,50400,100,100,'2').

%afetarDrivers_data('1/2/2000'). %valor default



%Adiciona um elemento ao log de erros
gerarLogErros(Msg):-
    (logErros(L),!;L = []),
    append(L,[Msg],ResLogs),
     (retractall(logErros(_));true),!,asserta(logErros(ResLogs)).

%Chamada inicial ao algoritmo
afetarDrivers:-
    (retractall(list_of_facts_t(_)),!;true),
    (retractall(lista_motoristas_nworkblocks(_,_)),!;true),
    (retractall(resultado(_,_)),!;true),
    (retractall(driverDutyTemp(_,_)),!;true),
    (retractall(driverDuty(_,_)),!;true),
    %realiza retracts necess�rios aqui

    %inicializar_afetarDrivers, usado apenas para demonstracao de algav, lapr5 usa json enviado com esta info (data)
    verificacao_carga,
    ordena(Ds,Vs), %% Ds é a lista de factos t() (blocos de trabalho de motoristas) ordenada,  Vs é a lista dos veicleDuties ordenada  tudo por ordem crescente de tempo de começo
    %writeln('lista ts ordenada'),writeln(Ds),
    %writeln('lista vs ordenada'),write(Vs),
    asserta(list_of_vehiclesDutiesSorted(Vs)),
    asserta(list_of_facts_t(Ds)), % asserted the list of facts t() becouse it will be easier to use it in recursive funtions as i will delete
    constroi_factos_motoristas_nworkblocks_inicial(Vs),!,
    %writeln('Depois da atribuicao inicial de maiore blocos horas a cada vd lista t()= '),list_of_facts_t(R), write(R),!,
    constroi_factos_motoristas_nworkblocks_restantes(Vs),

    chamar_algoritmo_genetico(Vs), %para todos os vehicle duties, vai ser preciso guardar o facto antes de ser removido no fim de cada chamada
    gerar_driver_dutiesTemp(Vs),!,%writeln('hererererere1'),
    gerar_driver_duties(Ds),
    check_and_improve(),
    !.
check_and_improve():-reset_lista_visitados(),verificar_sobreposicoes(),!,reset_lista_visitados(),verificar_duracao_consecutivos(),!,reset_lista_visitados(),
verificar_pausa_entre_consecutivos(),!,reset_lista_visitados(),verificar_intervalo_refeicao(),!,reset_lista_visitados(),final_check_para_log_erros(),!.

final_check_para_log_erros():-reset_lista_visitados(),verificar_sobreposicoes_log(),!,reset_lista_visitados(),verificar_duracao_consecutivos_log(),!,reset_lista_visitados(),
verificar_pausa_entre_consecutivos_log(),!,reset_lista_visitados(),verificar_intervalo_refeicao_log(),!,reset_lista_visitados().

obter_lista_driver_duties(LD):-findall((Driver,Lwb),driverDuty(Driver,Lwb),LD2),reverse(LD2, LD)
,!.

reset_lista_visitados():-(retractall(lista_visitados(_));true),asserta(lista_visitados([])),!.


verificar_intervalo_refeicao():-obter_lista_driver_duties(LD),setupAgenda(LD),
findall((Driver,Agenda),(agenda_driver(Driver,Agenda)),Lnf),
lista_visitados(Lv),remove_visitados(Lnf,Lv),lista_filtrada(Lf),verificar_intervalos_refeicoes2(Lf).

verificar_intervalos_refeicoes2([(Driver,Agenda)]):-verificar_refeicoes(Driver,Agenda,[]).
verificar_intervalos_refeicoes2([(Driver,Agenda)|T]):-verificar_refeicoes(Driver,Agenda,T),verificar_intervalos_refeicoes2(T).

verificar_refeicoes(Driver,[(_,_,_,_,_)],_):-lista_visitados(Lv),(retractall(lista_visitados(_));true),append([Driver],Lv,Lv2),asserta(lista_visitados(Lv2)),!.
verificar_refeicoes(Driver,[(Ti,Tf,VdAtual,_,ListaWbs)|[(Ti2,Tf2,VdProximo,_,ListaWbsProximo)|T]],LRestDrivers):-
(Tf>39600,54000>Tf,Ti2<54000,averiguar_pausa_refeicao_caso1(Driver,(Ti,Tf,VdAtual,_,ListaWbs),(Ti2,Tf2,VdProximo,_,ListaWbsProximo)),verificar_refeicoes(Driver,[(Ti2,Tf2,VdProximo,_,ListaWbsProximo)|T],LRestDrivers));
(Tf>39600,54000>Tf,Ti2>=54000,averiguar_pausa_almoco_caso2(Driver,(Ti,Tf,VdAtual,_,ListaWbs),(Ti2,Tf2,VdProximo,_,ListaWbsProximo)),verificar_refeicoes(Driver,[(Ti2,Tf2,VdProximo,_,ListaWbsProximo)|T],LRestDrivers));
(Ti>39600,54000>Ti,averiguar_pausa_almoco_caso3(Driver,(Ti,Tf,VdAtual,_,ListaWbs)),verificar_refeicoes(Driver,[(Ti2,Tf2,VdProximo,_,ListaWbsProximo)|T],LRestDrivers));
(Tf>64800,79200>Tf,Ti2<64800,averiguar_pausa_refeicao_caso1(Driver,(Ti,Tf,VdAtual,_,ListaWbs),(Ti2,Tf2,VdProximo,_,ListaWbsProximo)),verificar_refeicoes(Driver,[(Ti2,Tf2,VdProximo,_,ListaWbsProximo)|T],LRestDrivers));
(Tf>64800,79200>Tf,Ti2>=79200,averiguar_pausa_jantar_caso2(Driver,(Ti,Tf,VdAtual,_,ListaWbs),(Ti2,Tf2,VdProximo,_,ListaWbsProximo)),verificar_refeicoes(Driver,[(Ti2,Tf2,VdProximo,_,ListaWbsProximo)|T],LRestDrivers));
(Ti>64800,79200>Ti,averiguar_pausa_jantar_caso3(Driver,(Ti,Tf,VdAtual,_,ListaWbs)),verificar_refeicoes(Driver,[(Ti2,Tf2,VdProximo,_,ListaWbsProximo)|T],LRestDrivers))
;verificar_refeicoes(Driver,[(Ti2,Tf2,VdProximo,_,ListaWbsProximo)|T],LRestDrivers).


averiguar_pausa_refeicao_caso1(Driver,(_,Tf,VdAtual,_,ListaWbs),(Ti2,_,_,[(Wb2,_,TiWb2,TfWb2)|T])):-
    obter_ultimo_workblock(ListaWbs,(_,LastTrip,_,TfWb)),workblock(Wb2,[FirstTrip2|_],_,_),
    find_last_node_of_trip(LastTrip,Node1),find_first_node_of_trip(FirstTrip2,Node2),(aStar(TfWb,Node1,Node2,_,_,TDeslocacao),!;gerarLogErros("Erro no AStar ao tentar averiguar tempo de deslocacao"),false),
    Tf=<Ti2,TPausa is (Ti2-Tf),TPausaReal is (TPausa-TDeslocacao),TPausaReal<3600,TConflito is (Tf+TDeslocacao+3600),retirar_blocos_excesso_pausa(TConflito,Driver,VdAtual,[(Wb2,_,TiWb2,TfWb2)|T]).

averiguar_pausa_almoco_caso2(Driver,(_,Tf,VdAtual,_,ListaWbs),(Ti2,_,_,_,[(Wb2,_,_,_)|_])):-
    obter_ultimo_workblock(ListaWbs,(_,LastTrip,_,TfWb)),workblock(Wb2,[FirstTrip2|_],_,_),
    find_last_node_of_trip(LastTrip,Node1),find_first_node_of_trip(FirstTrip2,Node2),(aStar(TfWb,Node1,Node2,_,_,TDeslocacao),!;gerarLogErros("Erro no AStar ao tentar averiguar tempo de deslocacao"),false),
    Tf=<Ti2,TPausa is (54000-Tf),TDif is (Ti2-Tf),TMax is 3600+TDeslocacao,TDif=<TMax,TPausa=<3600,X is (3600-TPausa),TConflito is (Tf-X),retirar_blocos_excesso_refeicao_caso2(TConflito,Driver,VdAtual,ListaWbs).

averiguar_pausa_almoco_caso3(Driver,(Ti,_,VdAtual,_,ListaWbs)):-Dif is (54000-Ti),Dif<3600,TConflito is 54000,retirar_blocos_excesso_refeicao_caso3(TConflito,Driver,VdAtual,ListaWbs).

averiguar_pausa_jantar_caso2(Driver,(_,Tf,VdAtual,_,ListaWbs),(Ti2,_,_,_,[(Wb2,_,_,_)|_])):-
    obter_ultimo_workblock(ListaWbs,(_,LastTrip,_,TfWb)),workblock(Wb2,[FirstTrip2|_],_,_),
    find_last_node_of_trip(LastTrip,Node1),find_first_node_of_trip(FirstTrip2,Node2),(aStar(TfWb,Node1,Node2,_,_,TDeslocacao),!;gerarLogErros("Erro no AStar ao tentar averiguar tempo de deslocacao"),false),
    Tf=<Ti2,TPausa is (79200-Tf),TDif is (Ti2-Tf),TMax is 3600+TDeslocacao,TDif=<TMax,TPausa=<3600,X is (3600-TPausa),TConflito is (Tf-X),retirar_blocos_excesso_refeicao_caso2(TConflito,Driver,VdAtual,ListaWbs).

averiguar_pausa_jantar_caso3(Driver,(Ti,_,VdAtual,_,ListaWbs)):-Dif is (79200-Ti),Dif<3600,TConflito is 79200,retirar_blocos_excesso_refeicao_caso3(TConflito,Driver,VdAtual,ListaWbs).

retirar_blocos_excesso_refeicao_caso2(_,_,_,[]).
retirar_blocos_excesso_refeicao_caso2(TConflito,Driver,VdAtual,[(Wb,_,TiWb,TfWb)|Resto]):-TConflito<TfWb, meter_livre(Wb,TiWb,TfWb,Driver),verificar_intervalo_refeicao();retirar_blocos_excesso_refeicao_caso2(TConflito,Driver,VdAtual,Resto).

retirar_blocos_excesso_refeicao_caso3(_,_,_,[]).
retirar_blocos_excesso_refeicao_caso3(TConflito,Driver,VdAtual,[(Wb,_,TiWb,TfWb)|Resto]):-TConflito>TiWb, meter_livre(Wb,TiWb,TfWb,Driver),verificar_intervalo_refeicao();retirar_blocos_excesso_refeicao_caso3(TConflito,Driver,VdAtual,Resto).

%VERIFICAR PAUSA DE 1 HORA ENTRE BLOCOS CONSECUTIVOS DE 4 HORAS
verificar_pausa_entre_consecutivos():-obter_lista_driver_duties(LD),setupAgenda(LD),
findall((Driver,Agenda),(agenda_driver(Driver,Agenda)),Lnf),
lista_visitados(Lv),remove_visitados(Lnf,Lv),lista_filtrada(Lf),verificar_pausa_entre_consecutivos2(Lf).

verificar_pausa_entre_consecutivos2([(Driver,Agenda)]):-verificar_pausa_consecutivos(Driver,Agenda,[]).
verificar_pausa_entre_consecutivos2([(Driver,Agenda)|T]):-
    verificar_pausa_consecutivos(Driver,Agenda,T),verificar_pausa_entre_consecutivos2(T).


verificar_pausa_consecutivos(Driver,[(_,_,_,_,_)],_):-lista_visitados(Lv),(retractall(lista_visitados(_));true),append([Driver],Lv,Lv2),asserta(lista_visitados(Lv2)),!.
verificar_pausa_consecutivos(Driver,[(Ti,Tf,VdAtual,_,ListaWbs)|[(Ti2,Tf2,VdProximo,_,ListaWbsProximo)|T]],LRestDrivers):-
(Duracao is Tf-Ti,(Duracao=14400,averiguar_pausa(Driver,(Ti,Tf,VdAtual,_,ListaWbs),(Ti2,Tf2,VdProximo,_,ListaWbsProximo)),verificar_pausa_consecutivos(Driver,[(Ti2,Tf2,VdProximo,_,ListaWbsProximo)|T],LRestDrivers));verificar_pausa_consecutivos(Driver,[(Ti2,Tf2,VdProximo,_,ListaWbsProximo)|T],LRestDrivers)).


averiguar_pausa(Driver,(_,Tf,VdAtual,_,ListaWbs),(Ti2,_,_,_,[(Wb2,_,TiWb2,TfWb2)|T])):-
    obter_ultimo_workblock(ListaWbs,(_,LastTrip,_,TfWb)),workblock(Wb2,[FirstTrip2|_],_,_),
    find_last_node_of_trip(LastTrip,Node1),find_first_node_of_trip(FirstTrip2,Node2),(aStar(TfWb,Node1,Node2,_,_,TDeslocacao),!;gerarLogErros("Erro no AStar ao tentar averiguar tempo de deslocacao"),false),
    Tf=<Ti2,TPausa is (Ti2-Tf),TPausaReal is (TPausa-TDeslocacao),TPausaReal<3600,TConflito is (Tf+TDeslocacao+3600),retirar_blocos_excesso_pausa(TConflito,Driver,VdAtual,[(Wb2,_,TiWb2,TfWb2)|T]).


find_last_node_of_trip2([Node1],Node1).
find_last_node_of_trip2([_|T],Node1):-obter_ultima_trip(T,Node1),!.

find_last_node_of_trip(LastTrip,Node1):-horario(Path,LastTrip,_),linha(_,Path,ListaNodes,_,_),find_last_node_of_trip2(ListaNodes,Node1),!.

find_first_node_of_trip(FirstTrip2,Node2):-horario(Path,FirstTrip2,_),linha(_,Path,[Node2|_],_,_),!.

obter_ultima_trip([LastTrip],LastTrip).
obter_ultima_trip([_|T],LastTrip):-obter_ultima_trip(T,LastTrip),!.

obter_ultimo_workblock([(Wb,_,TiWb2,TfWb2)],(Wb,LastTrip,TiWb2,TfWb2)):-workblock(Wb,Trips,_,_),obter_ultima_trip(Trips,LastTrip).
obter_ultimo_workblock([_|T],(Wb,LastTrip,TiWb2,TfWb2)):-obter_ultimo_workblock(T,(Wb,LastTrip,TiWb2,TfWb2)),!.

retirar_blocos_excesso_pausa(_,_,_,[]).
retirar_blocos_excesso_pausa(TConflito,Driver,VdAtual,[(Wb,_,TiWb,TfWb)|Resto]):-TConflito>TiWb, meter_livre(Wb,TiWb,TfWb,Driver),verificar_pausa_entre_consecutivos();retirar_blocos_excesso_pausa(TConflito,Driver,VdAtual,Resto).
%------------------------------------------------------


%VERIFICAR SE HÁ BLOCOS CONSECUTIVOS COM MAIS DE 4 HORAS
verificar_duracao_consecutivos():-obter_lista_driver_duties(LD),setupAgenda(LD),
findall((Driver,Agenda),(agenda_driver(Driver,Agenda)),Lnf),
lista_visitados(Lv),remove_visitados(Lnf,Lv),lista_filtrada(Lf),verificar_duracao_consecutivos2(Lf).

verificar_duracao_consecutivos2([(Driver,Agenda)]):-verificar_blocos_consecutivos(Driver,Agenda,[]).
verificar_duracao_consecutivos2([(Driver,Agenda)|T]):-
    verificar_blocos_consecutivos(Driver,Agenda,T),verificar_duracao_consecutivos2(T).

verificar_blocos_consecutivos(Driver,[],_):-lista_visitados(Lv),(retractall(lista_visitados(_));true),append([Driver],Lv,Lv2),asserta(lista_visitados(Lv2)),!.
verificar_blocos_consecutivos(Driver,[(Ti,Tf,VdAtual,_,ListaWbs)|T],LRestDrivers):-
(Duracao is Tf-Ti,(Duracao>14400,TConflit is (Ti+14400),retirar_blocos_excesso(TConflit,Driver,VdAtual,ListaWbs),verificar_blocos_consecutivos(Driver,T,LRestDrivers));verificar_blocos_consecutivos(Driver,T,LRestDrivers)).


retirar_blocos_excesso(_,_,_,[]).
retirar_blocos_excesso(TConflito,Driver,VdAtual,[(Wb,_,TiWb,TfWb)|Resto]):-TConflito<TfWb, meter_livre(Wb,TiWb,TfWb,Driver),verificar_duracao_consecutivos();retirar_blocos_excesso(TConflito,Driver,VdAtual,Resto).
%------------------------------------------------------

%VERIFICAR SE HÁ SOBREPOSICOES NOS BLOCOS DO DRIVER DUTY
verificar_sobreposicoes():-obter_lista_driver_duties(LD),setupAgenda(LD),
findall((Driver,Agenda),(agenda_driver(Driver,Agenda)),Lnf),
lista_visitados(Lv),remove_visitados(Lnf,Lv),lista_filtrada(Lf),verificar_sobreposicoes2(Lf).

verificar_sobreposicoes2([(Driver,Agenda)]):-intersetar_blocos_agenda(Driver,Agenda,[]).
verificar_sobreposicoes2([(Driver,Agenda)|T]):-
    intersetar_blocos_agenda(Driver,Agenda,T),verificar_sobreposicoes2(T).

intersetar_blocos_agenda(Driver,[(_,_,_,_,_)],_):-lista_visitados(Lv),(retractall(lista_visitados(_));true),append([Driver],Lv,Lv2),asserta(lista_visitados(Lv2)),!.
intersetar_blocos_agenda(Driver,[(Ti,Tf,_,_,_)|[(Ti2,Tf2,VdProximo,_,ListaWbsProximo)|T]],LRestDrivers):-
    (Ti=<Ti2,Tf2=<Tf,corrigir_workblocks_conflito(Ti2,Tf2,ListaWbsProximo,LRestDrivers,VdProximo,Driver));
    (Ti=<Ti2,Ti2<Tf,Tf2>Tf,corrigir_workblocks_conflito(Ti2,Tf,ListaWbsProximo,LRestDrivers,VdProximo,Driver));intersetar_blocos_agenda(Driver,[(Ti2,Tf2,_,_,ListaWbsProximo)|T],LRestDrivers).

corrigir_workblocks_conflito(TiConflit,TfConflit,[(Wb,_,TiWb,TfWb)|Resto],LRestDrivers,VdProximo,Driver):-
(TiWb>=TiConflit,TiWb=<TfConflit,obter_tempo_possivel_novo_bloco(Resto,TNovoBloco)),
(encontrar_bloco_para_trocar(VdProximo,TNovoBloco,Bloco),
encontrar_driver_para_trocar(Bloco,LRestDrivers,Driver2),troca(Wb,Bloco,Driver,Driver2),!,verificar_sobreposicoes(),! ;meter_livre(Wb,TiWb,TfWb,Driver),verificar_sobreposicoes(),!;true,!);corrigir_workblocks_conflito(TiConflit,TfConflit,Resto,LRestDrivers,VdProximo,Driver).
%------------------------------------------------------

%VERIFICAR TUDO QUE NÃO SE CONSEGUIU CORRIGIR E METER NO LOG ERROS
verificar_sobreposicoes_log():-obter_lista_driver_duties(LD),setupAgenda(LD),
findall((Driver,Agenda),(agenda_driver(Driver,Agenda)),Lnf),
lista_visitados(Lv),remove_visitados(Lnf,Lv),lista_filtrada(Lf),verificar_sobreposicoes2_log(Lf).

verificar_sobreposicoes2_log([(Driver,Agenda)]):-intersetar_blocos_agenda_log(Driver,Agenda,[]).
verificar_sobreposicoes2_log([(Driver,Agenda)|T]):-
    intersetar_blocos_agenda_log(Driver,Agenda,T),verificar_sobreposicoes2_log(T).

intersetar_blocos_agenda_log(Driver,[(_,_,_,_,_)],_):-lista_visitados(Lv),(retractall(lista_visitados(_));true),append([Driver],Lv,Lv2),asserta(lista_visitados(Lv2)),!.
intersetar_blocos_agenda_log(Driver,[(Ti,Tf,_,_,_)|[(Ti2,Tf2,VdProximo,_,ListaWbsProximo)|T]],LRestDrivers):-
    (Ti=<Ti2,Tf2=<Tf,log_workblocks_conflito(Ti2,Tf2,ListaWbsProximo,LRestDrivers,VdProximo,Driver));
    (Ti=<Ti2,Ti2<Tf,Tf2>Tf,log_workblocks_conflito(Ti2,Tf,ListaWbsProximo,LRestDrivers,VdProximo,Driver));intersetar_blocos_agenda_log(Driver,[(Ti2,Tf2,_,_,ListaWbsProximo)|T],LRestDrivers).

log_workblocks_conflito(TiConflit,TfConflit,[(Wb,_,TiWb,_)|Resto],LRestDrivers,VdProximo,Driver):-
(TiWb>=TiConflit,TiWb=<TfConflit,atom_string(Driver,D),atom_string(Wb,Wb2),number_string(TiConflit,Ti),number_string(TfConflit,Tf),string_concat("O Condutor ", D, SD1)
,string_concat(SD1," tem sobreposicoes",S1),
string_concat(" entre ",Ti,S2),string_concat(" e ",Tf,S3),string_concat(" com o workblock ", Wb2, S5)
, string_concat(S1, S2, S4),string_concat(S4, S3, S6),string_concat(S6, S5, S),gerarLogErros(S),!,
log_workblocks_conflito(TiConflit,TfConflit,Resto,LRestDrivers,VdProximo,Driver),!);!,log_workblocks_conflito(TiConflit,TfConflit,Resto,LRestDrivers,VdProximo,Driver),!.

verificar_duracao_consecutivos_log():-obter_lista_driver_duties(LD),setupAgenda(LD),
findall((Driver,Agenda),(agenda_driver(Driver,Agenda)),Lnf),
lista_visitados(Lv),remove_visitados(Lnf,Lv),lista_filtrada(Lf),verificar_duracao_consecutivos2_log(Lf).

verificar_duracao_consecutivos2_log([(Driver,Agenda)]):-verificar_blocos_consecutivos_log(Driver,Agenda,[]).
verificar_duracao_consecutivos2_log([(Driver,Agenda)|T]):-
    verificar_blocos_consecutivos_log(Driver,Agenda,T),verificar_duracao_consecutivos2_log(T).

verificar_blocos_consecutivos_log(Driver,[],_):-lista_visitados(Lv),(retractall(lista_visitados(_));true),append([Driver],Lv,Lv2),asserta(lista_visitados(Lv2)),!.
verificar_blocos_consecutivos_log(Driver,[(Ti,Tf,_,_,_)|T],LRestDrivers):-
(Duracao is Tf-Ti,(Duracao>14400,atom_string(Driver,D),string_concat("O Condutor ", D, SD1),string_concat(SD1," tem blocos consecutivos superiores a 4 horas",S1),gerarLogErros(S1),verificar_blocos_consecutivos_log(Driver,T,LRestDrivers));verificar_blocos_consecutivos_log(Driver,T,LRestDrivers)).

verificar_pausa_entre_consecutivos_log():-obter_lista_driver_duties(LD),setupAgenda(LD),
findall((Driver,Agenda),(agenda_driver(Driver,Agenda)),Lnf),
lista_visitados(Lv),remove_visitados(Lnf,Lv),lista_filtrada(Lf),verificar_pausa_entre_consecutivos2_log(Lf).

verificar_pausa_entre_consecutivos2_log([(Driver,Agenda)]):-verificar_pausa_consecutivos_log(Driver,Agenda,[]).
verificar_pausa_entre_consecutivos2_log([(Driver,Agenda)|T]):-
    verificar_pausa_consecutivos_log(Driver,Agenda,T),verificar_pausa_entre_consecutivos2_log(T).


verificar_pausa_consecutivos_log(Driver,[(_,_,_,_,_)],_):-lista_visitados(Lv),(retractall(lista_visitados(_));true),append([Driver],Lv,Lv2),asserta(lista_visitados(Lv2)),!.
verificar_pausa_consecutivos_log(Driver,[(Ti,Tf,VdAtual,_,ListaWbs)|[(Ti2,Tf2,VdProximo,_,ListaWbsProximo)|T]],LRestDrivers):-
(Duracao is Tf-Ti,(Duracao=14400,averiguar_pausa_log(Driver,(Ti,Tf,VdAtual,_,ListaWbs),(Ti2,Tf2,VdProximo,_,ListaWbsProximo)),verificar_pausa_consecutivos_log(Driver,[(Ti2,Tf2,VdProximo,_,ListaWbsProximo)|T],LRestDrivers));verificar_pausa_consecutivos_log(Driver,[(Ti2,Tf2,VdProximo,_,ListaWbsProximo)|T],LRestDrivers)).


averiguar_pausa_log(Driver,(_,Tf,_,_,ListaWbs),(Ti2,_,_,_,[(Wb2,_,_,_)|_])):-
    obter_ultimo_workblock(ListaWbs,(_,LastTrip,_,TfWb)),workblock(Wb2,[FirstTrip2|_],_,_),
    find_last_node_of_trip(LastTrip,Node1),find_first_node_of_trip(FirstTrip2,Node2),(aStar(TfWb,Node1,Node2,_,_,TDeslocacao),!;gerarLogErros("Erro no AStar ao tentar averiguar tempo de deslocacao"),false),
    Tf=<Ti2,TPausa is (Ti2-Tf),TPausaReal is (TPausa-TDeslocacao),TPausaReal<3600,
    atom_string(Driver,D),string_concat("O Condutor ", D, SD1),string_concat(SD1," nao faz pausa de 1 hora entre ",S1),
    number_string(Tf,TfS),number_string(Ti2,Ti2S),string_concat(S1,TfS,S2),string_concat(S2," e ",S3),string_concat(S3,Ti2S,S4),gerarLogErros(S4).




verificar_intervalo_refeicao_log():-obter_lista_driver_duties(LD),setupAgenda(LD),
findall((Driver,Agenda),(agenda_driver(Driver,Agenda)),Lnf),
lista_visitados(Lv),remove_visitados(Lnf,Lv),lista_filtrada(Lf),verificar_intervalos_refeicoes2_log(Lf).

verificar_intervalos_refeicoes2_log([(Driver,Agenda)]):-verificar_refeicoes_log(Driver,Agenda,[]).
verificar_intervalos_refeicoes2_log([(Driver,Agenda)|T]):-verificar_refeicoes_log(Driver,Agenda,T),verificar_intervalos_refeicoes2_log(T).

verificar_refeicoes_log(Driver,[(_,_,_,_,_)],_):-lista_visitados(Lv),(retractall(lista_visitados(_));true),append([Driver],Lv,Lv2),asserta(lista_visitados(Lv2)),!.
verificar_refeicoes_log(Driver,[(Ti,Tf,VdAtual,_,ListaWbs)|[(Ti2,Tf2,VdProximo,_,ListaWbsProximo)|T]],LRestDrivers):-
(Tf>39600,54000>Tf,Ti2<54000,averiguar_pausa_almoco_caso1_log(Driver,(Ti,Tf,VdAtual,_,ListaWbs),(Ti2,Tf2,VdProximo,_,ListaWbsProximo)),verificar_refeicoes_log(Driver,[(Ti2,Tf2,VdProximo,_,ListaWbsProximo)|T],LRestDrivers));
(Tf>39600,54000>Tf,Ti2>=54000,averiguar_pausa_almoco_caso2_log(Driver,(Ti,Tf,VdAtual,_,ListaWbs),(Ti2,Tf2,VdProximo,_,ListaWbsProximo)),verificar_refeicoes_log(Driver,[(Ti2,Tf2,VdProximo,_,ListaWbsProximo)|T],LRestDrivers));
(Ti>39600,54000>Ti,averiguar_pausa_almoco_caso3_log(Driver,(Ti,Tf,VdAtual,_,ListaWbs)),verificar_refeicoes_log(Driver,[(Ti2,Tf2,VdProximo,_,ListaWbsProximo)|T],LRestDrivers));
(Tf>64800,79200>Tf,Ti2<64800,averiguar_pausa_jantar_caso1_log(Driver,(Ti,Tf,VdAtual,_,ListaWbs),(Ti2,Tf2,VdProximo,_,ListaWbsProximo)),verificar_refeicoes_log(Driver,[(Ti2,Tf2,VdProximo,_,ListaWbsProximo)|T],LRestDrivers));
(Tf>64800,79200>Tf,Ti2>=79200,averiguar_pausa_jantar_caso2_log(Driver,(Ti,Tf,VdAtual,_,ListaWbs),(Ti2,Tf2,VdProximo,_,ListaWbsProximo)),verificar_refeicoes_log(Driver,[(Ti2,Tf2,VdProximo,_,ListaWbsProximo)|T],LRestDrivers));
(Ti>64800,79200>Ti,averiguar_pausa_jantar_caso3_log(Driver,(Ti,Tf,VdAtual,_,ListaWbs)),verificar_refeicoes_log(Driver,[(Ti2,Tf2,VdProximo,_,ListaWbsProximo)|T],LRestDrivers))
;verificar_refeicoes_log(Driver,[(Ti2,Tf2,VdProximo,_,ListaWbsProximo)|T],LRestDrivers).


averiguar_pausa_almoco_caso1_log(Driver,(_,Tf,_,_,ListaWbs),(Ti2,_,_,[(Wb2,_,_,_)|_])):-
    obter_ultimo_workblock(ListaWbs,(_,LastTrip,_,TfWb)),workblock(Wb2,[FirstTrip2|_],_,_),
    find_last_node_of_trip(LastTrip,Node1),find_first_node_of_trip(FirstTrip2,Node2),(aStar(TfWb,Node1,Node2,_,_,TDeslocacao),!;gerarLogErros("Erro no AStar ao tentar averiguar tempo de deslocacao"),false),
    Tf=<Ti2,TPausa is (Ti2-Tf),TPausaReal is (TPausa-TDeslocacao),TPausaReal<3600, atom_string(Driver,D),string_concat("O Condutor ", D, SD1),string_concat(SD1," nao faz pausa de 1 hora para almocar ",S1)
,gerarLogErros(S1).
averiguar_pausa_jantar_caso1_log(Driver,(_,Tf,_,_,ListaWbs),(Ti2,_,_,[(Wb2,_,_,_)|_])):-
    obter_ultimo_workblock(ListaWbs,(_,LastTrip,_,TfWb)),workblock(Wb2,[FirstTrip2|_],_,_),
    find_last_node_of_trip(LastTrip,Node1),find_first_node_of_trip(FirstTrip2,Node2),(aStar(TfWb,Node1,Node2,_,_,TDeslocacao),!;gerarLogErros("Erro no AStar ao tentar averiguar tempo de deslocacao"),false),
    Tf=<Ti2,TPausa is (Ti2-Tf),TPausaReal is (TPausa-TDeslocacao),TPausaReal<3600, atom_string(Driver,D),string_concat("O Condutor ", D, SD1),string_concat(SD1," nao faz pausa de 1 hora para jantar ",S1)
,gerarLogErros(S1).
averiguar_pausa_almoco_caso2_log(Driver,(_,Tf,_,_,ListaWbs),(Ti2,_,_,_,[(Wb2,_,_,_)|_])):-
    obter_ultimo_workblock(ListaWbs,(_,LastTrip,_,TfWb)),workblock(Wb2,[FirstTrip2|_],_,_),
    find_last_node_of_trip(LastTrip,Node1),find_first_node_of_trip(FirstTrip2,Node2),(aStar(TfWb,Node1,Node2,_,_,TDeslocacao),!;gerarLogErros("Erro no AStar ao tentar averiguar tempo de deslocacao"),false),
    Tf=<Ti2,TPausa is (54000-Tf),TDif is (Ti2-Tf),TMax is 3600+TDeslocacao,TDif=<TMax,TPausa=<3600,atom_string(Driver,D),string_concat("O Condutor ", D, SD1),string_concat(SD1," nao faz pausa de 1 hora para almocar ",S1)
    ,gerarLogErros(S1).

averiguar_pausa_almoco_caso3_log(Driver,(Ti,_,_,_,_)):-Dif is (54000-Ti),Dif<3600,atom_string(Driver,D),string_concat("O Condutor ", D, SD1),string_concat(SD1," nao faz pausa de 1 hora para almocar ",S1)
,gerarLogErros(S1).

averiguar_pausa_jantar_caso2_log(Driver,(_,Tf,_,_,ListaWbs),(Ti2,_,_,_,[(Wb2,_,_,_)|_])):-
    obter_ultimo_workblock(ListaWbs,(_,LastTrip,_,TfWb)),workblock(Wb2,[FirstTrip2|_],_,_),
    find_last_node_of_trip(LastTrip,Node1),find_first_node_of_trip(FirstTrip2,Node2),(aStar(TfWb,Node1,Node2,_,_,TDeslocacao),!;gerarLogErros("Erro no AStar ao tentar averiguar tempo de deslocacao"),false),
    Tf=<Ti2,TPausa is (79200-Tf),TDif is (Ti2-Tf),TMax is 3600+TDeslocacao,TDif=<TMax,TPausa=<3600,atom_string(Driver,D),string_concat("O Condutor ", D, SD1),string_concat(SD1," nao faz pausa de 1 hora para jantar ",S1)
    ,gerarLogErros(S1).

averiguar_pausa_jantar_caso3_log(Driver,(Ti,_,_,_,_)):-Dif is (79200-Ti),Dif<3600,atom_string(Driver,D),string_concat("O Condutor ", D, SD1),string_concat(SD1," nao faz pausa de 1 hora para jantar ",S1)
,gerarLogErros(S1).


%------------------------------------------------------

%PREDICADOS AUXILIARES
troca(Bloco1,Bloco2,Driver1,Driver2):-
    driverDuty(Driver1,ListaDriver1),(retractall(driverDuty(Driver1,_));true),subtract(ListaDriver1,[Bloco1],ListaDriver1N),
    append(ListaDriver1N,[Bloco2],ListaNova1),ordenar_lista_workblocks(ListaNova1,ListaSort1),asserta((driverDuty(Driver1,ListaSort1))),
    driverDuty(Driver2,ListaDriver2),(retractall(driverDuty(Driver2,_));true),subtract(ListaDriver2,[Bloco2],ListaDriver2N),
    append(ListaDriver2N,[Bloco1],ListaNova2),ordenar_lista_workblocks(ListaNova2,ListaSort2),asserta((driverDuty(Driver2,ListaSort2))),!.


meter_livre(Bloco,TiWb,TfWb,Driver):-Duracao is TfWb-TiWb,encontrar_driver_livre(Duracao,Driver2,Driver),meter_livre2(Bloco,Driver,Driver2,Duracao).

meter_livre2(Bloco,Driver,(Ti,Tf,L,D,Driver2),Duracao):-driverDuty(Driver,ListaDriver),(retractall(driverDuty(Driver,_));true),subtract(ListaDriver,[Bloco],ListaDriver1N),
ordenar_lista_workblocks(ListaDriver1N,ListaSort1),asserta((driverDuty(Driver,ListaSort1))),

((driverDuty(Driver2,ListaDriver2),(retractall(driverDuty(Driver2,_));true),
append(ListaDriver2,[Bloco],ListaNova2),ordenar_lista_workblocks(ListaNova2,ListaSort2),asserta((driverDuty(Driver2,ListaSort2))),(retractall(t(Ti,Tf,L,D,Driver2));true),D2 is Duracao+D,
asserta(t(Ti,Tf,L,D2,Driver2)));
append([],[Bloco],ListaNova2),asserta((driverDuty(Driver2,ListaNova2))),(retractall(t(Ti,Tf,L,D,Driver2));true),D2 is Duracao+D,
asserta(t(Ti,Tf,L,D2,Driver2))),!.

encontrar_driver_livre(Duracao,(Ti,Tf,L,D,Driver2),Driver1):-findall((Ti,Tf,L,D,Driver2),(t(Ti,Tf,L,D,Driver2),L>D,Dif is L-D,Dif>=Duracao,Driver1 \= Driver2),[(Ti,Tf,L,D,Driver2)|_]),!.

ordenar_lista_workblocks2([],[]).
ordenar_lista_workblocks2([(_,Wb1)|T],ListaSort):-ordenar_lista_workblocks2(T,ListaSort2),append([Wb1],ListaSort2,ListaSort),!.
ordenar_lista_workblocks(Lista,ListaSort):-findall((Ti,Wb),(workblock(Wb,_,Ti,_),member(Wb,Lista)),ListTemp),sort(ListTemp,ListTemp2),ordenar_lista_workblocks2(ListTemp2,ListaSort).


encontrar_bloco_para_trocar(VdProximo,TNovoBloco,Bloco):-
vehicleduty(VdProximo,_,ListaBlocos),findall(B,(member(B,ListaBlocos),workblock(B,_,TiB,_),TiB>=TNovoBloco),[Bloco|_]),!.

encontrar_driver_para_trocar(Bloco,LRestDrivers,Driver):-
findall(Driver,(driverDuty(Driver,ListaBlocos),member((Driver,_),LRestDrivers),member(Bloco,ListaBlocos)),[Driver|_]),!.

obter_tempo_possivel_novo_bloco([(_,_,_,TfWb)],TNovoBloco):-TNovoBloco is TfWb.
obter_tempo_possivel_novo_bloco([_|T],TNovoBloco):-
    obter_tempo_possivel_novo_bloco(T,TNovoBloco).


remove_visitados2(Lr,Lv):-remove_visitados(Lr,Lv),!.
remove_visitados(Ld,[]):-(retractall(lista_filtrada(_));true),asserta(lista_filtrada(Ld)),!.
remove_visitados(Lr,[H1|T1]):-subtract(Lr,[(H1,_)],Ld), remove_visitados(Ld,T1),!.

setupAgenda([(D,Lwb)]):-setupAgenda2(D,Lwb),!.
setupAgenda([(D1,Lwb1)|T]):-setupAgenda2(D1,Lwb1),setupAgenda(T).
setupAgenda2(D,Lwb):-get_lista_vds(Lwb,Lvd),criar_agenda(Lvd,Lwb,D),!.

criar_agenda(Lvd,Lwb,D):-

criar_agenda2(D,Lvd, Lwb,-1,[]),
fill_agenda(AgendaX),sort(AgendaX,Agenda),(retractall(agenda_driver(D,_));true),assert(agenda_driver(D,Agenda)),!.

fill_agenda(Agenda):-!,findall((Ti,Tf,Vd,D,Lista),d(Ti,Tf,Vd,D,Lista),Agenda),retractall(d(_,_,_,_,_)).
criar_agenda2(D,[H1],[Hw],Ti,Lista):-Ti = -1,(workblock(Hw,_,Tinicio,Tfinal),X is Tfinal-Tinicio,append([(Hw,X,Tinicio,Tfinal)],Lista,Lista2),reverse(Lista2,Lista2X),assertz(d(Tinicio,Tfinal,H1,D,Lista2X))),!; (workblock(Hw,_,Tinicio,Tfinal),X is Tfinal-Tinicio,append([(Hw,X,Tinicio,Tfinal)],Lista,Lista2),reverse(Lista2,Lista2X),assertz(d(Ti,Tfinal,H1,D,Lista2X))),!.

criar_agenda2(D,[H1|[H2|T1]],[Hw|[Hw2|Tw]],Ti,Lista):-
  Ti = -1 ,( (H1 = H2 ,workblock(Hw2,_,Tinicio2,_),
workblock(Hw,_,Tinicio,Tf),Tf=Tinicio2,X is Tf-Tinicio,append([(Hw,X,Tinicio,Tf)],Lista,Lista2),!,criar_agenda2(D,[H2|T1],[Hw2|Tw],Tinicio,Lista2));(workblock(Hw,_,Tinicio,Tfinal),X is Tfinal-Tinicio,append([(Hw,X,Tinicio,Tfinal)],Lista,Lista2),reverse(Lista2,Lista2X),assertz(d(Tinicio,Tfinal,H1,D,Lista2X)),!, criar_agenda2(D,[H2|T1],[Hw2|Tw],-1,[])) )  ;
( (H1 = H2,workblock(Hw2,_,Tinicio2,_),
workblock(Hw,_,Tinicio,Tf),Tf=Tinicio2,X is Tf-Tinicio,append([(Hw,X,Tinicio,Tf)],Lista,Lista2) ,!,criar_agenda2(D,[H2|T1],[Hw2|Tw],Ti,Lista2)) ;(workblock(Hw,_,Tinicio,Tfinal),X is Tfinal-Tinicio,append([(Hw,X,Tinicio,Tfinal)],Lista,Lista2),reverse(Lista2,Lista2X),assertz(d(Ti,Tfinal,H1,D,Lista2X)),!,criar_agenda2(D,[H2|T1],[Hw2|Tw],-1,[])) ).

get_lista_vds([Wb],LVd):-get_vehicleDuty_from_workblock(Wb,Vd),append([Vd],[],LVd).
get_lista_vds([Wb1|T],LVd):-get_lista_vds(T,LVd2),get_vehicleDuty_from_workblock(Wb1,Vd),append([Vd],LVd2,LVd).
get_vehicleDuty_from_workblock(Wb,Vd):-afetarDrivers_data(D),findall(Vd,(vehicleduty(Vd,D,Lwb),member(Wb,Lwb)),[Vd|_]).


%% nos vehicleDuties com varios drivers diferentes é chamado o algoritmo genetico e vou usar o melhor individuo para gerar driverDutyTemp
%% se houver um vehicle duty mas que nao tenha sido chamado o algoritmo genetico para ele ( pode so ter um driver associado e nao precisa) então vou usar a informação da listaNworkBlocks para criar tais factos
gerar_driver_dutiesTemp([]):- !.
gerar_driver_dutiesTemp([(VdId,_,_)|T]):-
afetarDrivers_data(Data),((resultado(VdId,[X*_|_]),!,!,
 gerar_driver_dutiesTempApartirDaSolucaoDoAg(VdId,X,Data,0),!,gerar_driver_dutiesTemp(T));gerar_driver_dutiesTempApartirDaListaNworkBlocks(VdId,Data), gerar_driver_dutiesTemp(T)).

gerar_driver_dutiesTempApartirDaSolucaoDoAg(_,[],_,_):- !.
gerar_driver_dutiesTempApartirDaSolucaoDoAg(VdId,[H|T],Data,I):- I1 is I+1, vehicleduty(VdId,Data,Lwb),!, nth0(I,Lwb, WorkBlock),!,
asserta(driverDutyTemp(H,WorkBlock)), gerar_driver_dutiesTempApartirDaSolucaoDoAg(VdId,T,Data,I1).


gerar_driver_dutiesTempApartirDaListaNworkBlocks(VdId,Data):-
lista_motoristas_nworkblocks(VdId,[(Driver,_)|_]), vehicleduty(VdId,Data,Lwb),gerar_driver_dutiesTempApartirDaListaNworkBlocks1(Driver,Lwb).

gerar_driver_dutiesTempApartirDaListaNworkBlocks1(_,[]):-!.
gerar_driver_dutiesTempApartirDaListaNworkBlocks1(Driver,[H|ListWb]):-asserta(driverDutyTemp(Driver,H)),gerar_driver_dutiesTempApartirDaListaNworkBlocks1(Driver,ListWb).

%% faço um not(driverDuty(Driver,_)) porque a lista que estou a enviar para este metodo é uma lista de t() por isso pode aparecer la o meso driver varias vezes
%% e assim garanto que so vou criar um facto driver duty para um driver se ainda nao existir
%% podia ter ido buscar a lista de todos os drivers em vez de usar a lista de t()

gerar_driver_duties([]):-!.
gerar_driver_duties([(_,_,_,_,Driver)|T]):- ((not(driverDuty(Driver,_)), obterAlistaFactosWorkBlock(Driver,R), length(R, Tamanho),((Tamanho>0, predsort(compare_work_blocks_by_startTime,R, Rsorted),
 obterListSoComIdWorkBlocks(Rsorted,ListaIds),asserta(driverDuty(Driver,ListaIds)), gerar_driver_duties(T)));gerar_driver_duties(T))).


obterListSoComIdWorkBlocks([],[]):- !.
obterListSoComIdWorkBlocks([(Id,_,_,_)|T1],[Id|T]):- obterListSoComIdWorkBlocks(T1,T).

obterAlistaFactosWorkBlock(Driver,R):- findall((Wb,W,I,F), (driverDutyTemp(Driver,Wb), workblock(Wb,W,I,F)),R).

chamar_algoritmo_genetico([]):-!.
chamar_algoritmo_genetico([(VdId,_,_)|T]):-
lista_motoristas_nworkblocks(VdId,P), length(P,Tamanho),
((Tamanho>1, gera_genetico(VdId,10),!, chamar_algoritmo_genetico(T));chamar_algoritmo_genetico(T)),!.



inicializar_afetarDrivers:-
    write('Dia: '),read(D),
    write('M�s: '),read(M),
    write('Ano: '),read(A),
    term_to_atom(D/M/A,R),
    (retractall(afetarDrivers_data(_)),!;true), asserta(afetarDrivers_data(R)),
    (retractall(logErros(_)),!;true).

%Elimina todos os factos correspondentes aos elementos da lista
deleteFacts([]):-!.
deleteFacts([X|Y]):-
    (retractall(X),!;true),
    deleteFacts(Y).

%Verifica a carga que cada motorista deve cumprir hoje
verificacao_carga:-
    gerar_range_vehicleduties,

    sum_horas_vehicleduties(SumVDs),
     %write('Somei vehicle duties '),write(SumVDs),
    sum_horas_motoristas(SumMots),
   % write('Somei motoristas '),write(SumMots),
    percentagem_margem_carga(Per),
    %Se h� mais horas disponiveis por motorista que horas de trabalho
    ((SumMarg is (SumVDs + SumVDs*Per),DifSums is SumMots-SumMarg,DifSums>=0,!,gerar_blocos_horas_trabalho(SumMarg))
    %Sen�o:
    ;gerarLogErros('E possivel que nao existam motoristas com horas de trabalho suficientes para satisfazer a carga de trabalho necessaria. Multiplas violacoes de hard constraints devem ser esperadas'),gerar_blocos_horas_trabalho(SumMots)).


ordena(Ds,Vs):-ordenaDrivers(Ds), ordenaVehicleDuties(Vs),!.

ordenaDrivers(R):-findall((A,B,C,D,E),t(A,B,C,D,E),L), predsort(compare_bloco_horas_mot_by_first,L, R).

ordenaVehicleDuties(R):-findall((D,F,A),rangevd(D,F,A),L), predsort(compare_range_vd_by_second,L, R).


compare_bloco_horas_mot_by_first(<, (A,_,_,0,_), (C,_,_,0,_)) :-
    ( % se estao os dois de folga
      A @< C; %se A < C entao o primeiro arguemnto é menor e fica antes do 2º arg
      A == C).

compare_bloco_horas_mot_by_first(<, (A,_,_,_,_), (C,_,_,F,_)) :-
    ( F ==0; % se o elemento na posicao F é 0 quero metelo mais para a direita possivel da lista visto que em principio nao irá trabalhar hoje
      A @< C; %se A < C entao o primeiro arguemnto é menor e fica antes do 2º arg
      A == C).

compare_bloco_horas_mot_by_first(=, (A), (C)) :-
    A == C.

    compare_bloco_horas_mot_by_first(>, (A), (C)) :-
  ( A @> C;
   A == C ).


compare_range_vd_by_second(<, (_,A), (_,B)) :-
    ( A @< B; %se A < B entao o primeiro arguemnto é menor e fica antes do 2º arg
      A == B).


compare_range_vd_by_second(=, (_,A), (_,B)) :-
    A == B.

   compare_range_vd_by_second(>, (_,A), (_,B)) :-
  ( A @> B;
    A == B ).

%% compara os workbloks pelo 3 argumento, Tempo Inicial, util para criar factos driverDuty  com os work blocks ordenados
compare_work_blocks_by_startTime(<, (_,_,A), (_,_,B)) :-
    ( A @< B; %se A < B entao o primeiro arguemnto é menor e fica antes do 2º arg
      A == B).


compare_work_blocks_by_startTime(=, (_,_,A), (_,_,B)) :-
    A == B.

compare_work_blocks_by_startTime(>, (_,_,A), (_,_,B)) :-
  ( A @> B;
    A == B ).

constroi_factos_motoristas_nworkblocks_inicial([]):-!.
constroi_factos_motoristas_nworkblocks_inicial([(VdId,_,_)|T2]):- afetarDrivers_data(R),
vehicleduty(VdId,R,L),verificaIntervaloMaiorWorkBlock(L,0,DuracaoMaiorWorkBlockVd),
seleciona_mots_mais_adequados(VdId,DuracaoMaiorWorkBlockVd,BestBlock),
 length(L, NumWbInVd), afetaMaiorBloco(VdId,NumWbInVd,DuracaoMaiorWorkBlockVd,BestBlock),
 altera_factos_t_atualizar_mots_folga(BestBlock),
 constroi_factos_motoristas_nworkblocks_inicial(T2).

%% quando tem 0 no 4º parametro era sinal que estaria de folga e vou atualizar esse valor no seu facto T
altera_factos_t_atualizar_mots_folga((Ti,Tf,Dur,0,Driver)):-(retractall(t(Ti,Tf,Dur,0,Driver)),!;true), asserta(t(Ti,Tf,Dur,Dur,Driver)).

%se entrar neste significa que o driver escolhido vai trabalhar hoje, ou pelo menos esta previsto trabalhar neste seu bloco de trabalho por isso nao precisa atualizar
altera_factos_t_atualizar_mots_folga((_,_,_,_,_)):-!.


constroi_factos_motoristas_nworkblocks_restantes([]):-!.
constroi_factos_motoristas_nworkblocks_restantes([(VdId,_,_)|T2]):- afetarDrivers_data(R),
vehicleduty(VdId,R,L), length(L, NumWbInVd), verificaIntervaloMaiorWorkBlock(L,0,DuracaoMaiorWorkBlockVd),
 obtemNumeroDeWorkBlocksPorAfetar(VdId,NumWbInVd,NwbPorAfetar),
 ((NwbPorAfetar==0, constroi_factos_motoristas_nworkblocks_restantes(T2)); afetaRestantesWB(VdId,NumWbInVd,NwbPorAfetar,DuracaoMaiorWorkBlockVd)),

 constroi_factos_motoristas_nworkblocks_restantes(T2).


afetaRestantesWB(_,_,0,_):-!. % aqui para porque o veicle duty esta todo afetado

afetaRestantesWB(VdId,NumWbInVd,NwbPorAfetar,DuracaoMaiorWorkBlockVd):-  %% se houver blocos de horas de motoristas atribuio esses, se não vou buscar um motorista qualquer e doulhe uma duraçao de NBlocosPorAfetar / numero de drivers
 ((list_of_facts_t([(Ti,Tf,Dur,Tt,Driver)|T]),
 deleteBlockFromList((Ti,Tf,Dur,Tt,Driver),[(Ti,Tf,Dur,Tt,Driver)|T]),altera_factos_t_atualizar_mots_folga((Ti,Tf,Dur,Tt,Driver)) )
 ;obterCondutorRandom(NwbPorAfetar,DuracaoMaiorWorkBlockVd,Driver,Dur)),
 Div is div(Dur, DuracaoMaiorWorkBlockVd), RoundedDiv is round(Div), ((RoundedDiv>NwbPorAfetar, RNum is NwbPorAfetar );RNum is RoundedDiv),
 lista_motoristas_nworkblocks(VdId,[(Dr,Nvz)|T1]), adicionaALista_motNworkBlock(RNum,Driver,VdId,[(Dr,Nvz)|T1]),
 obtemNumeroDeWorkBlocksPorAfetar(VdId,NumWbInVd,NwbPorAfetar1),!,
afetaRestantesWB(VdId,NumWbInVd,NwbPorAfetar1,DuracaoMaiorWorkBlockVd),!.

obterCondutorRandom(NwbPorAfetar,DuracaoMaiorWorkBlockVd,Driver,Dur):-
 findall(D,driver(D), DriverList), length(DriverList, TamanhoListaDriver), Div is div(NwbPorAfetar,TamanhoListaDriver), ((Div>0,Dur is Div*DuracaoMaiorWorkBlockVd);Dur is DuracaoMaiorWorkBlockVd),
  random(0,TamanhoListaDriver, RandomN),nth0(RandomN, DriverList, Driver).

%obterCondutorRandom(Driver):-
 %findall(D,driver(D), DriverList), length(DriverList, TamanhoLista), random(0,TamanhoLista, RandomN),nth0(RandomN, DriverList, Driver).

adicionaALista_motNworkBlock(RNum,Driver,VdId,[(Driver1,RNum1)|T]):-
((member((Driver,X),[(Driver1,RNum1)|T]),!,delete([(Driver1,RNum1)|T], (Driver,X), ListR),Soma is X + RNum,
 asserta(temp([(Driver,Soma)])), temp(L), append(L,ListR,Lr)),(retractall(lista_motoristas_nworkblocks(VdId,_)),!;true),asserta(lista_motoristas_nworkblocks(VdId,Lr))
;asserta(temp([(Driver,RNum)])),temp(L), append(L,[(Driver1,RNum1)|T],Lr),(retractall(lista_motoristas_nworkblocks(VdId,_)),!;true),asserta(lista_motoristas_nworkblocks(VdId,Lr))), !.

obtemNumeroDeWorkBlocksPorAfetar(VdId,NumWbInVd,R):-lista_motoristas_nworkblocks(VdId,[(Driver,RNum)|T]),obtemNumeroDeWorkBlocksPorAfetar1(NumWbInVd,[(Driver,RNum)|T],0,R).

 obtemNumeroDeWorkBlocksPorAfetar1(NumWbInVd,[],Ac,R):- R is NumWbInVd-Ac.
 obtemNumeroDeWorkBlocksPorAfetar1(NumWbInVd,[(_,RNum)|T],Ac,R):- Ac1 is Ac+RNum,  obtemNumeroDeWorkBlocksPorAfetar1(NumWbInVd,T,Ac1,R).


afetaMaiorBloco(VdId,NumWbInVd,DuracaoMaiorWorkBlockVd,(_,_,D,_,Driver)):-
Div is div(D, DuracaoMaiorWorkBlockVd), RoundedDiv is round(Div), ((RoundedDiv>NumWbInVd, RNum is NumWbInVd );RNum is RoundedDiv), asserta(lista_motoristas_nworkblocks(VdId,[(Driver,RNum)])),!.



seleciona_mots_mais_adequados(VdId,DuracaoMaiorWorkBlockVd,BestBlock):- % se houver blocos de trabalho ( factos t()) uso esses, se nao vou atribuir de a um random driver um 2 workBlocks (se o vehicle duty so tiver 1 workblock entao atribuio so 1)
 list_of_facts_t(ListT),length(ListT,Tamanho), ((Tamanho>0,seleciona_mots_mais_adequados1(ListT,BestBlock));
 vehicleduty(VdId,_,ListaWorkblocks), length(ListaWorkblocks,NumWb),((NumWb>1,obterCondutorRandom(2,DuracaoMaiorWorkBlockVd,Driver,Dur),  BestBlock=(_,_,Dur,Dur,Driver)))).

seleciona_mots_mais_adequados1([(Ti,Tf,Dur,Tt,Driver)|T],BestBlock):-
 obtainBiggestBlockOfFirstDriverInList((Ti,Tf,Dur,Tt,Driver),T,BestBlock), deleteBlockFromList(BestBlock,[(Ti,Tf,Dur,Tt,Driver)|T]).




obtainBiggestBlockOfFirstDriverInList(R,[],R):- !.
obtainBiggestBlockOfFirstDriverInList((Ti,Tf,Dur,Tt,Driver),[(_,_,Dur1,_,Driver1)|T],Bb):-
((Driver == Driver1, BlockDif is Dur-Dur1, ((BlockDif<0, obtainBiggestBlockOfFirstDriverInList((Ti,Tf,Dur,Tt,Driver),T,Bb));obtainBiggestBlockOfFirstDriverInList((Ti,Tf,Dur,Tt,Driver),T,Bb));obtainBiggestBlockOfFirstDriverInList((Ti,Tf,Dur,Tt,Driver),T,Bb))).

verificaIntervaloMaiorWorkBlock([],Acomul,Acomul):- !.
verificaIntervaloMaiorWorkBlock([H|ListWb],Acomul,R):-
workblock(H,_,Ti,Tf), Duracao is Tf-Ti, ((Acomul<Duracao, Acomul1 is Duracao);Acomul1 is Acomul), verificaIntervaloMaiorWorkBlock(ListWb,Acomul1,R),!.

obtemTempoDeInicioPrimeiroWorkBlock([H|_],R):-workblock(H,_,Ti,_), R is Ti.


%verifica_atualiza_drivers_folga((Ti1,Tf1,Dur1,0,Driver1)):- list_of_facts_t(ListT), verifica_atualiza_drivers_folga1((Ti1,Tf1,Dur1,0,Driver1),ListT).

%verifica_atualiza_drivers_folga1((Ti1,Tf1,Dur1,0,Driver1),[(Ti,Tf,Dur,T,Driver)|T]):- ((Ti1==Ti, Tf1==Tf,Dur1==Dur,Driver1==Driver, T), ).

deleteBlockFromList(BestBlock,List):- delete(List, BestBlock, R), (retractall(list_of_facts_t(_)),!;true), asserta(list_of_facts_t(R)).

% Gera factos do tipo rangevd(vehicledutyID,horaInicio,horaFim)
% referidos no forum
gerar_range_vehicleduties:-
    afetarDrivers_data(Data),
    (retractall(rangevd(_,_,_)),!;true),
    findall((VD,Hinicio,Hfim),
           (vehicleduty(VD,Data,WkList),
            calcular_horario_workblocks(WkList,Hinicio,Hfim))
           ,RangeList),
    gerar_range_vehicleduties1(RangeList).

gerar_range_vehicleduties1([]):-!.
gerar_range_vehicleduties1([(Vd,Hi,Hf)|Y]):-
    asserta(rangevd(Vd,Hi,Hf))
    ,gerar_range_vehicleduties1(Y).


% Obtem de uma lista de workblocks, o seu horario de inicio e o seu
% horario de fim
calcular_horario_workblocks([X],Hinicio,Hfim):-workblock(X,_,Hinicio,Hfim).
calcular_horario_workblocks([X|Y],Hinicio,Hfim):-
   workblock(X,_,Hi,Hf),
   calcular_horario_workblocks(Y,Hinicio1,Hfim1),
   (Hi<Hinicio1,!,Hinicio = Hi;Hinicio = Hinicio1),
   (Hf>Hfim1,!,Hfim = Hf;Hfim = Hfim1).


% Obt�m o somatorio do tempo de trabalho necess�rio para realizar todos
% os vehicle duties
sum_horas_vehicleduties(Sum):-
    findall(T,
           (rangevd(_,Hi,Hf), T is Hf - Hi)
           ,Rlist),
    sumAllElems(Rlist,Sum).

%Retorna o somatorio de todos os elementos de uma lista de numeros
sumAllElems([],0):-!.
sumAllElems([X|Y],Sum):-
    sumAllElems(Y,Sum1),
    Sum is Sum1 + X.

% Obt�m o somatorio do tempo de trabalho disponibilizado por todos os
% motoristas
sum_horas_motoristas(Sum):-
    findall(T,
           horariomotorista(_,_,_,T,_)
           ,Rlist),
    sumAllElems(Rlist,Sum).

% Gera os factos t(Hi,Hf,TMaxtrabalho,TatualTrabalho,IdMotorista) que
% representam os blocos de horas de trabalho de cada motorista
gerar_blocos_horas_trabalho(TempoTrabalho):-
    motoristas_menor_trabalho_total(ListaMotOrd),
    add_new_drivers(ListaMotOrd,ListaTdsMots),
    (retractall(t(_,_,_,_,_)),!;true),
    gerar_blocos_horas_trabalho1(TempoTrabalho,ListaTdsMots).

gerar_blocos_horas_trabalho1(_,[]):-!.
gerar_blocos_horas_trabalho1(TempoTrabalho,[Driv|Y]):-
    ((horariomotorista(Driv,Hi,Hf,TotalT,ListaBlocos),
    gerar_blocos_motorista(Driv,Hi,Hf,TotalT,ListaBlocos,TempoTrabalho,Tutilizado),
    Trestante is TempoTrabalho - Tutilizado);(Trestante is TempoTrabalho)),
    gerar_blocos_horas_trabalho1(Trestante,Y).

%Condi��o paragem
gerar_blocos_motorista(Driv,Hi,Hf,_,[X],Trestante,Tutilizado):-
    !,
    ((Trestante=<0,!,TatualTrabalho is 0);(TatualTrabalho is X)),
    assert(t(Hi,Hf,X,TatualTrabalho,Driv)),
    Tutilizado is X.

gerar_blocos_motorista(Driv,Hi,Hf,TotalT,[X|Y],Trestante,Tutilizado):-
    ((X>=14400,!, sumAllElems([X|Y],Sum), Diff is Hf-Hi, Diff>Sum+3600,HblocoF is Hi + X + 3600);HblocoF is Hi + X), %Se o tempo ocupado por X for >= a 4 horas, � necess�rio adicionar algum tempo de descanso
    ((Trestante=<0,!,TatualTrabalho is 0);(TatualTrabalho is X)), %Verificar se � necess�rio alocar tempo a este driver ou se ele fica livre
    assert(t(Hi,HblocoF,X,TatualTrabalho,Driv)),
    gerar_blocos_motorista(Driv,HblocoF,Hf,TotalT,Y,Trestante,Tutilizado1),
    Tutilizado is Tutilizado1 + X.


% Obtem por ordem de menor trabalho anterior para a empresa uma lista
% com os ids dos motoristas (do menor para o maior)
%
motoristas_menor_trabalho_total(ListaMotOrd):-
    findall((Total,Driv),
           t(_,_,_,Total,Driv)
           ,Lista),
    agregarValoresId(Lista,TempList),
    sort(TempList,TempList1),
    motoristas_menor_trabalho_total1(TempList1,ListaMotOrd).


%Limpa os valores da lista, mantendo apenas os Ids dos drivers
motoristas_menor_trabalho_total1([],[]):-!.
motoristas_menor_trabalho_total1([(_,Id)|Y],ListaMotOrdLimpa):-
    motoristas_menor_trabalho_total1(Y,ListaMotOrdLimpa1),
    append([Id],ListaMotOrdLimpa1,ListaMotOrdLimpa).

% Numa lista de dupletos de formato (Id,Valor), agrega todos os
% elementos com o mesmo ID e soma o seu valor
agregarValoresId([],[]):-!.
agregarValoresId([(V,Id)|Y],ListaMotOrd):-
    agregarValoresId(Y,ListaMotOrd1),
    addValorId((V,Id),ListaMotOrd1,ListaMotOrd).

% Retorna uma nova lista ap�s somar o valor ao dupleto com Id
% correspondente, caso id correspondente n�o exista, adiciona-o ao final
% da lista
addValorId((V,Id),[],[(V,Id)]):-!.
addValorId((V,Id),[(V1,Id1)|Y],NewList):-
    ((Id == Id1,!,Value is V+V1,append([(Value,Id)],Y,NewList));
    (addValorId((V,Id),Y,NewList1),append([(V1,Id1)],NewList1,NewList))).

% Adiciona todos os drivers que n�o trabalharam anteriormente ao inicio
% da lista
add_new_drivers(ListaMotOrd,ListaTdsMots):-
    findall(Id,
            (driver(Id),\+ member(Id,ListaMotOrd))
           ,ListaDrivers),
    append(ListaDrivers,ListaMotOrd,ListaTdsMots).



































% Algoritmo gen�tico (est� a ser utilizado apenas o gera_populacao sem
% heuristicas para n haver problemas)
gera_genetico(VeicDuty,Duracao):-
 inicializa_gera_genetico(VeicDuty,Duracao),!,
gera_populacao1(Pop),!,
avalia_populacao(Pop,PopAv),!,
ordena_populacao(PopAv,PopOrd),
geracoes(NG),
asserta(melhor(_*100 )),
estabiliz(Establimit),!,
gera_geracao(0,NG,PopOrd,1,Establimit,0,0),!.

inicializa_gera_genetico(VeicDuty,Duracao):-
 (retract(geracoes(_));true),asserta(geracoes(100)),
 (retract(populacao(_));true),asserta(populacao(5)),
 (retract(prob_cruzamento(_));true),asserta(prob_cruzamento(75)),
 (retract(prob_mutacao(_));true),asserta(prob_mutacao(25)),
 (retract(selected_vehicle_duty(_));true),asserta(selected_vehicle_duty(VeicDuty)),
 (retract(avaliacaoexp(_));true),asserta(avaliacaoexp(1)),
 (retract(duracao_maxima(_));true),asserta(duracao_maxima(Duracao)),
 get_time(Ta),
 (retract(tempo_inicial(_));true), asserta(tempo_inicial(Ta)),!.


gera_populacao1(Pop):-
populacao(TamPop),
dimensao(NumD),
selected_vehicle_duty(Vehic),
lista_motoristas_nworkblocks(Vehic,ListaDrivers),
transformNewListDrivers(ListaDrivers,[],NewListaDrivers),
gera_populacao1(TamPop,NewListaDrivers,NumD,Pop).


dimensao(Dim):- selected_vehicle_duty(Vd),!,lista_motoristas_nworkblocks(Vd,L),
    dimensao2(L,Dim).
dimensao2([],0).
dimensao2([(_,X)|Z],Dim):- dimensao2(Z,Dim1),Dim is Dim1 + X.

transformNewListDrivers([],L,L):-!.
transformNewListDrivers([(Driver,Vezes)|L],List,R):-
addToListXTimes(Driver,Vezes,List,ResultList),
transformNewListDrivers(L,ResultList, R).


addToListXTimes(_,0,L,L):-!.
addToListXTimes(Driver,Vezes,List,Res):-
Vezes1 is Vezes-1,
append(List,[Driver],L1),
addToListXTimes(Driver,Vezes1,L1,Res).


gera_populacao1(0,_,_,[]):-!.
gera_populacao1(TamPop,ListaDrivers,NumD,[Ind|Resto]):-
TamPop1 is TamPop-1,
gera_populacao1(TamPop1,ListaDrivers,NumD,Resto),
gera_individuo(ListaDrivers,NumD,Ind),
not(member(Ind,Resto)).


gera_populacao1(TamPop,ListaDrivers,NumD,L):-
gera_populacao1(TamPop,ListaDrivers,NumD,L).


gera_individuo([G],1,[G]):-!.
gera_individuo(ListaDrivers,NumD,[G|Resto]):-
NumTemp is NumD + 1, % para usar com random
random(1,NumTemp,N),
retira(N,ListaDrivers,G,NovaLista),
NumT1 is NumD-1,
gera_individuo(NovaLista,NumT1,Resto).

retira(1,[G|Resto],G,Resto):-!.
retira(N,[G1|Resto],G,[G1|Resto1]):- N1 is N-1,
retira(N1,Resto,G,Resto1).


avalia_populacao([],[]).
avalia_populacao([Ind|Resto],[Ind*V|Resto1]):-
criar_agenda_temporal(Ind,ATemp),

avalia(ATemp,V),
avalia_populacao(Resto,Resto1).

avalia(Agenda,V):-avalia2(Agenda,[],V),!.

avalia2([ ],_,0).

avalia2([(Tinicio,Tfim,Driver)|Resto],ListaDriversVistos,V):-
%se for a primeira vez que estiver a avaliar um driver, ve as restricoes onde e necessario todos os blocos da agenda do mesmo
%e adiciona a lista de drivers vistos para quando for ver outro bloco do condutor nao repetir a verificacao destas restricoes
(( \+ member(Driver,ListaDriversVistos),!,append(ListaDriversVistos,[Driver],ListaDriversVistos2),!,findall((Ti,Tf,Driver),member((Ti,Tf,Driver),Resto),ListaCondutor)
,check_restriction_max_hours(Tinicio,Tfim,ListaCondutor,VT3),check_restriction_meal(Tinicio,Tfim,ListaCondutor,VT4),check_pref_horario(Tinicio,Tfim,Driver,ListaCondutor,VT5)); append(ListaDriversVistos,[],ListaDriversVistos2), VT3 is 0 ,VT4 is 0 ,VT5 is 0),

check_restriction_consecutive_hours(Tinicio,Tfim,VT2),
check_restriction_rest_after_4hours(Tinicio,Tfim,Driver,Resto,VT),
avalia2(Resto,ListaDriversVistos2,VResto),

V is VT+VT2+VT3+VT4+VT5+VResto .

%predicado que verifica se os blocos da agenda estao dentro da preferencia de horario do motorista,caso nao esteja e uma violacao e e calculada a penalizacao
check_pref_horario(Tinicio,Tfim,Driver,ListaCondutor,VT5):-(pref_horario(Driver,T1,T2),pref_horario_pen(Pen),!,check_pref_horario2(Tinicio,Tfim,ListaCondutor,T1,T2,Total), VT5 is Total*Pen);(VT5 is 0).

check_pref_horario2(Tinicio,Tfim,[],T1,T2,Total):-(((Tinicio>T2;T1>Tfim),!,Total is Tfim-Tinicio);((Tinicio<T1,T1=<Tfim,Tfim=<T2,!, Total is T1-Tinicio) ; (Tinicio >=T1,T2>Tinicio,T2=<Tfim,!, Total is Tfim-T2));Total is 0).
check_pref_horario2(Tinicio,Tfim,[(Tinicio2,Tfim2,_)|Resto],T1,T2,Total):-check_pref_horario2(Tinicio,Tfim,Resto,T1,T2,Total2),(((Tinicio2>T2; T1>Tfim2),Total is Total2+(Tfim2-Tinicio2));((Tinicio2<T1,T1=<Tfim2,Tfim2=<T2, Total is Total2+(T1-Tinicio2)) ; (Tinicio2 >=T1,T2>Tinicio2,T2=<Tfim2, Total is Total2+(Tfim2-T2)));Total is Total2+0).


%predicado que vai verificar se na agenda do motorista, nos periodos de refeicoes tem 1 hora de pausa
check_restriction_meal(Tinicio,Tfim,ListaCondutor,VT4):-!,check_lunch_time(Tinicio,Tfim,ListaCondutor,VT1),check_dinner_time(Tinicio,Tfim,ListaCondutor,VT2),!, VT4 is VT1+VT2.

% verificar se o condutor durante o periodo do almoco possui um hora para a refeicao, caso não tenha é uma violacao de 3600 segundos
check_lunch_time(Tinicio,Tfim,ListaCondutor,VT1):-meal_break_time(H,Pen),first_meal_start_time(T1),first_meal_end_time(T2),max_time_during_meal(M),check_lunch_time2(Tinicio,Tfim,ListaCondutor,T1,T2,Total), ((Total >M, VT1 is H*Pen);VT1 is 0).
% predicado auxiliar que vai calcular a intersecao entre o periodo de almoco e a agenda do motorista
check_lunch_time2(Tinicio,Tfim,[],T1,T2,Total):-(((Tinicio>T2;T1>Tfim),!,Total is 0); (Ta is max(T1,Tinicio),Tb is min(T2,Tfim), Total is Tb-Ta)).
check_lunch_time2(Tinicio,Tfim,[(Tinicio2,Tfim2,_)|Resto],T1,T2,Total):-check_lunch_time2(Tinicio,Tfim,Resto,T1,T2,Total2),(((Tinicio2>T2;T1>Tfim2),Total is Total2+0); (Ta is max(T1,Tinicio2),Tb is min(T2,Tfim2), Total is Total2+(Tb-Ta))).

% verificar se o condutor durante o periodo do jantar possui um hora para a refeicao, caso não tenha é uma violacao de 3600 segundos
check_dinner_time(Tinicio,Tfim,ListaCondutor,VT1):-meal_break_time(H,Pen),second_meal_start_time(T1),second_meal_end_time(T2),max_time_during_meal(M),check_dinner_time2(Tinicio,Tfim,ListaCondutor,T1,T2,Total), ((Total >M, VT1 is H*Pen);VT1 is 0).
% predicado auxiliar que vai calcular a intersecao entre o periodo de jantar e a agenda do motorista
check_dinner_time2(Tinicio,Tfim,[],T1,T2,Total):-!,(((Tinicio>T2;T1>Tfim),Total is 0); (Ta is max(T1,Tinicio),Tb is min(T2,Tfim), Total is Tb-Ta)).
check_dinner_time2(Tinicio,Tfim,[(Tinicio2,Tfim2,_)|Resto],T1,T2,Total):-check_dinner_time2(Tinicio,Tfim,Resto,T1,T2,Total2),(((Tinicio2>T2;T1>Tfim2),Total is Total2+0); (Ta is max(T1,Tinicio2),Tb is min(T2,Tfim2), Total is Total2+(Tb-Ta))).

% predicado que verifica se um bloco da agenda do motorista passa o limite de horas consecutivas possiveis, se passou entao e uma violacao e calcular a penalizacao
check_restriction_consecutive_hours(Tinicio,Tfim,VT):-
max_consecutive_hours(M,Pen), Ttotal is Tfim-Tinicio,((Ttotal=<M,!,VT is 0);(VT is (Ttotal-M)*Pen)).

% predicado que verifica se o somatorios dos blocos da agenda do motorista passa o limite de horas diarias possiveis, se passou entao e uma violacao e calcular a penalizacao
check_restriction_max_hours(Tinicio,Tfim,ListaCondutor,VT):-
max_work_hours(M,Pen),get_total_workhours(Tinicio,Tfim,ListaCondutor,Total),((Total=<M,!,VT is 0);(VT is (Total-M)*Pen)).
%predicado auxiliar que obtem as horas de trabalho total do motorista
get_total_workhours(Tinicio,Tfim,[],Total):-!,Total is Tfim-Tinicio.
get_total_workhours(Tinicio,Tfim,[(Tinicio2,Tfim2,_)|Resto],Total):-get_total_workhours(Tinicio,Tfim,Resto,Total2),Total is Total2 + (Tfim2-Tinicio2).

%predicado que verifica se o bloco atual for de 4 horas, ve se a diferenca entre esse e o proximo na agenda e igual ou superior ao tempo de descanso (1 hora), se viola esta condicao e calculada a penalizacao
check_restriction_rest_after_4hours(Tinicio,Tfim,Driver,Resto,VT):-
rest_hour(M,Pen),max_consecutive_hours(M2,_),Diff is (Tfim-Tinicio), (Diff=M2 ,!,findall((Ti,Tf,Driver),member((Ti,Tf,Driver),Resto),ListaCondutor),check_rest_time(Tinicio,Tfim,ListaCondutor,Total),((Total >= M,!,VT is 0);(VT is M*Pen))); VT is 0.
%predicado auxiliar que calcula a diferenca entre o fim do bloco atual e o inicio do proximo
check_rest_time(_,_,[],Total):-Total is 9999. %se for o ultimo bloco do condutor, atribuimos um valor maior que 3600
check_rest_time(_,Tfim,[(Tinicio2,_,_)|_],Total):-Total is Tinicio2-Tfim.

%predicado que cria a agenda temporal para facilitar a avaliacao
criar_agenda_temporal(Ind,Agenda):-selected_vehicle_duty(D),
vehicleduty(D,_,ListaWorkblocks),
criar_agenda_temporal2(Ind, ListaWorkblocks,-1),
preencher_agenda(Agenda).

preencher_agenda(Agenda):-!,findall((Ti,Tf,D),t(Ti,Tf,D),Agenda),retractall(t(_,_,_)).
%predicado auxiliar que ao criar os periodos do motorista, condensa os consecutivos
criar_agenda_temporal2([H1],[Hw],Ti):-Ti = -1,(workblock(Hw,_,Tinicio,Tfinal),assertz(t(Tinicio,Tfinal,H1))),!; (workblock(Hw,_,_,Tfinal),assertz(t(Ti,Tfinal,H1))),!.

criar_agenda_temporal2([H1|[H2|T1]],[Hw|Tw],Ti):-
  Ti = -1 ,( (H1 = H2 ,
workblock(Hw,_,Tinicio,_),!,criar_agenda_temporal2([H2|T1],Tw,Tinicio));(workblock(Hw,_,Tinicio,Tfinal),assertz(t(Tinicio,Tfinal,H1)),!, criar_agenda_temporal2([H2|T1],Tw,-1)) )  ;
( (H1 = H2 ,!,criar_agenda_temporal2([H2|T1],Tw,Ti)) ;(workblock(Hw,_,_,Tfinal),assertz(t(Ti,Tfinal,H1)),!,criar_agenda_temporal2([H2|T1],Tw,-1)) ).


ordena_populacao(PopAv,PopAvOrd):-
bsort(PopAv,PopAvOrd).


bsort([X],[X]):-!.
bsort([X|Xs],Ys):-
bsort(Xs,Zs),
btroca([X|Zs],Ys).


btroca([X],[X]):-!.
btroca([X*VX,Y*VY|L1],[Y*VY|L2]):-
VX>VY,!,
btroca([X*VX|L1],L2).

btroca([X|L1],[X|L2]):-btroca(L1,L2).



gera_geracao(_,_,Pop,E,E,_,_):-!, selected_vehicle_duty(VdId),
asserta(resultado(VdId,Pop)).

gera_geracao(_,_,Pop,_,_,_,1):-!, selected_vehicle_duty(VdId),
asserta(resultado(VdId,Pop)).

gera_geracao(_,_,Pop,_,_,1,_):-!, selected_vehicle_duty(VdId),
asserta(resultado(VdId,Pop)).

gera_geracao(G,G,Pop,_,_,_,_):-!, selected_vehicle_duty(VdId),
asserta(resultado(VdId,Pop)).



gera_geracao(N,G,Pop,Estab,Establimit,_,_):-
verifica_tempo(Limitreach1),
verifica_avaliacao_especifica(Pop,Avalespecifica1),
cruzamento(Pop,NPop1),
mutacao(NPop1,NPop),
avalia_populacao(NPop,NPopAv),
ordena_populacao(NPopAv,NPopOrd),
append(Pop,NPopOrd,Epop),
sort(Epop,Espop),
ordena_populacao(Espop,Rpop),
populacao(Num),
percentagem_melhor_manter(Pm),
P1 is Num * Pm,
(P1<1 ->P is 1; P is round(P1)),
obterListas(Rpop,P,Lm,Lp),
flatten([Lm|Lp], Lfx),
N1 is N+1,
verifica_estabilizacao(Pop,Estab,Lfx,Restabilizacao),
gera_geracao(N1,G,Lfx,Restabilizacao,Establimit,Limitreach1,Avalespecifica1).


obterListas(Pop,P,Listadosmelhores,Listadospiores):- obterListaMelhores(Pop,P,Listadosmelhores), obterListaPiores(Pop,P,Listadospiores).

obterListaMelhores(_,0,[]).
obterListaMelhores([M|Pop],P,[M|Pop1]):-P>=0, P1 is P-1, obterListaMelhores(Pop,P1,Pop1).


obterListaPiores(L,0,R):-randomizeListaPiores(L,P), trataListaPioresRandomized(P,T),devolveListaSemRandom(T,R).
obterListaPiores([_|Pop],P,R):- P1 is P-1 , obterListaPiores(Pop,P1,R).

randomizeListaPiores([],[]).
randomizeListaPiores([H*Vp|T],[H*Vp*Vprand|T1]):- random(0.000001,0.999999,Random),Vprand is round(Vp*Random),randomizeListaPiores(T,T1).

trataListaPioresRandomized(T,P):-ordena_populacao(T,Tord),obterNumeroDeElementosConsiderarListaPiores(R), selecionaParteDaLista(Tord,R,P).

obterNumeroDeElementosConsiderarListaPiores(R):-populacao(Num),percentagem_melhor_manter(Pm),T is round(Num*Pm), R is Num-T.

selecionaParteDaLista(_,0,[]).
selecionaParteDaLista([H|T],R,[H|T1]):- R1 is R-1, selecionaParteDaLista(T,R1,T1).

devolveListaSemRandom([],[]).
devolveListaSemRandom([H*Vp*_|T],[H*Vp|T1]):-
	devolveListaSemRandom(T,T1).



verifica_tempo(Limitreach):-duracao_maxima(D), tempo_inicial(I), get_time(Tf), R is D+I, (R>Tf ->Limitreach is 0;Limitreach is 1).

verifica_avaliacao_especifica([_*VX|_],Avalespecifica):- avaliacaoexp(Aval), (VX =< Aval -> Avalespecifica is 1;Avalespecifica is 0  ).


verifica_estabilizacao(Pop,Estab,Novapop,R):- (Pop = Novapop -> R is Estab+1; R is 1).


gerar_pontos_cruzamento(P1,P2):- gerar_pontos_cruzamento1(P1,P2).
gerar_pontos_cruzamento1(P1,P2):-
dimensao(N),
NTemp is N+1,
random(1,NTemp,P11),
random(1,NTemp,P21),
P11\==P21,!,
((P11<P21,!,P1=P11,P2=P21);P1=P21,P2=P11).



gerar_pontos_cruzamento1(P1,P2):-
gerar_pontos_cruzamento1(P1,P2).


cruzamento(L,R):- random_permutation(L,Lrp), cruzamento2(Lrp,R).

cruzamento2([ ],[ ]).
cruzamento2([Ind*_],[Ind]).



cruzamento2([Ind1*_,Ind2*_|Resto],[NInd1,NInd2|Resto1]):-
gerar_pontos_cruzamento(P1,P2),
prob_cruzamento(Pcruz),random(0.0,1.0,Pc),
((Pc =< Pcruz,!,
cruzar(Ind1,Ind2,P1,P2,NInd1),
cruzar(Ind2,Ind1,P1,P2,NInd2))
;
(NInd1=Ind1,NInd2=Ind2)),
cruzamento2(Resto,Resto1).


%  PreencheH
preencheh([ ],[ ]).

preencheh([_|R1],[h|R2]):-
 preencheh(R1,R2).


 %  Sublista
sublista(L1,I1,I2,L):-I1 < I2,!,
 sublista1(L1,I1,I2,L).

sublista(L1,I1,I2,L):-sublista1(L1,I2,I1,L).

sublista1([X|R1],1,1,[X|H]):-!, preencheh(R1,H).

sublista1([X|R1],1,N2,[X|R2]):-!,N3 is N2 - 1,
 sublista1(R1,1,N3,R2).

sublista1([_|R1],N1,N2,[h|R2]):-N3 is N1 - 1,
 N4 is N2 - 1,
 sublista1(R1,N3,N4,R2).


%  Rotate_Right
rotate_right(L,K,L1):- dimensao(N),
 T is N - K,
 rr(T,L,L1).

rr(0,L,L):-!.

rr(N,[X|R],R2):- N1 is N - 1,
 append(R,[X],R1),
 rr(N1,R1,R2).



elimina([],_,[]):-!.
elimina([X|R1],L,[X|R2]):- not(member(X,L)),!,
elimina(R1,L,R2).
elimina([_|R1],L,R2):-
elimina(R1,L,R2).

% Valida se h� espa�o para o elemento ser colocado na lista, true
% se houver
validarElem(X,L):-
    obtainNumberOfMaxDriverOccurs(X,N),count(X,L,N1),!,N>N1.

%  Obtem o n�mero m�ximo de ocurrencias do condutor possiveis para o
% vehicle duty atual
obtainNumberOfMaxDriverOccurs(X,N):-
    selected_vehicle_duty(Vd),
    lista_motoristas_nworkblocks(Vd,L),
    nth0(_,L,(X,N)).

%  Counts the amount of ocurrences N of element X in list
count(_,[],0):-!.
count(X,[A|B],N):-
    count(X,B,N1),
    ((A==X,N is N1+1);(N is N1)).


%  Insere

%  Condi��o de paragem, se chegarmos ao elemento do ponto de corte 1
insere(P1,_,L,N,L):-
 dimensao(T),
 N>T,N1 is N mod T,N1==P1,!.

insere(P1,[X|R],L,N,L2):-
 dimensao(T),
 ((N>T,!,N1 is N mod T);N1 is N),
 ((validarElem(X,L),!,
   insere1(X,N1,L,L1),
   N2 is N + 1);
 (L1 = L,N2 is N)),
 insere(P1,R,L1,N2,L2).

insere1(X,1,L,[X|L]):-!.

insere1(X,N,[Y|L],[Y|L1]):-
 N1 is N-1,
 insere1(X,N1,L,L1).

cruzar(Ind1,Ind2,P1,P2,NInd11):-
 sublista(Ind1,P1,P2,Sub1),
 dimensao(NumT),
 R is NumT-P2,
 rotate_right(Ind2,R,Sub2),
 P3 is P2 + 1,
 insere(P1,Sub2,Sub1,P3,NInd1),
 eliminah(NInd1,NInd11).


eliminah([],[]).
eliminah([h|R1],R2):-!,
eliminah(R1,R2).
eliminah([X|R1],[X|R2]):-
eliminah(R1,R2).


mutacao([],[]).
mutacao([Ind|Rest],[NInd|Rest1]):-
prob_mutacao(Pmut),
random(0.0,1.0,Pm),
((Pm < Pmut,!,mutacao1(Ind,NInd));NInd = Ind),
mutacao(Rest,Rest1).
mutacao1(Ind,NInd):-
gerar_pontos_cruzamento(P1,P2),
mutacao22(Ind,P1,P2,NInd).
mutacao22([G1|Ind],1,P2,[G2|NInd]):-
!, P21 is P2-1,
mutacao23(G1,P21,Ind,G2,NInd).
mutacao22([G|Ind],P1,P2,[G|NInd]):-
P11 is P1-1, P21 is P2-1,
mutacao22(Ind,P11,P21,NInd).
mutacao23(G1,1,[G2|Ind],G2,[G1|Ind]):-!.
mutacao23(G1,P,[G|Ind],G2,[G|NInd]):-
P1 is P-1,
mutacao23(G1,P1,Ind,G2,NInd).
