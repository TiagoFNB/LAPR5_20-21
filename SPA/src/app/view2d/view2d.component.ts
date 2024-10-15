import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LineActionsService } from '../core/services/line-actions/line-actions.service';
import { NodeServiceService } from '../core/services/node-service.service';
import { PathActionsService } from '../core/services/path-actions/path-actions.service';
import { View2DService } from '../core/services/view2d/view2d.service';



@Component({
  selector: 'app-view2d',
  templateUrl: './view2d.component.html',
  styleUrls: ['./view2d.component.css']
 
})
export class View2dComponent implements OnInit , AfterViewInit {


  @ViewChild('rendererCanvas', {static: false} )
  public rendererCanvas!: ElementRef<HTMLElement>;
  constructor(private engServ : View2DService,private lineServ: LineActionsService,
		private nodeServ: NodeServiceService,private pathServ: PathActionsService) { }
    
  async ngOnInit() { 

  }

  async ngAfterViewInit(){
  
    await this.lineServ.getListLines().toPromise().then((data)=>{
      this.engServ.lines=data;
    }).catch( (err) => {
      //tratar erro(futura implementação)
    });
    await this.nodeServ.getAllNodes().toPromise().then((data)=>{
      this.engServ.nodes=data;
    }).catch( (err) => {
      //tratar erro(futura implementação)
    });

    await this.pathServ.getAllPaths().toPromise().then((data)=>{
      this.engServ.paths=data;
    }).catch( (err) => {
      //tratar erro(futura implementação)
    });

    this.engServ.drawLines(this.rendererCanvas);
 }
}
