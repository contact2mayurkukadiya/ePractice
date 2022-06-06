import { Component, OnInit } from '@angular/core';
import { GridDataResult, PageChangeEvent, DataStateChangeEvent } from '@progress/kendo-angular-grid';
import { process, SortDescriptor, State, CompositeFilterDescriptor, FilterDescriptor, GroupDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'app-base-grid',
  template: `
    <p>
      base-grid works!
    </p>
  `,
  styleUrls: ['./base-grid.component.css']
})
export class BaseGridComponent implements OnInit {

  public permission: string[];

  get haveDeletePermission(): boolean {
    return this.permission.indexOf("D") >= 0;
  }

  get haveViewPermission(): boolean {
    return this.permission.indexOf("V") >= 0;
  }

  get haveEditPermission(): boolean {
    return this.permission.indexOf("E") >= 0;
  }

  public gridData: any[];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  public locationData: any[];
  public multiple = false;
  public allowUnsort = true;
  public reorder = true;
  public hasItems = false;
  public sort: SortDescriptor[] = [{
    field: 'id',
    dir: 'asc'
  }];
  public groups: GroupDescriptor[] = [];

  activeFilters: CompositeFilterDescriptor = {
    logic: 'and',
    filters: [{ field: 'isStatus', operator: 'eq', value: true }]
  }

  inactiveFilters: CompositeFilterDescriptor = {
    logic: 'and',
    filters: [{ field: 'isStatus', operator: 'eq', value: false }]
  }


  activeFilterss: CompositeFilterDescriptor = {
    logic: 'and',
    filters: [{ field: 'status', operator: 'eq', value: true }]
  }

  inactiveFilterss: CompositeFilterDescriptor = {
    logic: 'and',
    filters: [{ field: 'status', operator: 'eq', value: false }]
  }

  public state: State = {
    skip: this.skip,
    take: this.pageSize,
    sort: this.sort,
    filter: this.activeFilters
  };
  public states: State = {
    skip: this.skip,
    take: this.pageSize,
    sort: this.sort,
    filter: this.activeFilterss
  };

  removeFilters() {
    this.state.filter = null;
  }
  removeFilterss() {
    this.states.filter = null;
  }

  constructor() { }

  ngOnInit() {

  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.state.sort = sort;
    this.loadItems();
  }

  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.state.skip = event.skip;
    this.loadItems();
  }

  public groupChange(groups: GroupDescriptor[]): void {
    this.groups = groups;
    this.state.group = groups;
    this.loadItems();
  }

  public setActiveFilter() {
    this.state.filter = this.activeFilters;
  }

  public setInactiveFilter() {
    this.state.filter = this.inactiveFilters;
  }

  public loadItems(): void {
    this.hasItems = this.gridData && this.gridData.length > 0;
    this.gridView = process(this.gridData, this.state);
  }

  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.loadItems();
  }


  // For Letter and Email Template 
  public sortChanges(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.states.sort = sort;
    this.loadItemss();
  }

  public pageChanges(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.states.skip = event.skip;
    this.loadItemss();
  }

  public groupChanges(groups: GroupDescriptor[]): void {
    // console.log(groups); return;
    this.groups = groups;
    this.states.group = groups;
    this.loadItemss();
  }

  public setActiveFilters() {
    this.states.filter = this.activeFilterss;
  }

  public setInactiveFilters() {
    this.states.filter = this.inactiveFilterss;
  }

  public loadItemss(): void {
    // console.log(this.states);
    this.hasItems = this.gridData && this.gridData.length > 0;
    this.gridView = process(this.gridData, this.states);
    // console.log(this.gridView);
  }

  public dataStateChanges(states: DataStateChangeEvent): void {
    console.log(states);
    this.states = states;
    this.loadItemss();
  }


}
