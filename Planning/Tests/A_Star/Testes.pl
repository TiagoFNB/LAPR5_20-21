

linhas('Sobrosa_Cete', 1, ['CETE', 'MOURZ', 'VCCAR', 'BESTR','CRIST','SOBRO'], 23,11500).
linhas('Lordelo_Parada', 2, ['PARAD', 'BALTR', 'VCCAR','CRIST','DIGRJ', 'LORDL'], 22,11000).
linhas('Paredes_Aguiar', 3, ['AGUIA','RECAR', 'PARAD', 'CETE','PARED'], 31, 15700).
linhas('Paredes_Aguiar', 4, ['PARED', 'CETE','PARAD', 'RECAR','AGUIA'], 31, 15700).

nodes('Aguiar de Sousa', 'AGUIA', f, f, -8.4464785432391,41.1293363229325).
nodes('Baltar', 'BALTR', t, f, -8.38716802227697, 41.1937898023744).
nodes('Paredes', 'PARED', t, f, -8.33566951069481, 41.2062947118362).

horario(1, [2, 3, 4, 5, 6]).
horario(1, [12, 13, 14, 15, 16]).
horario(2, [22, 23, 24, 25, 26]).

liga('AGUIA','PARED',3).
liga('PARED','AGUIA',4).


estimativa(Nodo1,Nodo2,Estimativa):-
        velocidadeMedia(Vm),
        nodes(_,Nodo1,_,_,X1,Y1),
        nodes(_,Nodo2,_,_,X2,Y2),
        Dist is sqrt((X1-X2)^2+(Y1-Y2)^2),
        Estimativa is Dist/Vm.

































velocidadeMedia(Vm):-
        findall(Vel,(linhas(_,_,_,Tempo,Dist),Vel is Dist/Tempo),Lista),
        max_list(Lista,Vm).


ligaCustos(Ha,Act,X,T,Per):-
        liga(Act,X,Per),posPer(Per,Act,PosAct),posPer(Per,X,PosX),
        horario(Per,Lista),nth0(PosAct,Lista,TAct),Ha<TAct,Tespera is TAct-Ha,
        nth0(PosX,Lista,TX),Dif is TAct-TX,
        abs(Dif,AbsDif), T is AbsDif+120+Tespera.

%Obtem a posição de um nó num percurso
posPer(Per,Nodo,Pos):-
        linhas(_,Per,ListaNodos,_,_), nth0(Pos,ListaNodos,Nodo).

