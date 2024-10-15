import { Injectable, NgZone } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Line } from 'src/app/shared/models/Line/Line';
import { Node } from 'src/app/shared/models/node/Node';
import { Path } from 'src/app/shared/models/path/Path';
import * as THREE from './threebox-master/src/three';
const utils = require("./threebox-master/src/utils/utils.js");
import * as MapboxGL from 'mapbox-gl';
import * as Threebox from './threebox-master/src/Threebox';
import { PathSegmentInterface } from 'src/app/shared/models/path/PathSegment/PathSegmentInterface';
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline';
import {GUI} from 'dat.gui';

//GLOBAL VARIABLES
//contains points to draw
var DrawnNodes = [];

//GUI-Settings
var guiOpts = {
  timeOfDay: [8, 0],
  shadowsEnabled: true,
  lightIntensity: 0.1,
  lightColor: {r:0,g:0,b:255}
}

var guiOptsTestDriver = {
  driving: false,
  busCoords: [0,0]
}


@Injectable({
  providedIn: 'root',
})
export class View2DService {
  public lines: Line[] = [];
  public nodes: Node[] = [];
  public paths: Path[] = [];

  constructor(ngZone: NgZone) {
  }

  public drawLines(canvas: ElementRef<HTMLElement>): void {
    //Create map here
    MapboxGL.accessToken =
      'pk.eyJ1IjoibWFwcGF1c2VyIiwiYSI6ImNqNXNrbXIyZDE2a2cyd3J4Ym53YWxieXgifQ.JENDJqKE1SLISxL3Q_T22w';

    var map = new MapboxGL.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 11,
      pitch: 0,
      center: [-8.35, 41.17961],
      renderWorldCopies: false,
    });

    //map.flyTo({center: [0, 0], zoom: 9});

    let tb = new Threebox(
      map,
      map.getCanvas().getContext('webgl'),
      {
        realSunlight: true,
        enableSelectingObjects: true,
        enableTooltips: false,
        multiLayer: true, // this will create a default custom layer that will manage a single tb.update
      }
    );
    //Defines the map bounds
    var bounds = [
      [-180, -85], // Southwest coordinates
      [180, 85] // Northeast coordinates
    ];

    // Set the map's max bounds.
    map.setMaxBounds(bounds);

    //Set the maps field of view


    //Orbit starts disabled
    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();

    var toggle3d = new Toggle3dControl(tb);

    map.addControl(toggle3d, 'top-right');


    let pathLines: Path[];
    let pathNode1: Node;
    let pathNode2: Node;
    const linesForDrawing = [];
    let pointsForDrawing = [];
    let pathLine: Path[];
    for (let line of this.lines) {
      let points = [];
      pathLines = this.paths.filter((x) => x.line == line.key);
      pathLines = this.clearDuplicatePaths(pathLines);
      let colorLine = new THREE.Color("rgb(" +
        line.RGB.red + "," +
        line.RGB.green + "," +
        line.RGB.blue + ")"
      ).getHex();

      for (let path of pathLines) {
        for (let i = 0; i < path.pathSegments.length; i++) {
          if (i == path.pathSegments.length - 1) {
            pathNode1 = this.nodes.find(
              (x) => x.shortName == path.pathSegments[i].node1
            );
            pathNode2 = this.nodes.find(
              (x) => x.shortName == path.pathSegments[i].node2
            );
            pointsForDrawing.push([pathNode1.longitude, pathNode1.latitude, pathNode1.shortName, pathNode1.name]);
            pointsForDrawing.push([pathNode2.longitude, pathNode2.latitude, pathNode2.shortName, pathNode2.name]);
            points.push([pathNode1.longitude, pathNode1.latitude]);
            points.push([pathNode2.longitude, pathNode2.latitude]);
          } else {
            pathNode1 = this.nodes.find(
              (x) => x.shortName == path.pathSegments[i].node1
            );
            pointsForDrawing.push([pathNode1.longitude, pathNode1.latitude, pathNode1.shortName, pathNode1.name]);
            points.push([pathNode1.longitude, pathNode1.latitude]);
          }
        }
        const line1 = {
          color: colorLine,
          geometry: points,
          path: path.key,
          key: line.name,
        };
        linesForDrawing.push(line1);
      }
    }

    for (let line of linesForDrawing) {
      this.checkIfSegmentsOverlay(line, linesForDrawing);
    }
    pointsForDrawing = pointsForDrawing.filter((v, i, a) => a.findIndex(t => (JSON.stringify(t) === JSON.stringify(v))) === i)

    DrawnNodes = pointsForDrawing;

    map.on('style.load', function () {
      map.addLayer({
        id: '2d',
        type: 'custom',
        renderingMode: '3d',
        onAdd: function (map, mbxContext) {

          const material = new THREE.MeshBasicMaterial({ color: 0x3383FF });
          material.transparent = false;
          let geo = new THREE.CircleGeometry(3.5, 32);

          var resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
          for (let point of pointsForDrawing) {

            var nodes = new THREE.Mesh(geo, material);
            nodes = tb.Object3D({ obj: nodes, tooltip: 'AQUIIIII', bbox: false, rotation: { x: 0, y: 0, z: 0 } });
            nodes.setCoords([point[0] - 0.0007, point[1] - 0.0009, -3]);
            nodes.addTooltip(point[2], true);
            tb.add(nodes);
          }

          for (let line of linesForDrawing) {
            let mat = new MeshLineMaterial({
              color: line.color,
              opacity: 1,
              resolution: resolution,
              sizeAttenuation: 1,
              lineWidth: 2,
              depthTest: false,
              bbox:false,
              transparent: false,

            });

            for (let i = 0; i < line.geometry.length - 1; i++) {
              let lineSegment = {
                geometry: []
              }
              lineSegment.geometry.push(line.geometry[i]);
              lineSegment.geometry.push(line.geometry[i + 1]);
              var straightProject = utils.lnglatsToWorld(lineSegment.geometry);
              var normalized = utils.normalizeVertices(straightProject);
              var flattenedArray = utils.flattenVectors(normalized.vertices);
              let line2 = new MeshLine();
              line2.setPoints(flattenedArray);
              let middlepoint = {
                x: (lineSegment.geometry[0][0] + lineSegment.geometry[1][0]) / 2,
                y: (lineSegment.geometry[0][1] + lineSegment.geometry[1][1]) / 2
              }
              let mesh = new THREE.Mesh(line2.geometry, mat);
              mesh.raycast = MeshLineRaycast;
              let lineX = tb.Object3D({ obj: mesh, anchor: "center", bbox: false });
              lineX.setCoords([middlepoint.x, middlepoint.y, 0]);
              lineX.addTooltip("Linha :" + line.key + '\n', true);

              tb.add(lineX, '2d');

            }

          }

        },

        render: function (gl, matrix) {
          /*Handle all the stuff here*/

          //Handle Sunlight Source position (treated as the time of day) here
          let lightOrig = [-8.35, 41.17961];
          let date = new Date(2020, 7, 14, guiOpts.timeOfDay[0], guiOpts.timeOfDay[1]);
          tb.setSunlight(date, lightOrig);

          //Turn shadows on/off
          tb.lights.dirLight.castShadow = guiOpts.shadowsEnabled;

          //Change light luminescence
          tb.lights.dirLight.intensity = guiOpts.lightIntensity/10;

          //Change light color
          tb.lights.dirLight.color.setRGB(guiOpts.lightColor.r,guiOpts.lightColor.g,guiOpts.lightColor.b);

        },
      });

      //Add layer for 3d nodes
      map.addLayer({
        'id': '3DNodes',
        'type': 'custom',
        'renderingMode': '3d',

        onAdd(map, mbxContext) {

          for (let point of pointsForDrawing) {

            //Boring bus stop
            var options = {
              type: 'gltf',
              obj: '../../../../assets/models/bus-stop/Bus-stop-new.gltf',
              scale: 4, anchor: 'center', rotation: { x: 90, y: 180, z: 0 },
              bbox: false,
              tooltip: true
            }

            let stop;
            tb.loadObj(options, function (model) {
              model.setCoords([point[0], point[1], 0]);
              model.castShadow = true;
              tb.add(model, '3DNodes');
            });

          }

        },
        render: function (gl, matrix) {

        }
      });

      //Set 3d nodes to invisible by default
      map.setLayoutProperty('3DNodes', 'visibility', 'none');
      tb.toggleLayer('3DNodes', false);

      let bus;
      map.addLayer({
        'id': 'Bus',
        'type': 'custom',
        'renderingMode': '3d',

        async onAdd(map, mbxContext) {

          //Boring bus stop
          var options = {
            type: 'gltf',
            obj: '../../../../assets/models/bus/scene.gltf',
            mtl: '../../../../assets/models/bus/scene.bin',
            scale: 1, anchor: 'center', rotation: { x: 90, y: 180, z:0 },
            bbox: false,
            tooltip: true
          }

          //Load important !
          await tb.loadObj(options, function (model) {
            model.setRotation({ x: 0, y: 0, z: 0 });
            bus = new Bus(tb,model);
            bus.updateCoords();
            model.castShadow = true;
            tb.add(model, 'Bus');
            bus.detectInputs();
            Bus.busProperties.flag = true;
          });

        },
        render: function (gl, matrix) {
          
          if(bus){
            //Set new location
            bus.updateCoords();

            //Move the bus
            bus.movementBus();
          }
          tb.map.repaint = true;
        }
      });

      tb.toggleLayer('Bus',false);
    });
  }

  clearDuplicatePaths(pathLines: Path[]): Path[] {
    let nonDups: Path[] = [], flag;
    for (let i = 0; i < pathLines.length; i++) {
      flag = 0;
      for (let j = pathLines.length - 1; j > i; j--) {
        if (
          pathLines[i].pathSegments.length == pathLines[j].pathSegments.length
        ) {
          if (
            this.compareSegments(
              pathLines[i].pathSegments,
              pathLines[j].pathSegments
            )
          ) {
            flag++;
          }
        }
      }
      if (flag == 0) {
        nonDups.push(pathLines[i]);
      }
    }
    return nonDups;
  }
  compareSegments(
    pathSegments1: PathSegmentInterface[],
    pathSegments2: PathSegmentInterface[]
  ) {
    let x = pathSegments1.reverse();
    let flag = 0;
    for (let i = 0; i < pathSegments1.length; i++) {
      if (
        pathSegments1[i].node2 == pathSegments2[i].node1 &&
        pathSegments1[i].node1 == pathSegments2[i].node2
      ) {
        flag++;
      }
    }
    if (flag == pathSegments2.length) {
      return true;
    } else {
      return false;
    }
  }
  private checkIfSegmentsOverlay(line, linesForDrawing) {
    let flag;
    for (let j = 0; j < linesForDrawing.length; j++) {
      if (linesForDrawing[j].key != line.key) {
        for (let k = 0; k < line.geometry.length - 1; k++) {
          for (let i = 0; i < linesForDrawing[j].geometry.length - 1; i++) {
            flag = this.checkIfCoordinatesAreEqual(
              linesForDrawing[j].geometry[i],
              linesForDrawing[j].geometry[i + 1],
              line.geometry[k],
              line.geometry[k + 1]
            );

            if (flag == 1) {
              this.calculatePointsParallel(
                linesForDrawing[j].geometry[i],
                linesForDrawing[j].geometry[i + 1],
                line.geometry[k],
                line.geometry[k + 1]
              );
            } else if (flag == 2) {
              this.calculatePointsParallel(
                linesForDrawing[j].geometry[i + 1],
                linesForDrawing[j].geometry[i],
                line.geometry[k],
                line.geometry[k + 1]
              );
            }
          }
        }
      }
    }
  }
  //latitude [1] , longitude [0]
  private checkIfCoordinatesAreEqual(pointA1, pointB1, pointA2, pointB2) {
    if (
      pointA1[1] == pointA2[1] &&
      pointA1[0] == pointA2[0] &&
      pointB1[1] == pointB2[1] &&
      pointB1[0] == pointB2[0]
    ) {
      return 1;
    }
    if (
      pointA1[1] == pointB2[1] &&
      pointA1[0] == pointB2[0] &&
      pointB1[1] == pointA2[1] &&
      pointB1[0] == pointA2[0]
    ) {
      return 2;
    }
    return 0;
  }

  private calculatePointsParallel(nodeA1, nodeB1, nodeA2, nodeB2) {
    let d = 0.0005;
    let r = Math.sqrt(
      Math.pow(nodeB1[0] - nodeA1[0], 2) + Math.pow(nodeB1[1] - nodeA1[1], 2)
    );
    let cosBeta = -(nodeB1[1] - nodeA1[1]) / r;
    let sinBeta = (nodeB1[0] - nodeA1[0]) / r;

    nodeA2[0] = nodeA1[0] + d * cosBeta;
    nodeA2[1] = nodeA1[1] + d * sinBeta;
    nodeB2[0] = nodeB1[0] + d * cosBeta;
    nodeB2[1] = nodeB1[1] + d * sinBeta;
  }


}



//Implements the button control for 3d 
//Inspired on: https://codepen.io/roblabs/pen/zJjPzX
class Toggle3dControl {

  //Holds the camera options for when it swaps to 3d
  private option3dCam;

  //Holds the camera options for when it swaps to 2d
  private option2dCam;

  //Defines the minimum zoom for it to not be adjusted when swapping to 3d
  private minSwapZoom = 12;

  //Swapping button presented to the user
  private button;

  //Container holding the button
  private container;

  //Holds the last instance of map received
  private map;
  //instance of threebox
  private tb;
  //Current state (either '3D' or '2D')
  private state: String;

  constructor(tb) {
    this.state = "2D";
    this.option2dCam = { bearing: -20, pitch: 70 };
    this.option3dCam = { bearing: 0, pitch: 0 };
    this.tb = tb;
  }

  onAdd(map) {
    this.map = map;
    this.button = document.createElement('button');
    this.button.className = 'mapboxgl-ctrl-icon';
    this.button.textContent = '3D';
    this.button.type = "button";
    

    //Put all the logic for what the button does here
    this.button.onclick = () => {

      //Swaps the current state
      this.swapState();

      //If the new state is 2D
      if (this.state === "2D") {
        this.button.textContent = '3D';

        //Disable orbit
        map.dragRotate.disable();
        map.touchZoomRotate.disableRotation();

        //Adjust camera
        let options = this.option3dCam;
        options.zoom = 11;
        map.easeTo(options);

        //Make 3d nodes invisible
        map.setLayoutProperty('3DNodes', 'visibility', 'none');
        this.tb.toggleLayer('3DNodes',false);

        //Remove 3D GUI
        Gui3d.rem3DGUI(this.tb);
      }
      //If the new state is 3D
      else {
        this.button.textContent = '2D';

        //Enable orbit
        map.dragRotate.enable();
        map.touchZoomRotate.enableRotation();

        //Adjust camera
        let options = this.option2dCam;
        if (this.minSwapZoom > map.getZoom()) {
          options.zoom = this.minSwapZoom;
        } else {
          //This may seem redudant but without it the zoom adjusting does not work properly
          options.zoom = map.getZoom();
        }
        map.easeTo(options);

        //Turn nodes visible 
        map.setLayoutProperty('3DNodes', 'visibility', 'visible');
        //map.setLayoutProperty('3d-buildings', 'visibility', 'visible');
        this.tb.toggleLayer('3DNodes',true);

        //Add 3D GUI
        Gui3d.add3DGUI(map,this.tb);
      }
    }

    this.container = document.createElement("div");
    this.container.className = "mapboxgl-ctrl-group mapboxgl-ctrl";
    this.container.appendChild(this.button);

    return this.container;
  }

  onRemove() {
    this.button.parentNode.removeChild(this.button);
    this.map = undefined;
  }

  //Swaps the instance state between 3D and 2D
  swapState() {
    if (this.state === "2D") {
      this.state = "3D";
    } else {
      this.state = "2D";
    }
  }

}

class Gui3d{
  
  public static rem3DGUI(tb){
    //Turn off necessary layers connected to the gui
    tb.toggleLayer('Bus', false); 

    //Reset necessary global variables
    guiOptsTestDriver.driving=false;
    guiOptsTestDriver.busCoords=[0,0];

    //Remove html
    let guiDom = document.getElementById("gui3D");
    
    if(guiDom){
      guiDom.remove();
    }
  }

  /**
   * Adds the gui with 3d options
   * 
   * Inspired by: https://observablehq.com/@bumbeishvili/three-js-dat-gui-controls
   */
  public static add3DGUI(map : any,tb : any){

    //If GUI is already there
    if(document.getElementById('gui3D')){
      return;
    }

    let gui = new GUI({ autoPlace: false });

    gui.domElement.id = 'gui3D';
    let gui_container = document.getElementById("gui_container");
    gui_container.style.zIndex = '2';
    gui_container.appendChild(gui.domElement);


    //New folder
    let folderBus = gui.addFolder('Test Driving');

    //Chooses to show the bus or not
    folderBus.add(guiOptsTestDriver,'driving')
    .name('Test Drive')
    .onChange(() => { 
      if(guiOptsTestDriver.driving){
        tb.toggleLayer('Bus', true);
        //Disable camera movement
        map.dragRotate.disable();
        map.touchZoomRotate.disableRotation();
        map.dragPan.disable();
      }else{
        tb.toggleLayer('Bus', false); 

        //Zoom out a bit
        tb.map.flyTo({
           zoom: 12,
           speed: 5,
           essential:true
          });

        //Re-enable camera movement
        map.dragRotate.enable();
        map.touchZoomRotate.enableRotation();
        map.dragPan.enable();
      }
      
      this.update(map)});

    let nodesNames = DrawnNodes.map(x => x[3]);
    let holdNodeName = {name : 'None'}

    //Allows user to choose bus location
    folderBus.add(holdNodeName,'name',nodesNames)
    .name('Location')
    .onChange(() => {
      let node = DrawnNodes.find(x => x[3]==holdNodeName.name)
      guiOptsTestDriver.busCoords= [node[0],node[1]];
      this.update(map)});

    //New folder
    let folderIllumination = gui.addFolder('Illumination');
  
    folderIllumination.add(guiOpts,'lightIntensity',0,1)
    .name('Light Intensity')
    .onChange(() => {this.update(map);});

    folderIllumination.add(guiOpts,'shadowsEnabled')
    .name('Enable Shadows')
    .onChange(() => {this.update(map);});

    //Although the user cannot see it, the decimal portion on the slider is still saved
    let timeOfDayInput = {time:18};
    folderIllumination.add(timeOfDayInput,'time',0,24)
    .name('Time of Day')
    .onChange(() => {

      guiOpts.timeOfDay[0] = Math.floor(timeOfDayInput.time); //Define hour
      guiOpts.timeOfDay[1] = (((timeOfDayInput.time%1)*6)/10)*100-0.001;  //Define minutes (subtracts the 0.001 to make sure it does not attain 60)

      this.update(map);});

    // I have no ideia why but the color option in datgui is not adjusting itself to it's
    // parent div correctly therefore, just leave it for last
    let hexColor = {hex: '#0000ff'};
    folderIllumination.addColor(hexColor,'hex') 
    .name('Light Color').onChange(() => {
      guiOpts.lightColor= this.HexToRGB(hexColor.hex);
      this.update(map);});
  
    //Open both gui and it's files to start with
    gui.open();
    folderIllumination.open();
    folderBus.open();
    
  }

  /** Inspired by: https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb */
  private static HexToRGB(hex : string){
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
  }

  private static update(map : any){
    map.repaint=true;
  }
}

class Bus {


  //Bus model
  public model;

  //Holds the camera options for when it swaps to 3d
  private option3dCam;

  //Holds the camera options for when it swaps to 2d
  private option2dCam;

  private angle;

  private speed;

  private speedLimit;

  //Bus
  static busProperties: any = {
    flag: undefined,
    w: undefined,
    s: undefined,
    a: undefined,
    d: undefined,
    objBus: undefined,
  }

  //instance of threebox
  private tb;

  constructor(tb,model) {
    this.model = model;
    this.option2dCam = { bearing: -20, pitch: 70 };
    this.option3dCam = { bearing: 0, pitch: 0 };
    this.tb = tb;
    this.angle = 0;
    this.speed = 0;
    this.speedLimit = 0.0001;
  }

  updateCoords(){
    this.model.setCoords([guiOptsTestDriver.busCoords[0],guiOptsTestDriver.busCoords[1],0.3]);
  }

  //Detects inputs from users
  detectInputs(){
      document.addEventListener("keydown", onDocumentKeyDown, false);
      Bus.busProperties.objBus = this.model;
      function onDocumentKeyDown(event) {
      var keyCode = event.which;

      if (keyCode == 87) { // W
        Bus.busProperties.w = true;
      } else if (keyCode == 83) { //S
        Bus.busProperties.s = true;
      } else if (keyCode == 65) { //A
        Bus.busProperties.a = true;
      } else if (keyCode == 68) { //D
        Bus.busProperties.d = true;
      }
    };

    document.addEventListener("keyup", onDocumentKeyUp, false);
    function onDocumentKeyUp(event) {
      var keyCode = event.which;
      if (keyCode == 87) { // W
        Bus.busProperties.w = false;
      } else if (keyCode == 83) { //S
        Bus.busProperties.s = false;
      } else if (keyCode == 65) { //A
        Bus.busProperties.a = false;
      } else if (keyCode == 68) { //D
        Bus.busProperties.d = false;
      }
    };
  }

  movementBus() {
    //Test drive ligado
    if(guiOptsTestDriver.driving){

      //simulate friction
      if (this.speed > 0) {
        this.speed -= 0.000001;
      }
      else if(this.speed < 0){
        this.speed += 0.000001;
      }

      if(Bus.busProperties.w){
        if (this.speed < this.speedLimit) {
          this.speed += 0.000003;
        };
      }
      if(Bus.busProperties.a){
        this.angle+=2;
      }
      if(Bus.busProperties.s){
        if (this.speed > -this.speedLimit) {
          this.speed -= 0.000003;
        };
      }
      if(Bus.busProperties.d){
        this.angle-=2;
      }

      //Alter the objects coordinates now
      this.alterMovementCoords();
    }
    //Test drive desligado -> reset aceleração
    else{
      this.speed = 0;
    }
  }

  private alterMovementCoords(){
    //Alter rotation
    this.model.setRotation({ x: 0, y: 0, z: this.angle });

    //Alter coordinates
    guiOptsTestDriver.busCoords[0] = guiOptsTestDriver.busCoords[0] + (this.speed * Math.cos(this.RAD(this.angle-180)));
    guiOptsTestDriver.busCoords[1]= guiOptsTestDriver.busCoords[1] + (this.speed * Math.sin(this.RAD(this.angle-180)));

    //Follow with camera
    this.adjustCamera();
  }

  private RAD(angle:number) : number{
    return (angle * Math.PI )/180;
  }

  private adjustCamera(){
    this.tb.map.flyTo({
      center: [guiOptsTestDriver.busCoords[0], guiOptsTestDriver.busCoords[1]],
       zoom: 15,
       speed: 3,
       bearing: -this.angle-90,
       essential:true
      });
  }

}