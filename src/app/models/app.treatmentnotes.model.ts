export class TreatmentNotesModel {
  id: string;
  parentBusinessId: string;
  templateName: string;
  isStatus: boolean;
  itemType: string;
  treatmentNotesTemplateLocation: TreatmentNotesLocationModel[] = [];
  treatmentNotesTemplateSpeciality: TreatmentNotesSpecialtyModel[] = [];
  itemTypeModel: ItemTypeModel[] = [];
}

export class ItemTypeModel {
  id: number;
  itemLabel: string;
  itemLabelDuplicate: string;
  itemTypeId: number;
  itemTypeText: string;
  setAsDefault: boolean;
  setAsDuplicateDefault: boolean;
  selectedDropdown: number;
  selectedDuplicateDropdown: number;
  dropdowns: DropdownModel[] = [];
  duplicateDropdowns: DropdownModel[] = [];
  radioButtons: RadioButtonModel[] = [];
  duplicateRadioButtons: RadioButtonModel[] = [];
  checkBoxes: CheckBoxModel[] = [];
  checkBoxesDuplicate: CheckBoxModel[] = [];
  optionListStyleId: number;
  optionListSubjects: KeyValueModel[] = [];
  optionListChoices: KeyValueModel[] = [];
  optionListStyleDuplicateId: number;
  optionListSubjectsDuplicate: KeyValueModel[] = [];
  optionListChoicesDuplicate: KeyValueModel[] = [];
  number: NumberModel;
  numberDuplicate: NumberModel;
  rangeOrScale: number;
  rangeOrScaleDuplicate: number;
  dateTime: DateTimeModel;
  dateTimeDuplicate: DateTimeModel;
  table: TableModel;
  tableDuplicate: TableModel;
  text: string;
  textDuplicate: string;
  fileDescription: string;
  fileDuplicateDescription: string;
  instruction: string;
  instructionDuplicate: string;
  chartImage: ChartModel;
  chartDuplicateImage: ChartModel;
  vitals: VitalsModel;
  chiefComplaint: string;
  helpText: string;
  helpTextDuplicate: string;
  showMirrored: boolean;
  isMandatory: boolean;
  isOpen: boolean;
  includeNotes: boolean;
}

export class DropdownModel {
  id: number;
  value: string;
  default: boolean;
}

export class RadioButtonModel {
  id: number;
  value: string;
  default: boolean;
}

export class CheckBoxModel {
  id: number;
  value: string;
  textValue: string;
  default: boolean;
}

export class KeyValueModel {
  id: number;
  value: string;
}

export class TableModel {
  id: number;
  columns: number;
  rows: number;
  rowHeader: KeyValueModel[] = [];
  columnHeader: KeyValueModel[] = [];
}

export class DateTimeModel {
  date: Date;
  time: Date;
}

export class NumberModel {
  minimum: number;
  maximum: number;
  default: number;
}

export class ChartModel {
  constructor(public img: string) {
    this.image = img;
  }
  image: string;
  imageSize: string;
}

export class VitalsModel {
  vitalType: string;
  measurements: string[] = [];
}

export class TreatmentNotesLocationModel {
  id: string;
  treatmentNotesId?: string;
  locationId: string;
  locationName: string;
  isStatus?: boolean;
}

export class TreatmentNotesSpecialtyModel {
  id: string;
  treatmentNotesId?: string;
  locationId: string;
  specialtyId: string;
  idAndLocationId: string;
  specialtyName: string;
  isStatus?: boolean;
}

export class LocationModel {
  locationId: string;
  locationName: string;
}

export class SpecialtyModel {
  locationId: string;
  specialtyId: string;
  idAndLocationId: string;
  specialtyName: string;
}
