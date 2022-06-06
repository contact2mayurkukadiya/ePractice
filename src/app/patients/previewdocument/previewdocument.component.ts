import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-previewdocument',
  templateUrl: './previewdocument.component.html',
  styleUrls: ['./previewdocument.component.css']
})
export class PreviewdocumentComponent implements OnInit {
  title = 'ng-picture-viewer';
  imagepreview: string;
  docuName: string;
  // images ='../../../assets/placeholder.jpg';

  currentIndex: any = -1;
  showFlag: any = false;
  imageObject1: any = [];
  imageObject: Array<object> = [{
    image: '../../../assets/placeholder.jpg',
    thumbImage: '../../../assets/placeholder.jpg',
  }];
  constructor(public matDialogRef: MatDialogRef<PreviewdocumentComponent>, @Inject(MAT_DIALOG_DATA) private data: any,) {
    this.docuName = data.docName;
    this.imagepreview = data.image;
    this.imageObject[0]['image'] = this.imagepreview
    this.imageObject1.push(this.imagepreview);

  }
  ngOnInit() {

  }
  download() {
    try {
      FileSaver.saveAs(this.imagepreview, this.docuName);
    } catch (e) { console.log(e) }

  }
  showLightbox(index) {
    this.currentIndex = index;
    this.showFlag = true;
  }
  closeEventHandler() {
    this.showFlag = false;
    this.currentIndex = -1;
  }
  close() {
    this.matDialogRef.close()
  }
}