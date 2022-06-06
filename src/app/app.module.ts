import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from "@angular/platform-browser/animations";
import { LoginComponent } from "./login/login.component";
import { ContactsComponent } from "./contacts/contacts.component";
import { AddThirdPartyContactsComponent } from './contacts/add-third-party/add-third-party.component';
import { AddReferralContactsComponent } from './contacts/add-referral/add-referral.component';
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import {
  MatInputModule,
  MatListModule,
  MatTooltipModule,
  MatExpansionModule,
  MatDatepickerModule,
  MatSlideToggleModule,
  MatTabsModule,
  MatRadioModule,
  MatTableModule,
  MatProgressBarModule,
  MatButtonToggleModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatBottomSheetModule,
  MatSnackBarModule,
} from "@angular/material";
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { MatIconModule } from "@angular/material/icon";
import { RegisterComponent } from "./register/register.component";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FooterComponent } from "./footer/footer.component";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { SidenavComponent } from "./sidenav/sidenav.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AppService } from "./app.service";
import { MatDividerModule } from "@angular/material/divider";
import { MatMenuModule } from "@angular/material/menu";
import { AppointmentComponent } from "./appointment/appointment.component";
import { AuthorisationComponent } from "./authorisation/authorisation.component";
import { AppState } from "./app.state";
import { SecurityGuard } from "./authorisation/authorisation.guard";
import { AuthInterceptor } from "./app.http-interceptor";
import { AuthService } from "./services/app.authenication.service";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { NgxCaptchaModule } from "ngx-captcha";
import { ColorPickerModule } from "ngx-color-picker";
import { ActivationComponent } from "./activation/activation.component";
import { BusinessService } from "./services/app.business.service";
import { AlertComponent } from "./shared/alert/alert.component";
import { SharedModule } from "./shared.modules";
import { BlockUIModule } from "ng-block-ui";
import { MiscService } from "./services/app.misc.service";
import { OrderModule } from "ngx-order-pipe";
import { AddUserComponent } from "./settings/users/addUser/addUser.component";
import { UsersComponent } from "./settings/users/users.component";
import { SettingsService } from "./services/app.settings.service";
import { RolesComponent } from "./settings/roles/roles.component";
import { AddRolesComponent } from "./settings/roles/add-roles/add-roles.component";
import { CommonModule } from "@angular/common";
import { PractitionerDetailsOptionsComponent } from "./settings/users/practitioner-details-options/practitioner-details-options.component";
import { ApplicationDataService } from "./services/app.applicationdata.service";
import { RoleService } from "./services/app.role.service";
import { BaseService } from "./services/app.base.service";
import { StaffService } from "./services/app.staff.service";
import { OfferingsService } from "./services/app.offerings.service";
import { ContactService } from "./services/app.contact.service";
import { RolesAndPermissionsComponent } from "./settings/roles-and-permissions/roles-and-permissions.component";
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { AddProductsComponent } from './offerings/products/add-products.component';
import { AddClassComponent } from './offerings/classes/add-class.component';
import { AddServiceComponent } from './offerings/service/add-service.component';
import { OfferingsComponent } from './offerings/offerings.component';
import { ScheduleComponent } from './appointment/schedule/schedule.component';
import { CreateAppointmentComponent } from './appointment/create-appointment/create-appointment.component';
import { PractitionerTodayComponent } from './appointment/practitioner-today/practitioner-today.component';
import { WaitListComponent } from './appointment/wait-list/wait-list.component';
import { RoomComponent } from './appointment/room/room.component';
import { AppointmentHeaderComponent } from './appointment/appointment-header/appointment-header.component';
import { AddScheduleComponent } from './appointment/schedule/add-schedule/add-schedule.component';
import { AppointmentService } from './services/app.appointment.service';
import { ScheduleEditService } from './services/app.schedule.editservice';
import { RoomEditService } from './services/app.room.editservice';
import { AddRoomComponent } from './appointment/room/add-room/add-room.component';
import { PatientService } from './services/app.patient.service';
import { AddBreakComponent } from './appointment/add-break/add-break.component';
import { AppointmentEditService } from './services/app.appointment.editservice';
import { DashboardService } from './services/app.dashboard.service';
import { AddWaitListComponent } from './appointment/add-wait-list/add-wait-list.component';
import { NgImageFullscreenViewModule } from "ng-image-fullscreen-view";
import { CKEditorModule } from 'ckeditor4-angular';

import { TreeViewModule } from '@progress/kendo-angular-treeview';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { PopupModule } from '@progress/kendo-angular-popup';
import { MaterialTimePickerModule } from './material-timepicker/material-timepicker.module';
// import { ImgViewerModule } from 'ng-picture-viewer';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CreatePractitionerComponent } from './appointment/create-practitioner/create-practitioner.component';
import { DxDateBoxModule, DxSchedulerModule, DxSwitchModule } from "devextreme-angular";
import { TagInputModule } from 'ngx-chips';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ContactsComponent,
    AddReferralContactsComponent,
    AddThirdPartyContactsComponent,
    RegisterComponent,
    FooterComponent,
    SidenavComponent,
    DashboardComponent,
    AppointmentComponent,
    AuthorisationComponent,
    ForgotPasswordComponent,
    ActivationComponent,
    UsersComponent,
    AddUserComponent,
    RolesComponent,
    AddRolesComponent,
    PractitionerDetailsOptionsComponent,
    RolesAndPermissionsComponent,
    AccessDeniedComponent,
    OfferingsComponent,
    AddProductsComponent,
    AddClassComponent,
    AddServiceComponent,
    ScheduleComponent,
    CreateAppointmentComponent,
    PractitionerTodayComponent,
    WaitListComponent,
    RoomComponent,
    AppointmentHeaderComponent,
    AddScheduleComponent,
    AddRoomComponent,
    AddBreakComponent,
    AddWaitListComponent,
    CreatePractitionerComponent,
  ],
  imports: [
  CommonModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatToolbarModule,
    MatDividerModule,
    MatMenuModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
    MatListModule,
    MatTooltipModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatRadioModule,
    NoopAnimationsModule,
    ColorPickerModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatIconModule,
    BlockUIModule.forRoot(),
    OrderModule,
    MatButtonToggleModule,
    MatDialogModule,
    SchedulerModule,
    LayoutModule,
    NgImageFullscreenViewModule,
    DropDownsModule,
    CKEditorModule,
    TreeViewModule,
    TooltipModule,
    PopupModule,
    MaterialTimePickerModule,
    // ImgViewerModule,
    NgbModule,
    DxSchedulerModule,
    DxSwitchModule,
    DxDateBoxModule,
    TagInputModule,
  ],
  exports: [AlertComponent],
  providers: [
    AppService,
    BaseService,
    AuthInterceptor,
    AppState,
    SecurityGuard,
    AuthService,
    BusinessService,
    MiscService,
    ApplicationDataService,
    OfferingsService,
    PatientService,
    ContactService,
    SettingsService,
    SidenavComponent,
    RoleService,
    StaffService,
    AppointmentService,
    ScheduleEditService,
    AppointmentEditService,
    RoomEditService,
    DashboardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [PractitionerDetailsOptionsComponent, CreateAppointmentComponent],
})
export class AppModule { }
