import { Component, Input, ComponentFactoryResolver, ViewChild, OnInit, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy } from "@angular/core";
import { ContentContainerDirective } from "./content-container.directive";
import { Tab } from 'src/app/models/app.tab.model';
import { BaseGridComponent } from 'src/app/shared/base-grid/base-grid.component';

@Component({
  selector: 'app-tab-content',
  template: "<ng-template content-container></ng-template>"
})

export class TabContentComponent implements OnInit, OnChanges {
  @Input() tab : Tab;
  @Input() active : boolean;

  @ViewChild(ContentContainerDirective, { static: true}) contentContainer: ContentContainerDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

  componentRef: any;

  ngOnInit() {
    this.loadComponent();
  }

  loadComponent() {
    const viewContainerRef = this.contentContainer.viewContainerRef;
    viewContainerRef.clear();

    const tab: Tab = this.tab;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      tab.component
    );
    
    this.componentRef = viewContainerRef.createComponent(componentFactory);
    (this.componentRef.instance as SkeletonComponent).data = this.active;
  }

  ngOnChanges(changes: SimpleChanges)  {
    if(changes && changes.active && this.componentRef) {
      this.active = changes.active.currentValue;
      this.loadComponent();
    }
  }
}

export interface SkeletonComponent {
  data: boolean;
  clickEvent: any;
  queryEvent: any;
}