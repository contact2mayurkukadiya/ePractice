import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { SecurityGuard } from './authorisation/authorisation.guard';
import { AuthorisationComponent } from './authorisation/authorisation.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ActivationComponent } from './activation/activation.component';
import { AddUserComponent } from './settings/users/addUser/addUser.component';
import { UsersComponent } from './settings/users/users.component';
import { ContactsComponent } from './contacts/contacts.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { AddThirdPartyContactsComponent } from './contacts/add-third-party/add-third-party.component';
import { AddReferralContactsComponent } from './contacts/add-referral/add-referral.component';
import { AddGeneralContactsComponent } from './contacts/add-general/add-general.component';
import { OfferingsComponent } from './offerings/offerings.component';
import { AddProductsComponent } from './offerings/products/add-products.component';
import { AddClassComponent } from './offerings/classes/add-class.component';
import { AddServiceComponent } from './offerings/service/add-service.component';
import { ScheduleComponent } from './appointment/schedule/schedule.component';
import { CreateAppointmentComponent } from './appointment/create-appointment/create-appointment.component';
import { PractitionerTodayComponent } from './appointment/practitioner-today/practitioner-today.component';
import { RoomComponent } from './appointment/room/room.component';
import { WaitListComponent } from './appointment/wait-list/wait-list.component';
import { CreatePractitionerComponent } from './appointment/create-practitioner/create-practitioner.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'contacts', component: ContactsComponent, canActivate: [SecurityGuard] },
  { path: 'contacts/referral/add', component: AddReferralContactsComponent, canActivate: [SecurityGuard] },
  { path: 'contacts/referral/edit/:contactId', component: AddReferralContactsComponent, canActivate: [SecurityGuard] },
  { path: 'contacts/thirdparty/add', component: AddThirdPartyContactsComponent, canActivate: [SecurityGuard] },
  { path: 'contacts/thirdparty/edit/:contactId', component: AddThirdPartyContactsComponent, canActivate: [SecurityGuard] },
  { path: 'contacts/general/add', component: AddGeneralContactsComponent, canActivate: [SecurityGuard] },
  { path: 'contacts/general/edit/:contactId', component: AddGeneralContactsComponent, canActivate: [SecurityGuard] },
  { path: 'authorisation/:token', component: AuthorisationComponent },
  { path: 'forgotpassword', component: ForgotPasswordComponent },
  { path: 'activate', component: ActivationComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [SecurityGuard] },
  { path: 'appointment', component: AppointmentComponent, canActivate: [SecurityGuard] },
  { path: 'appointment/create-practitioner', component: CreatePractitionerComponent, canActivate: [SecurityGuard] },
  { path: 'appointment/schedule', component: ScheduleComponent, canActivate: [SecurityGuard] },
  { path: 'appointment/create', component: CreateAppointmentComponent, canActivate: [SecurityGuard] },
  { path: 'appointment/today', component: PractitionerTodayComponent, canActivate: [SecurityGuard] },
  { path: 'appointment/room', component: RoomComponent, canActivate: [SecurityGuard] },
  { path: 'appointment/waitlist', component: WaitListComponent, canActivate: [SecurityGuard] },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsModule', canActivate: [SecurityGuard] },
  { path: 'tools', loadChildren: './tools/tools.module#ToolsModule', canActivate: [SecurityGuard] },
  { path: 'patients', loadChildren: './patients/patients.module#PatientsModule', canActivate: [SecurityGuard] },
  { path: 'staffs', component: UsersComponent, canActivate: [SecurityGuard] },
  { path: 'staffs/add', component: AddUserComponent, canActivate: [SecurityGuard] },
  { path: 'staffs/:staffId', component: AddUserComponent, canActivate: [SecurityGuard] },
  { path: 'offerings', component: OfferingsComponent, canActivate: [SecurityGuard] },
  { path: 'offerings/products/add', component: AddProductsComponent, canActivate: [SecurityGuard] },
  { path: 'offerings/products/edit/:productId', component: AddProductsComponent, canActivate: [SecurityGuard] },
  { path: 'offerings/classes/add', component: AddClassComponent, canActivate: [SecurityGuard] },
  { path: 'offerings/classes/edit/:classId', component: AddClassComponent, canActivate: [SecurityGuard] },
  { path: 'offerings/service/add', component: AddServiceComponent, canActivate: [SecurityGuard] },
  { path: 'offerings/service/edit/:serviceId', component: AddServiceComponent, canActivate: [SecurityGuard] },
  { path: 'accessDenied', component: AccessDeniedComponent, canActivate: [SecurityGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
