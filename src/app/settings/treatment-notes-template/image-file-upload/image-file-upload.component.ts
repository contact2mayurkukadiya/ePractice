import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChartImageSnippet } from 'src/app/models/app.misc';

@Component({
  selector: 'app-image-file-upload',
  templateUrl: './image-file-upload.component.html',
  styleUrls: ['./image-file-upload.component.css'],
})
export class ImageFileUploadComponent implements OnInit {
  @Input() headerDescription = '';
  @Input() source = '';

  selectedFile?: ChartImageSnippet;
  file: File;
  // tslint:disable-next-line: no-output-rename
  @Output('parentChartCallBack')
  parentChartCallBack: EventEmitter<any> = new EventEmitter();

  constructor() {}
  ngOnInit(): void {
    if (this.source !== '' && this.source !== undefined) {
      this.selectedFile  = new ChartImageSnippet(this.source, null);
    }
  }

  processFile(imageInput: any) {
    this.file = imageInput.files[0];
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ChartImageSnippet(event.target.result, this.file);
      this.parentChartCallBack.emit(this.selectedFile);
    });

    reader.readAsDataURL(this.file);
  }

  public clearSelection() {
    this.selectedFile = null;
  }

  downloadFile() {
    const downloadLink = document.createElement('a');
    const fileName = 'download.png';
    downloadLink.href = this.selectedFile.src;
    downloadLink.download = fileName;
    downloadLink.click();
  }
}
