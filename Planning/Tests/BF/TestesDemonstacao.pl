nodes('Aguiar de Sousa', 'AGUIA', f, f, -8.4464785432391, 41.1293363229325).
nodes('Baltar', 'BALTR', f, f, -8.38716802227697, 41.1937898023744).
nodes('Cete', 'CETE', f, f, -8.35164059584564, 41.183243425797).
nodes('Cristelo', 'CRIST', t, f, -8.34639896125324, 41.2207801252676).
nodes('Duas Igrejas', 'DIGRJ', f, f, -8.35481024956726, 41.2278665802794).
nodes('Lordelo', 'LORDL', t, f, -8.42293614720057, 41.2452627470645).
nodes('Parada de Todeia', 'PARAD', f, f, -8.37023578802149, 41.1765780321068).
nodes('Paredes', 'PARED', t, f, -8.33566951069481, 41.2062947118362).
nodes('Recarei', 'RECAR', t, f, -8.42215867462191, 41.1599363478137).
nodes('Vila Cova de Carros', 'VCCAR', f, f, -8.35109395257277, 41.2090666564063).



liga('AGUIA','PARED',1).
liga('AGUIA','RECAR',1).
liga('RECAR','PARED',1).

liga('LORDL','PARAD',2).


liga('PARED','LORDL',3).
liga('PARED','RECAR',3).
liga('PARED','CETE',3).

liga('RECAR','LORDL',3).

linhas('Paredes_Aguiar', 1, ['AGUIA','RECAR','PARED'], 31, 15700).
linhas('Lordelo_Parada',2,['LORDL','DIGRJ','CRIST','VCCAR','BALTR','PARAD'],22,11000).
linhas('Paredes_Aguiar', 3, ['PARED', 'CETE','RECAR', 'LORDL'], 31, 15700).

horario(1,[200,500,1000]).
horario(1,[2000,5000,10000]).

horario(2,[2200,2300,2400,2500,2600,2700]).
horario(2,[4200,4300,4400,4500,4600,4700]).

horario(3,[1300,1500,1700,2000]).
horario(3,[1300,1500,5100,6100]).




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
%NovosOrd = [(_,Cm,Melhor,Listpath)|_], comentado porque fiz a alteração sugerida pelo regente
proximo(NovosOrd,Cm,Melhor,Listpath),

bestfs2(Dest,(Cm,Melhor),Cam,Listpath,Lreverse).





estimativabf(Nodo1,Nodo2,Estimativa):-

nodes(_,Nodo1,_,_,X1,Y1),
nodes(_,Nodo2,_,_,X2,Y2),
Estimativa is sqrt((X1-X2)^2+(Y1-Y2)^2).


proximo([(_,Cm,Melhor,Listpath)|_],Cm,Melhor,Listpath).
proximo([_|L],Cm,Melhor,Listpath):- proximo(L,Cm,Melhor,Listpath).






