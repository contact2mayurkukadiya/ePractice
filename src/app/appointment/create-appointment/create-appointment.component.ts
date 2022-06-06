import { Component, Inject } from '@angular/core';
import { MatSnackBarRef } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html',
  styleUrls: ['./create-appointment.component.css'],
})
export class CreateAppointmentComponent {

  recurrenceData: any = [
    { label: 'No Recurrence', value: false },
    { label: 'Daily', value: 'DAILY' },
    { label: 'Weekly', value: 'WEEKLY' },
    { label: 'Monthly', value: 'MONTHLY' },
    { label: 'Yearly', value: 'YEARLY' },
  ]

  recurrenceFreq: false | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' = false;
  interval: number = 1;
  repeatWeekDay: boolean = false;
  recurrenceRangeType: "none" | 'after' | 'by'
  rangeOfOccurenceBy: any;
  rangeOfOccurenceAfter: any;
  week: any = [
    { icon: 'S', selected: false, value: "SU" },
    { icon: 'M', selected: false, value: "MO" },
    { icon: 'T', selected: false, value: "TU" },
    { icon: 'W', selected: false, value: "WE" },
    { icon: 'T', selected: false, value: "TH" },
    { icon: 'F', selected: false, value: "FR" },
    { icon: 'S', selected: false, value: "SA" },

  ]
  // MONTHLY repeat
  monthlyDayWise: boolean = true;
  repeatEvery: number = 1;
  repeatMonths: number = 1;
  dayNumberData: Array<any> = [
    { label: 'First', value: 1 },
    { label: 'Second', value: 2 },
    { label: 'Third', value: 3 },
    { label: 'Fourth', value: 4 }
  ]
  dayNumber: any = 1
  dayNameData: Array<any> = [
    { label: 'Monday', value: 'Monday' },
    { label: 'Tuesday', value: 'Tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'Thursday' },
    { label: 'Friday', value: 'Friday' },
    { label: 'Saturday', value: 'Saturday' },
  ];
  dayName: any = 'Monday';
  repeatDayOnMonth: number = 1

  // YEARLY repeat
  yearlyDayWise: boolean = true;
  recureEvery: number = 1;
  recureMonths: number = 1;
  monthData: number = 1;
  monthList:Array<any> = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
  ]
  recureDayNumber: number = 1;
  recureDayName: any = 'Monday';

  constructor(public dialogRef: MatDialogRef<CreateAppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (typeof data.appointmentData.allDay == 'undefined') {
      data.appointmentData.allDay = false;
    }
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.dialogRef.close(this.data.appointmentData);
  }

  generateRecurrencePattern() {
    let rule = "";
    if (this.recurrenceFreq == false) {
      delete this.data.appointmentData.recurrenceRule
    }
    else {
      rule = rule + 'FERQ=' + this.recurrenceFreq
      switch (this.recurrenceFreq) {
        case "DAILY":
          // FREQ=DAILY;INTERVAL=3;UNTIL=20210311T182959Z
          rule = rule + "INTERVAL=" + this.interval
          break;
        case "WEEKLY": break;
        case "MONTHLY": break;
        case "YEARLY": break;
      }
    }
  }
}
