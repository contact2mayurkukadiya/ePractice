import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ToolsComponent } from './tools.component';
import { BusinessComponent } from '../settings/business/business.component';
import { EditBusinessComponent } from '../settings/business/edit-business/edit-business.component';
import { LocationsComponent } from '../settings/locations/locations.component';
import { AddLocationComponent } from '../settings/locations/add-location/add-location.component';
import { SpecialtyComponent } from '../settings/specialty/specialty.component';
import { AddSpecialtyComponent } from '../settings/specialty/add-specialty/add-specialty.component';
import { TaxComponent } from '../settings/tax/tax.component';
import { AddTaxComponent } from '../settings/tax/add-tax/add-tax.component';
import { ConcessionComponent } from '../settings/concession/concession.component';
import { AddConcessionComponent } from '../settings/concession/add-concession/add-concession.component';
import { TreatmentRoomComponent } from '../settings/treatment-room/treatment-room.component';
import { AddTreatmentRoomComponent } from '../settings/treatment-room/add-treatment-room/add-treatment-room.component';
import { CancelReasonComponent } from '../settings/cancel-reason/cancel-reason.component';
import { AddCancelReasonComponent } from '../settings/cancel-reason/add-cancel-reason/add-cancel-reason.component';
import { MissedReasonComponent } from '../settings/missed-reason/missed-reason.component';
import { AddMissedReasonComponent } from '../settings/missed-reason/add-missed-reason/add-missed-reason.component';
import { BlockoutTypeComponent } from '../settings/blockout-type/blockout-type.component';
import { AddBlockoutTypeComponent } from '../settings/blockout-type/add-blockout-type/add-blockout-type.component';
import { MarketingReferralSourceComponent } from '../settings/marketing-referral-source/marketing-referral-source.component';
import { AddMarketingReferralSourceComponent } from '../settings/marketing-referral-source/add-marketing-referral-source/add-marketing-referral-source.component';
import { PaymentTypeComponent } from '../settings/payment-type/payment-type.component';
import { AddPaymentTypeComponent } from '../settings/payment-type/add-payment-type/add-payment-type.component';
import { AppointmentTypeComponent } from '../settings/appointment-type/appointment-type.component';
import { AddAppointmentTypeComponent } from '../settings/appointment-type/add-appointment-type/add-appointment-type.component';
import { DiscountTypeComponent } from '../settings/discount-type/discount-type.component';
import { AddDiscountTypeComponent } from '../settings/discount-type/add-discount-type/add-discount-type.component';
import { DocumentTypeComponent } from '../settings/document-type/document-type.component';
import { AddDocumentTypeComponent } from '../settings/document-type/add-document-type/add-document-type.component';


const routes: Routes = [
  {
    path: '', component: ToolsComponent, children: [
      {
        'path': 'business', component: BusinessComponent
      },
      {
        'path': 'business/edit', component: EditBusinessComponent
      },
      {
        'path': 'locations', component: LocationsComponent
      },
      {
        'path': 'locations/add', component: AddLocationComponent
      },
      {
        'path': 'locations/edit/:locationId', component: AddLocationComponent
      },
      {
        'path': 'specialty', component: SpecialtyComponent,
      },
      {
        'path': 'specialty/add', component: AddSpecialtyComponent
      },
      {
        'path': 'specialty/edit/:specialtyId', component: AddSpecialtyComponent
      },
      {
        'path': 'tax', component: TaxComponent,
      },
      {
        'path': 'tax/add', component: AddTaxComponent
      },
      {
        'path': 'tax/edit/:taxId', component: AddTaxComponent
      },
      {
        'path': 'concession', component: ConcessionComponent,
      },
      {
        'path': 'concession/add', component: AddConcessionComponent
      },
      {
        'path': 'concession/edit/:concessionId', component: AddConcessionComponent
      },
      {
        'path': 'treatmentRoom', component: TreatmentRoomComponent,
      },
      {
        'path': 'treatmentRoom/add', component: AddTreatmentRoomComponent
      },
      {
        'path': 'treatmentRoom/edit/:treatmentRoomId', component: AddTreatmentRoomComponent
      },
      {
        'path': 'cancelReason', component: CancelReasonComponent,
      },
      {
        'path': 'cancelReason/add', component: AddCancelReasonComponent
      },
      {
        'path': 'cancelReason/edit/:cancelReasonId', component: AddCancelReasonComponent
      },
      {
        'path': 'missedReason', component: MissedReasonComponent,
      },
      {
        'path': 'missedReason/add', component: AddMissedReasonComponent
      },
      {
        'path': 'missedReason/edit/:missedReasonId', component: AddMissedReasonComponent
      },
      {
        'path': 'blockoutType', component: BlockoutTypeComponent,
      },
      {
        'path': 'blockoutType/add', component: AddBlockoutTypeComponent
      },
      {
        'path': 'blockoutType/edit/:blockoutTypeId', component: AddBlockoutTypeComponent
      },
      {
        'path': 'marketingReferralSource', component: MarketingReferralSourceComponent,
      },
      {
        'path': 'marketingReferralSource/add', component: AddMarketingReferralSourceComponent
      },
      {
        'path': 'marketingReferralSource/edit/:marketingReferralSourceId', component: AddMarketingReferralSourceComponent
      },
      {
        'path': 'paymentType', component: PaymentTypeComponent,
      },
      {
        'path': 'paymentType/add', component: AddPaymentTypeComponent
      },
      {
        'path': 'paymentType/edit/:paymentTypeId', component: AddPaymentTypeComponent
      },
      {
        'path': 'appointmentType', component: AppointmentTypeComponent,
      },
      {
        'path': 'appointmentType/add', component: AddAppointmentTypeComponent
      },
      {
        'path': 'appointmentType/edit/:appointmentTypeId', component: AddAppointmentTypeComponent
      },
      {
        'path': 'discountType', component: DiscountTypeComponent,
      },
      {
        'path': 'discountType/add', component: AddDiscountTypeComponent
      },
      {
        'path': 'discountType/edit/:discountTypeId', component: AddDiscountTypeComponent
      },
      {
        'path': 'documentType', component: DocumentTypeComponent,
      },
      {
        'path': 'documentType/add', component: AddDocumentTypeComponent
      },
      {
        'path': 'documentType/edit/:documentTypeId', component: AddDocumentTypeComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToolsRoutingModule { }
