import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BaseItemComponent } from 'src/app/shared/base-item/base-item.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Location } from '@angular/common';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ChartModel,
  CheckBoxModel,
  DateTimeModel,
  DropdownModel,
  ItemTypeModel,
  KeyValueModel,
  LocationModel,
  NumberModel,
  RadioButtonModel,
  TableModel,
  TreatmentNotesLocationModel,
  TreatmentNotesModel,
  TreatmentNotesSpecialtyModel,
  VitalsModel,
} from 'src/app/models/app.treatmentnotes.model';
import { SettingsService } from 'src/app/services/app.settings.service';
import { BusinessService } from 'src/app/services/app.business.service';
import { AppState } from 'src/app/app.state';
import { FileRestrictions } from '@progress/kendo-angular-upload';
import { ImageUploadComponent } from 'src/app/shared/image-upload/image-upload.component';
import { NgxImageCompressService } from 'ngx-image-compress';
import { TreatmentNotesService } from 'src/app/services/app.treatmentnotes.services';
import { ActivatedRoute, Router } from '@angular/router';
import { groupBy, GroupResult } from '@progress/kendo-data-query';

@Component({
  selector: 'app-add-treatment-notes-template',
  templateUrl: './add-treatment-notes-template.component.html',
  styleUrls: ['./add-treatment-notes-template.component.css'],
})
export class AddTreatmentNotesTemplateComponent
  extends BaseItemComponent
  implements OnInit {
  rangeOrScaleDuplicateMax: number;
  rangeOrScaleMax: number;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(ImageUploadComponent, { static: true })
  image: ImageUploadComponent;
  apperance = 'outline';

  panelOpenState = true;

  itemTypes = [
    {
      id: 1,
      title: 'Heading',
      description: 'Section Heading',
      icon: 'local_offer',
      json: '',
    },
    {
      id: 2,
      title: 'Date Time',
      description: '(Field to enter date Time)',
      icon: 'date_range',
      json: '',
    },
    {
      id: 3,
      title: 'Text',
      description: 'A plain text area to type notes',
      icon: 'text_format',
      json: '',
    },
    {
      id: 4,
      title: 'Number',
      description: 'Field to enter a single number',
      icon: 'looks_one',
      json: '',
    },
    {
      id: 5,
      title: 'Dropdown',
      description:
        'Select one option from a list of options in a dropdown menu',
      icon: 'arrow_circle_down',
      json: '',
    },
    {
      id: 6,
      title: 'Radio Buttons',
      description: 'Select one option from a list of options in a radio button',
      icon: 'radio_button_checked',
      json: '',
    },
    {
      id: 7,
      title: 'Check Boxes',
      description:
        'Select one or more checkboxes and optionally add a note to each',
      icon: 'check_box',
      json: '',
    },
    {
      id: 8,
      title: 'Range or Scale',
      description:
        'Customizable range / scale / clider allows you to choose from a range of values',
      icon: 'linear_scale',
      json: '',
    },
    {
      id: 9,
      title: 'Option List',
      description: 'Select a choice from list of subjects',
      icon: 'reorder',
      json: '',
    },
    {
      id: 10,
      title: 'Table',
      description:
        'Set of facts or figures systematically displayed in rows and column',
      icon: 'view_module',
      json: '',
    },
    {
      id: 11,
      title: 'Chart',
      description:
        'Draw or type notes on the provided Body chart or any image of your choice',
      icon: 'accessibility',
      json: '',
    },
    {
      id: 12,
      title: 'File Attachment',
      description:
        'Upload any type of file,with a preview of most common file types',
      icon: 'attach_file',
      json: '',
    },
    {
      id: 13,
      title: 'Instruction',
      description:
        'A plain text area to type instructions.It will not appear in printed or exported Treatment Note',
      icon: 'toc',
      json: '',
    },
    {
      id: 14,
      title: 'Chief Complaint',
      description: 'Record the chief complaint or diagnosis',
      icon: 'content_paste',
      json: '',
    },
    {
      id: 15,
      title: 'Vitals',
      description:
        'Record weight, height, blood pressure, respiratory rate, and calculate BMI.',
      icon: 'receipt_long',
      json: '',
    },
    {
      id: 16,
      title: 'Spine',
      description: 'Checkboxes for each joint, sketch on the spine diagram',
      icon: 'more_vert',
      json: '',
    },
    {
      id: 17,
      title: 'Optical Measurements',
      description: 'Optical Measurements',
      icon: 'visibility',
      json: '',
    },
  ];

  optionListStyles = [
    {
      id: 1,
      type: 'Button',
    },
    {
      id: 2,
      type: 'Checkbox',
    },
    {
      id: 3,
      type: 'Dropdown',
    },
    {
      id: 4,
      type: 'Radio button',
    },
  ];

  metric = [
    {
      id: 1,
      name: 'Body Temp (C)',
    },
    {
      id: 2,
      name: 'Pulse (BPM)',
    },
    {
      id: 3,
      name: 'Resp. Rate (bpm)',
    },
    {
      id: 4,
      name: 'BP (mm/ Hg)',
    },
    {
      id: 5,
      name: 'Height (cm)',
    },
    {
      id: 6,
      name: 'Weight (Kg)',
    },
    {
      id: 7,
      name: 'BMI (kg/m2)',
    },
  ];

  imperial = [
    {
      id: 1,
      name: 'Body Temp (F)',
    },
    {
      id: 2,
      name: 'Pulse (BPM)',
    },
    {
      id: 3,
      name: 'Resp. Rate (bpm)',
    },
    {
      id: 4,
      name: 'BP (mm/ Hg)',
    },
    {
      id: 5,
      name: 'Height (in)',
    },
    {
      id: 6,
      name: 'Weight (lbs)',
    },
    {
      id: 7,
      name: 'BMI (lb/in2)',
    },
  ];

  spine = [
    {
      id: 1,
      name: 'C0',
    },
    {
      id: 2,
      name: 'C1',
    },
    {
      id: 3,
      name: 'C2',
    },
    {
      id: 4,
      name: 'C3',
    },
    {
      id: 5,
      name: 'C4',
    },
    {
      id: 6,
      name: 'C5',
    },
    {
      id: 7,
      name: 'C6',
    },
    {
      id: 8,
      name: 'C7',
    },
    {
      id: 9,
      name: 'T1',
    },
    {
      id: 10,
      name: 'T2',
    },
    {
      id: 11,
      name: 'T3',
    },
    {
      id: 12,
      name: 'T4',
    },
    {
      id: 13,
      name: 'T5',
    },
    {
      id: 14,
      name: 'T6',
    },
    {
      id: 15,
      name: 'T7',
    },
    {
      id: 16,
      name: 'T8',
    },
    {
      id: 17,
      name: 'T9',
    },
    {
      id: 18,
      name: 'T10',
    },
    {
      id: 19,
      name: 'T11',
    },
    {
      id: 20,
      name: 'T12',
    },
    {
      id: 21,
      name: 'L1',
    },
    {
      id: 22,
      name: 'L2',
    },
    {
      id: 23,
      name: 'L3',
    },
    {
      id: 24,
      name: 'L4',
    },
    {
      id: 25,
      name: 'L5',
    },
    {
      id: 26,
      name: 'Sacrum',
    },
    {
      id: 27,
      name: 'SI AS',
    },
    {
      id: 28,
      name: 'SI PI',
    },
    {
      id: 29,
      name: 'Coccyx',
    },
  ];

  uploadSaveUrl = 'saveUrl'; // should represent an actual API endpoint
  uploadRemoveUrl = 'removeUrl'; // should represent an actual API endpoint
  itemTypesData = [];
  rangeOrScale = [];
  rangeOrScaleDuplicate = [];
  myRestrictions: FileRestrictions = {
    allowedExtensions: ['.jpg', '.png', '.pdf'],
  };

  maxTableRowsColumns = [1, 2, 3, 4, 5];

  treatmentNotes: TreatmentNotesModel;
  tempItemTemplates: ItemTypeModel[] = [];
  templateName: string;
  locationName: any;
  specialtyName: any;
  public specialtyData: any[] = [];
  public groupedSpecialtyData: GroupResult[];
  locationData: LocationModel[] = [];
  specialtyPreview: any;
  public dateValue: Date;
  public dateDuplicateValue: Date;
  locationAllList: LocationModel[];
  specialtyAllList: any;
  originalImage: string;
  originalDuplicateImage: string;
  unitOfMeasurement: { id: number; name: string }[];
  @Input() headerDescription = 'Default Image';
  tempTreatmentNotesTemplateSpeciality: TreatmentNotesSpecialtyModel[];
  chartDuplicateSize: string;
  chartSize: string;
  chartSrc: string;
  duplicateChartSrc: string;
  isSave: boolean;
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.treatmentNotes.itemTypeModel,
      event.previousIndex,
      event.currentIndex
    );
  }

  constructor(
    private appState: AppState,
    public location: Location,
    private settingsService: SettingsService,
    private _route: ActivatedRoute,
    private router: Router,
    private businessService: BusinessService,
    private imageCompress: NgxImageCompressService,
    private treatmentNotesService: TreatmentNotesService
  ) {
    super(location);
  }

  ngOnInit() {
    this.appState.selectedUserLocationIdState.subscribe((locationId) => {
      console.log(locationId);
    });
    this.isSave = false;
    this.treatmentNotes = new TreatmentNotesModel();
    this.treatmentNotes.isStatus = true;
    this.treatmentNotes.templateName = '';
    this.chartSize = this.chartDuplicateSize = 'Small';
    this.businessService
      .getLocationsByBusiness(this.appState.userProfile.parentBusinessId)
      .subscribe((data) => {
        data.map((d) => {
          const m = new LocationModel();
          m.locationId = d.id;
          m.locationName = d.locationName;
          this.locationData.push(m);
        });

        const locationsModel: TreatmentNotesLocationModel[] = [];
        this.locationData.forEach(
          (l: { locationId: string; locationName: string }) => {
            if (this.appState.selectedUserLocation.id === l.locationId) {
              const m = new TreatmentNotesLocationModel();
              m.locationId = l.locationId;
              m.locationName = l.locationName;
              locationsModel.push(m);
            }
          }
        );
        this.treatmentNotes.treatmentNotesTemplateLocation = locationsModel;

        this.settingsService.getAllSpecialties().subscribe((specialties) => {
          this.specialtyData = this.specialtyAllList = specialties;
          this.onLocationChange(locationsModel);
        });
        this.locationAllList = this.locationData;
      });

    this._route.params.subscribe((params) => {
      if (params.treatmentNotesTemplateId) {
        this.blockUI.start();
        this.addItem = false;
        this.itemid = params.treatmentNotesTemplateId;
        this.treatmentNotesService
          .GetTreatmentNotesTemplateById(params.treatmentNotesTemplateId)
          .subscribe((data) => {
            this.treatmentNotes = data;
            this.treatmentNotes.itemTypeModel = JSON.parse(
              this.treatmentNotes.itemType
            );

            this.treatmentNotes.itemTypeModel.map((x) => {
              if (x.chartImage.image !== '../../../assets/dropfileimage.png') {
                this.chartSrc = x.chartImage.image;
                this.chartChange(x.id, this.chartSize);
              }
              if (x.chartImage.image !== '../../../assets/dropfileimage.png') {
                this.duplicateChartSrc = x.chartDuplicateImage.image;
                this.chartDuplicateChange(x.id, this.chartDuplicateSize);
              }

              if (x.dateTime.date !== undefined) {
                const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
                  (y) => y.id === x.id
                );
                this.treatmentNotes.itemTypeModel[
                  itemTypeIndex
                ].dateTime.date = new Date(x.dateTime.date);
                this.treatmentNotes.itemTypeModel[
                  itemTypeIndex
                ].dateTime.time = new Date(x.dateTime.time);
              }

              if (x.dateTimeDuplicate.date !== undefined) {
                const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
                  (y) => y.id === x.id
                );
                this.treatmentNotes.itemTypeModel[
                  itemTypeIndex
                ].dateTimeDuplicate.date = new Date(x.dateTimeDuplicate.date);
                this.treatmentNotes.itemTypeModel[
                  itemTypeIndex
                ].dateTimeDuplicate.time = new Date(x.dateTimeDuplicate.time);
              }
            });

            this.tempTreatmentNotesTemplateSpeciality = [];
            this.treatmentNotes.treatmentNotesTemplateSpeciality.map((x) => {
              let m = new TreatmentNotesSpecialtyModel();
              m = x;
              m.idAndLocationId = x.specialtyId + x.locationId;
              this.tempTreatmentNotesTemplateSpeciality.push(m);
            });
            this.treatmentNotes.treatmentNotesTemplateSpeciality = this.tempTreatmentNotesTemplateSpeciality;
            this.settingsService.getAllSpecialties().subscribe((d) => {
              this.specialtyData = this.specialtyAllList = d;
              this.populateSpecialty(
                this.treatmentNotes.treatmentNotesTemplateLocation
              );
            });
            this.validate();
          });
        this.blockUI.stop();
      }
    });
    // this.onAddItem();
    this.itemTypesData = this.itemTypes;
  }

  validate() {
    if (
      this.treatmentNotes.templateName !== '' &&
      this.treatmentNotes.treatmentNotesTemplateLocation.length > 0 &&
      this.treatmentNotes.treatmentNotesTemplateSpeciality.length > 0
    ) {
      this.isSave = true;
    } else {
      this.isSave = false;
    }
  }

  onAddItem() {
    if (this.treatmentNotes.itemTypeModel.length === 0) {
      const it = this.defaultItemType(undefined);
      this.treatmentNotes.itemTypeModel.push(it);
    } else {
      this.resetOpenFlag();
      const it = this.defaultItemType(this.treatmentNotes.itemTypeModel);
      this.treatmentNotes.itemTypeModel.push(it);
    }
  }

  templateNameChange(value: string) {
    this.treatmentNotes.templateName = value;
    this.validate();
  }

  copyTemplate() {

  }

  shareTemplate() {

  }
  
  onLocationChange(locationData: any[]) {
    if (locationData.length === 0) {
      this.groupedSpecialtyData = groupBy([], [{ field: 'locationName' }]);
      this.specialtyData = [];
      this.treatmentNotes.treatmentNotesTemplateLocation = [];
    } else {
      this.populateSpecialty(locationData);

      const locationsModel: TreatmentNotesLocationModel[] = [];

      locationData.forEach(
        (l: { locationId: string; locationName: string }) => {
          const m = new TreatmentNotesLocationModel();
          m.locationId = l.locationId;
          m.locationName = l.locationName;
          locationsModel.push(m);
        }
      );
      this.treatmentNotes.treatmentNotesTemplateLocation = locationsModel;
    }
    this.validate();
  }

  onSpecialtyChange(specialtyData: any[]) {
    if (specialtyData.length > 0) {
      const specialtyModel: TreatmentNotesSpecialtyModel[] = [];

      specialtyData.forEach(
        (s: {
          locationId: string;
          specialtyId: string;
          specialtyName: string;
        }) => {
          const m = new TreatmentNotesSpecialtyModel();
          m.locationId = s.locationId;
          m.treatmentNotesId = this.itemid;
          m.specialtyId = s.specialtyId;
          m.idAndLocationId = s.specialtyId + s.locationId;
          m.specialtyName = s.specialtyName;
          specialtyModel.push(m);
        }
      );
      this.treatmentNotes.treatmentNotesTemplateSpeciality = specialtyModel;
      console.log(this.treatmentNotes.treatmentNotesTemplateSpeciality);
    } else {
      this.treatmentNotes.treatmentNotesTemplateSpeciality = [];
    }
    this.validate();
  }

  populateSpecialty(locationData: any[]) {
    this.specialtyData = [];
    locationData.forEach((e) => {
      if (this.specialtyAllList !== undefined) {
        this.specialtyAllList.forEach(
          (s: {
            specialtyLocation: any[];
            id: string;
            specialtyName: string;
          }) => {
            const sLocation = s.specialtyLocation.find(
              (x: { locationId: any }) => x.locationId === e.locationId
            );
            if (sLocation !== undefined) {
              const specialtyDataCheck = this.specialtyData.find(
                (x) => x.locationId === e.locationId && x.id === s.id
              );

              const sData = {
                specialtyId: '',
                idAndLocationId: '',
                specialtyName: '',
                locationId: '',
                locationName: '',
              };
              sData.specialtyId = s.id;
              sData.idAndLocationId = s.id + sLocation.locationId;
              sData.specialtyName =
                s.specialtyName + ' (' + sLocation.locationName + ')';
              sData.locationId = sLocation.locationId;
              sData.locationName = sLocation.locationName;
              if (specialtyDataCheck === undefined) {
                this.specialtyData.push(sData);
                this.groupedSpecialtyData = groupBy(this.specialtyData, [
                  { field: 'locationName' },
                ]);
              }
            }
          }
        );
      }
    });
  }

  resetOpenFlag() {
    this.tempItemTemplates = [];
    const itModel = this.treatmentNotes.itemTypeModel;
    itModel.forEach((x) => {
      let model = new ItemTypeModel();
      model = x;
      model.isOpen = false;
      this.tempItemTemplates.push(model);
    });
    this.treatmentNotes.itemTypeModel = this.tempItemTemplates;
  }

  defaultItemType(itemTypeModel: ItemTypeModel[]): ItemTypeModel {
    const model = new ItemTypeModel();
    let max = 0;
    if (itemTypeModel !== undefined) {
      itemTypeModel.forEach((x) => {
        if (x.id > max) {
          max = x.id;
        }
      });
      model.id = max + 1;
    } else {
      model.id = 1;
    }
    model.itemLabel = '';
    model.itemLabelDuplicate = '';
    model.itemTypeId = 0;
    model.helpText = '';
    model.helpTextDuplicate = '';
    model.showMirrored = false;
    model.isMandatory = false;
    model.isOpen = true;
    return model;
  }

  createTreatmentNotes() {
    console.log(this.treatmentNotes.treatmentNotesTemplateLocation);
    const el = document.getElementById('heading');
    this.treatmentNotes.itemType = JSON.stringify(
      this.treatmentNotes.itemTypeModel
    );

    if (this.addItem) {
      this.treatmentNotesService
        .createTreatmentNotesTemplate(this.treatmentNotes)
        .subscribe(
          () => {
            this.submitting = false;
            this.treatmentNotesService.messageConfirmation =
              'Treatment Notes Template added successfully.';
            this.router.navigate(['/settings/treatmentnotestemplate']);
            el.scrollIntoView();
            this.blockUI.stop();
          },
          () => {
            this.displayErrorMessage(
              'Error occurred while adding Treatment Notes Template, please try again.'
            );
            this.submitting = false;
            el.scrollIntoView();
            this.blockUI.stop();
          }
        );
    } else {
      this.treatmentNotes.id = this.itemid;
      this.treatmentNotesService
        .updateTreatmentNotesTemplate(this.treatmentNotes)
        .subscribe(
          () => {
            this.submitting = false;
            this.treatmentNotesService.messageConfirmation =
              'Treatment Notes Template updated successfully.';
            this.router.navigate(['/settings/treatmentnotestemplate']);
            el.scrollIntoView();
            this.blockUI.stop();
          },
          () => {
            this.displayErrorMessage(
              'Error occurred while updating Treatment Notes Template, please try again.'
            );
            this.submitting = false;
            el.scrollIntoView();
            this.blockUI.stop();
          }
        );
    }
  }

  cancel() {
    this.router.navigate(['/settings/treatmentnotestemplate']);
  }

  // Item Type Dropdown
  handleItemTypeChange(id: number, $event: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === id
    );
    this.clearItemType(itemTypeIndex);
    if ($event !== undefined) {
      const itemType = this.itemTypes.find((x) => x.id === $event);
      this.treatmentNotes.itemTypeModel[itemTypeIndex].itemTypeId = $event;
      this.treatmentNotes.itemTypeModel[itemTypeIndex].itemTypeText =
        itemType.title;
      this.populateInitialValue(itemType.title, id);
    }
  }

  handleItemTypeFilter(value: string) {
    this.itemTypesData = this.itemTypes.filter(
      (s) => s.title.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  private clearItemType(itemTypeIndex: number) {
    // this.treatmentNotes.itemTypeModel[itemTypeIndex].itemLabel = "";
    // this.treatmentNotes.itemTypeModel[itemTypeIndex].itemLabelDuplicate = "";
    this.treatmentNotes.itemTypeModel[itemTypeIndex].itemTypeId = 0;
    this.treatmentNotes.itemTypeModel[itemTypeIndex].itemTypeText = '';
    // this.treatmentNotes.itemTypeModel[itemTypeIndex].helpText = "";
    // this.treatmentNotes.itemTypeModel[itemTypeIndex].helpTextDuplicate = "";
    this.treatmentNotes.itemTypeModel[itemTypeIndex].text = '';
    this.treatmentNotes.itemTypeModel[itemTypeIndex].textDuplicate = '';
    this.treatmentNotes.itemTypeModel[itemTypeIndex].chiefComplaint = '';
    this.treatmentNotes.itemTypeModel[itemTypeIndex].instruction = '';
    this.treatmentNotes.itemTypeModel[itemTypeIndex].instructionDuplicate = '';
    this.treatmentNotes.itemTypeModel[itemTypeIndex].dropdowns = [];
    this.treatmentNotes.itemTypeModel[itemTypeIndex].duplicateDropdowns = [];
    this.treatmentNotes.itemTypeModel[itemTypeIndex].radioButtons = [];
    this.treatmentNotes.itemTypeModel[itemTypeIndex].duplicateRadioButtons = [];
    this.treatmentNotes.itemTypeModel[itemTypeIndex].checkBoxes = [];
    this.treatmentNotes.itemTypeModel[itemTypeIndex].checkBoxesDuplicate = [];
    this.treatmentNotes.itemTypeModel[itemTypeIndex].optionListStyleId = 0;
    this.treatmentNotes.itemTypeModel[itemTypeIndex].optionListSubjects = [];
    this.treatmentNotes.itemTypeModel[itemTypeIndex].optionListChoices = [];
    this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].optionListStyleDuplicateId = 0;
    this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].optionListSubjectsDuplicate = [];
    this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].optionListSubjectsDuplicate = [];
    this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].dateTime = new DateTimeModel();
    this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].dateTimeDuplicate = new DateTimeModel();
    this.treatmentNotes.itemTypeModel[itemTypeIndex].number = new NumberModel();
    this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].numberDuplicate = new NumberModel();
    this.treatmentNotes.itemTypeModel[itemTypeIndex].rangeOrScale = 0;
    this.treatmentNotes.itemTypeModel[itemTypeIndex].rangeOrScaleDuplicate = 0;
    this.treatmentNotes.itemTypeModel[itemTypeIndex].table = new TableModel();
    this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].tableDuplicate = new TableModel();
    this.treatmentNotes.itemTypeModel[itemTypeIndex].selectedDropdown = 0;
    this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].selectedDuplicateDropdown = 0;
    this.treatmentNotes.itemTypeModel[itemTypeIndex].setAsDefault = false;
    this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].setAsDuplicateDefault = false;
    this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].chartImage = new ChartModel('../../../assets/dropfileimage.png');
    this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].chartDuplicateImage = new ChartModel('../../../assets/dropfileimage.png');
    this.treatmentNotes.itemTypeModel[itemTypeIndex].vitals = new VitalsModel();
    this.treatmentNotes.itemTypeModel[itemTypeIndex].isOpen = true;
    this.treatmentNotes.itemTypeModel[itemTypeIndex].showMirrored = false;
    this.treatmentNotes.itemTypeModel[itemTypeIndex].isMandatory = false;
    this.treatmentNotes.itemTypeModel[itemTypeIndex].includeNotes = false;
    this.treatmentNotes.itemTypeModel[itemTypeIndex].isOpen = true;
  }

  populateInitialValue(title: string, id: number) {
    const itemType = this.treatmentNotes.itemTypeModel.find((x) => x.id === id);
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === id
    );
    if (title === 'Dropdown') {
      if (itemType.dropdowns.length === 0) {
        this.addDropDownOption(id);
      }
      if (
        itemType.showMirrored === true &&
        itemType.duplicateDropdowns.length === 0
      ) {
        this.addDuplicateDropDownOption(id);
      } else {
        this.treatmentNotes.itemTypeModel[
          itemTypeIndex
        ].duplicateDropdowns = [];
      }
    } else if (title === 'Radio Buttons') {
      if (itemType.radioButtons.length === 0) {
        this.addRadioButtonOption(id);
      }
      if (
        itemType.showMirrored === true &&
        itemType.duplicateRadioButtons.length === 0
      ) {
        this.addDuplicateRadioButtonOption(id);
      } else {
        this.treatmentNotes.itemTypeModel[
          itemTypeIndex
        ].duplicateRadioButtons = [];
      }
    } else if (title === 'Check Boxes') {
      if (itemType.checkBoxes.length === 0) {
        this.addCheckBox(id);
      }
      if (
        itemType.showMirrored === true &&
        itemType.checkBoxesDuplicate.length === 0
      ) {
        this.addDuplicateCheckBox(id);
      } else {
        this.treatmentNotes.itemTypeModel[
          itemTypeIndex
        ].checkBoxesDuplicate = [];
      }
    } else if (title === 'Option List') {
      if (itemType.optionListSubjects.length === 0) {
        this.addOptionListSubject(id);
      }
      if (
        itemType.showMirrored === true &&
        itemType.optionListSubjectsDuplicate.length === 0
      ) {
        this.addOptionListSubjectDuplicate(id);
      } else {
        this.treatmentNotes.itemTypeModel[
          itemTypeIndex
        ].optionListSubjectsDuplicate = [];
      }

      if (itemType.optionListChoices.length === 0) {
        this.addOptionListChoice(id);
      }
      if (
        itemType.showMirrored === true &&
        itemType.optionListChoicesDuplicate.length === 0
      ) {
        this.addOptionListChoiceDuplicate(id);
      } else {
        this.treatmentNotes.itemTypeModel[
          itemTypeIndex
        ].optionListChoicesDuplicate = [];
      }
    }
  }

  labelChange(id: number, value: string) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === id
    );
    this.treatmentNotes.itemTypeModel[itemTypeIndex].itemLabel = value;
  }

  duplicateLabelChange(id: number, value: string) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === id
    );
    this.treatmentNotes.itemTypeModel[itemTypeIndex].itemLabelDuplicate = value;
  }

  helpTextChange(id: number, value: string) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === id
    );
    this.treatmentNotes.itemTypeModel[itemTypeIndex].helpText = value;
  }

  duplicateHelpTextChange(id: number, value: string) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === id
    );
    this.treatmentNotes.itemTypeModel[itemTypeIndex].helpTextDuplicate = value;
  }

  deleteItem(id: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === id
    );
    if (itemTypeIndex !== -1) {
      this.treatmentNotes.itemTypeModel.splice(itemTypeIndex, 1);
    }
  }

  mirroredValueChange(itemTypeId: number, $event: { checked: boolean }) {
    const itemType = this.treatmentNotes.itemTypeModel.find(
      (x) => x.id === itemTypeId
    );
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    this.treatmentNotes.itemTypeModel[itemTypeIndex].showMirrored =
      $event.checked;
    this.populateInitialValue(itemType.itemTypeText, itemTypeId);
  }

  includeNotesValueChange(itemTypeId: number, $event: { checked: boolean }) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    this.treatmentNotes.itemTypeModel[itemTypeIndex].includeNotes =
      $event.checked;
    // this.populateInitialValue(itemType.itemTypeText, itemTypeId);
  }

  mandatoryValueChange(itemTypeId: number, $event: { checked: boolean }) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    this.treatmentNotes.itemTypeModel[itemTypeIndex].isMandatory =
      $event.checked;
  }

  defaultNoteChange(id: number, value: string) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === id
    );
    this.treatmentNotes.itemTypeModel[itemTypeIndex].helpText = value;
  }

  duplicateDefaultNoteChange(id: number, value: string) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === id
    );
    this.treatmentNotes.itemTypeModel[itemTypeIndex].helpTextDuplicate = value;
  }

  // Dropdown
  addDropDownOption(itemTypeId: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const model = new DropdownModel();
    let max = 0;
    if (
      itemTypeIndex >= 0 &&
      this.treatmentNotes.itemTypeModel[itemTypeIndex].dropdowns.length > 0
    ) {
      this.treatmentNotes.itemTypeModel[itemTypeIndex].dropdowns.forEach(
        (x) => {
          if (x.id > max) {
            max = x.id;
          }
        }
      );
      model.id = max + 1;
    } else {
      model.id = 1;
    }
    model.value = '';
    model.default = false;
    this.treatmentNotes.itemTypeModel[itemTypeIndex].dropdowns.push(model);
  }

  removeDropDownOption(itemTypeId: number, id: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const ddIndex = this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].dropdowns.findIndex((x) => x.id === id);
    if (ddIndex !== -1) {
      this.treatmentNotes.itemTypeModel[itemTypeIndex].dropdowns.splice(
        ddIndex,
        1
      );
    }
  }

  selectedDropDownDefault(itemTypeId: number, id: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    if (this.treatmentNotes.itemTypeModel[itemTypeIndex].dropdowns.length > 0) {
      this.treatmentNotes.itemTypeModel[itemTypeIndex].dropdowns.forEach(
        (c) => {
          const dIndex = this.treatmentNotes.itemTypeModel[
            itemTypeIndex
          ].dropdowns.findIndex((x) => x.id === c.id);
          this.treatmentNotes.itemTypeModel[itemTypeIndex].dropdowns[
            dIndex
          ].default = false;
        }
      );

      const ddIndex = this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].dropdowns.findIndex((x) => x.id === id);
      this.treatmentNotes.itemTypeModel[itemTypeIndex].dropdowns[
        ddIndex
      ].default = true;
      this.treatmentNotes.itemTypeModel[itemTypeIndex].setAsDefault = true;
      this.treatmentNotes.itemTypeModel[itemTypeIndex].selectedDropdown = id;
      console.log(this.treatmentNotes);
    }
  }

  inputDropDownValue(
    itemTypeId: number,
    id: number,
    event: { target: { value: string } }
  ) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const ddIndex = this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].dropdowns.findIndex((x) => x.id === id);
    this.treatmentNotes.itemTypeModel[itemTypeIndex].dropdowns[ddIndex].value =
      event.target.value;
  }

  // Duplicate Dropdown
  addDuplicateDropDownOption(itemTypeId: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const model = new DropdownModel();
    let max = 0;
    if (
      this.treatmentNotes.itemTypeModel[itemTypeIndex].duplicateDropdowns
        .length > 0
    ) {
      this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].duplicateDropdowns.forEach((x) => {
        if (x.id > max) {
          max = x.id;
        }
      });
      model.id = max + 1;
    } else {
      model.id = 1;
    }
    model.value = '';
    model.default = false;
    this.treatmentNotes.itemTypeModel[itemTypeIndex].duplicateDropdowns.push(
      model
    );
  }

  removeDuplicateDropDownOption(itemTypeId: number, id: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const ddIndex = this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].duplicateDropdowns.findIndex((x) => x.id === id);
    if (ddIndex !== -1) {
      this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].duplicateDropdowns.splice(ddIndex, 1);
    }
  }

  selectedDropDownDuplicateDefault(itemTypeId: number, id: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    if (
      this.treatmentNotes.itemTypeModel[itemTypeIndex].duplicateDropdowns
        .length > 0
    ) {
      this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].duplicateDropdowns.forEach((c) => {
        const dIndex = this.treatmentNotes.itemTypeModel[
          itemTypeIndex
        ].duplicateDropdowns.findIndex((x) => x.id === c.id);
        this.treatmentNotes.itemTypeModel[itemTypeIndex].duplicateDropdowns[
          dIndex
        ].default = false;
      });

      const ddIndex = this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].duplicateDropdowns.findIndex((x) => x.id === id);
      this.treatmentNotes.itemTypeModel[itemTypeIndex].duplicateDropdowns[
        ddIndex
      ].default = true;
      this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].setAsDuplicateDefault = true;
      this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].selectedDuplicateDropdown = id;

      console.log(this.treatmentNotes);
    }
  }

  inputDropDownDuplicateValue(
    itemTypeId: number,
    id: number,
    event: { target: { value: string } }
  ) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const ddIndex = this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].duplicateDropdowns.findIndex((x) => x.id === id);
    this.treatmentNotes.itemTypeModel[itemTypeIndex].duplicateDropdowns[
      ddIndex
    ].value = event.target.value;
  }

  // Radio Button
  addRadioButtonOption(itemTypeId: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const model = new RadioButtonModel();
    let max = 0;
    if (
      this.treatmentNotes.itemTypeModel[itemTypeIndex].radioButtons.length > 0
    ) {
      this.treatmentNotes.itemTypeModel[itemTypeIndex].radioButtons.forEach(
        (x) => {
          if (x.id > max) {
            max = x.id;
          }
        }
      );
      model.id = max + 1;
    } else {
      model.id = 1;
    }
    model.value = '';
    model.default = false;
    this.treatmentNotes.itemTypeModel[itemTypeIndex].radioButtons.push(model);
  }

  removeRadioButtonOption(itemTypeId: number, id: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const ddIndex = this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].radioButtons.findIndex((x) => x.id === id);
    if (ddIndex !== -1) {
      this.treatmentNotes.itemTypeModel[itemTypeIndex].radioButtons.splice(
        ddIndex,
        1
      );
    }
  }

  selectedRadioButtonDefault(itemTypeId: number, id: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    if (
      this.treatmentNotes.itemTypeModel[itemTypeIndex].radioButtons.length > 0
    ) {
      this.treatmentNotes.itemTypeModel[itemTypeIndex].radioButtons.forEach(
        (c) => {
          const dIndex = this.treatmentNotes.itemTypeModel[
            itemTypeIndex
          ].radioButtons.findIndex((x) => x.id === c.id);
          this.treatmentNotes.itemTypeModel[itemTypeIndex].radioButtons[
            dIndex
          ].default = false;
        }
      );

      const ddIndex = this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].radioButtons.findIndex((x) => x.id === id);
      this.treatmentNotes.itemTypeModel[itemTypeIndex].radioButtons[
        ddIndex
      ].default = true;
      this.treatmentNotes.itemTypeModel[itemTypeIndex].setAsDefault = true;
      this.treatmentNotes.itemTypeModel[itemTypeIndex].selectedDropdown = id;
      console.log(this.treatmentNotes);
    }
  }

  inputRadioButtonValue(
    itemTypeId: number,
    id: number,
    event: { target: { value: string } }
  ) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const ddIndex = this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].radioButtons.findIndex((x) => x.id === id);
    this.treatmentNotes.itemTypeModel[itemTypeIndex].radioButtons[
      ddIndex
    ].value = event.target.value;
  }

  // Duplicate Radio Button
  addDuplicateRadioButtonOption(itemTypeId: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const model = new RadioButtonModel();
    let max = 0;
    if (
      this.treatmentNotes.itemTypeModel[itemTypeIndex].duplicateRadioButtons
        .length > 0
    ) {
      this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].duplicateRadioButtons.forEach((x) => {
        if (x.id > max) {
          max = x.id;
        }
      });
      model.id = max + 1;
    } else {
      model.id = 1;
    }
    model.value = '';
    model.default = false;
    this.treatmentNotes.itemTypeModel[itemTypeIndex].duplicateRadioButtons.push(
      model
    );
  }

  removeDuplicateRadioButtonOption(itemTypeId: number, id: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const ddIndex = this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].duplicateRadioButtons.findIndex((x) => x.id === id);
    if (ddIndex !== -1) {
      this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].duplicateRadioButtons.splice(ddIndex, 1);
    }
  }

  selectedRadioButtonDuplicateDefault(itemTypeId: number, id: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    if (
      this.treatmentNotes.itemTypeModel[itemTypeIndex].duplicateRadioButtons
        .length > 0
    ) {
      this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].duplicateRadioButtons.forEach((c) => {
        const dIndex = this.treatmentNotes.itemTypeModel[
          itemTypeIndex
        ].duplicateRadioButtons.findIndex((x) => x.id === c.id);
        this.treatmentNotes.itemTypeModel[itemTypeIndex].duplicateRadioButtons[
          dIndex
        ].default = false;
      });

      const ddIndex = this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].duplicateRadioButtons.findIndex((x) => x.id === id);
      this.treatmentNotes.itemTypeModel[itemTypeIndex].duplicateRadioButtons[
        ddIndex
      ].default = true;
      this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].setAsDuplicateDefault = true;
      this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].selectedDuplicateDropdown = id;

      console.log(this.treatmentNotes);
    }
  }

  inputRadioButtonDuplicateValue(
    itemTypeId: number,
    id: number,
    event: { target: { value: string } }
  ) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const ddIndex = this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].duplicateRadioButtons.findIndex((x) => x.id === id);
    this.treatmentNotes.itemTypeModel[itemTypeIndex].duplicateRadioButtons[
      ddIndex
    ].value = event.target.value;
  }

  // Check Box
  addCheckBox(itemTypeId: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const model = new CheckBoxModel();
    let max = 0;
    if (
      this.treatmentNotes.itemTypeModel[itemTypeIndex].checkBoxes.length > 0
    ) {
      this.treatmentNotes.itemTypeModel[itemTypeIndex].checkBoxes.forEach(
        (x) => {
          if (x.id > max) {
            max = x.id;
          }
        }
      );
      model.id = max + 1;
    } else {
      model.id = 1;
    }
    model.value = '';
    model.default = false;
    this.treatmentNotes.itemTypeModel[itemTypeIndex].checkBoxes.push(model);
  }

  removeCheckBox(itemTypeId: number, id: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const ddIndex = this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].checkBoxes.findIndex((x) => x.id === id);
    if (ddIndex !== -1) {
      this.treatmentNotes.itemTypeModel[itemTypeIndex].checkBoxes.splice(
        ddIndex,
        1
      );
    }
  }

  selectedCheckBoxDefault(itemTypeId: number, id: number, $event) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    if (
      this.treatmentNotes.itemTypeModel[itemTypeIndex].checkBoxes.length > 0
    ) {
      const ddIndex = this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].checkBoxes.findIndex((x) => x.id === id);
      this.treatmentNotes.itemTypeModel[itemTypeIndex].checkBoxes[
        ddIndex
      ].default = $event;
      this.treatmentNotes.itemTypeModel[itemTypeIndex].setAsDefault = true;
      this.treatmentNotes.itemTypeModel[itemTypeIndex].selectedDropdown = id;
      console.log(this.treatmentNotes);
    }
  }

  inputCheckBoxValue(
    itemTypeId: number,
    id: number,
    event: { target: { value: string } }
  ) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const ddIndex = this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].checkBoxes.findIndex((x) => x.id === id);
    this.treatmentNotes.itemTypeModel[itemTypeIndex].checkBoxes[ddIndex].value =
      event.target.value;
  }

  // Duplicate Check Box
  addDuplicateCheckBox(itemTypeId: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const model = new CheckBoxModel();
    let max = 0;
    if (
      this.treatmentNotes.itemTypeModel[itemTypeIndex].checkBoxesDuplicate
        .length > 0
    ) {
      this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].checkBoxesDuplicate.forEach((x) => {
        if (x.id > max) {
          max = x.id;
        }
      });
      model.id = max + 1;
    } else {
      model.id = 1;
    }
    model.value = '';
    model.default = false;
    this.treatmentNotes.itemTypeModel[itemTypeIndex].checkBoxesDuplicate.push(
      model
    );
  }

  removeDuplicateCheckBox(itemTypeId: number, id: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const ddIndex = this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].checkBoxesDuplicate.findIndex((x) => x.id === id);
    if (ddIndex !== -1) {
      this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].checkBoxesDuplicate.splice(ddIndex, 1);
    }
  }

  selectedCheckBoxDuplicateDefault(itemTypeId: number, id: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    if (
      this.treatmentNotes.itemTypeModel[itemTypeIndex].checkBoxesDuplicate
        .length > 0
    ) {
      const ddIndex = this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].checkBoxesDuplicate.findIndex((x) => x.id === id);
      this.treatmentNotes.itemTypeModel[itemTypeIndex].checkBoxesDuplicate[
        ddIndex
      ].default = true;
      this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].setAsDuplicateDefault = true;
      this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].selectedDuplicateDropdown = id;

      console.log(this.treatmentNotes);
    }
  }

  inputCheckBoxDuplicateValue(
    itemTypeId: number,
    id: number,
    event: { target: { value: string } }
  ) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const ddIndex = this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].checkBoxesDuplicate.findIndex((x) => x.id === id);
    this.treatmentNotes.itemTypeModel[itemTypeIndex].checkBoxesDuplicate[
      ddIndex
    ].value = event.target.value;
  }

  // Option List
  addOptionListSubject(itemTypeId: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const model = new KeyValueModel();
    let max = 0;
    if (
      this.treatmentNotes.itemTypeModel[itemTypeIndex].optionListSubjects
        .length > 0
    ) {
      this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].optionListSubjects.forEach((x) => {
        if (x.id > max) {
          max = x.id;
        }
      });
      model.id = max + 1;
    } else {
      model.id = 1;
    }
    model.value = '';
    this.treatmentNotes.itemTypeModel[itemTypeIndex].optionListSubjects.push(
      model
    );
  }

  optionListStylesChange(itemTypeId: number, $event: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    this.treatmentNotes.itemTypeModel[itemTypeIndex].optionListStyleId = $event;
  }

  removeOptionListSubject(itemTypeId: number, id: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const ddIndex = this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].optionListSubjects.findIndex((x) => x.id === id);
    if (ddIndex !== -1) {
      this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].optionListSubjects.splice(ddIndex, 1);
    }
  }

  inputOptionListSubjectValue(
    itemTypeId: number,
    id: number,
    event: { target: { value: string } }
  ) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const ddIndex = this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].optionListSubjects.findIndex((x) => x.id === id);
    this.treatmentNotes.itemTypeModel[itemTypeIndex].optionListSubjects[
      ddIndex
    ].value = event.target.value;
  }

  addOptionListChoice(itemTypeId: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const model = new KeyValueModel();
    let max = 0;
    if (
      this.treatmentNotes.itemTypeModel[itemTypeIndex].optionListChoices
        .length > 0
    ) {
      this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].optionListChoices.forEach((x) => {
        if (x.id > max) {
          max = x.id;
        }
      });
      model.id = max + 1;
    } else {
      model.id = 1;
    }
    model.value = '';
    this.treatmentNotes.itemTypeModel[itemTypeIndex].optionListChoices.push(
      model
    );
  }

  removeOptionListChoice(itemTypeId: number, id: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const ddIndex = this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].optionListChoices.findIndex((x) => x.id === id);
    if (ddIndex !== -1) {
      this.treatmentNotes.itemTypeModel[itemTypeIndex].optionListChoices.splice(
        ddIndex,
        1
      );
    }
  }

  inputOptionListChoiceValue(
    itemTypeId: number,
    id: number,
    event: { target: { value: string } }
  ) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const ddIndex = this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].optionListChoices.findIndex((x) => x.id === id);
    this.treatmentNotes.itemTypeModel[itemTypeIndex].optionListChoices[
      ddIndex
    ].value = event.target.value;
  }

  // Duplicate Option List
  addOptionListSubjectDuplicate(itemTypeId: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const model = new KeyValueModel();
    let max = 0;
    if (
      this.treatmentNotes.itemTypeModel[itemTypeIndex]
        .optionListSubjectsDuplicate.length > 0
    ) {
      this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].optionListSubjectsDuplicate.forEach((x) => {
        if (x.id > max) {
          max = x.id;
        }
      });
      model.id = max + 1;
    } else {
      model.id = 1;
    }
    model.value = '';
    this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].optionListSubjectsDuplicate.push(model);
  }

  optionListStylesDuplicateChange(itemTypeId: number, $event: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].optionListStyleDuplicateId = $event;
  }

  removeOptionListSubjectDuplicate(itemTypeId: number, id: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const ddIndex = this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].optionListSubjectsDuplicate.findIndex((x) => x.id === id);
    if (ddIndex !== -1) {
      this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].optionListSubjectsDuplicate.splice(ddIndex, 1);
    }
  }

  inputOptionListSubjectDuplicateValue(
    itemTypeId: number,
    id: number,
    event: { target: { value: string } }
  ) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const ddIndex = this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].optionListSubjectsDuplicate.findIndex((x) => x.id === id);
    this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].optionListSubjectsDuplicate[ddIndex].value = event.target.value;
  }

  addOptionListChoiceDuplicate(itemTypeId: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const model = new KeyValueModel();
    let max = 0;
    if (
      this.treatmentNotes.itemTypeModel[itemTypeIndex]
        .optionListChoicesDuplicate.length > 0
    ) {
      this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].optionListChoicesDuplicate.forEach((x) => {
        if (x.id > max) {
          max = x.id;
        }
      });
      model.id = max + 1;
    } else {
      model.id = 1;
    }
    model.value = '';
    this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].optionListChoicesDuplicate.push(model);
  }

  removeOptionListChoiceDuplicate(itemTypeId: number, id: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const ddIndex = this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].optionListChoicesDuplicate.findIndex((x) => x.id === id);
    if (ddIndex !== -1) {
      this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].optionListChoicesDuplicate.splice(ddIndex, 1);
    }
  }

  inputOptionListChoiceDuplicateValue(
    itemTypeId: number,
    id: number,
    event: { target: { value: string } }
  ) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const ddIndex = this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].optionListChoicesDuplicate.findIndex((x) => x.id === id);
    this.treatmentNotes.itemTypeModel[itemTypeIndex].optionListChoicesDuplicate[
      ddIndex
    ].value = event.target.value;
  }

  // Table
  tableRowChange(itemTypeId: number, $event: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    this.treatmentNotes.itemTypeModel[itemTypeIndex].table.rowHeader = [];
    this.treatmentNotes.itemTypeModel[itemTypeIndex].table.rows = $event;
    for (let i = 1; i <= $event; i++) {
      const m = new KeyValueModel();
      m.id = i;
      this.treatmentNotes.itemTypeModel[itemTypeIndex].table.rowHeader.push(m);
    }
  }

  tableColumnChange(itemTypeId: number, $event: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    this.treatmentNotes.itemTypeModel[itemTypeIndex].table.columnHeader = [];
    this.treatmentNotes.itemTypeModel[itemTypeIndex].table.columns = $event;
    for (let i = 1; i <= $event; i++) {
      const m = new KeyValueModel();
      m.id = i;
      this.treatmentNotes.itemTypeModel[itemTypeIndex].table.columnHeader.push(
        m
      );
    }
  }

  tableRowHeaderInput(
    itemTypeId: number,
    rowId: number,
    event: { target: { value: string } }
  ) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const rowIndex = this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].table.rowHeader.findIndex((x) => x.id === rowId);
    this.treatmentNotes.itemTypeModel[itemTypeIndex].table.rowHeader[
      rowIndex
    ].id = rowId;
    this.treatmentNotes.itemTypeModel[itemTypeIndex].table.rowHeader[
      rowIndex
    ].value = event.target.value;
  }

  tableColumnHeaderInput(
    itemTypeId: number,
    columnId: number,
    event: { target: { value: string } }
  ) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const columnIndex = this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].table.columnHeader.findIndex((x) => x.id === columnId);
    this.treatmentNotes.itemTypeModel[itemTypeIndex].table.columnHeader[
      columnIndex
    ].id = columnId;
    this.treatmentNotes.itemTypeModel[itemTypeIndex].table.columnHeader[
      columnIndex
    ].value = event.target.value;
  }

  // Duplicate Table
  tableRowDuplicateChange(itemTypeId: number, $event: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].tableDuplicate.rowHeader = [];
    this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].tableDuplicate.rows = $event;
    for (let i = 1; i <= $event; i++) {
      const m = new KeyValueModel();
      m.id = i;
      this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].tableDuplicate.rowHeader.push(m);
    }
  }

  tableColumnDuplicateChange(itemTypeId: number, $event: number) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].tableDuplicate.columnHeader = [];
    this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].tableDuplicate.columns = $event;
    for (let i = 1; i <= $event; i++) {
      const m = new KeyValueModel();
      m.id = i;
      this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].tableDuplicate.columnHeader.push(m);
    }
  }

  tableRowHeaderDuplicateInput(
    itemTypeId: number,
    rowId: number,
    event: { target: { value: string } }
  ) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const rowIndex = this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].tableDuplicate.rowHeader.findIndex((x) => x.id === rowId);
    this.treatmentNotes.itemTypeModel[itemTypeIndex].tableDuplicate.rowHeader[
      rowIndex
    ].id = rowId;
    this.treatmentNotes.itemTypeModel[itemTypeIndex].tableDuplicate.rowHeader[
      rowIndex
    ].value = event.target.value;
  }

  tableColumnHeaderDuplicateInput(
    itemTypeId: number,
    columnId: number,
    event: { target: { value: string } }
  ) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    const columnIndex = this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].tableDuplicate.columnHeader.findIndex((x) => x.id === columnId);
    this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].tableDuplicate.columnHeader[columnIndex].id = columnId;
    this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].tableDuplicate.columnHeader[columnIndex].value = event.target.value;
  }

  // Date Time
  onDateChange(itemTypeId: number, $event: Date) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    if (
      this.treatmentNotes.itemTypeModel[itemTypeIndex].dateTime === undefined
    ) {
      const m = new DateTimeModel();
      m.date = $event;
      this.treatmentNotes.itemTypeModel[itemTypeIndex].dateTime = m;
    } else {
      this.treatmentNotes.itemTypeModel[itemTypeIndex].dateTime.date = $event;
    }
  }

  // Date Time
  onTimeChange(itemTypeId: number, $event: Date) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    if (
      this.treatmentNotes.itemTypeModel[itemTypeIndex].dateTime === undefined
    ) {
      const m = new DateTimeModel();
      m.time = $event;
      this.treatmentNotes.itemTypeModel[itemTypeIndex].dateTime = m;
    } else {
      this.treatmentNotes.itemTypeModel[itemTypeIndex].dateTime.time = $event;
    }
  }

  // Duplicate Date Time
  onDuplicateDateChange(itemTypeId: number, $event: Date) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    if (
      this.treatmentNotes.itemTypeModel[itemTypeIndex].dateTimeDuplicate ===
      undefined
    ) {
      const m = new DateTimeModel();
      m.date = $event;
      this.treatmentNotes.itemTypeModel[itemTypeIndex].dateTimeDuplicate = m;
    } else {
      this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].dateTimeDuplicate.date = $event;
    }
  }

  // Duplicate Date Time
  onDuplicateTimeChange(itemTypeId: number, $event: Date) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    if (
      this.treatmentNotes.itemTypeModel[itemTypeIndex].dateTimeDuplicate ===
      undefined
    ) {
      const m = new DateTimeModel();
      m.time = $event;
      this.treatmentNotes.itemTypeModel[itemTypeIndex].dateTimeDuplicate = m;
    } else {
      this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].dateTimeDuplicate.time = $event;
    }
  }

  // Text
  textChange(itemTypeId: number, value: string) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    this.treatmentNotes.itemTypeModel[itemTypeIndex].text = value;
  }

  // Duplicate Text
  textDuplicateChange(itemTypeId: number, value: string) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    this.treatmentNotes.itemTypeModel[itemTypeIndex].textDuplicate = value;
  }

  // Number
  numberChange(itemTypeId: number, value: number, type: string) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    if (type === 'Minimum') {
      this.treatmentNotes.itemTypeModel[itemTypeIndex].number.minimum = value;
    } else if (type === 'Maximum') {
      this.treatmentNotes.itemTypeModel[itemTypeIndex].number.maximum = value;
    } else if (type === 'Default') {
      this.treatmentNotes.itemTypeModel[itemTypeIndex].number.default = value;
    } else if (type === 'Minimum Duplicate') {
      this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].numberDuplicate.minimum = value;
    } else if (type === 'Maximum Duplicate') {
      this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].numberDuplicate.maximum = value;
    } else if (type === 'Default Duplicate') {
      this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].numberDuplicate.default = value;
    }
  }

  formatLabel(value: number | null) {
    if (!value) {
      return 0;
    }
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return value;
  }

  // Range or Scale
  rangeOrScaleChange(itemTypeId: number, rangeValue: { value: string }) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    this.rangeOrScale = [];
    if (rangeValue.value === '1') {
      for (let i = 0; i < 5; i++) {
        this.rangeOrScale[i] = i * 20;
      }
      this.rangeOrScaleMax = 5;
    } else {
      for (let i = 0; i < 10; i++) {
        this.rangeOrScale[i] = i * 10;
      }
      this.rangeOrScaleMax = 10;
    }
    this.treatmentNotes.itemTypeModel[itemTypeIndex].rangeOrScale = Number(
      rangeValue.value
    );
  }

  // Duplicate Range or Scale
  rangeOrScaleDuplicateChange(
    itemTypeId: number,
    rangeValue: { value: string }
  ) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    this.rangeOrScaleDuplicate = [];
    if (rangeValue.value === '1') {
      for (let i = 0; i < 5; i++) {
        this.rangeOrScaleDuplicate[i] = i * 20;
      }
      this.rangeOrScaleDuplicateMax = 5;
    } else {
      for (let i = 0; i < 10; i++) {
        this.rangeOrScaleDuplicate[i] = i * 10;
      }
      this.rangeOrScaleDuplicateMax = 10;
    }
    this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].rangeOrScaleDuplicate = Number(rangeValue.value);
  }

  // Chart
  parentChartCallBack(itemTypeId: number, $event: { src: string }) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    this.treatmentNotes.itemTypeModel[itemTypeIndex].chartImage.image =
      $event.src;
    this.chartChange(itemTypeId, this.chartSize);
  }

  chartChange(itemTypeId: number, sizeType: string) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );

    this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].chartImage.imageSize = this.chartSize = sizeType;
    let ratio = 0;
    let quality = 0;
    if (sizeType === 'Small') {
      ratio = 50;
      quality = 100;
    } else if (sizeType === 'Medium') {
      ratio = 70;
      quality = 100;
    } else {
      ratio = 100;
      quality = 100;
    }
    const image = this.treatmentNotes.itemTypeModel[itemTypeIndex].chartImage
      .image;
    this.imageCompress
      .compressFile(image, -1, ratio, quality)
      .then((result) => {
        this.originalImage = result;
      });
  }

  // Chart Duplicate
  chartDuplicateChange(itemTypeId: number, sizeType: string) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].chartDuplicateImage.imageSize = this.chartDuplicateSize = sizeType;

    let ratio = 0;
    let quality = 0;
    if (sizeType === 'Small') {
      ratio = 50;
      quality = 100;
    } else if (sizeType === 'Medium') {
      ratio = 70;
      quality = 100;
    } else {
      ratio = 100;
      quality = 100;
    }
    const image = this.treatmentNotes.itemTypeModel[itemTypeIndex]
      .chartDuplicateImage.image;
    this.imageCompress
      .compressFile(image, -1, ratio, quality)
      .then((result) => {
        this.originalDuplicateImage = result;
      });
  }

  parentChartDuplicateCallBack(itemTypeId: number, $event: { src: string }) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    this.treatmentNotes.itemTypeModel[itemTypeIndex].chartDuplicateImage.image =
      $event.src;
    this.chartDuplicateChange(itemTypeId, this.chartDuplicateSize);
  }

  // File Attachment
  fileDescriptionChange(itemTypeId: number, value: string) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    this.treatmentNotes.itemTypeModel[itemTypeIndex].fileDescription = value;
  }

  // File Attachment Duplicate
  fileDescriptionDuplicateChange(itemTypeId: number, value: string) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].fileDuplicateDescription = value;
  }

  // Instruction
  instructionChange(itemTypeId: number, value: string) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    this.treatmentNotes.itemTypeModel[itemTypeIndex].instruction = value;
  }

  // Instruction Duplicate
  instructionDuplicateChange(itemTypeId: number, value: string) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    this.treatmentNotes.itemTypeModel[
      itemTypeIndex
    ].instructionDuplicate = value;
  }

  // Chief Complaint
  chiefComplaintChange(itemTypeId: number, value: string) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    this.treatmentNotes.itemTypeModel[itemTypeIndex].chiefComplaint = value;
  }

  // Vitals
  vitalsChange(itemTypeId: number, value: string) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );
    this.treatmentNotes.itemTypeModel[itemTypeIndex].vitals = new VitalsModel();
    if (value === 'Metric') {
      this.unitOfMeasurement = this.metric;
    } else {
      this.unitOfMeasurement = this.imperial;
    }
    this.treatmentNotes.itemTypeModel[itemTypeIndex].vitals.vitalType = value;
  }

  unitOfMeasurementChange(
    itemTypeId: number,
    value: { checked: boolean },
    vitalId: string
  ) {
    const itemTypeIndex = this.treatmentNotes.itemTypeModel.findIndex(
      (x) => x.id === itemTypeId
    );

    if (value.checked === true) {
      this.treatmentNotes.itemTypeModel[itemTypeIndex].vitals.measurements.push(
        vitalId
      );
    } else {
      const index = this.treatmentNotes.itemTypeModel[
        itemTypeIndex
      ].vitals.measurements.indexOf(vitalId);
      if (index !== -1) {
        this.treatmentNotes.itemTypeModel[
          itemTypeIndex
        ].vitals.measurements.splice(index, 1);
      }
    }
  }
}
