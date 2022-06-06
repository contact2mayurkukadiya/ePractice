import 'fabric';
declare const fabric: any;
const objectConfig = {
    cornerColor: '#ffffff',
    borderColor: '#ffffff',
    cornerSize: 12,
    cornerStrokeColor: '#ffffff',
    cornerStyle: 'circle',
    hasControls: true,
    transparentCorners: false,
    cornerShadowColor: '#35394188',
    strokeShadowBlur: 2,
    cornerShadowBlur: 10,
    cornerShadowOffsetX: 0,
    cornerShadowOffsetY: 0,
    lockUniScaling: false,
    centeredScaling: true,
    centeredRotation: true,
    lockScalingFlip: true,
    snapAngle: 45,
    snapThreshold: 5,
    controls: {}
}

const KEYCODES = Object.freeze({
    Z: 90,
    Y: 89,
    SHIFT: 16,
    BACKSPACE: 8,
    DEL: 46,
    PLUS: 187,
    MINUS: 189,
    NUMPLUS: 107,
    NUMMINUS: 109
})

const tools = [
    { type: 'pointer' },
    { type: 'pencil', lineWidth: 4, opacity: 'ff' },
    { type: 'pen', lineWidth: 2, opacity: 'ff' },
    { type: 'marker', lineWidth: 10, opacity: 'ff' },
    { type: 'highlighter', lineWidth: 20, opacity: '80' },
    { type: 'eraser', lineWidth: 30, opacity: '60' },
    { type: 'line', lineWidth: 2, opacity: 'ff' },
    { type: 'rect', lineWidth: 2, opacity: 'ff' },
    { type: 'circle', lineWidth: 2, opacity: 'ff' },
    { type: 'text', text: "Enter Text Here", opacity: 'ff', fontSize: 20, fontFamily: 'verdana' },
    { type: 'move' },
]


fabric.Object.prototype.set(objectConfig);

export class editor {

    public zoomLevel: number = 1;
    public lineColors: Array<string> = ["#0E60D3", "#20923B", "#FEB400", "#FF4C4E", "#995ADC", "#323336"];
    public canvas: any;
    public isEraserEnable: boolean = false;
    public defaultSelectedToolName: string = "pencil";
    private selectedDrawingTool: any = tools.find(item => item.type == this.defaultSelectedToolName);
    private selectedLineColor: any = this.lineColors[0];
    private downTime: any;
    pointArray: Array<any> = [];
    private line: any;
    private isMouseDown: any;
    public customProperties = ['id', 'selectable', 'evented'];
    // History Feature
    private _config = {
        canvasState: [],
        currentStateIndex: -1,
        undoStatus: false,
        redoStatus: false,
        disableUndo: true,
        disableRedo: true,
        undoFinishedStatus: 1,
        redoFinishedStatus: 1
    };

    constructor() {

    }

    initCanvas(id, options): Promise<any> {
        return new Promise(async (resolve, _reject) => {
            this.canvas = await new fabric.Canvas(id, options);
            resolve(this.canvas);
        })
    }

    setBackgroundImage(imageSrc): Promise<any> {
        return new Promise((resolve, reject) => {
            var image = new Image();
            image.crossOrigin = 'anonymous';
            image.onload = () => {
                fabric.util.loadImage(image.src, (img) => {
                    const background = new fabric.Pattern({
                        source: img,
                        repeat: 'no-repeat',
                        // scaleX: this.canvas.width / image.width,
                        // scaleY: this.canvas.height / image.height,
                    });
                    this.canvas.backgroundColor = background;
                    this.canvas.renderAll();
                    resolve({ width: image.width, height: image.height, background: this.canvas.backgroundColor });
                });
            }
            image.src = imageSrc;
        });
    }

    resizeCanvasToSize(size): Promise<any> {
        return new Promise((resolve, reject) => {
            this.canvas.setWidth(size.width);
            this.canvas.setHeight(size.height);
            this.canvas.set({ _width: size.width });
            this.canvas.set({ _height: size.height });
            this.canvas.renderAll();
            resolve(this.canvas);
        });
    }

    enableDrawingMode(): Promise<any> {
        return new Promise(async (resolve, _reject) => {
            this.canvas.isDrawingMode = true;
            await this.canvas.set({ selection: false });
            this.canvas.renderAll();
            resolve(this.canvas);
        })
    }

    disableDrawingMode(): Promise<any> {
        return new Promise(async (resolve, _reject) => {
            this.canvas.isDrawingMode = false;
            await this.canvas.set({ selection: true });
            this.canvas.renderAll();
            resolve(this.canvas);
        });
    }

    async resetTools() {
        this.selectedDrawingTool = await tools.find(item => item.type == this.defaultSelectedToolName);
        this.selectedLineColor = this.lineColors[0];
        this.activateDrawingTool(this.selectedDrawingTool.type);
        this.enableLineColor(this.selectedLineColor);
    }

    initBrush(): Promise<any> {
        return new Promise(async (resolve, reject) => {
            this.canvas.freeDrawingBrush = await new fabric.PencilBrush(this.canvas);
            this.canvas.freeDrawingBrush.width = this.selectedDrawingTool.lineWidth;
            this.canvas.freeDrawingBrush.color = this.selectedLineColor;
            this.canvas.renderAll();
            resolve(this.canvas.freeDrawingBrush);
        })
    }

    onPathCreatedEvent() {
        this.canvas.on("path:created", (e) => {
            if (this.selectedDrawingTool.type == 'eraser') {
                e.path.set({
                    selectable: false,
                    evented: false,
                    stroke: '#000000',
                    globalCompositeOperation: 'destination-out',
                    lockMovementX: true,
                    lockMovementY: true,
                    lockScalingX: true,
                    lockScalingY: true,
                    lockUniScaling: true,
                    lockRotation: true,
                })
                this.putHistory();
                this.canvas.renderAll.bind(this.canvas);
            }
            else {
                this.putHistory();
                this.canvas.renderAll.bind(this.canvas);
            }
        })
    }

    onPointeCreatedEvent() {
        this.canvas.on("mouse:down", (e) => {
            this.downTime = Date.now()
            if (this.selectedDrawingTool.type == 'line') {
                this.isMouseDown = true;
                var pointer = this.canvas.getPointer(e.e);
                var points = [pointer.x, pointer.y, pointer.x, pointer.y];
                this.line = new fabric.Line(points, {
                    strokeWidth: 5,
                    fill: this.selectedLineColor,
                    stroke: this.selectedLineColor,
                    originX: 'center',
                    originY: 'center'
                });
                this.canvas.add(this.line);
                this.putHistory();
            }
        });
        this.canvas.on("mouse:move", (e) => {
            if (!this.isMouseDown) return;
            if (this.selectedDrawingTool.type == 'line') {
                var pointer = this.canvas.getPointer(e.e);
                this.line.set({ x2: pointer.x, y2: pointer.y });
                this.canvas.renderAll();
            }
        });
        this.canvas.on('mouse:up', (e) => {
            this.isMouseDown = false;
            let uptime = Date.now();
            if ((uptime - this.downTime) / 1000 < 0.20) {
                // it will put a point if click within 1 second
                if (this.selectedDrawingTool.type == 'pointer') {
                    let count = 0;
                    let id = "point_" + (Math.random() * 10000).toString();
                    this.canvas.forEachObject(object => {
                        if ((object.toJSON(this.customProperties).id && object.toJSON(this.customProperties).id.includes("point_")) || (object && object.id && object.id.includes("point_"))) {
                            count++;
                        }
                    });
                    this.pointArray.push({ id, value: (count + 1).toString() });
                    let circle = new fabric.Circle({ radius: 15, fill: this.selectedLineColor, top: 0, left: 0, originX: 'center', originY: 'center' })
                    let number = new fabric.Text((count + 1).toString(), { top: 0, left: 0, fill: '#fff', fontSize: 12, fontFamily: 'verdana', originX: 'center', originY: 'center' });
                    let group = new fabric.Group([circle, number], {
                        top: Math.round(e.absolutePointer.y - 15),
                        left: Math.round(e.absolutePointer.x - 15),
                        // id: 'point_' + (count + 1).toString(),
                        selectable: false,
                        evented: false,
                        lockMovementX: true,
                        lockMovementY: true,
                        lockScalingX: true,
                        lockScalingY: true,
                        lockUniScaling: true,
                        lockRotation: true,
                    });
                    this.extend(group, id);
                    this.canvas.add(group);
                    this.canvas.renderAll();
                    this.putHistory();
                }
            }
        })
    }

    activateDrawingTool(toolType) {
        let tool = tools.find(item => item.type == toolType);
        this.canvas.freeDrawingBrush.width = tool.lineWidth;
        this.selectedDrawingTool = tool;
        this.enableLineColor(this.selectedLineColor);
        this.canvas.renderAll();
    }

    activateStandardTools(toolType) {
        this.selectedDrawingTool = tools.find(item => item.type == toolType);
        switch (toolType) {
            case 'pointer':
            case 'line':
                break;
            case 'rect':
                let addrectanle = new fabric.Rect({
                    width: 200, height: 100, left: 10, top: 10, angle: 0,
                    stroke: this.selectedLineColor,
                    fill: '#00000005'
                });
                this.extend(addrectanle, this.randomId());
                this.canvas.add(addrectanle);
                this.selectItemAfterAdded(addrectanle);
                this.putHistory();
                break;
            case 'circle':
                let addsquare = new fabric.Circle({
                    radius: 50, left: 10, top: 10,
                    stroke: this.selectedLineColor,
                    fill: '#00000005'
                });
                this.extend(addsquare, this.randomId());
                this.canvas.add(addsquare);
                this.selectItemAfterAdded(addsquare);
                this.putHistory();
                break;
            case 'text':
                var text = new fabric.IText(this.selectedDrawingTool.text, {
                    width: 250,
                    height: 100,
                    borderColor: this.selectedLineColor,
                    cursorColor: this.selectedLineColor,
                    top: 10,
                    left: 10
                });
                this.canvas.add(text)
                this.selectItemAfterAdded(text);
                this.putHistory();
                break;
        }

    }
    extend(obj, id) {
        obj.toObject = (function (toObject) {
            return function () {
                return fabric.util.object.extend(toObject.call(this), {
                    id: id
                });
            };
        })(obj.toObject);
    }
    //======= this is used to generate random id of every object ===========
    randomId() {
        return Math.floor(Math.random() * 999999) + 1;
    }
    selectItemAfterAdded(obj) {
        this.canvas.discardActiveObject().renderAll();
        this.canvas.setActiveObject(obj);
    }

    enableLineColor(color) {
        let dummy = color + this.selectedDrawingTool.opacity;
        this.canvas.freeDrawingBrush.color = dummy;
        this.selectedLineColor = color;
    }

    disableEraser() {
        this.isEraserEnable = false;
    }

    enableEraser() {
        this.isEraserEnable = true;
    }

    generateImage(backgroundImage): Promise<any> {
        return new Promise((resolve, reject) => {
            var image = new Image();
            image.crossOrigin = 'anonymous';
            image.onload = async () => {
                this.canvas.backgroundColor = "#ff000000";
                this.canvas.renderAll();
                let base64 = this.canvas.toDataURL({ format: 'jpg', multiplier: this.canvas.getZoom() });
                var cnv = await document.createElement('canvas');
                cnv.setAttribute('id', 'resize_canvas');
                var blob = this.dataURLtoBlob(base64);
                var blobUrl = URL.createObjectURL(blob);
                var img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = async () => {
                    cnv.width = img.width;
                    cnv.height = img.height;
                    var ctx = cnv.getContext('2d');
                    ctx.drawImage(image, 0, 0, cnv.width, cnv.height);
                    ctx.drawImage(img, 0, 0, cnv.width, cnv.height);
                    let base64 = cnv.toDataURL();
                    this.setBackgroundImage(image).then(result => {
                        this.canvas.renderAll();
                    });
                    resolve(base64);
                };
                img.src = blobUrl;
            }
            image.src = backgroundImage;
        })
    }


    // Undo Redu History state

    putHistory() {
        this._config.disableUndo = false;
        this._config.disableRedo = false;
        this.updateCanvasState();
    }

    updateCanvasState() {
        if ((this._config.undoStatus == false && this._config.redoStatus == false)) {
            fabric.Object.NUM_FRACTION_DIGITS = 10;
            var jsonData = this.canvas.toJSON(this.customProperties);
            var canvasAsJson = JSON.stringify(jsonData);
            if (this._config.currentStateIndex < this._config.canvasState.length - 1) {
                var indexToBeInserted = this._config.currentStateIndex + 1;
                this._config.canvasState[indexToBeInserted] = canvasAsJson;
                var numberOfElementsToRetain = indexToBeInserted + 1;
                this._config.canvasState = this._config.canvasState.splice(0, numberOfElementsToRetain);
            } else {
                this._config.canvasState.push(canvasAsJson);
            }
            this._config.currentStateIndex = this._config.canvasState.length - 1;
            if ((this._config.currentStateIndex == this._config.canvasState.length - 1) && this._config.currentStateIndex != -1) {
                this._config.disableRedo = true;
            }
        }
    }

    undo() {
        let that = this;
        if (that._config.undoFinishedStatus) {
            if (that._config.currentStateIndex == -1) {
                that._config.undoStatus = false;
            }
            else {
                if (that._config.canvasState.length >= 1) {
                    that._config.undoFinishedStatus = 0;
                    if (that._config.currentStateIndex != 0) {
                        that._config.undoStatus = true;
                        let currentInx = JSON.parse(that._config.canvasState[that._config.currentStateIndex - 1]);
                        that._config.canvasState[that._config.currentStateIndex - 1] = JSON.stringify(currentInx);
                        that.canvas.loadFromJSON(that._config.canvasState[that._config.currentStateIndex - 1], function () {
                            that.canvas.renderAll();
                            that.selectableAllFalse();
                            that._config.undoStatus = false;
                            that._config.currentStateIndex -= 1;
                            that._config.disableUndo = false;
                            if (that._config.currentStateIndex !== that._config.canvasState.length - 1) {
                                that._config.disableRedo = false;
                            }
                            that._config.undoFinishedStatus = 1;
                            if (that._config.currentStateIndex == 0) {
                                that._config.disableUndo = true;
                            }
                        });
                    }
                    else if (that._config.currentStateIndex == 0) {
                        that._config.undoFinishedStatus = 1;
                        that._config.disableUndo = true;
                        that._config.disableRedo = false;
                        that._config.currentStateIndex -= 1;
                    }
                }
            }
        }
    }

    redo() {
        let that = this;
        if (that._config.redoFinishedStatus) {
            if ((that._config.currentStateIndex == that._config.canvasState.length - 1) && that._config.currentStateIndex != -1) {
                that._config.disableRedo = true;
            } else {
                if (that._config.canvasState.length > that._config.currentStateIndex && that._config.canvasState.length != 0) {
                    that._config.redoFinishedStatus = 0;
                    that._config.redoStatus = true;
                    let currentInx = JSON.parse(that._config.canvasState[that._config.currentStateIndex + 1]);
                    that._config.canvasState[that._config.currentStateIndex + 1] = JSON.stringify(currentInx);
                    that.canvas.loadFromJSON(that._config.canvasState[that._config.currentStateIndex + 1], function () {
                        that.canvas.renderAll();
                        that.selectableAllFalse();
                        that._config.redoStatus = false;
                        that._config.currentStateIndex += 1;
                        if (that._config.currentStateIndex != -1) {
                            that._config.disableUndo = false;
                        }
                        that._config.redoFinishedStatus = 1;
                        if ((that._config.currentStateIndex == that._config.canvasState.length - 1) && that._config.currentStateIndex != -1) {
                            that._config.disableRedo = true;
                        }
                    });
                }
            }
        }
    }

    on(callbacks) {
        document.addEventListener("keydown", (e) => {
            if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.keyCode === KEYCODES.Z) {
                // ctrl + z
                e.preventDefault();
                if (callbacks.indexOf('undo') != -1) {
                    if (!this._config.disableUndo) {
                        this.undo();
                    }
                }
            }
            else if ((e.ctrlKey || e.metaKey) && e.keyCode === KEYCODES.Y) {
                // ctrl + y
                e.preventDefault();
                if (callbacks.indexOf('undo') != -1) {
                    if (!this._config.disableRedo) {
                        this.redo();
                    }
                }
            }
            else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === KEYCODES.Z) {
                // ctrl + shift + z
                e.preventDefault();
                if (callbacks.indexOf('undo') != -1) {
                    if (!this._config.disableRedo) {
                        this.redo();
                    }
                }
            }

        }, false);
    }

    // Zoom Feature
    fitCanvasToView(size): Promise<any> {
        return new Promise(resolve => {
            this.getScaleToFit(size).then(async (result: any) => {
                await this.setZoom(result.scale);
                resolve(null);
            })
        })
    }

    getScaleToFit(size): Promise<any> {
        return new Promise(resolve => {
            let width;
            let height;
            const canvasOriginalWidth = this.canvas.getWidth();
            const canvasOriginalHeight = this.canvas.getHeight();
            width = size.width;
            height = Math.round(size.height);
            if (this.isPortrait(canvasOriginalWidth, canvasOriginalHeight)) {
                const scale = height / canvasOriginalHeight;
                if (width < canvasOriginalWidth * scale) {
                    resolve({ width: canvasOriginalWidth, height: canvasOriginalHeight, scale: width / canvasOriginalWidth });
                }
                else {
                    resolve({ width: canvasOriginalWidth, height: canvasOriginalHeight, scale: scale });
                }
            }
            else if (this.isLandscape(canvasOriginalWidth, canvasOriginalHeight)) {
                const scale = width / canvasOriginalWidth;
                if (height < canvasOriginalHeight * scale) {
                    resolve({ width: canvasOriginalWidth, height: canvasOriginalHeight, scale: height / canvasOriginalHeight });
                }
                else {
                    resolve({ width: canvasOriginalWidth, height: canvasOriginalHeight, scale: scale });
                }
            }
            else {
                resolve({ width: canvasOriginalWidth, height: canvasOriginalHeight, scale: width / canvasOriginalWidth });
            }
        });
    }

    setZoom(scale) {
        this.canvas.setDimensions({
            width: Math.round(this.canvas._width * scale),
            height: Math.round(this.canvas._height * scale)
        });
        this.canvas.setZoom(scale);
        this.zoomLevel = scale;
        this.canvas.calcOffset();
    }

    zoomIn() {
        let newLvl = this.zoomLevel + 0.1;
        if (newLvl <= 2) {
            this.setZoom(newLvl);
        }
        else {
            this.setZoom(2);
            this.zoomLevel = 2;
        }
    }

    zoomOut() {
        let newLvl = this.zoomLevel - 0.1;
        if (newLvl > 0.1) {
            this.setZoom(newLvl);
        }
        else {
            this.setZoom(0.1);
            this.zoomLevel = 0.1;
        }
    }

    resetZoom() {
        this.setZoom(1);
    }

    // Utility function
    dataURLtoBlob(dataurl) {
        let parts = dataurl.split(','), mime = parts[0].match(/:(.*?);/)[1]
        if (parts[0].indexOf('base64') !== -1) {
            let bstr = atob(parts[1]), n = bstr.length, u8arr = new Uint8Array(n)
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }
            return new Blob([u8arr], { type: mime })
        } else {
            let raw = decodeURIComponent(parts[1]);
            return new Blob([raw], { type: mime });
        }
    }

    isPortrait(width, height) {
        return height > width + (height / 6);
    }

    isLandscape(width, height) {
        return width > height + (width / 6);
    }

    makeDrawingUnselectable() {
        this.canvas.discardActiveObject().renderAll();
        this.canvas.forEachObject(element => {
            if (element.toJSON(this.customProperties).type == 'path') {
                element.set({
                    selectable: false,
                    evented: false,
                    lockMovementX: true,
                    lockMovementY: true,
                    lockScalingX: true,
                    lockScalingY: true,
                    lockUniScaling: true,
                    lockRotation: true,
                })
            }
        });
        this.canvas.renderAll();
    }

    selectableAllFalse() {
        let excludedType = ['line', 'rect', 'circle', 'IText'];
        this.canvas.getObjects().forEach(element => {
            if (excludedType.indexOf(element.type) == -1) {
                element.set({
                    selectable: false,
                    evented: false
                })
            }
        });
        this.canvas.renderAll();
    }
}