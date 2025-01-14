nodes('Aguiar de Sousa', 'AGUIA', f, f, -8.4464785432391, 41.1293363229325).
nodes('Baltar', 'BALTR', f, f, -8.38716802227697, 41.1937898023744).
nodes('Cete', 'CETE', f, f, -8.35164059584564, 41.183243425797).
nodes('Cristelo', 'CRIST', t, f, -8.34639896125324, 41.2207801252676).
nodes('Duas Igrejas', 'DIGRJ', f, f, -8.35481024956726, 41.2278665802794).
nodes('Lordelo', 'LORDL', t, f, -8.42293614720057, 41.2452627470645).
nodes('Parada de Todeia', 'PARAD', f, f, -8.37023578802149, 41.1765780321068).
nodes('Paredes', 'PARED', t, f, -8.33566951069481, 41.2062947118362).
nodes('Recarei', 'RECAR', f, f, -8.42215867462191, 41.1599363478137).
nodes('Vila Cova de Carros', 'VCCAR', f, f, -8.35109395257277, 41.2090666564063).

linhas('Paredes_Aguiar', 1, ['AGUIA','RECAR','PARED'], 31, 15700).
linhas('Lordelo_Parada',2,['LORDL','DIGRJ','CRIST','VCCAR','BALTR','PARAD'],22,11000).
linhas('Paredes_Aguiar', 3, ['PARED', 'CETE','RECAR', 'LORDL'], 31, 15700).

liga('AGUIA','PARED',1).
liga('AGUIA','RECAR',1).
liga('RECAR','PARED',1).

liga('LORDL','PARAD',2).

liga('PARED','LORDL',3).
liga('PARED','RECAR',3).
liga('RECAR','LORDL',3).

horario(1,[200,500,1000]).

horario(2,[2200,2300,2400,2500,2600,2700]).
horario(2,[4200,4300,4400,4500,4600,4700]).

horario(3,[1300,1500,1700,2000]).









%Implementa��o do A* adaptado
aStar(Hinit,Orig,Dest,Cam,CamL,Custo):-
        aStar2(Hinit,Dest,[(_,0,[Orig],[])],Cam,CamL,Custo).


aStar2(Hinit,Dest,[(_,Ha,[Dest|T],Linhas)|_],Cam,CamL,Custo):-
        reverse([Dest|T],Cam),reverse(Linhas,CamL), Custo is (Ha-Hinit).

% Aten��o: edge � uma fun��o dummy, substitui-la por algo q devolva o
% menor custo para ir a cada um dos pr�ximos n�s
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






