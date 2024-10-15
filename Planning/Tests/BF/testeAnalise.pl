nodes('Aguiar de Sousa', 'AGUIA', t, f, -8.4464785432391, 41.1293363229325).
nodes('Baltar', 'BALTR', t, f, -8.38716802227697, 41.1937898023744).

nodes('Besteiros', 'BESTR', t, f, -8.34043029659082, 41.217018845589).%%mudou-se para ponto de rendição fase 4

nodes('Cete', 'CETE', t, f, -8.35164059584564, 41.183243425797).
nodes('Cristelo', 'CRIST', t, f, -8.34639896125324, 41.2207801252676).

nodes('Duas Igrejas', 'DIGRJ', t, f, -8.35481024956726, 41.2278665802794).%%mudou-se para ponto de rendição fase 4

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
 linhas('LORDELO_CETE', 27, ['LORDL', 'DIGRJ', 'BALTR', 'VANDO',
 'MOURZ',
 'CETE'], 23,11500).%%adicionada para fase 2

linhas('SOBROSA_LORDELO', 45, ['SOBRO', 'MOURZ',
 'BALTR','CRIST','VANDO','DIGRJ', 'SOBRO'], 23,11500).
 %%adicionado para
% fase 3

 linhas('LORDELO_SOBROSA', 47, ['LORDL', 'DIGRJ', 'VANDO',
 'CRIST','BALTR','MOURZ' ,'SOBRO'], 23,11500).%%adicionado para fase 3




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


:-dynamic liga/3.
gera_ligacoes:- retractall(liga(_,_,_)),
findall(_,
((nodes(_,No1,t,_,_,_);nodes(_,No1,_,t,_,_)),
(nodes(_,No2,t,_,_,_);nodes(_,No2,_,t,_,_)),
No1\==No2,
linhas(_,N,LNos,_,_),
ordem_membros(No1,No2,LNos),
assertz(liga(No1,No2,N))
),_).
ordem_membros(No1,No2,[No1|L]):- member(No2,L),!.
ordem_membros(No1,No2,[_|L]):- ordem_membros(No1,No2,L).


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
get_time(Ti),
bestfs2(Dest,(0,[Orig]),Cam,[],Lreverse),!,
calx(Cam,Lreverse,PassingTime,MomentoChegada),
get_time(Tf),

Tsol is Tf-Ti,
write('Tempo de geracao da solucao:'),write(Tsol),nl.


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


