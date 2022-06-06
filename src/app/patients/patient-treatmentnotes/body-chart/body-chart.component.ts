import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { editor } from './../editor.class';
import 'fabric';
declare const fabric: any;

interface BChartData {
  title?: string,
  helpText?: string,
  isMendatory?: boolean,
  chartSize?: Array<string>,
  selectedChartSize?: string,
  canvasInstance?: any,
  json?: any,
  pointArray?: Array<any>
}

const Size: any = {
  SMALL: "Small",
  MEDIUM: "Medium",
  LARGE: "Large"
}

const CanvasSize: any = [
  { zoomLevel: 0.5, type: Size.SMALL },
  { zoomLevel: 1, type: Size.MEDIUM },
  { zoomLevel: 2, type: Size.LARGE }
]

const canvasDefaultConfig = {
  width: 1080,
  height: 1080,
  _width: 1080,
  _height: 1080,
  preserveObjectStacking: true
};

const maxCanvasSize = 800;

@Component({
  selector: 'app-body-chart',
  templateUrl: './body-chart.component.html',
  styleUrls: ['./body-chart.component.css']
})
export class BodyChartComponent extends editor implements OnInit, AfterViewInit, OnDestroy {

  @Input() ngData: BChartData = {};
  @Input() isFullScreen: boolean = false;
  @Output() deleteChartClick: EventEmitter<any> = new EventEmitter();
  @Output() moveDown: EventEmitter<any> = new EventEmitter();
  @Output() moveUp: EventEmitter<any> = new EventEmitter();
  @Output() ngDataChange: EventEmitter<any> = new EventEmitter();

  loading: boolean = false;
  randomCanvasId: string;
  drawingTools: Array<string> = ['pencil', 'pen', 'marker', 'highlighter', 'eraser'];
  data: any;
  isTitleInEditing: boolean = false;
  isClearSketchDialog: boolean = false;
  portalModal: boolean = false;
  imageUrl: any = '';
  chartdata: any;
  length: any;
  dummyData: BChartData = {
    title: '',
    helpText: '',
    isMendatory: false,
    chartSize: [],
    selectedChartSize: Size.MEDIUM
  };
  zoomFeature: any;
  zoomLevel: any = 1;

  constructor() {
    super()
    this.randomCanvasId = 'canvas_' + JSON.stringify(Math.round(Math.random() * 100000000));
    this.defaultSelectedToolName = "pointer";
    this.data = { ...this.ngData }
  }

  ngOnDestroy(): void {
    this.ngDataChange.emit({ ...this.ngData, json: this.canvas.toJSON(this.customProperties), pointArray: this.pointArray })
  }

  ngOnInit() {
    if (!this.ngData.json) {
      this.loading = true;
      this.setDefaultData();
      setTimeout(() => {
        this.initCanvas(this.randomCanvasId, canvasDefaultConfig).then(_result => {
          this.imageUrl = "./assets/exportnote.jpg";
          this.setBackgroundImage(this.imageUrl).then(image => {
            this.resizeCanvasToSize(image).then(_newCanvas => {
              this.enableDrawingTool('pointer');
              this.onPointeCreatedEvent();
              this.onPathCreatedEvent();
              this.putHistory();
              this.on(['undo', 'redo']);
              this.loading = false;
            })
          })
        });
      }, 0);
    }
    this.chartdata = localStorage.getItem("Chartitem");
    this.length = localStorage.getItem("Chartitemlength");
    // console.log("this.ngData", this.ngData);
  }

  ngAfterViewInit(): void {
    if (this.ngData.json) {
      if (this.isFullScreen) {
        // this.loading = true;
        this.initCanvas(this.randomCanvasId, canvasDefaultConfig).then(canvas => {
          this.imageUrl = this.ngData.json.background.source
          this.setBackgroundImage(this.imageUrl).then(image => {
            this.resizeCanvasToSize(image).then(_newCanvas => {
              canvas.loadFromJSON(this.ngData.json, () => {
                canvas.renderAll.bind(canvas);
                this.selectableAllFalse();
                this.enableDrawingTool('pointer');
                this.onPointeCreatedEvent();
                this.onPathCreatedEvent();
                this.on(['undo', 'redo']);
                // this.loading = false;
              }, (o, object) => {
                console.log(o, object);
              })
            });
          });
        });
      }
    }
  }

  doMoveDown() {
    this.moveDown.emit();
  }

  doMoveUp() {
    this.moveUp.emit();
  }

  setDefaultData() {
    !this.data.title ? this.data.title = "Heading" : null;
    !this.data.helpText ? this.data.helpText = "Draw or type notes on the provided Body Chart or any image of your choice" : null;
    !this.data.isMendatory ? this.data.isMendatory = false : null;
    !this.data.chartSize || this.data.chartSize.length <= 0 ? this.data.chartSize = [Size.SMALL, Size.MEDIUM, Size.LARGE] : null;
    !this.data.selectedChartSize ? this.data.selectedChartSize = Size.MEDIUM : null;
  }

  editTitle() {
    this.isTitleInEditing = true;
    this.dummyData = { ...this.data }
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

  closeClearSketchDialog(state) {
    this.isClearSketchDialog = false;
    if (state != "cancel") {
      this.clearAllSketch();
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
    this.ngData = { ...this.data };
  }


  changeBodyImage($event) {
    this.loading = true;
    this.imageUrl = URL.createObjectURL($event.target.files[0])
    this.setBackgroundImage(this.imageUrl).then(image => {
      this.resizeCanvasToSize(image).then(canvas => {
        this.resizeToFitInAView();
      })
    })
  }
  
  resizeToFitInAView() {
    let size = this.isFullScreen ? { width: 1200, height: 1200 } : { width: 800, height: 800 };
    this.fitCanvasToView(size).then(result => {
      this.loading = false;
    })
  }

  openFilePicker() {
    document.getElementById("upload").click();
  }

  enableLine() {
    this.activateDrawingTool('line');
    this.canvas.isDrawingMode = false;
    this.canvas.isDrawingMode = true;
    fabric.Line.prototype.globalCompositeOperation = "destination-out";
    this.canvas.renderAll();
  }

  enableDrawingTool(toolName) {
    if (this.drawingTools.indexOf(toolName) != -1) {
      if (!this.canvas.isDrawingMode)
        this.enableDrawingMode();
      this.activateDrawingTool(toolName);
    }
    else {
      this.disableDrawingMode();
      this.makeDrawingUnselectable()
      this.activateStandardTools(toolName);
    }
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
    this.resetTools();
  }

  generatePreview() {
    this.generateImage(this.imageUrl).then(result => {
      this.data.finalImage = result;
    })
  }

  deletedata(point, index) {
    this.pointArray.splice(index, 1);
    this.canvas.getObjects().forEach(object => {
      if (object.toJSON(this.customProperties).id == point.id) {
        this.canvas.remove(object);
      }
    })
    this.canvas.renderAll();
  }

  openPortalModal() {
    this.data.json = this.canvas.toJSON(this.customProperties);
    this.ngData = { ...this.data }
    this.portalModal = true;
  }

  closeportalModal() {
    this.portalModal = false;
    setTimeout(() => {
      this.canvas.clear();
      if (this.ngData.json) {
        this.imageUrl = this.ngData.json.background.source
        this.setBackgroundImage(this.imageUrl).then(image => {
          this.resizeCanvasToSize(image).then(_newCanvas => {
            this.canvas.loadFromJSON(this.ngData.json, () => {
              this.canvas.renderAll.bind(this);
              this.resizeToFitInAView();
              this.pointArray = [...this.pointArray, ...this.ngData.pointArray]
              this.selectableAllFalse();
            })
          });
        });
      }
    }, 0);
  }
}