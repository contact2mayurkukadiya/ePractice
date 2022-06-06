import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { ApplicationDataComponent } from './application-data/application-data.component';
import { PersonalizeComponent } from './personalize/personalize.component';
import { TreatmentNotesTemplateComponent } from './treatment-notes-template/treatment-notes-template.component';
import { AddTreatmentNotesTemplateComponent } from './treatment-notes-template/add-treatment-notes-template/add-treatment-notes-template.component';
import { TemplateLibraryComponent } from './treatment-notes-template/template-library/template-library.component';
import { EmailtemplateComponent } from './emailtemplate/emailtemplate.component';
import { LettertemplateComponent } from './lettertemplate/lettertemplate.component';
import { AddemailtemplateComponent } from './emailtemplate/addemailtemplate/addemailtemplate.component';
import { AddlettertemplateComponent } from './lettertemplate/addlettertemplate/addlettertemplate.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: 'personalize/:option',
        component: PersonalizeComponent,
      },
      {
        path: 'applicationdata',
        component: ApplicationDataComponent,
      },
      {
        path: 'treatmentnotestemplate',
        component: TreatmentNotesTemplateComponent,
      },
      {
        path: 'treatmentnotestemplate/edit/:treatmentNotesTemplateId',
        component: AddTreatmentNotesTemplateComponent,
      },
      {
        path: 'treatmentnotestemplate/add',
        component: AddTreatmentNotesTemplateComponent,
      },
      {
        path: 'templatelibrary',
        component: TemplateLibraryComponent,
      },
      {
        path: 'emailtemplate',
        component: EmailtemplateComponent,
      },
      {
        path: 'lettertemplate',
        component: LettertemplateComponent,
      },
      {
        path: 'emailtemplate/add',
        component: AddemailtemplateComponent,
      },
      {
        path: 'lettertemplate/add',
        component: AddlettertemplateComponent,
      },
      {
        path: 'emailtemplate/edit/:emailTemplateId',
        component: AddemailtemplateComponent,
      },
      {
        path: 'lettertemplate/edit/:letterTemplateId',
        component: AddlettertemplateComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule { }
