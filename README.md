# LAPR5_20-21
Project for LAPR5 subject of the Informatics Engineering course at ISEP

The full project documentation is available at the project's [wiki](https://github.com/TiagoFNB/LAPR5_20-21/wiki).

## System Overview Summarized

![SystemOverview](./images/visaogeralsistema_enunciado.png)


- Master data –  allows the management of information related to the network (nodes, routes), vehicle types, crew types, lines, and trips.

- Planeamento (Planning) – based on existing routes, it plans crew changes at relief points. It also plans crew services based on vehicle services. It consumes the information managed in the master data module and publishes planning information to the visualization module.

- Visualizador 3D (3D Viewer) –  allows 2D and 3D visualization of the network, scene navigation, and graphical consultation of information about trips. It consumes the information managed in the master data module and the module.

- UI – interface com o utilizador

- Clientes + RGPD – management of end-user "client" information and their consents in accordance with GDPR.

The software is then divided in the following components:

- **Master Data Rede (MDR)** 
  -  handles the backend related to the transportation network, such as nodes, paths, lines.
  -  Tech Stack - Node.js, Express, MongoDB, Mongoose, TypeDI, among others.


- **Master Data Viagens (MDV)**
  -  handles the backend related to the drivers, vehicles, their trips and workblocks. Also handles user information.
  -  Tech Stack - .Net Core, EntityFramework, SQL Server

- **Single-page application (SPA)**
    - handles all user interaction with the system.
    - Tech Stack - Angular, Three.js, Angular Material, Mapbox 

- **Planning** - Program written in Prolog that plans the schedule and which drivers and vehicles are allocated to the existing routes.


