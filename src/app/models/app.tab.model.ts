import { Type } from '@angular/core';

export class Tab {
    public id: number;
    public title: string;
    public tabData?: TabData;
    public active: boolean;
    public component: Type<any>;
    public showClose?: boolean;
    public clickEvent?: any;
    public addUrl: string;
    public addLabel: string;
  
    constructor(component: Type<any>, title: string, tabData: TabData, showClose: boolean, active: boolean = false) {
      this.tabData = tabData;
      this.component = component;
      this.title = title;
      this.showClose = showClose;
      this.active = active;
    }
}


export interface TabData {
    parent?: string;
    type?: string;
}