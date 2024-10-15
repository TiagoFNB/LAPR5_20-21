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
horario('3', [63000, 63480, 63780, 64080, 64620]).
horario('1', [61200, 61740, 62040, 62340, 62820]).
horario('11', [65220, 65700, 65940]).
horario('8', [70500,71000,71500]).
horario('5', [75000,75500,76000]).


% Relacao entre pedidos HTTP e predicados que os processam
:- http_handler('/plannings/GeneratorAllSolutions', doGeradorSolucoes, []).
:- http_handler('/plannings/A*', doAStar, []).
:- http_handler('/plannings/BestFirst', doBestFirst, []).
:- http_handler('/plannings/Genetic', doGenetic, []).

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


        resultado(Pop),

        extract_elem(Pop,Elem),
        vehicleduty(VeicDuty,_,Wks),
        Res = genetic_response(Elem,Wks),

        prolog_to_json(Res,JSONObject),
        reply_json(JSONObject, [json_object(dict)]).

extract_elem([X*_|_],X).

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
   horario(Path,[X|L]),

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
        horario(Per,Lista),nth0(PosAct,Lista,TAct),Ha<TAct,Tespera is TAct-Ha,
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


horario(H3,ListaHorario),

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
%NovosOrd = [(_,Cm,Melhor,Listpath)|_], comentado porque fiz a alteraÔøΩÔøΩo sugerida pelo regente
proximo(NovosOrd,Cm,Melhor,Listpath),

bestfs2(Dest,(Cm,Melhor),Cam,Listpath,Lreverse).





estimativabf(Nodo1,Nodo2,Estimativa):-

nodes(_,Nodo1,_,_,X1,Y1),
nodes(_,Nodo2,_,_,X2,Y2),
Estimativa is sqrt((X1-X2)^2+(Y1-Y2)^2).


proximo([(_,Cm,Melhor,Listpath)|_],Cm,Melhor,Listpath).
proximo([_|L],Cm,Melhor,Listpath):- proximo(L,Cm,Melhor,Listpath).


lista_motoristas_nworkblocks('12',[('276',2),('5188',3),('16690',2),('18107',5),('1',1)]).
lista_motoristas_nworkblocks('VeicDutT01',[('276',1),('5188',1)]).
lista_motoristas_nworkblocks('VeicDutT02',[('276',1),('5188',2),('16690',1)]).
vehicleduty('12',_,['12','211','212','213','214','215','216','217','218','219','220','221','222']).
workblock('12',['459'],34080,37620).
workblock('211',['31','63'],37620,41220).
workblock('212',['33','65'],41220,44820).
workblock('213',['35','67'],44820,48420).
workblock('214',['37','69'],48420,52020).
workblock('215',['39','71'],52020,55620).
workblock('216',['41','73'],55620,59220).
workblock('217',['43','75'],59220,62820).
workblock('218',['45','77'],62820,66420).
workblock('219',['48','82'],66420,70020).
workblock('220',['52','86'],70020,73620).
workblock('221',['56','432'],73620,77220).
workblock('222',['460'],77220,77340).


% parameteriza√ß√£o
:-asserta(percentagem_melhor_manter(0.25)).
:-asserta(duracao_maxima(10)).
:-asserta(avaliacaoexp(1)).
:-asserta(estabiliz(4)).

% parameteriza√ß√£o necess√°ria para adaptacao da avaliacao
:-asserta(selected_vehicle_duty('12')).
:-asserta(max_delay_time(0)). %Tempo m√°ximo de atraso
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

pref_horario('5188',28800,64800 ). %das 8:00h ‡s 18:00h
pref_horario('276',36000,72000 ).  %das 10:00h ‡s 20:00h
pref_horario('16690',0,36000).     %das 00:00h ‡s 10:00h
pref_horario('18107',0,86400). %das 00:00h ‡s 24:00h



inicializa_Genetico:-write('Numero de novas Geracoes: '),read(NG),
(retract(geracoes(_));true), asserta(geracoes(NG)),
write('Dimensao da Populacao: '),read(DP),
(retract(populacao(_));true), asserta(populacao(DP)),
write('Probabilidade de Cruzamento (%):'), read(P1),
PC is P1/100,
(retract(prob_cruzamento(_));true), asserta(prob_cruzamento(PC)),
write('Probabilidade de Mutacao (%):'), read(P2),
PM is P2/100,
(retract(prob_mutacao(_));true), asserta(prob_mutacao(PM)),

write('duracao m√°ximo :'), read(TM),


write('Parar quando atinge a avaliacao de : '), read(Avalexp),
(retract(avaliacaoexp(_));true), asserta(avaliacaoexp(Avalexp)),
(retract(duracao_maxima(_));true), asserta(duracao_maxima(TM)),
get_time(Ta),
(retract(tempo_inicial(_));true), asserta(tempo_inicial(Ta)).

gera_genetico(VeicDuty,Duracao):-
 inicializa_gera_genetico(VeicDuty,Duracao),!,
%Case1
%gera_populacao1(Pop),!,
%Case2
gera_populacao(Pop),!,
%
avalia_populacao(Pop,PopAv),!,
ordena_populacao(PopAv,PopOrd),
geracoes(NG),
asserta(melhor(_*100 )),
estabiliz(Establimit),!,
gera_geracao(0,NG,PopOrd,1,Establimit,0,0),!.

inicializa_gera_genetico(VeicDuty,Duracao):-
 (retract(geracoes(_));true),asserta(geracoes(100)),
 (retract(populacao(_));true),asserta(populacao(2)),
 (retract(prob_cruzamento(_));true),asserta(prob_cruzamento(75)),
 (retract(prob_mutacao(_));true),asserta(prob_mutacao(25)),
 (retract(selected_vehicle_duty(_));true),asserta(selected_vehicle_duty(VeicDuty)),
 (retract(avaliacaoexp(_));true),asserta(avaliacaoexp(1)),
 (retract(duracao_maxima(_));true),asserta(duracao_maxima(Duracao)),
 get_time(Ta),
 (retract(tempo_inicial(_));true), asserta(tempo_inicial(Ta)),!.


gera:-
inicializa_Genetico,
%Case1
%gera_populacao1(Pop),!,
%Case2
gera_populacao(Pop),!,
%
avalia_populacao(Pop,PopAv),!,
ordena_populacao(PopAv,PopOrd),
geracoes(NG),
asserta(melhor(_*100 )),
estabiliz(Establimit),!,
gera_geracao(0,NG,PopOrd,1,Establimit,0,0). % o antepenultimo parametro "1" √© para ter em conta a estabilizacao, que come√ßa a 1 , quando for igual a Establimit p√°ra
                                    %, o penultimo 0 √© para quando atinge o limite de tempo (0 para nao atingido, 1 para atingido/ultrapassado)
                                      % o ultimo 0 √© para ver se ja atingiu uma avalia√ßao especifica



%Case 1
gera_populacao1(Pop):-
populacao(TamPop),

%Mudanca efetuada, obtem se dimensoes Case 1
dimensao(NumD),

%
%Obter lista de condutores eg [(C2,X),(C1,Y)] do selected vehicle
selected_vehicle_duty(Vehic),
lista_motoristas_nworkblocks(Vehic,ListaDrivers),

%Obter lista de condutores
%Transformar ListaDrivers no caso um
% ---- Descomentar 2 linhas de baixo para caso 1 e utilizar
% gera_individuo/3
 transformNewListDrivers(ListaDrivers,[],NewListaDrivers),
gera_populacao1(TamPop,NewListaDrivers,NumD,Pop).


%Case 2 tem limitacoes
gera_populacao(Pop):-
populacao(TamPop),

%Case 2 Nr elementos na lista de drivers
%com o predicado count executado 6 linhas abaixo

%Obter lista de condutores eg [(C2,X),(C1,Y)] do selected vehicle
selected_vehicle_duty(Vehic),
lista_motoristas_nworkblocks(Vehic,ListaDrivers),
count(ListaDrivers,NumD),

%Obter lista de condutores
% ---- Caso 2 em baixo (Utilizar quando DimensaoFatorial>TamPop)
gera_populacao(TamPop,ListaDrivers,NumD,Pop).

count([],0).
count([_|L],N):- count(L,N1), N is N1 +1.


gera_populacao1(0,_,_,[]):-!.
gera_populacao1(TamPop,ListaDrivers,NumD,[Ind|Resto]):-
TamPop1 is TamPop-1,
gera_populacao1(TamPop1,ListaDrivers,NumD,Resto),

%Linha de baixo È o gera_individuo/3 Caso 1
gera_individuo(ListaDrivers,NumD,Ind),

not(member(Ind,Resto)).

gera_populacao1(TamPop,ListaDrivers,NumD,L):-
gera_populacao1(TamPop,ListaDrivers,NumD,L).


gera_populacao(0,_,_,[]):-!.
gera_populacao(TamPop,ListaDrivers,NumD,[Ind|Resto]):-
TamPop1 is TamPop-1,
gera_populacao(TamPop1,ListaDrivers,NumD,Resto),

% Linha de baixo È o gera_individuo/4 Caso 2
gera_individuo(0,ListaDrivers,NumD,[],Ind),

not(member(Ind,Resto)).

gera_populacao(TamPop,ListaDrivers,NumD,L):-
gera_populacao(TamPop,ListaDrivers,NumD,L).

% Calcula fatorial das dimensoes para determinar o maximo de populaÁ„o
% para o caso 2
calc_fatorial(1,1):-!.
calc_fatorial(N,Res):-
Temp = N,
N1 is N-1,
calc_fatorial(N1,Res1),
Res is Temp * Res1.




% %%usa -se para caso 1, Sem alteracoes, manteve-se inicial
% Neste caso ListaDrivers È criada posteriormente e cada elemente, mesmo
% que repetido ser· sorted para criar individuos
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



% ! %%% gera_individuo Caso 2
% adaptado para receber conjunto de driver e numero de workblocks
% associados [(Driver,NrVezes),...]
gera_individuo(_,[(Driver,Vezes)],1,Result,Final):-!,addToListXTimes(Driver,Vezes,Result,Final).
gera_individuo(Pos,ListaDrivers,NumD,Result,F):-

        NumTemp is NumD +1,
        random(1,NumTemp,N),

        %Nova lista saca o (driver,nrvezes) tem que ser adicionado (Driver, VezesSobra)
        %retira(N,ListaDrivers,(Driver,Vezes),NovaLista),
        retiraNotSameDriver(Result,N,ListaDrivers,_,_,NovaLista,Driver,Vezes),
calculateAndAddToListAccordingToHour(Result,NewResult,Pos,Driver,Vezes,NovaLista,NumD,NewPos,NovaListaModificada,NumDAlterado),

NumT1 is NumDAlterado-1,
gera_individuo(NewPos,NovaListaModificada,NumT1,NewResult,F).


retiraNotSameDriver(_,0,_,RDriver,RVezes,_,RDriver,RVezes):-!.
retiraNotSameDriver(Result,N,ListaDrivers,RDriver,RVezes,NovaLista,Driver,Vezes):-
        (last(Result,UltimoDriver);true,!,UltimoDriver ='Example'),
        retira(N,ListaDrivers,(RDriver,RVezes),NovaListaTest),
        (UltimoDriver\=RDriver,!,NovaLista=NovaListaTest,retiraNotSameDriver(_,0,_,RDriver,RVezes,NovaLista,Driver,Vezes);true,!,(count(ListaDrivers,N),(N\=1,retiraNotSameDriver(Result,N,ListaDrivers,RDriver,RVezes,NovaLista,Driver,Vezes);fail))).




calculateAndAddToListAccordingToHour(Result,NewResult,Pos,Driver,Vezes,NovaLista,NumD,NewPos,NovaListaModificada,NumDAlterado):-
        %Temp is Vzes +1,
       %random(1,Temp,Vezes),
       verifyHowManyTimesCanAdd(Pos,0,NextPos,Vezes,1,VezesSobra),

       (VezesSobra<1,!,
        NovaListaModificada= NovaLista,
        NewPos is NextPos,
        NumDAlterado is NumD,
        addToListXTimes(Driver,Vezes,Result,NewResult)
       ;(true,!,NewPos is NextPos,
        VezesPossiveis is Vezes - VezesSobra,
        addToListXTimes(Driver,VezesPossiveis,Result,NewResult),
        append([(Driver,VezesSobra)],NovaLista,NovaListaModificada),
        NumDAlterado is NumD +1
        )).




%! %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% simplesmente objetivo vai pegar no nr de vezes dos drivers e juntar ‡
% lista xvezes
transformNewListDrivers([],L,L):-!.
transformNewListDrivers([(Driver,Vezes)|L],List,R):-
addToListXTimes(Driver,Vezes,List,ResultList),
transformNewListDrivers(L,ResultList, R).


% Permite adicionar Driver x vezes no final da lista recebida
% como parametro List e retorna resultado na variavel Res
addToListXTimes(_,0,L,L):-!.
addToListXTimes(Driver,Vezes,List,Res):-
Vezes1 is Vezes-1,
append(List,[Driver],L1),
addToListXTimes(Driver,Vezes1,L1,Res).

verifyHowManyTimesCanAdd(P,_,NextP,0,_,Vf):- !,Vf is 0,NextP is P.
verifyHowManyTimesCanAdd(P,_,NextP,V,0,Vf):-!,Vf is V,NextP is P.

%Sum initiated 0, %Vezes initiated
verifyHowManyTimesCanAdd(Pos,Sum,FinalPos,Vezes,Final,V):-
        selected_vehicle_duty(Vehic),
        vehicleduty(Vehic,_,LW),
        NrVezes is Vezes-1,
        nth0(Pos,LW,Wb),
        calculateWbDurationTime(Wb,Duration),
        SumTemp is Duration + Sum,
        (SumTemp>14400,!,Vez is NrVezes +1,verifyHowManyTimesCanAdd(Pos,_,FinalPos,Vez,0,V);(!,true,NewSum is Duration + Sum, NewPos is Pos +1, verifyHowManyTimesCanAdd(NewPos,NewSum,FinalPos,NrVezes,Final,V))).





calculateWbDurationTime(Wb,Duration):-
        workblock(Wb,_,Start,End),
        Duration is End-Start.


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

% verificar se o condutor durante o periodo do almoco possui um hora para a refeicao, caso n√£o tenha √© uma violacao de 3600 segundos
check_lunch_time(Tinicio,Tfim,ListaCondutor,VT1):-meal_break_time(H,Pen),first_meal_start_time(T1),first_meal_end_time(T2),max_time_during_meal(M),check_lunch_time2(Tinicio,Tfim,ListaCondutor,T1,T2,Total), ((Total >M, VT1 is H*Pen);VT1 is 0).
% predicado auxiliar que vai calcular a intersecao entre o periodo de almoco e a agenda do motorista
check_lunch_time2(Tinicio,Tfim,[],T1,T2,Total):-(((Tinicio>T2;T1>Tfim),!,Total is 0); (Ta is max(T1,Tinicio),Tb is min(T2,Tfim), Total is Tb-Ta)).
check_lunch_time2(Tinicio,Tfim,[(Tinicio2,Tfim2,_)|Resto],T1,T2,Total):-check_lunch_time2(Tinicio,Tfim,Resto,T1,T2,Total2),(((Tinicio2>T2;T1>Tfim2),Total is Total2+0); (Ta is max(T1,Tinicio2),Tb is min(T2,Tfim2), Total is Total2+(Tb-Ta))).

% verificar se o condutor durante o periodo do jantar possui um hora para a refeicao, caso n√£o tenha √© uma violacao de 3600 segundos
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


gera_geracao(_,_,Pop,E,E,_,_):-!,
retract(resultado(_)),asserta(resultado(Pop)).

gera_geracao(_,_,Pop,_,_,_,1):-!,
retract(resultado(_)),asserta(resultado(Pop)).

gera_geracao(_,_,Pop,_,_,1,_):-!,
retract(resultado(_)),asserta(resultado(Pop)).

gera_geracao(G,G,Pop,_,_,_,_):-!,
retract(resultado(_)),asserta(resultado(Pop)).


gera_geracao(N,G,Pop,Estab,Establimit,_,_):-
verifica_tempo(Limitreach1),
verifica_avaliacao_especifica(Pop,Avalespecifica1),
cruzamento(Pop,NPop1),
mutacao(NPop1,NPop),
avalia_populacao(NPop,NPopAv),
ordena_populacao(NPopAv,NPopOrd),



%Aplicar um metodo de sele√ß√£o que n√£o seja puramente elitista

append(Pop,NPopOrd,Epop), % Juntar os N indiv√≠duos da popula√ß√£o atual com os seus descendentes obtidos por cruzamento e muta√ß√£o
sort(Epop,Espop), % remover indiv√≠duos repetidos (usando sort) e Orden√°-los (ordem crescente porque o objetivo √© uma minimiza√ß√£o) a ordem crescente √© o default
ordena_populacao(Espop,Rpop),
populacao(Num),
percentagem_melhor_manter(Pm),
P1 is Num * Pm, % escolher o P primeiros (P maior ou igual a 1 para garantir que passam os P melhores, valores como 20% ou 30% de N s√£o adequados)
(P1<1 ->P is 1; P is round(P1)), %para garantir que P vai ser sempre maior ou igual do que 1 e vai ser inteiro
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


%VERIFICACOES DE TERMINO

verifica_tempo(Limitreach):-duracao_maxima(D), tempo_inicial(I), get_time(Tf), R is D+I, (R>Tf ->Limitreach is 0;Limitreach is 1).

verifica_avaliacao_especifica([_*VX|_],Avalespecifica):- avaliacaoexp(Aval), (VX =< Aval -> Avalespecifica is 1;Avalespecifica is 0  ).


verifica_estabilizacao(Pop,Estab,Novapop,R):- (Pop = Novapop -> R is Estab+1; R is 1).
%


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


%  Obtem a dimens„o do vehicle duty
dimensao(Dim):- selected_vehicle_duty(Vd),!,lista_motoristas_nworkblocks(Vd,L),
    dimensao2(L,Dim).

dimensao2([],0).
dimensao2([(_,X)|Z],Dim):- dimensao2(Z,Dim1),Dim is Dim1 + X.

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

% Valida se h· espaÁo para o elemento ser colocado na lista, true
% se houver
validarElem(X,L):-
    obtainNumberOfMaxDriverOccurs(X,N),count(X,L,N1),!,N>N1.

%  Obtem o n˙mero m·ximo de ocurrencias do condutor possiveis para o
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

%  CondiÁ„o de paragem, se chegarmos ao elemento do ponto de corte 1
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
