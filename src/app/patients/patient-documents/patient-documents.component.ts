import { Component, OnInit, ViewChild, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import { DocumentListModel, PatientDocumentUpdateLockModel } from 'src/app/models/app.patient.model';
import { AdddocumentsComponent } from '../adddocuments/adddocuments.component';
import { DomSanitizer } from '@angular/platform-browser';
import { EmailtemplateComponent } from '../emailtemplate/emailtemplate.component';
import { GroupDescriptor } from '@progress/kendo-data-query';
import { PreviewdocumentComponent } from '../previewdocument/previewdocument.component';
import { PatientService } from '../../services/app.patient.service';
import { BaseGridComponent } from '../../shared/base-grid/base-grid.component';
import { AppState } from '../../app.state';
import { ImageSnippet } from 'src/app/models/app.misc';
import { MessageType } from '../../models/app.misc';
import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-patient-documents',
  templateUrl: './patient-documents.component.html',
  styleUrls: ['./patient-documents.component.css']
})
export class PatientDocumentsComponent extends BaseGridComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @Input() progress: number;
  @Input() total: number;
  @Input() patientId: string;
  @ViewChild("fileInput", { static: false }) fileInput: ElementRef;
  @ViewChild(AdddocumentsComponent, { static: false }) errorMessages: AdddocumentsComponent;
  subscription: Subscription;
  files = [];
  dialogRef: any;
  docShow = true;
  docTitle = '';
  docRouteLink = '';
  docRouteName = '';
  docDescription = '';
  dataLoaded: boolean;
  streamedFileContent: string;
  public opened: boolean = false;
  errorMessage: string;
  messageType: MessageType;
  lockstatusdata: number;
  isLoading: boolean = true;
  displaySuccessMessage: string;
  filetype: string;

  caseName: string;
  documentName: string;
  documentTypes: string;
  note: string;
  uploadedDate: string;
  id: string;
  status: string;
  downloadimages: string;
  public groups: GroupDescriptor[] = [{ field: 'caseName' }, { field: "fileTypes" },];
  constructor(private changedetectorRef: ChangeDetectorRef, private _matDialog: MatDialog, private sanitizer: DomSanitizer, public location: Location, private patientService: PatientService, public appState: AppState,) {
    super();

  }
  icon = 'cog';
  animate: false;
  popupClass = 'font-arial';
  data: Array<any> = [{
    icon: 'pencil',
    text: 'Edit',
    click: () => { this.editForm() }
  }, {
    icon: 'preview',
    text: 'Preview',
    click: () => { this.previewImage() }
  }, {
    icon: 'download',
    text: 'Download',
    click: () => { this.downloadimage() }
  }, {
    icon: 'email',
    text: 'Email',
    click: () => { this.EmailTemplate() }
  }, {
    icon: 'lock',
    text: 'Lock / Unlock',
    click: () => { this.documentlockstatus() }
  }, {
    icon: 'delete',
    text: 'Delete',
    click: () => { this.deletedocuments() }
  }];
  ngOnInit() {
    this.blockUI.start();
    this.populateLanding();
    this.subscription = this.patientService.onSuccess1.subscribe(status => {
      if (status) {
        this.populateLanding();
      }
    });
    this.patientService.onSuccess.subscribe(status => {
      if (status)
        this.errorMessage = status;
      this.messageType = MessageType.success;
      setInterval(
        (a) => {
          this.displaySuccessMessage = '';
          this.errorMessage = '';
        },
        10000,
        []
      );
    });
    console.log(this.patientId);
    this.blockUI.stop();
  }
  // Get All Documents
  populateLanding() {
    console.log("Start");
    this.dataLoaded = true;
    this.patientService.getpatientdocuments(this.patientId).subscribe((data) => {
      console.log(data);
      if (data.length === 0) {
        this.docTitle = 'You haven\'t added a document for this patient.';
        this.docRouteName = 'Upload Document';
        this.docDescription =
          'Please click on the Upload Document button to upload files for this patient.';
        this.docShow = true;
        this.changedetectorRef.detectChanges();
      } else {
        this.docShow = false;
        data.forEach(d => {
          const k = 1024;
          var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
          const i = Math.floor(Math.log(d.size) / Math.log(k));
          let final = Math.round(d.size / Math.pow(1024, i)) + ' ' + sizes[i];
          d.size = final
        });
        this.gridData = data;
        this.loadItems();
      }
    });
    this.isLoading = false;
    this.displayMessage();
  }

  onClick() {
    const fileInput = this.fileInput.nativeElement;
    fileInput.onchange = (event) => {
      const file = fileInput.files;
      const filesize = file[0].size;
      const filetype = file[0].type;
      const filess = Math.round((filesize / 1024));
      if (filetype == 'application/x-msdownload') {
        this.errorMessage = "Unfortunately, the file upload was unsuccessful because executable files and DLL files are not allowed for upload."
        this.messageType = MessageType.error;
      }
      else {
        if (filess >= 5096) {
          this.errorMessage = "Unfortunately, the file upload was unsuccessful because it exceeds 5 MB, which is the maximum allowed size for file upload."
          this.messageType = MessageType.error;
        }
        else {
          this.files.push({ data: file, inProgress: true, progress: 0 });
          this.progress = (this.progress / this.total) * 100;
          this.dialogRef = this._matDialog.open(AdddocumentsComponent, {
            width: '1200px',
            panelClass: 'event-form-dialog',
            data: {
              action: 'new',
              image: file,
              progressBar: this.progress,
              patientID: this.patientId
            }
          });
        }
      }
    };
    fileInput.click();
  }
  onopenform(data) {
    console.log(data)
    if (this.status == '0') {
      if (data != '') {
        let objectData = {
          caseName: this.caseName,
          documentName: this.documentName,
          note: this.note,
          id: this.documentTypes,
          uploadedDate: this.uploadedDate
        }
        this.dialogRef = this._matDialog.open(AdddocumentsComponent, {
          width: '1200px',
          panelClass: 'event-form-dialog',
          data: {
            action: 'edit',
            patientdocument: objectData,
            patientID: this.patientId,
            documentId: data
          }
        });
      }
      else {
        this.onClick();
      }
    }
    else {
      this.errorMessage = "File Is Lock";
      this.messageType = MessageType.error;
    }

  }

  displayMessage() {
    if (
      this.patientService.sharedData != undefined &&
      this.patientService.sharedData != ''
    ) {
      this.displaySuccessMessage = this.patientService.sharedData;
      setInterval(
        (a) => {
          this.displaySuccessMessage = '';
          this.patientService.sharedData = '';
        },
        50000,
        []
      );
    }
  }
  // For Edit Form
  editForm() {
    this.onopenform(this.id);
  }
  // For Preview Image
  previewImage() {
    if (this.filetype == "image/jpeg") {
      this.blockUI.start();
      this.patientService.getpatientdocumentcontentbyid(this.patientId, this.id)
        .subscribe((patientdocument) => {
          console.log(patientdocument);
          this.streamedFileContent = patientdocument.streamedFileContent;
          let imagedata = new ImageSnippet(`data:image/jpeg;base64,${this.streamedFileContent}`, null);
          console.log(imagedata);
          let downloadimage = imagedata.src;
          this.blockUI.stop();
          this.dialogRef = this._matDialog.open(PreviewdocumentComponent, {
            width: '1500px',
            panelClass: 'event-form-dialog',
            data: {
              action: 'new',
              image: downloadimage,
              docName: this.documentName,

            }
          });
        });
    }
    else {
      this.errorMessage = "Preview option not available for this file. Alternatively, you can download the file."
      this.messageType = MessageType.error;
    }
  }
  //  For Delete Documents
  deletedocuments() {
    if (this.status == '0') {
      this.opened = true;
    }
    else {
      this.errorMessage = "File Is Lock";
      this.messageType = MessageType.error;
    }
  }
  deleteconfirm(status: string) {
    if (status === "yes") {
      this.patientService.deletepatientdocumentsbyid(this.patientId, this.id).subscribe(r => {
        if (r) {
          localStorage.removeItem("patientDocumentId");
          this.populateLanding();
          this.errorMessage = "Your Document has been successfully deleted."
          this.messageType = MessageType.success;
        }
      });
    }
    this.opened = false;
  }
  // For Downloading Image
  downloadimage() {
    this.blockUI.start();
    this.patientService.getpatientdocumentcontentbyid(this.patientId, this.id)
      .subscribe((patientdocument) => {
        this.streamedFileContent = patientdocument.streamedFileContent;

        if (this.streamedFileContent != '') {
          if (this.filetype == "image/jpeg") {
            let imagedata = new ImageSnippet(`data:image/jpeg;base64,${this.streamedFileContent}`, null);
            this.downloadimages = imagedata.src;
          }
          else if (this.filetype == "image/png") {
            let imagedata = new ImageSnippet(`data:image/png;base64,${this.streamedFileContent}`, null);
            this.downloadimages = imagedata.src;
          }
          else if (this.filetype == "application/pdf") {
            let imagedata = new ImageSnippet(`data:application/pdf;base64,${this.streamedFileContent}`, null);
            this.downloadimages = imagedata.src;
          }
          else if (this.filetype == "image/bmp") {
            let imagedata = new ImageSnippet(`data:image/bmp;base64,${this.streamedFileContent}`, null);
            this.downloadimages = imagedata.src;
          }
          else if (this.filetype == "application/x-zip-compressed") {
            let imagedata = new ImageSnippet(`data:application/x-zip-compressed;base64,${this.streamedFileContent}`, null);
            this.downloadimages = imagedata.src;
          }
          else if (this.filetype == "text/plain") {
            let imagedata = new ImageSnippet(`data:text/plain;base64,${this.streamedFileContent}`, null);
            this.downloadimages = imagedata.src;
          }
          this.isLoading = true;
          try {
            FileSaver.saveAs(this.downloadimages, this.documentName);
            this.isLoading = false;
            this.blockUI.stop();
          } catch (e) { console.log() }
        }
      });
  }
  // For Send Mail
  EmailTemplate() {
    this.dialogRef = this._matDialog.open(EmailtemplateComponent, {
      width: '1200px',
      panelClass: 'event-form-dialog',
      data: {
        action: 'new',
        progressBar: 0
      }
    });
  }
  onSplitButtonClick(event) {
    console.log(event);
    this.filetype = event.fileTypes;
    this.caseName = event.caseName;
    this.documentTypes = event.documentTypes.id;
    this.documentName = event.documentName;
    this.note = event.note;
    this.uploadedDate = event.uploadedDate;
    this.id = event.id;
    this.status = event.status;
  }
  // For Lock Unlock
  documentlockstatus() {
    this.blockUI.start();
    if (this.status == '0') {
      this.lockstatusdata = 1;
    }
    else {
      this.lockstatusdata = 0;
    }
    const model = new PatientDocumentUpdateLockModel();
    model.id = this.id;
    model.patientId = this.patientId;
    model.lockUnlock = this.lockstatusdata;
    this.patientService.updatepatientdocumentlockstatus(model).subscribe(r => {
      this.populateLanding();
    });
    this.blockUI.stop();
  }
  public close(status: string) {
    this.opened = false;
  }
}
