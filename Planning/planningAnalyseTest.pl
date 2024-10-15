nodes('Aguiar de Sousa', 'AGUIA', t, f, -8.4464785432391, 41.1293363229325).
nodes('Baltar', 'BALTR', t, f, -8.38716802227697, 41.1937898023744).
nodes('Cete', 'CETE', t, f, -8.35164059584564, 41.183243425797).
nodes('Cristelo', 'CRIST', t, f, -8.34639896125324, 41.2207801252676).
nodes('Duas Igrejas', 'DIGRJ', t, f, -8.35481024956726, 41.2278665802794).
nodes('Lordelo', 'LORDL', t, f, -8.42293614720057, 41.2452627470645).
nodes('Parada de Todeia', 'PARAD', t, f, -8.37023578802149, 41.1765780321068).
nodes('Paredes', 'PARED', t, f, -8.33566951069481, 41.2062947118362).
nodes('Recarei', 'RECAR', t, f, -8.42215867462191, 41.1599363478137).
nodes('Vila Cova de Carros', 'VCCAR', f, f, -8.34109395257277, 41.1090666564063).
nodes('FREAMUNDE1', 'FREA1', t, f, -8.35109395257277, 41.2090666564063).
nodes('FREAMUNDE2', 'FREA2', t, f, -8.34109395257277, 41.2790666564063).
nodes('FREAMUNDE3', 'FREA3', t, f, -8.34709395257277, 41.2770666564063).
nodes('FREAMUNDE4', 'FREA4', t, f, -8.44709395257277, 41.4770666564063).
nodes('NODENT1', 'NODET1', t, f, -8.44709395257277, 41.9770666564063).
nodes('NODENT2', 'NODET2', t, f, -8.94709395257277, 41.4770666564063).
nodes('NODENT3', 'NODET3', t, f, -8.44709395257277, 42.4770666564063).
nodes('TT1', 'T1', t, f, -8.34709395257277, 41.2770666564063).
nodes('TT2', 'X2', t, f, -8.44709305257277, 41.4770666564063).
nodes('TT3', 'T3', t, f, -8.44769395257277, 41.9770666564063).
nodes('TT4', 'T3', t, f, -8.94709325257277, 41.4770666564063).
nodes('TT5', 'T4', t, f, -8.44709395357277, 42.4770666564063).

linhas('Paredes_Aguiar', 1, ['AGUIA','RECAR','PARED','LORDL'], 31, 15700).
linhas('Lordelo_Parada',2,['LORDL','CRIST','VCCAR','BALTR','PARAD'],22,11000).
linhas('Paredes_Aguiar', 3, ['PARAD', 'RECAR','CETE'], 31, 15700).
linhas('Paredes_Freamunde', 4, ['CETE', 'DIGRJ','FREA2', 'FREA3'], 32, 16700).
linhas('Paredes_Freamunde', 5, ['FREA3', 'DIGRJ', 'FREA4'], 32, 16700).
linhas('Paredes_Freamunde', 6, ['FREA4', 'NODET1','NODET2','NODET3','FREA1','T1'], 32, 16700).
linhas('Paredes_Freamunde', 7, ['FREA4', 'NODET1','NODET2','NODET3','T1'], 32, 16700).
linhas('L1', 8, ['T1', 'T3', 'X2'], 32, 16700).
linhas('L2', 9, ['X2', 'T3','T1','T3'], 32, 16700).
linhas('L3', 10, ['T3', 'T1','T3','T1','X2'], 32, 16700).

horario(1,[200,500,1000,1100]).
horario(2,[2200,2400,2500,2600,2700]).
horario(3,[3300,3500,3600]).
horario(4,[5000,6000,7000,9000]).
horario(5,[9000,10000,11000]).
horario(6,[12000,14000,15000,16000,17000,18000]).
horario(7,[19000,20000,21000,22000,23000]).
horario(8,[25000,26000,27000]).
horario(9,[28000,29000,30000,32000]).
horario(10,[33000,34000,35000,36000,37000]).

%Bibliotecas HTTP
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
:-use_module(library(http/http_open)).

 :- json_object
 (name:string,shortName:string)+[type=node].
:- json_object
   (list(node)).
:- json_object req(startTime:integer, startNode:string, destNode:string).
%:- json_object liga(no1:string,no2:string,path:integer).
:- json_object liga(no1:string,no2:string,path:integer).

:- json_object reque(caminho:list(liga), tempo:integer).
:- json_object resAStar(caminho:list(string),percursos:list(string),tempo:integer).
:- json_object resAStarList(lista:list(resAStar)).
:- json_object resBestFirst(caminho:list(string),percursos:list(integer),tempo:integer).


%Dynamic Fact
:-dynamic nodes/6.
:-dynamic linhas/5.
:-dynamic liga/3.
:- dynamic melhor_caminho/2.
:- dynamic melhor_horario/3.

% Rela��o entre pedidos HTTP e predicados que os processam
:- http_handler('/plannings/GeneratorAllSolutions', doGeradorSolucoes, []).
:- http_handler('/plannings/A*', doAStar, []).
:- http_handler('/plannings/BestFirst', doBestFirst, []).

% Cria��o de servidor HTTP no porto 'Port'
server(Port) :-
        http_server(http_dispatch, [port(Port)]).

doBestFirst(Request):-
         http_read_json(Request, JSON, [json_object(dict)]),
         reloadData(_),
         atom_string(Node1,JSON.startNode),
         atom_string(Node2,JSON.destNode),


         bestfs(Node1,Node2,LCaminho,Lpercurso,JSON.startTime,MomentoChegada),
         %findall(resAStar(LCaminho,Lpercurso,MomentoChegada),bestfs(Node1,Node2,LCaminho,Lpercurso,JSON.startTime,MomentoChegada),R),
         V=resBestFirst(LCaminho,Lpercurso,MomentoChegada),

         prolog_to_json(V, JSONObject),
         reply_json(JSONObject, [{}]).

doAStar(Request):-
         http_read_json(Request, JSON, [json_object(dict)]),
         reloadData(_),
         atom_string(Node1,JSON.startNode),
         atom_string(Node2,JSON.destNode),


         %%EDIT FROM HERE
         findall(resAStar(Cam,CamL,Custo),aStar(JSON.startTime,Node1,Node2,Cam,CamL,Custo),R),
         V=resAStarList(R),

         prolog_to_json(V, JSONObject),
         reply_json(JSONObject, [json_object(dict)]).

doGeradorSolucoes(Request):-
         http_read_json(Request, JSON, [json_object(dict)]),
         reloadData(_),
         atom_string(Node1,JSON.startNode),
         atom_string(Node2,JSON.destNode),
         plan_hor_mot(JSON.startTime,Node1,Node2,LCaminho,Tempo),

         transformReply(LCaminho,NewList),

         R = reque(NewList,Tempo),

         prolog_to_json(R, JSONObject),
         reply_json(JSONObject, [json_object(dict)]).

reloadData(_):-
        getNodes(),
        getLines(),
        gera_ligacoes.

transformReply([],[]).
transformReply([(AtomNo1,AtomNo2,Tempo)|L],[X|NewList]):-
        atom_string(AtomNo1,No1),
        atom_string(AtomNo2,No2),
        X = liga(No1,No2,Tempo),
        transformReply(L,NewList).

%Obtem nos do MDR
getNodes():-
   retractall(nodes(_,_,_,_,_,_)),
   %Lists Nodes in JSON are located in Reply
   http_get('http://localhost:3000/api/node/listByQuery?sortby=shortName', Reply, [json_object(dict)]),

  splitHeadNode(Reply).

  %write("Nodes were created!").


% First we will separate the node located in the head of the List
splitHeadNode([]).
splitHeadNode([X|L]):-
   createNode(X),
   splitHeadNode(L).


%Create node facts
createNode(X):-(X.isDepot == "true",D = 't';D = 'f'),
   (X.isReliefPoint== "true",R = 't';R = 'f'),
   %JSON comes with atom and we want it as strings
   atom_string(N,X.name),
   atom_string(M,X.shortName),
   %write(N),write(;),write(M),write(;),nl,
   assertz(nodes(N,M,R,D,X.longitude,X.latitude)),
   !.



%Obtain list of lines and transform json to Reply
getLines():-
   retractall(linhas(_,_,_,_,_)),

   http_get('http://localhost:3000/api/line/listByQuery?sortBy=name', Reply, [json_object(dict)]),

   splitHeadLine(Reply).


% Separate the Line located in the head of the List of Lines
splitHeadLine([]).
splitHeadLine([X|L]):-
   getPaths(X,List),

   %Obtain list name
   atom_string(R,X.name),

   createLine(R,List),
   splitHeadLine(L).




%Will make a request type get to obtain paths from specific line
getPaths(X,List):-

   %Transform key from string to atom
   atom_string(S,X.key),

   %Concatenate url and the id from list to return list of paths
   Old='http://localhost:3000/api/line/paths/',
   atom_concat(Old,S,Url),

   %Lines Line paths to Reply
   http_get(Url, Reply, [json_object(dict)]),

   List=Reply.paths.

   %Lets fix id from fact line which will be 'Terminal_Terminal'
   %atom_string(N1,X.terminalNode1),
   %atom_string(N2,X.terminalNode1),

   %atom_concat(N1,'_',New),
   %atom_concat(New,N2,X)




% Receives name line and List of paths from that line
createLine(_,[]):-!.
createLine(Nome,[X|L]):-
   %save the key without it being string
   number_string(Num,X.key),

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



%adicionar primeiro no do primeiro segmento � lista
newgetPathSums([X|L],Newlist,M,D):-

   atom_string(Nodestr,X.node1),

   getPathSegmentSums([X|L],List,M,D),
   Newlist = [Nodestr|List].



gera_ligacoes:-
retractall(liga(_,_,_)),
findall(_,((nodes(_,No1,t,f,_,_);
%esta linha ser� alterada pois o nosso dominio assume que um depot � sempre relief point
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
   %get_time(Ti),
   (ver_melhor_caminho(Passing_inicio,Noi,Nof);true),

   %Depois de ser executado predicado ver_melhor_caminho, o melhor_caminho no topo da base de conhecimentos, ser� o melhor tempo para o melhor caminho

   retract(melhor_caminho(LCaminho,Tempo)).

   %get_time(Tf),TSol is Tf-Ti,
   %write('Tempo de geracao da solucao:'),write(TSol),nl.

%Ciclo para verificar qual o melhor caminho
ver_melhor_caminho(Passing_inicio,Noi,Nof):-
   %adiciona no topo da lista um melhor_caminho com um tempo elevado
   asserta(melhor_caminho(_,10000)),

   %Verifica os caminhos disponiveis do Noinicial ao Nofinal
   caminho(Noi,Nof,LCaminho),

   %Predicado � chamado com o objetivo de verificar cada caminho(conjunto de percursos) existentes dentro da LCaminho(Lista de caminhos)
   atualiza_melhor(Passing_inicio,LCaminho),fail.


% Passing_Inicio � quando come�a o horario do motorista
% LCaminho � o conjunto de percursos
atualiza_melhor(Passing_inicio,LCaminho):-

   %Obtem o melhor_caminho
   melhor_caminho(_,Melhor_tempo),

   %calcula os horarios para a lista de percursos
   calcula_horario_do_caminho(Passing_inicio,LCaminho,Tempo_caminho),

   Tempo_caminho<Melhor_tempo,retract(melhor_caminho(_,_)),
   asserta(melhor_caminho(LCaminho,Tempo_caminho)).




%Calcula melhor horario do caminho recebido
% Quando acabar de verificar o melhor horario para todos os percurso vai
% inicializar o tempo a 0
 calcula_horario_do_caminho(_,[],0).
calcula_horario_do_caminho(Passing_inicio,[(No1,No2,P)|L],Tempo):-

  %inicializa melhor horario
  asserta(melhor_horario(P,_,10000)),

  %chama predicado que vai encontrar melhor horario e adiciona-lo ao topo dos factos
  atualiza_melhor_horario(Passing_inicio,No1,P),

  %obtem melhor horario do percurso (P),List de passing times e o tempo que esperou at� inicializar horario
  retract(melhor_horario(P,List,Tempo_espera)),
  %Obtem tempo de passagem no ultimo n� do percurso que ser� o proximo passing_inicio
  posPer(P,No1,Pos),
  nth0(Pos,List,Passing_inicio_perc),

  posPer(P,No2,Pos2),
  nth0(Pos2,List,Novo_Passing),

  %obtem tempo de dura�ao do percurso � a diferen�a entre pontos de rendi�ao/depot
  Duracao is Novo_Passing - Passing_inicio_perc,

  %Calcula proximo percurso da lista
  calcula_horario_do_caminho(Novo_Passing,L,Tempo1),

  %Recursivamente obtem valor do tempo que esperou ate inicializar o percurso, a duracao do percurso + o tempo anterior dos outros percursos
  Tempo is Tempo1 + Tempo_espera + Duracao.


% Verifica qual o melhor horario para um percurso desde o momento que se
% come�a a espera (Passing)
atualiza_melhor_horario(Passing,No1, Path):-
   %procura horario para o percurso
   horario(Path,[X|L]),

   posPer(Path,No1,Pos),

   nth0(Pos,[X|L],P),

   %Se o horario come�ar depois do tempo que come�a a espera, calcula-se o tempo de espera
   (Passing<X,Tempo_espera is P - Passing,
    %Vai ao topo ver melhor horario para o percurso do momento, se o N(Tempo de espera) for maior que o Tempo_espera do atual, ele retira o melhor, e adiciona o novo com os respetivos dados do horario
   melhor_horario(Path,_,N),
   (Tempo_espera<N,
    retract(melhor_horario(_,_,_)),asserta(melhor_horario(Path,[X|L],Tempo_espera))
   ;fail)
   ;fail).










%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%Implementacao do A* adaptado
aStar(Hinit,Orig,Dest,Cam,CamL,Custo):-
        aStar2(Hinit,Dest,[(_,Hinit,[Orig],[])],Cam,CamL,Custo).


aStar2(Hinit,Dest,[(_,Ha,[Dest|T],Linhas)|Outros],Cam,CamL,Custo):-
        length(Outros,NL),write(NL),reverse([Dest|T],Cam),reverse(Linhas,CamL), Custo is (Ha-Hinit).

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

% Obtem a maior velocidade m�dia de todas as linhas
velocidadeMedia(Vm):-
        findall(Vel,(linhas(_,_,_,Tempo,Dist),Vel is Dist/Tempo),Lista),
        max_list(Lista,Vm).


% Obtem um N� X, com liga��o direta ao N� Act (ambos de
% recolha/rendi��o), e obtem os seus respetivos tempos de demora T e
% Percurso Per a que pertencem para todos os horarios
%
% Obtem o percurso usando liga/3, obtem a posi��o nos horarios de cada
% nodo usando posPer/3, obtem o horario usando horario/2,obtem a hora
% de cada um colocando a posi��o do Nodo e lista de horarios em nth0/3,
% verifica se a hora atual � inferior � hora a que o autocarro
% passa,calcula a diferen�a entre as horas dos nodos, calcula o seu
% valor absoluto e no final retorna esse valor absoluto mais 120
% segundos (que s�o o tempo de espera pelo autocarro)

ligaCustos(Ha,Act,X,T,Per):-
        liga(Act,X,Per),posPer(Per,Act,PosAct),posPer(Per,X,PosX),
        horario(Per,Lista),nth0(PosAct,Lista,TAct),Ha<TAct,Tespera is TAct-Ha,
        nth0(PosX,Lista,TX),Dif is TAct-TX,
        abs(Dif,AbsDif), T is AbsDif+120+Tespera.


% Obtem a posi��o de um n� num percurso
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

bestfs2(Dest,(0,[Orig]),Cam,[],Lreverse),
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

estimativa(Act,X,Cx),

\+member(X,LA),
estimativabf(X,Dest,EstX),



CaX is Ca+Cx)
 ,Novos),


sort(Novos,NovosOrd),
NovosOrd = [(_,Cm,Melhor,Listpath)|_],

bestfs2(Dest,(Cm,Melhor),Cam,Listpath,Lreverse).





estimativabf(Nodo1,Nodo2,Estimativa):-

nodes(_,Nodo1,_,_,X1,Y1),
nodes(_,Nodo2,_,_,X2,Y2),
Estimativa is sqrt((X1-X2)^2+(Y1-Y2)^2).
