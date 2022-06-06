import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { PatientService } from "src/app/services/app.patient.service";
import {
  EligibleTreatmentNoteTemplatesModel,
  PatientModel,
  PatientTreatmentNotesModel,
  PractitonerLocationSpecialityModel,
  TemplateNameList,
} from "src/app/models/app.patient.model";
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material'
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/dt-format';
import { AppState } from "src/app/app.state";
import { BusinessService } from "src/app/services/app.business.service";
import { SettingsService } from "src/app/services/app.settings.service";
import { BlockUI, NgBlockUI } from "ng-block-ui";
import { ImageSnippet } from 'src/app/models/app.misc';
@Component({
  selector: 'app-patient-treatmentnotes',
  templateUrl: './patient-treatmentnotes.component.html',
  styleUrls: ['./patient-treatmentnotes.component.css'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class PatientTreatmentnotesComponent implements OnInit {
  selectedFile?: ImageSnippet;
  file: File;
  traetmentnotesForm: FormGroup;
  treatmentTitle = '';
  treatmentRouteLink = '';
  treatmentRouteName = '';
  treatmentDescription = '';
  @Input() patientId: string;
  selectedOption = '1';
  IsShow: boolean = false;
  mytemplateshow: boolean = true;
  casetstaus: string;
  pendingcase: string = 'pending';
  @BlockUI() blockUI: NgBlockUI;
  apperance = "outline";


  model = {
    textnumber1: null,
    textnumber2: null,
    numberhelptext: null,
    textnumbertitle: null,
    textdroupdowntitle: null,
    droupdownhelptext: null,
    droupdownvalue: [],
    textradiotitle: null,
    radiohelptext: null,
    textcheckboxtitle: null,
    checkboxhelptext: null,
    textrangetitle: null,
    rangehelptext: null,
    rangenumber1: null,
    rangenumber2: null,
    rangedefaultnumber: null,
    textoptionlisttitle: null,
    optionlisthelptext: null,
    textoptionlisttitles: null,
    texttabledatatitle: null,
    tabledatahelptext: null,
    textattachfiletitle: null,
    textinstructiontitle: null,
  }

  lstcaseName: any;
  lstfiltercase: any;
  lstnumber: any;
  lstdroupdown: any;
  lsteditoptions: any;
  lstradio: any;
  lstcheckbox: any;
  lstoptiondata: any;
  lsttrows: any;
  lsttcolumn: any;
  lstpindata: any = [];
  showprogressbar: boolean = true;
  showdraft: boolean = false;
  copttext: boolean = false;

  // Text area
  textareatitle: string;
  newAttribute: any = {};
  fieldArray: Array<any> = [];
  shomantextarea: boolean = false;
  showcopytextarea: boolean = false;
  showTextarea: boolean = true;

  // Heading Area
  openheadingeditform: boolean = false;
  showheadingarea: boolean = false;
  showcopyheading: boolean = false;
  textheadingtitle: string
  copytextarea: string;
  headingcopytitle: string;
  headingcopydatetime: string;
  newAttribute4: any = {};
  fieldArray4: Array<any> = [];

  // Date time Area
  opendatetimeeditform: boolean = false;
  showdatetimearea: boolean = false;
  showcopydatetime: boolean = false;
  shomandatetime: boolean = false;
  textdfatetimetitle: string;
  newAttribute5: any = {};
  fieldArray5: Array<any> = [];

  // Number area
  opennumbereditform: boolean = false;
  shownumber: boolean = false;
  showcopynumber: boolean = false;
  shomannumber: boolean = false;
  textnumbertitle: string;
  newAttribute6: any = {};
  fieldArray6: Array<any> = [];
  numberhelptextd: string;
  numbercopytitle: string;

  // Droupdown 
  opendroupdwoneditform: boolean = false;
  droupdownhelptextd: string;
  droupdowntext: string;
  showdroupdown: boolean = false;
  showcopydroupdown: boolean = false;
  textdroupdowntitle: string;
  droupdowntitle: string;
  newAttribute7: any = {};
  fieldArray7: Array<any> = [];
  droupdownattribute: any = [];
  droupdownarray: Array<any> = [];

  // Radio Button Area
  openradioeditform: boolean = false;
  showradio: boolean = false;
  showcopyradio: boolean = false;
  shomanradio: boolean = false;
  radiohelptextd: string;
  radiotext: string;
  radiocopytitle: string;
  radioattribute: any = [];
  newAttribute8: any = {};
  fieldArray8: Array<any> = [];
  radioarray: Array<any> = [];

  // CheckBox Area
  opencheckboxeditform: boolean = false;
  showcheckbox: boolean = false;
  showcopycheckbox: boolean = false;
  shomancheckbox: boolean = false;
  showincludenoted: boolean = false;
  checkboxhelptextd: string;
  checkboxtext: string;
  checkboxcopytitle: string;
  checkboxattribute: any = [];
  newAttribute9: any = {};
  fieldArray9: Array<any> = [];
  checkboxarray: Array<any> = [];

  // Cheif Area
  showChiefarea: boolean = false;
  openChiedform: boolean = false;
  chieftmandtory: boolean = false;
  textareacheiftitle: string;
  newAttribute1: any = {};
  fieldArray1: Array<any> = [];

  // Vital Area
  showvitalarea: boolean = false;
  openvitaleditform: boolean = false;
  showopticalarea: boolean = false;
  showMetric: boolean = true;
  showImperial: boolean = false;
  showeImperial: boolean = false;
  shomanvitals: boolean = false;
  textvitaltitle: string;
  public modeselect = 'Metric';
  newAttribute2: any = {};
  fieldArray2: Array<any> = [];

  // Optical Area
  textopticaltitle: string;
  newAttribute3: any = {};
  fieldArray3: Array<any> = [];

  // Range Scale
  max = 5;
  min = 0;
  showTicks = false;
  step = 1;
  value = 0;
  tickInterval = 1;
  displayvalue: number;
  openrangeeditform: boolean = false;
  showrange: boolean = false;
  showcopyrange: boolean = false;
  rangehelptextd: string;
  rangetext: string;
  rangecopytitle: string;
  newAttribute10: any = {};
  fieldArray10: Array<any> = [];

  // Option List
  abcvalue: string;
  showoptionlist: boolean = false;
  openoptionlisteditform: boolean = false;
  showcopyopenoptionlist: boolean = false;
  showcopyoptionlist: boolean = false;
  buttonselection: boolean = true;
  checkboxselection: boolean = false;
  droupdownselection: boolean = false;
  radioselection: boolean = false;
  optionlisthelptextd: string;
  optionlisttext: string;
  optionlistcopytitle: string;
  shoabcdata: string;
  newAttribute11: any = {};
  fieldArray11: Array<any> = [];
  optionlistarray: Array<any> = [];
  optionlistattribute: any = [];
  optionlistchoicearray: any = [];
  optionlistarrayattribute: Array<any> = [];

  // Table Data
  showtable: boolean = false;
  rowtext: boolean = false;
  columntext: boolean = false;
  tabledatahelptextd: string;
  tabledatatext: string;
  rowslength: any = [];
  columnlength: any = [];
  tablerows: any = [];
  tablecolumn: any = [];
  newAttribute12: any = {};
  fieldArray12: Array<any> = [];
  opentabledataeditform: boolean = false;

  // File Attachment data
  showattachfile: boolean = false;
  openatatchfileditform: boolean = false;
  atchfiltmandtory: boolean = false;
  newAttribute13: any = {};
  fieldArray13: Array<any> = [];

  // Instruction
  openinstructioneditform: boolean = false;
  showinstructionfile: boolean = false;
  newAttribute14: any = {};
  fieldArray14: Array<any> = [];

  // Chief Complaint
  openchiefeditform: boolean = false;
  showchieffile: boolean = false;
  shomanchief: boolean = false;
  newAttribute15: any = {};
  fieldArray15: Array<any> = [];
  chieftitle: string;

  // Vitals
  showvitalsarea: boolean = false;
  vitalstitle: string;
  newAttribute16: any = {};
  fieldArray16: Array<any> = [];
  showmatric: boolean = false;
  showimperial: boolean = false;
  degreesign: any;

  // Chart Data
  showChart: boolean = false;
  newAttribute17: any = {};
  fieldArray17: Array<any> = [];

  // Spine Data
  showSpineChart: boolean = false;
  newAttribute18: any = {};
  fieldArray18: Array<any> = [];

  addNewtemplateshow: boolean = false;
  IsAddItemShow: boolean = false;

  isShowAppointmet: boolean = false;
  isShowPerDate: boolean = false;
  openeditform: boolean = false;
  opendeleteform: boolean = false;
  edittemplateshow: boolean = false;
  opendeletenote: boolean = false;
  ShowProgress: boolean = false;
  ShowMedicalDetails: boolean = false;
  showalerticon: boolean = false;
  openexportnote: boolean = false;
  openexportnotepreview: boolean = false;
  openemailnoteemail: boolean = false;
  expandclass: boolean = false;
  IsShowfilter: boolean = false;
  ShowGeneralTemplate: boolean = true;
  ShowGastroTemplate: boolean = true;
  openfiltercase: boolean = false;
  openfilterpractitioner: boolean = false;
  openfilterdaterange: boolean = false;
  opencasestatusform: boolean = false;
  showexpand: boolean = true;
  showcolapse: boolean = false;
  Showreopencase: boolean = false;
  showEditOptions: boolean = false;
  showchangedatetime: boolean = false;
  showchangepatient: boolean = false;
  showchangepatientcase: boolean = false;
  showchangepatientnote: boolean = false;
  showchangepatientdelete: boolean = false;
  pinnotes: boolean = false;
  opendischargeform: boolean = false;
  itemIndex: number;
  modaltitle: string;
  displaydata: any;
  medicalCondition: string;
  medication: string;
  allergy: string;
  casenamedata: string = "all";
  generalcaseTemplatelist: any;
  gastrocaseTemplatelist: any;
  progresscasenoteList: any;
  progressgeneralcasenoteList: any;
  casestatustitle: string;
  caseopenstatusbutton: string;
  casereopenstatusbutton: string;
  reopencase: any;
  casestatuslabel: string;
  storevalue: string;

  public comment = '';
  indexnumber: number;
  itemModuletype: string;
  numbertitle: string;
  showpinEditOptions: boolean = false;
  drafttext: boolean = false;
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());

  public liked = false;
  patientTreatmentNotesModel: PatientTreatmentNotesModel;
  eligibleTreatment: EligibleTreatmentNoteTemplatesModel[] = [];
  templateNameDisplay: string;
  selectedTemplateId: string;
  public heartIcon(): string {
    return this.liked ? 'k-icon k-i-upload' : 'k-icon k-i-download';
  }
  public toggleLike(): void {
    this.liked = !this.liked;
  }
  selected = '';
  private exportTime = { hour: 12, minute: 0, meriden: "PM", format: 12 };
  public itemTypes: Array<any> = [
    {
      id: 1,
      title: 'Heading',
      description: 'Section Heading',
      icon: '../../../assets/price-tag 3.jpg',
      json: '',
    },
    {
      id: 2,
      title: 'Date Time',
      description: '(Field to enter Date \ Time)',
      icon: '../../../assets/calendar 4.jpg',
      json: '',
    },
    {
      id: 3,
      title: 'Text',
      description: 'A plain text area to type notes',
      icon: '../../../assets/A.png',
      json: '',
    },
    {
      id: 4,
      title: 'Number',
      description: 'Field to enter a single number',
      icon: './../../assets/one 2.png',
      json: '',
    },
    {
      id: 5,
      title: 'Dropdown',
      description:
        'Select one option from a list of options in a dropdown menu',
      icon: './../../assets/Group 334.png',
      json: '',
    },
    {
      id: 6,
      title: 'Radio Buttons',
      description: 'Select one option from a list of options in a radio button',
      icon: './../../assets/Group 170.png',
      json: '',
    },
    {
      id: 7,
      title: 'Check Boxes',
      description:
        'Select one or more checkboxes and optionally add a note to each',
      icon: './../../assets/one 2.png',
      json: '',
    },
    {
      id: 8,
      title: 'Range or Scale',
      description:
        'Customizable range / scale / clider allows you to choose from a range of values',
      icon: './../../assets/one 2.png',
      json: '',
    },
    {
      id: 9,
      title: 'Option List',
      description: 'Select a choice from list of subjects',
      icon: './../../assets/one 2.png',
      json: '',
    },
    {
      id: 10,
      title: 'Table',
      description:
        'Set of facts or figures systematically displayed in rows and column',
      icon: './../../assets/one 2.png',
      json: '',
    },
    {
      id: 11,
      title: 'Chart',
      description:
        'Draw or type notes on the provided Body chart or any image of your choice',
      icon: './../../assets/one 2.png',
      json: '',
    },
    {
      id: 12,
      title: 'File Attachment',
      description:
        'Upload any type of file,with a preview of most common file types',
      icon: './../../assets/one 2.png',
      json: '',
    },
    {
      id: 13,
      title: 'Instruction',
      description:
        'A plain text area to type instructions.It will not appear in printed or exported Treatment Note',
      icon: './../../assets/one 2.png',
      json: '',
    },
    {
      id: 14,
      title: 'Chief Complaint',
      description: 'Record the chief complaint or diagnosis',
      icon: './../../assets/one 2.png',
      json: '',
    },
    {
      id: 15,
      title: 'Vitals',
      description:
        'Record weight, height, blood pressure, respiratory rate, and calculate BMI.',
      icon: './../../assets/one 2.png',
      json: '',
    },
    {
      id: 16,
      title: 'Spine',
      description: 'Checkboxes for each joint, sketch on the spine diagram',
      icon: './../../assets/one 2.png',
      json: '',
    },
    {
      id: 17,
      title: 'Optical Measurements',
      description: 'Optical Measurements',
      icon: './../../assets/one 2.png',
      json: '',
    },
  ];
  patientlist: Array<any> = [
    {
      patientName: 'Ryan Anderson',
      id: '100052',
      gender: 'M',
      phone: '567-123-4677',
      email: 'ashley@e-practice.com.au',
      bday: '07-03-2000'
    },
    {
      patientName: 'Addison Andersconce',
      id: '100053',
      gender: 'F',
      phone: '567-123-4677',
      email: 'ashley@e-practice.com.au',
      bday: '12-09-1988'
    },
    {
      patientName: 'Ryan Anderson',
      id: '100054',
      gender: 'M',
      phone: '567-123-4677',
      email: 'ashley@e-practice.com.au',
      bday: '10-08-1994'
    },
    {
      patientName: 'Andrew Anderson',
      id: '100055',
      gender: 'M',
      phone: '567-123-4677',
      email: 'ashley@e-practice.com.au',
      bday: '07-03-2000'
    },
    {
      patientName: 'Ashley Anderson',
      id: '100056',
      gender: 'F',
      phone: '567-123-4677',
      email: 'ashley@e-practice.com.au',
      bday: '12-22-2005'
    },
    {
      patientName: 'Ryan Anderson',
      id: '100057',
      gender: 'F',
      phone: '567-123-4677',
      email: 'ashley@e-practice.com.au',
      bday: '8-09-1988'
    },
    {
      patientName: 'Andrew Anderson',
      id: '100058',
      gender: 'M',
      phone: '567-123-4677',
      email: 'ashley@e-practice.com.au',
      bday: '07-03-2000'
    },
    {
      patientName: 'Addison Anderson',
      id: '100059',
      gender: 'F',
      phone: '567-123-4677',
      email: 'ashley@e-practice.com.au',
      bday: '10-08-1994'
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
  locationList: any[];
  public specialityData: any[] = [];
  practitonerLocationSpecialityModel: PractitonerLocationSpecialityModel[] = [];
  selectedStates = this.patientlist;
  anotherArray = this.patientlist;
  filterListCareUnit(val) {
    this.patientlist = this.anotherArray.filter(
      (patients) => patients.patientName.indexOf(val) > -1
    );
  }
  constructor(
    private router: Router,
    public appState: AppState,
    public businessService: BusinessService,
    private settingsService: SettingsService,
    private patientService: PatientService,
    public _route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.traetmentnotesForm = new FormGroup({
      casename: new FormControl("", Validators.required),
      appointmentType: new FormControl("", Validators.required),
      appointmentdate: new FormControl(""),
      consultation: new FormControl(""),
      appointmentdateselect: new FormControl(""),
      traetmentname: new FormControl(""),
      textarea: new FormControl(""),
    });
    this._route.params.subscribe((params) => {
      if (params.patientId) {
        this.blockUI.start();
        this.patientId = params.patientId;
        this.blockUI.stop();
      }
    });
    this.textareatitle = "Text"
    this.fieldArray.push(this.newAttribute);
    this.populateLanding()
    this.progressnote();
    this.patientMedicalDetails();
    this.casetemplate(this.casenamedata)
    console.log(this.patientId);
    this.lstcaseName = [
      {
        name: 'general'
      },
      {
        name: 'gastro'
      }
    ];
    this.lstfiltercase = [
      {
        name: 'case'
      },
      {
        name: 'practitioner'
      },
      {
        name: 'date range'
      }
    ];
    this.lstnumber = [
      '1', '2', '3', '4', '5'
    ]
    this.lstdroupdown = [
      '1', '2', '3', '4', '5'
    ]
    this.lstradio = [
      '1', '2', '3', '4', '5'
    ]
    this.lstcheckbox = [
      '1', '2', '3', '4', '5'
    ]
    this.lsttrows = [
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'
    ]
    this.lsttcolumn = [
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'
    ]
    this.lsteditoptions = [
      {
        name: 'change date / time'
      },
      {
        name: 'change case'
      },
      {
        name: 'change patient'
      },
      {
        name: 'change notes name'
      },
      {
        name: 'delete'
      }
    ];
    this.lstoptiondata = [
      {
        odata: 'A',
        name1: 'Worse',
        name2: 'Same',
        name3: 'Better',
      },
      {
        odata: 'B',
        name1: 'Worse',
        name2: 'Same',
        name3: 'Better',
      },
      {
        odata: 'C',
        name1: 'Worse',
        name2: 'Same',
        name3: 'Better',
      }
    ]
  }
  populateLanding() {
    this.businessService.getLocationsForCurrentUser().subscribe((locations) => {
      this.locationList = locations;
    });

    this.settingsService.getAllSpecialties().subscribe((specialties) => {
      this.specialityData = specialties;
    });

    this.patientService
      .getLocationSpecialityByPractitonerId(this.appState.userProfile.id)
      .subscribe((data: PractitonerLocationSpecialityModel[]) => {
        this.practitonerLocationSpecialityModel = data;
        this.getTemplateNameList();
      });
  }
  private getTemplateNameList() {
    this.patientService
      .getEligibleTreatmentNotes(
        this.appState.selectedUserLocation.id,
        this.patientId
      )
      .subscribe((data: PatientTreatmentNotesModel) => {
        this.patientTreatmentNotesModel = data;
        this.eligibleTreatment = this.patientTreatmentNotesModel.eligibleTreatment.filter(
          (x) => x.locationId === this.appState.selectedUserLocation.id
        );

        this.practitonerLocationSpecialityModel.map((pls) => {
          let tnList: TemplateNameList[] = [];
          const et = this.eligibleTreatment.filter(
            (d) => d.specialityId === pls.specialityId
          );
          if (et !== undefined && et.length > 0) {
            et.forEach((element) => {
              const m = new TemplateNameList();
              m.treatmentId = element.id;
              m.treatmentName = element.treatmentName;
              tnList.push(m);
            });
            pls.templateNameList = tnList;
          }
        });
        console.log(this.eligibleTreatment);
        console.log(this.practitonerLocationSpecialityModel);
      });
  }
  openfilter() {
    if (this.IsShow == false) {
      this.IsShow = true;
    }
    else {
      this.IsShow = false;
    }
  }
  casetemplate(casenamedata) {
    if (casenamedata == "general") {
      this.generalcaseTemplatelist = [
        {
          generaltemplatename: 'General Template 01'
        },
        {
          generaltemplatename: 'General Template 02'
        }
      ];
      this.ShowGastroTemplate = false;
      this.ShowGeneralTemplate = true;
      this.IsShow = false;
    } else if (casenamedata == "gastro") {
      this.gastrocaseTemplatelist = [
        {
          gastrotemplatename: 'Gastro Template 01'
        },
        {
          gastrotemplatename: 'Gastro Template 02'
        },
        {
          gastrotemplatename: 'Gastro Template 03'
        }
      ]
      this.ShowGeneralTemplate = false;
      this.ShowGastroTemplate = true;
      this.IsShow = false;
    } else {
      this.generalcaseTemplatelist = [
        {
          generaltemplatename: 'General Template 01'
        },
        {
          generaltemplatename: 'General Template 02'
        }
      ];
      this.gastrocaseTemplatelist = [
        {
          gastrotemplatename: 'Gastro Template 01'
        },
        {
          gastrotemplatename: 'Gastro Template 02'
        },
        {
          gastrotemplatename: 'Gastro Template 03'
        }
      ];
      this.ShowGeneralTemplate = true;
      this.ShowGastroTemplate = true;
      this.IsShow = false;
    }
  }
  onClickTemplateName(id: string, treatmentName: string) {
    console.log(id);
    this.mytemplateshow = false;
    this.addNewtemplateshow = true;
    this.templateNameDisplay = treatmentName;
    this.selectedTemplateId = id;
  }
  openItem() {
    if (this.IsAddItemShow == false) {
      if (this.isShowPerDate == true) {
        this.isShowPerDate = false;
      }
      this.IsAddItemShow = true;
    } else {
      this.IsAddItemShow = false;
    }
  }
  showoptions(option) {
    console.log(option)
    if (option.title == 'Text') {
      this.showTextarea = true;
      this.textareatitle = "Text"
      this.fieldArray.push(this.newAttribute);
      this.newAttribute = {};
      this.IsAddItemShow = false;
      console.log("Text");
    }
    if (option.title == 'Optical Measurements') {
      this.textopticaltitle = "Optical Measurements"
      this.showopticalarea = true;
      this.IsAddItemShow = false;
      this.fieldArray3.push(this.newAttribute3);
      this.newAttribute3 = {};
    }
    if (option.title == 'Heading') {
      this.textheadingtitle = "Heading"
      this.showheadingarea = true;
      this.IsAddItemShow = false;
      this.fieldArray4.push(this.newAttribute4);
      this.newAttribute4 = {};
    }
    if (option.title == 'Date Time') {
      this.textdfatetimetitle = "Date Time"
      this.showdatetimearea = true;
      this.IsAddItemShow = false;
      this.fieldArray5.push(this.newAttribute5);
      this.newAttribute5 = {};
    }
    if (option.title == 'Number') {
      this.textnumbertitle = "Number"
      this.shownumber = true;
      this.IsAddItemShow = false;
      this.fieldArray6.push(this.newAttribute6);
      this.newAttribute6 = {};
      this.numberhelptextd = "Enter values between 1-5"
    }
    if (option.title == 'Dropdown') {
      this.model.textdroupdowntitle = "Dropdown";
      this.droupdowntext = this.model.textdroupdowntitle;
      this.showdroupdown = true;
      this.IsAddItemShow = false;
      this.fieldArray7.push(this.newAttribute7);
      this.newAttribute7 = {};
      this.droupdownhelptextd = "Select any of the droupdown values"
    }
    if (option.title == 'Radio Buttons') {
      this.model.textradiotitle = "Radio Button";
      this.radiotext = "Radio Button";
      this.showradio = true;
      this.IsAddItemShow = false;
      this.fieldArray8.push(this.newAttribute8);
      this.newAttribute8 = {};
      this.radiohelptextd = "Select any one of the radiobutton values"
    }
    if (option.title == 'Check Boxes') {
      this.model.textcheckboxtitle = "Check Boxe";
      this.checkboxtext = "Check Box";
      this.showcheckbox = true;
      this.IsAddItemShow = false;
      this.fieldArray9.push(this.newAttribute9);
      this.newAttribute9 = {};
      this.checkboxhelptextd = "Select one or more checkbox values"
    }
    if (option.title == 'Range or Scale') {
      // alert("data")
      this.model.textrangetitle = "Range or Scale";
      this.rangetext = "Range or Scale";
      this.showrange = true;
      this.IsAddItemShow = false;
      this.fieldArray10.push(this.newAttribute10);
      this.newAttribute10 = {};
      this.rangehelptextd = "Move the slider to select the value in Range or Scales"
    }
    if (option.title == 'Option List') {
      // alert("data")
      this.model.textoptionlisttitle = "Option List";
      this.optionlisttext = "Option List";
      this.showoptionlist = true;
      this.IsAddItemShow = false;
      for (let i = 0; i < this.lstoptiondata.length; i++) {
        let j = 64
        this.shoabcdata = String.fromCharCode(j + 1);
        console.log(this.shoabcdata)
      }
      this.fieldArray11.push(this.newAttribute11);
      this.newAttribute11 = {};
      this.optionlisthelptextd = "Select a choice from list of subjects"
    }
    if (option.title == 'Table') {
      // alert("data")
      this.model.texttabledatatitle = "Table";
      this.tabledatatext = "Table";
      this.showtable = true;
      this.IsAddItemShow = false;
      this.fieldArray12.push(this.newAttribute12);
      this.newAttribute12 = {};
      this.tablerows = [];
      this.tablecolumn = [];
      for (let i = 1; i <= 5; i++) {
        this.tablerows.push(i);
        this.tablecolumn.push(i);
      }
      this.tabledatahelptextd = "Enter value in the table cells"
    }
    if (option.title == 'File Attachment') {
      this.showattachfile = true;
      this.IsAddItemShow = false;
      this.fieldArray13.push(this.newAttribute13);
      this.newAttribute13 = {};
    }
    if (option.title == 'Instruction') {
      this.showinstructionfile = true;
      this.IsAddItemShow = false;
      this.fieldArray14.push(this.newAttribute14);
      this.newAttribute14 = {};
      this.model.textinstructiontitle = "Type the instruction the user has to follow";
    }
    if (option.title == 'Chief Complaint') {
      this.showchieffile = true;
      this.IsAddItemShow = false;
      this.chieftitle = "Chief Complaint"
      this.fieldArray15.push(this.newAttribute15);
      this.newAttribute15 = {};
    }
    if (option.title == 'Vitals') {
      this.degreesign = String.fromCharCode(176);
      this.showmatric = true;
      this.showvitalsarea = true;
      this.IsAddItemShow = false;
      this.vitalstitle = "Vitals"
      this.fieldArray16.push(this.newAttribute16);
      this.newAttribute16 = {};
    }
    if (option.title == "Chart") {
      this.IsAddItemShow = false;
      this.showChart = true;
      this.fieldArray17.push(this.newAttribute17);
      localStorage.setItem('Chartitem', JSON.stringify(this.fieldArray17));
      localStorage.setItem('Chartitemlength', JSON.stringify(this.fieldArray17.length));
      this.newAttribute17 = {};
    }
    if (option.title == "Spine") {
      this.IsAddItemShow = false;
      this.showSpineChart = true;
      this.fieldArray18.push(this.newAttribute18);
      this.newAttribute18 = {};
    }
    if (option == 'checkbox') {
      this.IsAddItemShow = false;
      this.buttonselection = false
      this.droupdownselection = false;
      this.radioselection = false;
      this.checkboxselection = true;
    }
    if (option == 'button') {
      this.IsAddItemShow = false;
      this.buttonselection = true
      this.droupdownselection = false;
      this.radioselection = false;
      this.checkboxselection = false;
    }
    if (option == 'radio') {
      this.IsAddItemShow = false;
      this.buttonselection = false
      this.droupdownselection = false;
      this.radioselection = true;
      this.checkboxselection = false;
    }
    if (option == 'droupdown') {
      this.IsAddItemShow = false;
      this.buttonselection = false
      this.droupdownselection = true;
      this.radioselection = false;
      this.checkboxselection = false;
    }
  }
  existing() {
    if (this.isShowAppointmet == false) {
      this.isShowAppointmet = true;
      this.traetmentnotesForm
        .get("appointmentdate")
        .setValidators([Validators.required]);
      this.traetmentnotesForm
        .get("consultation")
        .setValidators([Validators.required]);
      this.traetmentnotesForm.get("appointmentdate").updateValueAndValidity();
      this.traetmentnotesForm.get("consultation").updateValueAndValidity();
      if (this.isShowPerDate == true) {
        this.isShowPerDate = false;
        this.isShowAppointmet = true;
      }
    } else {
      this.isShowAppointmet = false;
    }
  }
  selectDate() {
    if (this.isShowAppointmet == true) {
      this.isShowAppointmet = false;
      this.isShowPerDate = false;
    } else {
      this.traetmentnotesForm
        .get("appointmentdateselect")
        .setValidators([Validators.required]);
      this.traetmentnotesForm
        .get("appointmentdateselect")
        .updateValueAndValidity();
    }
    this.isShowPerDate = true;
  }
  edit(index, type) {
    if (type == 'textarea') {
      this.openeditform = true;
    }
    if (type == 'cheif') {
      this.openChiedform = true;
      this.chieftmandtory = true;
    }
    if (type == 'vitals') {
      this.openvitaleditform = true;
    }
    if (type == 'heading') {
      this.openheadingeditform = true;
      this.textareatitle = "Heading"
    }
    if (type == 'datetime') {
      this.opendatetimeeditform = true;
      this.textareatitle = "Date Time"
    }
    if (type == 'number') {
      this.opennumbereditform = true;
      this.numbertitle = "Number"
      this.model.numberhelptext = "Enter values between 1-5"
    }
    if (type == 'droupdown') {
      this.opendroupdwoneditform = true;
      this.model.textnumbertitle = "Droupdown"
      this.model.droupdownhelptext = "Select any of the droupdown values";
    }
    if (type == 'radio') {
      this.openradioeditform = true;
      this.model.textradiotitle = "Radio Button";
      this.model.radiohelptext = "Select any of the values";
    }
    if (type == 'checkbox') {
      this.opencheckboxeditform = true;
      this.model.textcheckboxtitle = "Check Box";
      this.model.checkboxhelptext = "Select one or more checkbox values";
    }
    if (type == 'range') {
      this.openrangeeditform = true;
      this.model.textrangetitle = "Range or Scale";
      this.model.rangehelptext = "Move the slider to select the value in Range or Scales";
    }
    if (type == 'optionlist') {
      this.openoptionlisteditform = true;
      this.model.textoptionlisttitle = "Option List";
      this.model.optionlisthelptext = "Select a choice from list of subjects";
    }
    if (type == 'tabledata') {
      this.opentabledataeditform = true;
      this.model.texttabledatatitle = "Table";
      this.model.tabledatahelptext = "Enter value in the table cells";
    }
    if (type == 'attachfile') {
      this.openatatchfileditform = true;
      this.model.textattachfiletitle = "File Attachment";
    }
    if (type == 'instruction') {
      this.openinstructioneditform = true;
      this.model.textinstructiontitle = "Type the instruction the user has to follow";
    }
    if (type == 'chief') {
      this.openchiefeditform = true;
    }
  }
  addmoreoption(type) {
    if (type == "droupdown") {
      if (this.droupdownarray.length < 10) {
        this.droupdownarray.push(this.radioattribute);
      }
    }
    if (type == "radio") {
      if (this.radioarray.length < 10) {
        this.radioarray.push(this.radioattribute);
      }
    }
    if (type == "checkbox") {
      if (this.checkboxarray.length < 10) {
        this.checkboxarray.push(this.checkboxattribute);
      }
    }
    if (type == "optionabc") {
      let i = 65;
      this.abcvalue = String.fromCharCode(this.optionlistarray.length + i);
      this.optionlistarray.push(this.abcvalue);
    }
    if (type == "optionchoice") {
      this.optionlistchoicearray.push(this.optionlistarrayattribute);
    }
  }
  removedata(index, type) {
    if (type == "droupdown") {
      this.droupdownarray.splice(index, 1);
    }
    if (type == "radio") {
      this.radioarray.splice(index, 1);
    }
    if (type == "checkbox") {
      this.checkboxarray.splice(index, 1);
    }
    if (type == "optionabc") {
      this.optionlistarray.splice(index, 1);
    }
    if (type == "optionchoice") {
      this.optionlistchoicearray.splice(index, 1);
    }
    if (type == "bodychart") {
      this.fieldArray17.splice(index, 1);
    }
    if (type == "spinechart") {
      this.fieldArray18.splice(index, 1);
    }
  }
  public close() {
    this.openeditform = false;
    this.opendeleteform = false;
    this.opendeletenote = false;
    this.openexportnote = false;
    this.openexportnotepreview = false;
    this.openemailnoteemail = false;
    this.openfiltercase = false;
    this.openfilterpractitioner = false;
    this.openfilterdaterange = false;
    this.opencasestatusform = false;
    this.showchangedatetime = false;
    this.showchangepatient = false;
    this.showchangepatientcase = false;
    this.showchangepatientnote = false;
    this.showchangepatientdelete = false;
    this.openChiedform = false;
    this.openvitaleditform = false;
    this.showopticalarea = false;
    this.openheadingeditform = false;
    this.opendatetimeeditform = false;
    this.opennumbereditform = false;
    this.opendroupdwoneditform = false;
    this.opendischargeform = false;
    this.openradioeditform = false;
    this.opencheckboxeditform = false;
    this.openrangeeditform = false;
    this.openoptionlisteditform = false;
    this.openatatchfileditform = false;
    this.openchiefeditform = false;
  }
  deletetextarea(index) {
    this.itemIndex = index;
    this.opendeleteform = true;
  }

  moveUp(index: number, name) {
    if (index >= 1)
      this.swap(index, index - 1, name)
  }

  moveDown(index: number, name) {
    if (name == 'vital') {
      if (index < this.fieldArray16.length - 1)
        this.swap(index, index + 1, name)
    }
    if (name == 'textarea') {
      if (index < this.fieldArray.length - 1)
        this.swap(index, index + 1, name)
    }
    if (name == 'optical') {
      if (index < this.fieldArray3.length - 1)
        this.swap(index, index + 1, name)
    }
    if (name == 'heading') {
      if (index < this.fieldArray4.length - 1)
        this.swap(index, index + 1, name)
    }
    if (name == 'datetime') {
      if (index < this.fieldArray5.length - 1)
        this.swap(index, index + 1, name)
    }
    if (name == 'number') {
      if (index < this.fieldArray6.length - 1)
        this.swap(index, index + 1, name)
    }
    if (name == 'droupdown') {
      if (index < this.fieldArray7.length - 1)
        this.swap(index, index + 1, name)
    }
    if (name == 'radio') {
      if (index < this.fieldArray8.length - 1)
        this.swap(index, index + 1, name)
    }
    if (name == 'checkbox') {
      if (index < this.fieldArray9.length - 1)
        this.swap(index, index + 1, name)
    }
    if (name == 'range') {
      if (index < this.fieldArray10.length - 1)
        this.swap(index, index + 1, name)
    }
    if (name == 'optionlist') {
      if (index < this.fieldArray11.length - 1)
        this.swap(index, index + 1, name)
    }
    if (name == 'tabledata') {
      if (index < this.fieldArray12.length - 1)
        this.swap(index, index + 1, name)
    }
    if (name == 'attachfile') {
      if (index < this.fieldArray13.length - 1)
        this.swap(index, index + 1, name)
    }
    if (name == 'instruction') {
      if (index < this.fieldArray14.length - 1)
        this.swap(index, index + 1, name)
    }
    if (name == 'chief') {
      if (index < this.fieldArray15.length - 1)
        this.swap(index, index + 1, name)
    }
    if (name == 'bodychart') {
      if (index < this.fieldArray17.length - 1)
        this.swap(index, index + 1, name)
    }
    if (name == 'spinechart') {
      if (index < this.fieldArray18.length - 1)
        this.swap(index, index + 1, name)
    }
  }

  private swap(x: any, y: any, name) {
    // alert(name);
    if (name == 'vital') {
      var b = this.fieldArray16[x];
      this.fieldArray16[x] = this.fieldArray16[y];
      this.fieldArray16[y] = b;
    }
    if (name == 'textarea') {
      this.textareatitle = "test";
      var b = this.fieldArray[x];
      this.fieldArray[x] = this.fieldArray[y];
      this.fieldArray[y] = b;
    }
    if (name == 'optical') {
      var b = this.fieldArray3[x];
      this.fieldArray3[x] = this.fieldArray3[y];
      this.fieldArray3[y] = b;
      console.log(this.fieldArray3[y]);
    }
    if (name == 'heading') {
      var b = this.fieldArray4[x];
      this.fieldArray4[x] = this.fieldArray4[y];
      this.fieldArray4[y] = b;
      console.log(this.fieldArray4[y]);
    }
    if (name == 'datetime') {
      var b = this.fieldArray5[x];
      this.fieldArray5[x] = this.fieldArray5[y];
      this.fieldArray5[y] = b;
      console.log(this.fieldArray5[y]);
    }
    if (name == 'number') {
      var b = this.fieldArray6[x];
      this.fieldArray6[x] = this.fieldArray6[y];
      this.fieldArray6[y] = b;
      console.log(this.fieldArray6[y]);
    }
    if (name == 'droupdown') {
      var b = this.fieldArray7[x];
      this.fieldArray7[x] = this.fieldArray7[y];
      this.fieldArray7[y] = b;
      console.log(this.fieldArray7[y]);
    }
    if (name == 'radio') {
      var b = this.fieldArray8[x];
      this.fieldArray8[x] = this.fieldArray8[y];
      this.fieldArray8[y] = b;
      console.log(this.fieldArray8[y]);
    }
    if (name == 'checkbox') {
      var b = this.fieldArray9[x];
      this.fieldArray9[x] = this.fieldArray9[y];
      this.fieldArray9[y] = b;
      console.log(this.fieldArray9[y]);
    }
    if (name == 'range') {
      var b = this.fieldArray10[x];
      this.fieldArray10[x] = this.fieldArray10[y];
      this.fieldArray10[y] = b;
      console.log(this.fieldArray10[y]);
    }
    if (name == 'optionlist') {
      var b = this.fieldArray11[x];
      this.fieldArray11[x] = this.fieldArray11[y];
      this.fieldArray11[y] = b;
      console.log(this.fieldArray11[y]);
    }
    if (name == 'tabledata') {
      var b = this.fieldArray12[x];
      this.fieldArray12[x] = this.fieldArray12[y];
      this.fieldArray12[y] = b;
      console.log(this.fieldArray12[y]);
    }
    if (name == 'attachfile') {
      var b = this.fieldArray13[x];
      this.fieldArray13[x] = this.fieldArray13[y];
      this.fieldArray13[y] = b;
      console.log(this.fieldArray13[y]);
    }
    if (name == 'instruction') {
      var b = this.fieldArray14[x];
      this.fieldArray14[x] = this.fieldArray14[y];
      this.fieldArray14[y] = b;
      console.log(this.fieldArray14[y]);
    }
    if (name == 'chief') {
      var b = this.fieldArray15[x];
      this.fieldArray15[x] = this.fieldArray15[y];
      this.fieldArray15[y] = b;
      console.log(this.fieldArray15[y]);
    }
    if (name == 'bodychart') {
      var b = this.fieldArray17[x];
      this.fieldArray17[x] = this.fieldArray17[y];
      this.fieldArray17[y] = b;
    }
    if (name == 'spinechart') {
      console.log("swaped up");
      var b = this.fieldArray18[x];
      this.fieldArray18[x] = this.fieldArray18[y];
      this.fieldArray18[y] = b;
    }
  }
  deleteitem() {
    console.log(this.itemModuletype);
    if (this.itemModuletype == 'vital') {
      this.fieldArray16.splice(this.indexnumber, 1);
    }
    if (this.itemModuletype == 'textarea') {
      this.fieldArray.splice(this.indexnumber, 1);
    }
    if (this.itemModuletype == 'heading') {
      this.fieldArray4.splice(this.indexnumber, 1);
    }
    if (this.itemModuletype == 'datetime') {
      this.fieldArray5.splice(this.indexnumber, 1);
    }
    if (this.itemModuletype == 'number') {
      this.fieldArray6.splice(this.indexnumber, 1);
    }
    if (this.itemModuletype == 'droupdown') {
      this.fieldArray7.splice(this.indexnumber, 1);
    }
    if (this.itemModuletype == 'radio') {
      this.fieldArray8.splice(this.indexnumber, 1);
    }
    if (this.itemModuletype == 'checkbox') {
      this.fieldArray9.splice(this.indexnumber, 1);
    }
    if (this.itemModuletype == 'range') {
      this.fieldArray10.splice(this.indexnumber, 1);
    }
    if (this.itemModuletype == 'optionlist') {
      this.fieldArray11.splice(this.indexnumber, 1);
    }
    if (this.itemModuletype == 'tabledata') {
      this.fieldArray12.splice(this.indexnumber, 1);
    }
    if (this.itemModuletype == 'attachfile') {
      this.fieldArray13.splice(this.indexnumber, 1);
    }
    if (this.itemModuletype == 'instruction') {
      this.fieldArray14.splice(this.indexnumber, 1);
    }
    if (this.itemModuletype == 'chief') {
      this.fieldArray15.splice(this.indexnumber, 1);
    }
    if (this.itemModuletype == 'optical') {
      this.fieldArray3.splice(this.indexnumber, 1);
    }
    this.opendeleteform = false;
  }
  savedraft() {
    if (this.traetmentnotesForm.valid) {
      let formData = new FormData();
      formData.append(
        "casename",
        this.traetmentnotesForm.controls.casename.value
      );
      formData.append(
        "appointmentType",
        this.traetmentnotesForm.controls.appointmentType.value
      );
      formData.append(
        "appointmentdateselect",
        this.traetmentnotesForm.controls.appointmentdateselect.value
      );
      formData.append(
        "consultation",
        this.traetmentnotesForm.controls.consultation.value
      );
      formData.append(
        "traetmentname",
        this.traetmentnotesForm.controls.traetmentname.value
      );
      var plandetailsobj = [];
      if (this.fieldArray) {
        this.fieldArray.forEach((element) => {
          plandetailsobj.push({
            textarea: element.textarea,
            type: this.modaltitle,
            patientId: this.patientId,
          });
        });
      }
      var myJSON = JSON.stringify(plandetailsobj);
      formData.append("textarea_details", myJSON);
      this.displaydata = formData;
      this.showdraft = true;
      this.mytemplateshow = true;
      this.addNewtemplateshow = false;
    }
  }
  closeform() {
    this.mytemplateshow = true;
    this.addNewtemplateshow = false;
    this.showTextarea = false;
    this.showheadingarea = false;
    this.showdatetimearea = false;
    this.shownumber = false;
    this.showdroupdown = false;
    this.showradio = false;
    this.showcheckbox = false;
    this.showrange = false;
    this.showoptionlist = false;
    this.showtable = false;
    this.showattachfile = false;
    this.showinstructionfile = false;
    this.showchieffile = false;
    this.showvitalsarea = false;
    this.showopticalarea = false;
  }
  editform(action) {
    if (action == "draft") {
      this.drafttext = true;
      this.edittemplateshow = true;
      this.mytemplateshow = false;
      this.addNewtemplateshow = false;
    } else {
      this.traetmentnotesForm.controls.traetmentname.setValue("Copy");
      this.copttext = true;
      this.edittemplateshow = true;
      this.mytemplateshow = false;
      this.addNewtemplateshow = false;
    }
  }
  deletenote() {
    this.opendeletenote = true;
  }
  finalizeAddNote() {
    this.progressnote();
  }
  progressnote() {
    let i = 1;
    if (i == 1) {
      this.ShowProgress = true;
      this.caseopenstatusbutton = "Discharge";
      this.casereopenstatusbutton = "Case Reopen";
      this.progresscasenoteList = [
        {
          pcasedate: '2021-01-20T23:34:18.377',
          PatientName: 'Ashley Anderson',
          caseTitle: 'This is a test case.',
          caseDesc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
          pimage: 'exportnote.jpg',
          createdDate: '2021-01-15T23:34:18.377',
          ApproveddBy: 'Andrew Anderson'
        },
        {
          pcasedate: '2021-01-20T23:34:18.377',
          appointmentType: 'Treatment',
          PatientName: 'Ashley Anderson',
          caseTitle: 'This is a test case.',
          caseDesc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
          pimage: 'exportnote.jpg',
          createdDate: '2021-01-15T23:34:18.377',
          ApproveddBy: 'Andrew Anderson'
        },
        {
          pcasedate: '2021-01-20T23:34:18.377',
          PatientName: 'Ashley Anderson',
          caseTitle: 'This is a test case.',
          caseDesc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
          pimage: 'exportnote.jpg',
          createdDate: '2021-01-15T23:34:18.377',
          appoinrmrntservice: "Initial Consultation (1000)",
          ApproveddBy: 'Andrew Anderson'
        },
        {
          pcasedate: '2021-01-20T23:34:18.377',
          appointmentType: 'Treatment 02',
          PatientName: 'Ashley Anderson',
          caseTitle: 'This is a test case.',
          caseDesc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
          pimage: 'exportnote.jpg',
          createdDate: '2021-01-15T23:34:18.377',
          appoinrmrntservice: "Initial Consultation (1000), Orthotics (255)",
          ApproveddBy: 'Andrew Anderson'
        }
      ];
      this.progressgeneralcasenoteList = [
        {
          pcasedate: '2021-01-20T23:34:18.377',
          PatientName: 'Ashley Anderson',
          caseTitle: 'This is a test case.',
          caseDesc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
          pimage: 'exportnote.jpg',
          createdDate: '2021-01-15T23:34:18.377',
          ApproveddBy: 'Andrew Anderson'
        },
        {
          pcasedate: '2021-01-20T23:34:18.377',
          appointmentType: 'Treatment',
          PatientName: 'Ashley Anderson',
          caseTitle: 'This is a test case.',
          caseDesc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
          pimage: 'exportnote.jpg',
          createdDate: '2021-01-15T23:34:18.377',
          ApproveddBy: 'Andrew Anderson'
        },
        {
          pcasedate: '2021-01-20T23:34:18.377',
          PatientName: 'Ashley Anderson',
          caseTitle: 'This is a test case.',
          caseDesc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
          pimage: 'exportnote.jpg',
          createdDate: '2021-01-15T23:34:18.377',
          appoinrmrntservice: "Initial Consultation (1000)",
          ApproveddBy: 'Andrew Anderson'
        },
        {
          pcasedate: '2021-01-20T23:34:18.377',
          appointmentType: 'Treatment 02',
          PatientName: 'Ashley Anderson',
          caseTitle: 'This is a test case.',
          caseDesc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
          pimage: 'exportnote.jpg',
          createdDate: '2021-01-15T23:34:18.377',
          appoinrmrntservice: "Initial Consultation (1000), Orthotics (255)",
          ApproveddBy: 'Andrew Anderson'
        }
      ];
    } else {
      this.treatmentTitle = 'You haven\'t added a Finalized Treatment note.';
      this.treatmentDescription = 'Please select a Template to entre treatment notes for this patient.'
    }
  }
  patientMedicalDetails() {
    // this.patientService
    //   .getPatientById(this.patientId)
    //   .subscribe((data: PatientModel) => {
    // console.log(data)
    // if (data.allergy != '' && data.medicalCondition != '' && data.medication != '') {
    this.showalerticon = true;
    this.medicalCondition = "This patient is diagnosed with Type 2 Diabetes."
    this.allergy = "Lore imprisma Lore imprisma Lore imprisma Lore imprisma Lore imprisma.";
    this.medication = "Lore imprisma Lore imprisma Lore imprisma Lore imprisma Lore imprisma sdfd";
    // }
    // });
  }
  exportnotes() {
    alert("Export");
  }
  dischargeoropen() {
    if (this.pendingcase == 'pending') {
      this.opendischargeform = true;
    } else {
      this.opencasestatusform = true;
      if (this.caseopenstatusbutton == "Discharge") {
        this.casestatustitle = "DO YOU WANT TO DISCHARGE THIS CASE?";
      } else if (this.caseopenstatusbutton == "Case Reopen") {
        this.casestatustitle = "DO YOU WISH TO RE-OPEN THIS CASE?";
      }
    }
  }
  changecasestatus() {
    if (this.caseopenstatusbutton == "Discharge") {
      this.caseopenstatusbutton = "Case Reopen";
      this.opencasestatusform = false;
      this.reopencase = [
        {
          pcasedate: '2021-01-20T23:34:18.377',
          PatientName: 'Ashley Anderson',
          casestatus: 'Discharged',
          caseTitle: 'This is a test case.',
          caseDesc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
          pimage: 'exportnote.jpg',
          createdDate: '2021-01-15T23:34:18.377',
          appoinrmrntservice: "Initial Consultation (1000), Orthotics (255)",
          ApproveddBy: 'Andrew Anderson'
        }
      ];
      this.Showreopencase = true;
    } else if (this.caseopenstatusbutton == "Case Reopen") {
      this.caseopenstatusbutton = "Discharge";
      this.opencasestatusform = false;
      this.reopencase = [
        {
          pcasedate: '2021-01-20T23:34:18.377',
          PatientName: 'Ashley Anderson',
          casestatus: 'Re-Opneded',
          caseTitle: 'This is a test case.',
          caseDesc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
          pimage: 'exportnote.jpg',
          createdDate: '2021-01-15T23:34:18.377',
          appoinrmrntservice: "Initial Consultation (1000), Orthotics (255)",
          ApproveddBy: 'Andrew Anderson'
        }
      ];
    }
  }
  nextscreen() {
    this.showchangedatetime = true;
    this.showchangepatient = false;
  }
  editpatientdelete() {
    this.showEditOptions = false;
    this.showchangepatientdelete = true;
  }
  pintnote(patientdata, casename, index) {
    this.casetstaus = casename;
    if (casename == "acase") {
      this.pinnotes = true;
      this.progresscasenoteList.splice(index, 1);
      this.lstpindata.push(patientdata);
    } else {
      this.pinnotes = true;
      this.progressgeneralcasenoteList.splice(index, 1);
      this.lstpindata.push(patientdata);
    }
  }
  unpin(patientdata, index) {
    if (this.casetstaus == "acase") {
      this.lstpindata.splice(index, 1);
      this.progresscasenoteList.push(patientdata);
    } else {
      this.lstpindata.splice(index, 1);
      this.progressgeneralcasenoteList.push(patientdata);
    }
  }
  expandform() {
    if (this.showprogressbar == true) {
      this.showprogressbar = false;
    } else {
      this.showprogressbar = true;
    }
  }
  // Combine Function Start
  openpopup(action) {
    // alert(action)
    if (action == 'medicalalert') {
      if (this.ShowMedicalDetails == false) {
        this.ShowMedicalDetails = true;
      } else {
        this.ShowMedicalDetails = false;;
      }
    }
    if (action == 'exportpatientNote') {
      this.openexportnote = true;
    }
    if (action == 'previewNotes') {
      this.openexportnote = false;
      this.openexportnotepreview = true;
    }
    if (action == 'printnotes') {
      this.openexportnote = false;
      this.openexportnotepreview = false;
      alert("PrintFunction");
    }
    if (action == 'emailNotes') {
      this.openexportnotepreview = false;
      this.openemailnoteemail = true;
    }
    if (action == 'sendmail') {
      this.openemailnoteemail = false;
      alert("SendMail");
    }
    if (action == 'case') {
      this.IsShowfilter = false;
      this.openfiltercase = true;
    }
    if (action == 'delete') {
      this.showpinEditOptions = false;
      this.showEditOptions = false;
      this.opendeleteform = true;
    }
    if (action == 'practitioner') {
      this.IsShowfilter = false;
      this.openfilterpractitioner = true;
    }
    if (action == 'date range') {
      this.IsShowfilter = false;
      this.openfilterdaterange = true;
    }
    if (action == 'openeditoptions') {
      if (this.showpinEditOptions == false) {
        this.showpinEditOptions = true;
      } else {
        this.showpinEditOptions = false;
      }
    }
    if (action == 'change date / time') {
      this.showpinEditOptions = false;
      this.showEditOptions = false;
      this.showchangedatetime = true;
    }
    if (action == 'change patient') {
      this.showpinEditOptions = false;
      this.showEditOptions = false;
      this.showchangepatient = true;
    }
    if (action == 'change case') {
      this.showpinEditOptions = false;
      this.showEditOptions = false;
      this.showchangepatientcase = true;
    }
    if (action == 'change notes name') {
      this.showpinEditOptions = false;
      this.showEditOptions = false;
      this.showchangepatientnote = true;
    }
    if (action == 'openeditoptionsa') {
      if (this.showEditOptions == false) {
        this.showEditOptions = true;
      } else {
        this.showEditOptions = false;
      }
    }
    if (action == 'expanddetails') {
      if (this.expandclass == false) {
        this.expandclass = true;
        this.showexpand = false;
        this.showcolapse = true;
      } else {
        this.expandclass = false;
        this.showexpand = true;
        this.showcolapse = false;
      }
    }
    if (action == 'openfilterprogress') {
      if (this.IsShowfilter == false) {
        this.IsShowfilter = true;
      } else {
        this.IsShowfilter = false;
      }
    }
    if (action == 'redpintnote') {
      alert('RemoveData');
    }
  }

  savedata(action) {
    if (action == 'Filterbycase') {
      alert("FilterByCase");
      this.openfiltercase = false;
    }
    if (action == 'Filterbypractitioner') {
      alert("Filterbypractitioner");
      this.openfilterpractitioner = false;
    }
    if (action == 'Filterbydaterange') {
      alert("Filterbydaterange");
      this.openfilterdaterange = false;
    }
    if (action == 'changecasedatetime') {
      alert("changecasedatetime");
      this.showEditOptions = false;
      this.showchangedatetime = false;
    }
    if (action == 'changecase') {
      this.showchangepatientcase = false;
      alert("Changecase");
    }
    if (action == 'changecasenotes') {
      this.showchangepatientnote = false;
      alert("ChangeNote");
    }
    if (action == 'chief') {
      this.openChiedform = false;
    }
    if (action == 'vitals') {
      if (this.storevalue == "true") {
        this.showImperial = true;
        this.showMetric = false
      } else {
        this.showImperial = false;
        this.showMetric = true
      }
      this.openvitaleditform = false;
    }
    if (action == 'heading') {
      this.openheadingeditform = false;
      this.showcopyheading = true;
      this.headingcopytitle = "Heading2";
    }
    if (action == 'datetime') {
      this.opendatetimeeditform = false;
      this.showcopydatetime = true;
      this.headingcopydatetime = "Date Time2";
    }
    if (action == 'textarea') {
      this.openeditform = false;
    }
    if (action == 'number') {
      console.log(this.model.numberhelptext)
      this.lstnumber = [];
      let i;
      for (i = this.model.textnumber1; i <= this.model.textnumber2; i++) {
        this.lstnumber.push(i)
      }
      this.numberhelptextd = this.model.numberhelptext;
      this.opennumbereditform = false;
    }
    if (action == 'droupdown') {
      let i;
      for (i = 0; i < this.droupdownarray.length; i++) {
        this.lstdroupdown.push(this.model.droupdownvalue[i])
      }
      this.opendroupdwoneditform = false;
      this.droupdowntext = this.model.textdroupdowntitle;
    }
    if (action == 'radio') {
      let i;
      for (i = 0; i < this.radioarray.length; i++) {
        this.lstradio.push(this.lstradio.length + 1)
        console.log(this.lstradio);
      }
      this.openradioeditform = false;
      this.radiotext = this.model.textradiotitle;
    }
    if (action == 'checkbox') {
      let i;
      for (i = 0; i < this.checkboxarray.length; i++) {
        this.lstcheckbox.push(this.lstcheckbox.length + 1)
        console.log(this.lstcheckbox);
      }
      this.opencheckboxeditform = false;
      this.checkboxtext = this.model.textcheckboxtitle;
    }
    if (action == 'range') {
      this.openrangeeditform = false;
      this.min = this.model.rangenumber1;
      this.max = this.model.rangenumber2;
      this.value = this.model.rangedefaultnumber;
    }
    if (action == 'optionlist') {
      this.lstoptiondata = [];
      let i;
      for (i = 0; i < this.optionlistarray.length; i++) {
        console.log(this.optionlistarray);
        this.lstoptiondata.push(this.optionlistarray)
        console.log(this.lstoptiondata)
      }
      this.openoptionlisteditform = false;
    }
    if (action == 'tabledata') {
      this.tablerows = [];
      this.tablecolumn = [];
      for (let i = 0; i < this.rowslength.length; i++) {
        this.tablerows.push(i);
      }
      for (let j = 0; j < this.columnlength.length; j++) {
        this.tablecolumn.push(j);
      }
      this.opentabledataeditform = false;
    }
    if (action == 'attachfile') {
      this.openatatchfileditform = false;
    }
  }
  getvitals(event) {
    if (event.srcElement.innerText == "Imperial") {
      this.showeImperial = true;
      this.storevalue = 'true'
    }
    if (event.srcElement.innerText == "Metric") {
      this.showeImperial = false;
      this.storevalue = 'false'
    }
  }
  deletedata(index, name) {
    this.indexnumber = index;
    this.itemModuletype = name;
    this.opendeleteform = true;
  }
  fieldsChange(values: any, type): void {
    if (type == 'heading') {
      if (values.currentTarget.checked) {
        this.showcopyheading = true;
        this.headingcopytitle = "Heading2";
      } else {
        this.showcopyheading = false;
        this.headingcopytitle = "";
      }
    }
    if (type == 'textarea') {
      if (values.currentTarget.checked) {
        this.showcopytextarea = true;
        this.copytextarea = "Text2";
      } else {
        this.showcopytextarea = false;
        this.copytextarea = "";
      }
    }
    if (type == 'heading') {
      if (values.currentTarget.checked) {
        this.showcopyheading = true;
        this.headingcopytitle = "Heading2";
      } else {
        this.showcopyheading = false;
        this.headingcopytitle = "";
      }
    }
    if (type == 'number') {
      if (values.currentTarget.checked) {
        this.showcopynumber = true;
        this.numbercopytitle = "Number2";
      } else {
        this.showcopynumber = false;
        this.numbercopytitle = "";
      }
    }
    if (type == 'droupdown') {
      if (values.currentTarget.checked) {
        this.showcopydroupdown = true;
        this.numbercopytitle = "Droupdown 2";
      } else {
        this.showcopydroupdown = false;
        this.numbercopytitle = "";
      }
    }
    if (type == 'radio') {
      if (values.currentTarget.checked) {
        this.showcopyradio = true;
        this.radiocopytitle = "Radio Button 2";
      } else {
        this.showcopyradio = false;
        this.radiocopytitle = "";
      }
    }
    if (type == 'checkbox') {
      if (values.currentTarget.checked) {
        this.showcopycheckbox = true;
        this.checkboxcopytitle = "Check Box 2";
      } else {
        this.showcopycheckbox = false;
        this.checkboxcopytitle = "";
      }
    }
    if (type == 'range') {
      if (values.currentTarget.checked) {
        this.showcopyrange = true;
        this.rangecopytitle = "Range or Scale 2";
      } else {
        this.showcopyrange = false;
        this.rangecopytitle = "";
      }
    }
    if (type == 'optionlist') {
      if (values.currentTarget.checked) {
        this.showcopyoptionlist = true;
        this.optionlistcopytitle = "Option List 2";
      } else {
        this.showcopyoptionlist = false;
        this.optionlistcopytitle = "";
      }
    }
    if (type == 'datetime') {
      if (values.currentTarget.checked) {
        this.showcopydatetime = true;
        this.headingcopydatetime = "Date Time2";
      } else {
        this.showcopydatetime = false;
        this.headingcopydatetime = "";
      }
    }
  }
  mandotorydata(values: any, type): void {
    if (type == 'datetime') {
      if (values.currentTarget.checked) {
        this.shomandatetime = true;
      } else {
        this.shomandatetime = false;
      }
    }
    if (type == 'textarea') {
      if (values.currentTarget.checked) {
        this.shomantextarea = true;
      } else {
        this.shomantextarea = false;
      }
    }
    if (type == 'number') {
      if (values.currentTarget.checked) {
        this.shomannumber = true;
      } else {
        this.shomannumber = false;
      }
    }
    if (type == 'radio') {
      if (values.currentTarget.checked) {
        this.shomanradio = true;
      } else {
        this.shomanradio = false;
      }
    }
    if (type == 'checkbox') {
      if (values.currentTarget.checked) {
        this.shomancheckbox = true;
      } else {
        this.shomancheckbox = false;
      }
    }
    if (type == 'attachfile') {
      if (values.currentTarget.checked) {
        this.atchfiltmandtory = true;
      } else {
        this.atchfiltmandtory = false;
      }
    }
    if (type == 'chief') {
      if (values.currentTarget.checked) {
        this.shomanchief = true;
      } else {
        this.shomanchief = false;
      }
    }
    if (type == 'vitals') {
      if (values.currentTarget.checked) {
        this.shomanvitals = true;
      } else {
        this.shomanvitals = false;
      }
    }
  }
  includenotes(values: any, type): void {
    alert(type)
    if (type == 'checkbox') {
      if (values.currentTarget.checked) {
        this.showincludenoted = true;
      } else {
        this.showincludenoted = false;
      }
    }
  }
  onBookChange(ob, type) {
    if (type == "rows") {
      this.rowslength = [];
      this.rowtext = true;
      let selectedBook = ob.value;
      for (let i = 0; i < selectedBook; i++) {
        this.rowslength.push(i);
      }
    } else if (type == "column") {
      this.columnlength = [];
      this.columntext = true;
      let selectedBookc = ob.value;
      for (let j = 0; j < selectedBookc; j++) {
        this.columnlength.push(j);
        console.log(selectedBookc);
      }
    }
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
  downloadFile() {
    const downloadLink = document.createElement('a');
    const fileName = this.file.name;
    downloadLink.href = this.selectedFile.src;
    downloadLink.download = fileName;
    downloadLink.click();
  }
  deleteimage() {
    this.selectedFile = null;
  }
}