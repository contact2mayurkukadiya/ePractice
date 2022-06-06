import { Component, OnInit, Input } from '@angular/core';
import { ImageSnippet } from 'src/app/models/app.misc';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
  @Input() buttonText: string = "Upload Logo";
  @Input() format: string = "Image";
  selectedFile?: ImageSnippet;

  file: File;

  constructor() { }
  ngOnInit(): void {

  }

  processFile(imageInput: any) {
    this.file = imageInput.files[0];
    console.log(this.file);
    const reader = new FileReader();

    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, this.file);
      console.log(this.selectedFile);
    });

    reader.readAsDataURL(this.file);
  }

  public clearSelection() {
    this.selectedFile = null;
  }
}
