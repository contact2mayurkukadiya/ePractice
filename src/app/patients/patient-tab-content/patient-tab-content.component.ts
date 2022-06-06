import {
  Component,
  ComponentFactoryResolver,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { PatientTab } from 'src/app/models/app.patient.model';
import { ContentContainerDirective } from 'src/app/tools/tab-content/content-container.directive';

@Component({
  selector: 'app-patient-tab-content',
  template: '<ng-template content-container></ng-template>',
})
export class PatientTabContentComponent implements OnInit, OnChanges {
  @Input() patientTab: PatientTab;
  @Input() active: boolean;
  @Input() patientId: string;

  @ViewChild(ContentContainerDirective, { static: true })
  contentContainer: ContentContainerDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  componentRef: any;

  ngOnInit() {
    this.loadComponent();
  }

  loadComponent() {
    const viewContainerRef = this.contentContainer.viewContainerRef;
    viewContainerRef.clear();

    const patientTab: PatientTab = this.patientTab;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      patientTab.component
    );

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    console.log(this.componentRef);
    (this.componentRef
      .instance as SkeletonComponent).patientId = this.patientId;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.active && this.componentRef) {
      this.active = changes.active.currentValue;
      this.patientId = changes.active.currentValue;
      this.loadComponent();
    }
  }
}

export interface SkeletonComponent {
  patientId: string;
}
