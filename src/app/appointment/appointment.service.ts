import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Practitioner {
  id?: string,
  type?: number,
  name?: string,
  speciality?: 'Cardiology' | 'Oncology' | 'Neurology' | 'Urology' | 'Gastroenterology' | 'Gynaecology' | 'Bone Marrow Transplant',
  schedulerAccess?: boolean
  selected?: boolean,
  avatar?: string
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  PractitionerList: BehaviorSubject<Array<Practitioner>>;
  getPractioners: any;
  PractitionerListValue: Array<Practitioner> = [];
  constructor() {
    this.PractitionerList = new BehaviorSubject([]);
    this.getPractioners = this.PractitionerList.asObservable();
    this.getPractioners.subscribe(value => {
      this.PractitionerListValue = [...value];
    });
  }

  set Practitioner(value: Practitioner) {
    const updatedValue = [...this.PractitionerListValue, value];
    this.PractitionerList.next(updatedValue);
  }

  get Practitioner() {
    return this.getPractioners.value;
  }

  updatePractioner(list: Array<Practitioner>) {
    this.PractitionerList.next(list);
  }

  create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }
}
