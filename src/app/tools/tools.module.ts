import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatSelectModule, MatCheckboxModule, MatSidenavModule, MatToolbarModule, MatDividerModule, MatMenuModule, MatListModule, MatTooltipModule, MatExpansionModule, MatDatepickerModule, MatSlideToggleModule, MatTabsModule, MatRadioModule, MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, MatProgressSpinnerModule, MatButtonToggleModule, MatDialogModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
import { IntlModule } from '@progress/kendo-angular-intl';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { SharedModule } from '../shared.modules';
import { BlockUIModule } from 'ng-block-ui';
import { OrderModule } from 'ngx-order-pipe';
import { TimePickerModule, DateInputsModule, CalendarModule } from '@progress/kendo-angular-dateinputs';
import { ToolsRoutingModule } from './tools-routing.module';
import { BusinessComponent } from '../settings/business/business.component';
import { AddBusinessComponent } from '../settings/business/add/add.component';
import { ViewBusinessComponent } from '../settings/business/view-business/view-business.component';
import { EditBusinessComponent } from '../settings/business/edit-business/edit-business.component';
import { LocationsComponent } from '../settings/locations/locations.component';
import { AddLocationComponent } from '../settings/locations/add-location/add-location.component';
import { ToolsComponent } from './tools.component';
import { TabContentComponent } from './tab-content/tab-content.component';
import { SpecialtyComponent } from '../settings/specialty/specialty.component';
import { TreatmentRoomComponent } from '../settings/treatment-room/treatment-room.component';
import { TaxComponent } from '../settings/tax/tax.component';
import { PaymentTypeComponent } from '../settings/payment-type/payment-type.component';
import { ConcessionComponent } from '../settings/concession/concession.component';
import { DiscountTypeComponent } from '../settings/discount-type/discount-type.component';
import { AddSpecialtyComponent } from '../settings/specialty/add-specialty/add-specialty.component';
import { AddTaxComponent } from '../settings/tax/add-tax/add-tax.component';
import { AddConcessionComponent } from '../settings/concession/add-concession/add-concession.component';
import { AddTreatmentRoomComponent } from '../settings/treatment-room/add-treatment-room/add-treatment-room.component';
import { CancelReasonComponent } from '../settings/cancel-reason/cancel-reason.component';
import { AddCancelReasonComponent } from '../settings/cancel-reason/add-cancel-reason/add-cancel-reason.component';
import { MissedReasonComponent } from '../settings/missed-reason/missed-reason.component';
import { AddMissedReasonComponent } from '../settings/missed-reason/add-missed-reason/add-missed-reason.component';
import { BlockoutTypeComponent } from '../settings/blockout-type/blockout-type.component';
import { AddBlockoutTypeComponent } from '../settings/blockout-type/add-blockout-type/add-blockout-type.component';
import { MarketingReferralSourceComponent } from '../settings/marketing-referral-source/marketing-referral-source.component';
import { AddMarketingReferralSourceComponent } from '../settings/marketing-referral-source/add-marketing-referral-source/add-marketing-referral-source.component';
import { AddPaymentTypeComponent } from '../settings/payment-type/add-payment-type/add-payment-type.component';
import { AddAppointmentTypeComponent } from '../settings/appointment-type/add-appointment-type/add-appointment-type.component';
import { AppointmentTypeComponent } from '../settings/appointment-type/appointment-type.component';
import { AddDiscountTypeComponent } from '../settings/discount-type/add-discount-type/add-discount-type.component';
import { DocumentTypeComponent } from '../settings/document-type/document-type.component';
import { AddDocumentTypeComponent } from '../settings/document-type/add-document-type/add-document-type.component';


@NgModule({
  declarations: [
    ToolsComponent,
    BusinessComponent,
    AddBusinessComponent,
    ViewBusinessComponent,
    EditBusinessComponent,
    LocationsComponent,
    AddLocationComponent,
    TabContentComponent,
    SpecialtyComponent,
    TreatmentRoomComponent,
    TaxComponent,
    PaymentTypeComponent,
    ConcessionComponent,
    DiscountTypeComponent,
    AddSpecialtyComponent,
    AddTaxComponent,
    AddConcessionComponent,
    AddTreatmentRoomComponent,
    CancelReasonComponent,
    AddCancelReasonComponent,
    MissedReasonComponent,
    AddMissedReasonComponent,
    BlockoutTypeComponent,
    AddBlockoutTypeComponent,
    MarketingReferralSourceComponent,
    AddMarketingReferralSourceComponent,
    PaymentTypeComponent,
    AddPaymentTypeComponent,
    AppointmentTypeComponent,
    AddAppointmentTypeComponent,
    DiscountTypeComponent,
    AddDiscountTypeComponent,
    DocumentTypeComponent,
    AddDocumentTypeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ToolsRoutingModule,
    MatListModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatToolbarModule,
    MatDividerModule,
    MatMenuModule,
    MatListModule,
    MatTooltipModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatRadioModule,
    ReactiveFormsModule,
    ColorPickerModule,
    FormsModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    DateInputsModule,
    CalendarModule,
    IntlModule,
    TimePickerModule,
    InputsModule,
    MatButtonToggleModule,
    MatIconModule,
    BlockUIModule.forRoot(),
    MatDialogModule,
    OrderModule,
  ],
  entryComponents: [
    SpecialtyComponent,
    TreatmentRoomComponent,
    TaxComponent,
    PaymentTypeComponent,
    ConcessionComponent,
    DiscountTypeComponent
  ]
})
export class ToolsModule { }
