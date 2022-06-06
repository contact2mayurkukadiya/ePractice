import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import 'fabric';
import { editor } from './../editor.class';
declare const fabric: any;

interface SPChartData {
  isMendatory?: boolean,
  leftData?: Array<any>
  rightData?: Array<any>
  canvasInstance?: any,
  spineNote?: string,
  finalImage?: string
}

@Component({
  selector: 'app-spine-chart',
  templateUrl: './spine-chart.component.html',
  styleUrls: ['./spine-chart.component.css']
})
export class SpineChartComponent extends editor implements OnInit {

  @Input() ngData: SPChartData = {};
  @Output() deleteChartClick: EventEmitter<any> = new EventEmitter();
  @Output() moveDown: EventEmitter<any> = new EventEmitter();
  @Output() moveUp: EventEmitter<any> = new EventEmitter();


  loading: boolean = false;
  randomCanvasId: string;
  SpineNodes: Array<String> = ["C0", " C1", " C2", " C3", " C4", " C5", " C6", " C7", " T1", " T2", " T3", " T4", " T5", " T6", " T7", " T8", "T9", " T10", " T11", " T12", " L1", " L2", " L3", " L4", " L5", " Sacrum", " SI AS", " SI PI", " Coccyx"]
  data: any;
  isTitleInEditing: boolean = false;
  isClearSketchDialog: boolean = false;
  dummyData: SPChartData = {
    isMendatory: false,
    leftData: [],
    rightData: [],
    spineNote: ""
  };

  constructor() {
    super();
    this.randomCanvasId = 'canvas_' + JSON.stringify(Math.round(Math.random() * 100000000));
    this.defaultSelectedToolName = "pencil";
    this.data = { ...this.ngData }
  }

  ngOnInit() {
    this.loading = true;
    this.setDefaultData();
    setTimeout(() => {
      this.initCanvas(this.randomCanvasId, {
        width: 1080,
        height: 1080,
        _width: 1080,
        _height: 1080,
        preserveObjectStacking: true
      }).then(_result => {
        this.setBackgroundImage("./assets/spine.jpg").then(image => {
          this.resizeCanvasToSize(image).then(_newCanvas => {
            this.enableDrawingMode().then(_result => {
              this.resetTools();
              this.initBrush().then(_result => {
                this.onPathCreatedEvent()
                this.putHistory();
                this.on(['undo', 'redo']);
                this.loading = false;
              });
            });
          })
        })
      });
    }, 0);
  }

  doMoveDown() {
    this.moveDown.emit();
  }

  doMoveUp() {
    this.moveUp.emit();
  }

  setDefaultData() {
    !this.data.isMendatory ? this.data.isMendatory = false : null;
    !this.data.leftData ? this.data.leftData = this.SpineNodes.map(item => { return { label: item, value: false } }) : null;
    !this.data.rightData ? this.data.rightData = this.SpineNodes.map(item => { return { label: item, value: false } }) : null;
  }

  editTitle() {
    this.isTitleInEditing = true;
    this.dummyData = { ...this.data }
  }

  closeClearSketchDialog(state) {
    this.isClearSketchDialog = false;
    if (state != "cancel") {
      this.clearAllSketch();
    }
  }

  closeTitleEditing(state) {
    this.isTitleInEditing = false;
    if (state == "cancel") {
      this.data = { ...this.dummyData }
    }
    else {
      // Call api here for save
    }
  }

  changeMendatory($event) {
    console.log("event", $event);
  }

  deleteChart() {
    // delete chart
    this.isTitleInEditing = false;
    this.deleteChartClick.emit();
  }

  saveTitleChanges() {
    this.isTitleInEditing = false;
  }

  openFilePicker() {
    document.getElementById("upload").click();
  }

  enableEraserTool() {
    this.activateDrawingTool('eraser');
    this.canvas.isDrawingMode = false;
    this.canvas.isDrawingMode = true;
    fabric.PencilBrush.prototype.globalCompositeOperation = "destination-out";
    this.canvas.renderAll();
  }

  clearAllSketch() {
    this.disableDrawingMode();
    this.canvas.getObjects().forEach(object => {
      this.canvas.remove(object);
    });
    this.enableDrawingMode();
    this.resetTools();
  }

  generatePreview() {
    this.generateImage("./assets/spine.jpg").then(result => {
      this.data.finalImage = result;
    })
  }

}
