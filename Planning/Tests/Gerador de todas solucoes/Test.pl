%Este ficheiro será usado apenas para testes
%
%
%
%
%Dynamic Fact
:-dynamic nodes/6.
:-dynamic linhas/5.
:-dynamic liga/3.
:- dynamic melhor_caminho/2.
:- dynamic melhor_horario/3.

%Nodes que são relief point
nodes('Aguiar de Sousa','AGUIA',t,f,41.1293363229325,-8.4464785432391).
nodes('Paredes','PARED',t,f,41.2062947118362,-8.33566951069481).
nodes('Gandra','GAND',t,f,41.1956579348384,-8.43958765792976).
nodes('Cristelo','CRIST',t,f,41.2207801252676,-8.34639896125324).
nodes('Sobrosa','SOBRO',t,f,41.2557331783506,-8.38118071581788).

%Nodes para preencher percursos
nodes('Recarei','RECAR',f,f,41.1599363478137,-8.42215867462191).
nodes('Parada de Todeia','PARAD',f,f,41.1765780321068,-8.37023578802149).
nodes('Cete','CETE',f,f,41.183243425797,-8.35164059584564).
nodes('Mouriz','MOURZ',f,f,41.1983610215263,-8.36577272258403).
nodes('Baltar','BALTR',f,f,41.1937898023744,-8.38716802227697).
nodes('Vandoma','VANDO',f,f,41.2328015719913,-8.34160692293342).
nodes('Vila Cova de Carros','VCCAR',f,f,41.2090666564063,-8.35109395257277).

%Diferentes percursos
linhas('Aguiar_Paredes',1,['AGUIA','RECAR','PARAD','CETE','PARED'],1600,800).
linhas('Aguiar_Sobrosa',8,['AGUIA','PARAD','SOBRO'],1000,400).
linhas('Gandra_Cristelo',11,['GAND','VCCAR','CRIST'],720,400).
linhas('Paredes_Gandra',3,['PARED','MOURZ','BALTR','VANDO','GAND'],1720,800).
linhas('Sobrosa_Cristelo',5,['SOBRO','MOURZ','CRIST'],1000,400).


%horarios para testes
horario(3, [63000, 63480, 63780, 64080, 64620]).
horario(1, [61200, 61740, 62040, 62340, 62820]).
horario(11, [65220, 65700, 65940]).
horario(8, [70500,71000,71500]).
horario(5, [75000,75500,76000]).


gera_ligacoes:-
retractall(liga(_,_,_)),
findall(_,((nodes(_,No1,t,f,_,_);
%esta linha será alterada pois o nosso dominio assume que um depot é sempre relief point
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


% Depois de ser executado predicado ver_melhor_caminho, o melhor_caminho
% no topo da base de conhecimentos em memoria, será o melhor tempo para
% o melhor caminho
plan_hor_mot(Passing_inicio,Noi,Nof,LCaminho,Tempo):-


   (ver_melhor_caminho(Passing_inicio,Noi,Nof);true),

   %Depois de ser executado predicado ver_melhor_caminho, o melhor_caminho no topo da base de conhecimentos, ser� o melhor tempo para o melhor caminho

   retract(melhor_caminho(LCaminho,Tempo)).

% ########################################################

%Ciclo para verificar qual o melhor caminho
ver_melhor_caminho(Passing_inicio,Noi,Nof):-
   %adiciona no topo da lista um melhor_caminho com um tempo elevado
   asserta(melhor_caminho(_,100000)),

   %Verifica os caminhos disponiveis do Noinicial ao Nofinal
   caminho(Noi,Nof,LCaminho),

   %Predicado � chamado com o objetivo de verificar cada caminho(conjunto de percursos) existentes dentro da LCaminho(Lista de caminhos)
   write(LCaminho),nl,
  ((atualiza_melhor(Passing_inicio,LCaminho),fail);fail).
% ########################################################
% Passing_Inicio � quando come�a o horario do motorista
% LCaminho � o conjunto de percursos
atualiza_melhor(Passing_inicio,LCaminho):-

   %Obtem o melhor_caminho
   melhor_caminho(_,Melhor_tempo),

   %calcula os horarios para a lista de percursos
   (calcula_horario_do_caminho(Passing_inicio,LCaminho,Tempo_caminho);fail),

   Tempo_caminho<Melhor_tempo,retract(melhor_caminho(_,_)),
   asserta(melhor_caminho(LCaminho,Tempo_caminho)).


% ########################################################

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

% ########################################################

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
% ########################################################

% Obtem a posição de um nó num percurso
getPositionFromNode(Path,No1,[X|L],NewPassing):-
        !,linhas(_,Path,ListaNodos,_,_),
        element_at(No1,ListaNodos,Pos),
        (   ground(X),
        getElement(NewPassing,[X|L],Pos);fail).

getElement(Valor,[X|_],0):-Valor is X,!.
getElement(Valor,[_|L],K):- K1 is K-1,getElement(Valor,L,K1).

element_at(X,[X|_],0):-!.
element_at(X,[_|L],K) :- element_at(X,L,K1), K is K1 + 1.

% ########################################################
