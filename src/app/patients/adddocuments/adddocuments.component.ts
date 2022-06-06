import { Component, OnInit, Inject, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient, HttpRequest, HttpResponse, HttpEventType } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { SettingsService } from 'src/app/services/app.settings.service';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/dt-format';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PatientService } from '../../services/app.patient.service';
import { LabelSettings } from '@progress/kendo-angular-progressbar';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BaseItemComponent } from 'src/app/shared/base-item/base-item.component';
import { ImageSnippet, MessageType } from 'src/app/models/app.misc';
import { AppState } from 'src/app/app.state';
import { ApplicationDataEnum } from '../../enum/application-data-enum';
import { DocTypeDataModel } from '../../models/app.misc';
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import {
  DocumentListModel,
  PatientDocumentUpdateModel
} from '../../models/app.patient.model';
@Component({
  selector: 'app-adddocuments',
  templateUrl: './adddocuments.component.html',
  styleUrls: ['./adddocuments.component.css'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class AdddocumentsComponent extends BaseItemComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  UploadDocumentForm: FormGroup;
  patientId: string;
  documentName: any;
  Update_date: any;
  progressbar = 0;
  fileTypes: string;
  size: string;
  docTypes: any[];
  filterTypeData: any[];
  public filter: string;
  imageData: any;
  imageDataU: any;
  selectedFile?: ImageSnippet;
  getFile: any;
  categoryId: number;
  public label: LabelSettings = {
    visible: true,
    format: 'percent',
    position: 'center'
  };
  actiondata: string;
  epatientId: string;
  edocumentId: string;
  ecaseName: string;
  edocumentName: string;
  eUpdate_date: string;
  edocumentTypes: string;
  enote: string;
  editprogress: boolean = true;

  errorMessage: string;
  errorMessagedata: string;
  messageType = MessageType;
  uploadSuccess = false;
  sizedata: number;
  @Output("parentProductCallBack") parentProductCallBack: EventEmitter<any> = new EventEmitter();

  constructor(
    private patientService: PatientService,
    public matDialogRef: MatDialogRef<AdddocumentsComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private settingsService: SettingsService,
    public location: Location,
    public appState: AppState,
    private http: HttpClient,) {
    super(location);
    console.log(data);
    this.actiondata = data.action;
    if (data.action == 'new') {
      this.patientId = data.patientID;
      this.imageData = data.image;
      this.imageDataU = data.image[0];
      this.documentName = data.image[0].name;
      this.Update_date = data.image[0].lastModified;
      this.fileTypes = data.image[0].type;
      this.size = data.image[0].size;

      const formData = new FormData();
      formData.append('files', this.imageData);


      this.http
        .post("https://us-central1-tutorial-e6ea7.cloudfunctions.net/fileUpload", formData, {
          reportProgress: true,
          observe: "events"
        })
        .pipe(
          map((event: any) => {
            if (event.type == HttpEventType.UploadProgress) {
              this.progressbar = Math.round((100 / event.total) * event.loaded);
              console.log(this.progressbar);
            }
          })
        )
        .toPromise();
      const reader = new FileReader();
      reader.addEventListener('load', (event: any) => {
        this.selectedFile = new ImageSnippet(event.target.result, this.imageDataU);
        console.log(this.selectedFile);
        this.getFile = this.selectedFile.src.replace('data:', '').replace(/^.+,/, '');
      });
      reader.readAsDataURL(this.imageDataU);
    }
    else {
      this.epatientId = data.patientID;
      this.edocumentId = data.documentId;
      this.ecaseName = data.patientdocument.caseName;
      this.edocumentName = data.patientdocument.documentName;
      this.eUpdate_date = data.patientdocument.uploadedDate;
      this.edocumentTypes = data.patientdocument.id;
      this.enote = data.patientdocument.note;
    }
  }

  ngOnInit() {
    this.UploadDocumentForm = new FormGroup({
      documentName: new FormControl("", Validators.required),
      uploadedDate: new FormControl("", Validators.required),
      documentTypesId: new FormControl("", Validators.required),
      caseName: new FormControl("", Validators.required),
      note: new FormControl("")
    });
    this.UploadDocumentForm.controls['caseName'].setValue("General");
    this.populateDefaultValues();
    this.fillDocType();
  }

  fillDocType() {
    this.settingsService.getAllDocumentTypes().subscribe((data) => {
      console.log(data)
      this.docTypes = this.filterTypeData = data;
    });
  }

  search(query: string) {
    console.log('query', query)
    this.filterTypeData = this.docTypes.filter(
      (s) => s.folderName.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  populateDefaultValues() {
    if (this.actiondata == 'edit') {
      this.editprogress = false;
      this.UploadDocumentForm.controls['documentName'].setValue(this.edocumentName);
      this.UploadDocumentForm.controls['uploadedDate'].setValue(this.eUpdate_date);
      this.UploadDocumentForm.controls['documentTypesId'].setValue(this.edocumentTypes);
      this.UploadDocumentForm.controls['caseName'].setValue(this.ecaseName);
      this.UploadDocumentForm.controls['note'].setValue(this.enote);
    }
    else {
      this.editprogress = true;
      this.UploadDocumentForm.controls['uploadedDate'].setValue(new Date());
      this.UploadDocumentForm.controls['documentName'].setValue(this.documentName);
    }
  }

  uploadDocument() {
    if (this.actiondata == 'edit') {
      const edocumentListModel: PatientDocumentUpdateModel = this.UploadDocumentForm.value;
      var a = edocumentListModel.documentName.split(".");
      var b = this.documentName.split(".");
      if (a.length === 1) {
        edocumentListModel.documentName = this.UploadDocumentForm.controls.documentName.value + '.' + b[1];
      }
      else {
        edocumentListModel.documentName = this.UploadDocumentForm.controls.documentName.value;
      }
      edocumentListModel.patientId = this.epatientId;
      edocumentListModel.documentId = this.edocumentId;
      edocumentListModel.locationId = this.appState.selectedUserLocationId;
      console.log(edocumentListModel);
      // return;
      this.patientService.updatepatientdocument(edocumentListModel).subscribe(
        (e) => {

          this.close();
          this.submitting = false;
          this.patientService.openSuccess("Your file has been successfully updated.")
          this.patientService.openSuccess1(e);
          this.UploadDocumentForm.reset();
          this.blockUI.stop();
        },
        () => {
          this.displayErrorMessage('Unfortunately, file upload was unsuccesful.');
          this.submitting = false;
          this.close();
          this.blockUI.stop();
        }
      );
    }
    else {
      if (this.UploadDocumentForm.valid) {
        const documentListModel: DocumentListModel = this.UploadDocumentForm.value;

        var a = documentListModel.documentName.split(".");
        var b = this.documentName.split(".");
        if (a.length === 1) {
          documentListModel.documentName = this.UploadDocumentForm.controls.documentName.value + '.' + b[1];
        }
        else {
          documentListModel.documentName = this.UploadDocumentForm.controls.documentName.value;
        }
        documentListModel.patientId = this.patientId;
        documentListModel.locationId = this.appState.selectedUserLocationId;
        documentListModel.fileTypes = this.fileTypes;
        documentListModel.size = this.size;
        documentListModel.streamedFileContent = this.getFile;
        documentListModel.documentTypesId = this.UploadDocumentForm.controls.documentTypesId.value
        this.blockUI.start();
        this.patientService.uploadpatientdocument(documentListModel).subscribe(
          (e) => {
            console.log(e);
            this.close();
            this.submitting = false;
            this.patientService.openSuccess("Your file has been successfully uploaded.")
            this.patientService.openSuccess1(e);
            this.UploadDocumentForm.reset();

            this.blockUI.stop();
          },
          () => {
            this.errorMessage = "Unfortunately, file upload was unsuccesful."
            this.submitting = false;
            this.close();
            this.blockUI.stop();
          }
        );
      }
    }
  }
  close() {
    this.matDialogRef.close()
  }
  // public addNew(): void {
  //   this.settingsService
  //     .createDocumentTypeType(
  //       new DocTypeDataModel(
  //         0,
  //         this.filter,
  //         true,
  //         true,
  //         this.appState.selectedUserLocationId,
  //         true
  //       )
  //     )
  //     .subscribe(
  //       (d) => {
  //         this.categoryId = d;
  //         this.docTypes.push(
  //           new DocTypeDataModel(
  //             this.categoryId,
  //             this.filter,
  //             true,
  //             true,
  //             this.appState.selectedUserLocationId,
  //             true
  //           )
  //         );
  //         this.handleFilter(this.filter);
  //         this.blockUI.stop();
  //       },
  //       (error) => {
  //         this.blockUI.stop();
  //       }
  //     );
  // }
}
