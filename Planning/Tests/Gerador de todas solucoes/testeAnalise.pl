nodes('Aguiar de Sousa', 'AGUIA', t, f, -8.4464785432391, 41.1293363229325).
nodes('Baltar', 'BALTR', t, f, -8.38716802227697, 41.1937898023744).

nodes('Besteiros', 'BESTR', f, f, -8.34043029659082, 41.217018845589).%%mudou-se para ponto de rendição fase 4

nodes('Cete', 'CETE', t, f, -8.35164059584564, 41.183243425797).
nodes('Cristelo', 'CRIST', t, f, -8.34639896125324, 41.2207801252676).

nodes('Duas Igrejas', 'DIGRJ', f, f, -8.35481024956726, 41.2278665802794).%%mudou-se para ponto de rendição fase 4

nodes('Estacao (Lordelo)', 'ESTLO', t, t, -8.4227924957086, 41.2521157104055).
nodes('Estacao (Paredes)', 'ESTPA', t, t, -8.33448520831829, 41.2082119860192).
nodes('Gandra', 'GAND', t, f, -8.43958765792976, 41.1956579348384).
nodes('Lordelo', 'LORDL', t, f, -8.42293614720057, 41.2452627470645).
nodes('Mouriz', 'MOURZ', t, f, -8.36577272258403, 41.1983610215263).
nodes('Parada de Todeia', 'PARAD', t, f, -8.37023578802149, 41.1765780321068).
nodes('Paredes', 'PARED', t, f, -8.33566951069481, 41.2062947118362).
nodes('Recarei', 'RECAR', f, f, -8.42215867462191, 41.1599363478137).
nodes('Sobrosa', 'SOBRO', t, f, -8.38118071581788, 41.2557331783506).
nodes('Vandama', 'VANDO', f, f, -8.34160692293342, 41.2328015719913).
nodes('Vila Cova de Carros', 'VCCAR', f, f, -8.35109395257277, 41.2090666564063).



linhas('Paredes_Aguiar', 1, ['AGUIA','RECAR', 'PARAD', 'CETE', 'PARED'], 31, 15700).
linhas('Paredes_Aguiar', 3, ['PARED', 'CETE','PARAD', 'RECAR', 'AGUIA'], 31, 15700).
linhas('Paredes_Gandra', 5 , ['GAND', 'VANDO', 'BALTR', 'MOURZ', 'PARED'], 26, 13000).
linhas('Paredes_Gandra', 8, ['PARED', 'MOURZ', 'BALTR', 'VANDO', 'GAND'], 26, 13000).
linhas('Paredes_Lordelo', 9, ['LORDL','VANDO', 'BALTR', 'MOURZ', 'PARED'], 29, 14300).
linhas('Paredes_Lordelo', 11, ['PARED','MOURZ', 'BALTR', 'VANDO', 'LORDL'], 29, 14300).
linhas('Lordelo_Parada', 24, ['LORDL', 'DIGRJ', 'CRIST', 'VCCAR', 'BALTR', 'PARAD'], 22,
11000).
linhas('Lordelo_Parada', 26, ['PARAD', 'BALTR', 'VCCAR', 'CRIST', 'DIGRJ', 'LORDL'], 22,
11000).
% linha('Cristelo_Baltar’, nd0, ['CRIST', 'VCCAR', 'BALTR'], 8, 4000).
% linha('Baltar_Cristelo’, nd1, [‘BALTR', 'VCCAR', 'CRIST'], 8, 4000).
linhas('Sobrosa_Cete', 22, ['SOBRO', 'CRIST', 'BESTR', 'VCCAR', 'MOURZ', 'CETE'], 23,
11500).
linhas('Sobrosa_Cete', 20, ['CETE', 'MOURZ', 'VCCAR', 'BESTR', 'CRIST', 'SOBRO'], 23,
11500).

 linhas('CETE_LORDELO', 25, ['CETE', 'MOURZ', 'VANDO', 'BALTR',
 'DIGRJ','LORDL'], 23,11500).%%adicionada para fase 2
 linhas('LORDELO_CETE', 27, ['LORDL', 'DIGRJ', 'BALTR', 'VANDO', 'MOURZ',
 'CETE'], 23,11500).%%adicionada para fase 2

 linhas('SOBROSA_LORDELO', 45, ['SOBRO', 'MOURZ',
 'BALTR','CRIST','VANDO','DIGRJ', 'SOBRO'], 23,11500).
 %%adicionado para
% fase 3

 linhas('LORDELO_SOBROSA', 47, ['LORDL', 'DIGRJ', 'VANDO',
 'CRIST','BALTR','MOURZ' ,'SOBRO'], 23,11500).%%adicionado para fase 3

:- dynamic nSol/1.


linhas('Estação(Lordelo)_Lordelo',34,['ESTLO','LORDL'], 2,1160).
linhas('Lordelo_Estação(Lordelo)',35,['LORDL','ESTLO'], 2,1160).
linhas('Estação(Lordelo)_Sobrosa',36,['ESTLO','SOBRO'], 5,1160).
linhas('Sobrosa_Estação(Lordelo)',37,['SOBRO','ESTLO'], 5,1160).
linhas('Estação(Paredes)_Paredes',38,['ESTPA','PARED'], 2,1160).

horario(34,[100,500]).
horario(35,[100,500]).
horario(36,[100,500]).
horario(37,[100,500]).
horario(38,[100,500]).

horario(1,[1500,1600,2000,2100,2300]).
horario(3,[600,700,1200,1300,1400]).
horario(3,[2200,2400,2500,2600,2700]).
horario(5,[2400,2600,2700,2800,2900]).
horario(8,[3300,3500,3600,3650,3750]).
horario(24,[3300,3500,3600,3700,3800,3900]).

horario(11,[3700,3900,4000,5100,5200]).
horario(20,[5000,6000,7000,9000,9500,10000]).
horario(22,[500,1000,2000,4000,5000,5500]).
horario(27,[9000,10000,11000,11100,11200,11300]).
horario(45,[12000,14000,15000,16000,17000,18000,18100]).
horario(47,[19000,20000,21000,22000,23000,23100,23200]).
horario(9,[25000,26000,27000,27100,27200]).
horario(8,[28000,29000,30000,32000,32100]).
horario(10,[33000,34000,35000,36000,37000]).
horario(26,[2200,2400,2500,2600,2700,2800]).
horario(25,[2400,2600,2700,2800,2900,3000]).

%Bibliotecas HTTP
 :- use_module(library(http/http_client)).

%Dynamic Fact
:-dynamic nodes/6.
:-dynamic linhas/5.
:-dynamic liga/3.
:- dynamic melhor_caminho/2.
:- dynamic melhor_horario/3.


reloadData(_):-
        getNodes(),
        getLines(),
        gera_ligacoes.

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
   get_time(Ti),
	assertz(nSol(0)),
   (ver_melhor_caminho(Passing_inicio,Noi,Nof);true),

   %Depois de ser executado predicado ver_melhor_caminho, o melhor_caminho no topo da base de conhecimentos, ser� o melhor tempo para o melhor caminho

   retract(melhor_caminho(LCaminho,Tempo)),
write('Numero de Solucoes:'),retract(nSol(NS)),write(NS),nl,

   get_time(Tf),TSol is Tf-Ti,
   write('Tempo de geracao da solucao:'),write(TSol),nl.

%Ciclo para verificar qual o melhor caminho
ver_melhor_caminho(Passing_inicio,Noi,Nof):-
   %adiciona no topo da lista um melhor_caminho com um tempo elevado
   asserta(melhor_caminho(_,100000)),

   %Verifica os caminhos disponiveis do Noinicial ao Nofinal
   caminho(Noi,Nof,LCaminho),

   %Predicado � chamado com o objetivo de verificar cada caminho(conjunto de percursos) existentes dentro da LCaminho(Lista de caminhos)
   write(LCaminho),nl,
  ((atualiza_melhor(Passing_inicio,LCaminho),fail);fail).


% Passing_Inicio � quando come�a o horario do motorista
% LCaminho � o conjunto de percursos
atualiza_melhor(Passing_inicio,LCaminho):-

   %Obtem o melhor_caminho
   melhor_caminho(_,Melhor_tempo),retract(nSol(NS)), NS1 is NS+1, asserta(nSol(NS1)),

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

  %obtem melhor horario do percurso (P),List de passing times e o tempo que esperou at� inicializar horario
  retract(melhor_horario(P,List,Tempo_espera)),
  %Obtem tempo de passagem no ultimo n� do percurso que ser� o proximo passing_inicio
  getPositionFromNode(P,No1,List,Passing_inicio_perc),
  %posPer(P,No1,Pos),
  %nth0(Pos,List,Passing_inicio_perc),
  getPositionFromNode(P,No2,List,Novo_Passing),
  %posPer(P,No2,Pos2),
  %nth0(Pos2,List,Novo_Passing),

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

   %posPer(Path,No1,Pos),

   %nth0(Pos,[X|L],P),

   getPositionFromNode(Path,No1,[X|L],P),

   %Se o horario come�ar depois do tempo que come�a a espera, calcula-se o tempo de espera
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



