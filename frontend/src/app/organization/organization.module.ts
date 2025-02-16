/**
 * The Organization Module couples all features of the Organization feature
 * into a single unit that can be loaded at once. This decreases load time
 * for the overall application and decouples this feature from other features
 * in the application.
 *
 * @author Ajay Gandecha, Jade Keegan, Brianna Ta, Audrey Toney
 * @copyright 2023
 * @license MIT
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Angular Material Modules */
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatListItem, MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';

import { OrganizationPageComponent } from './organization-page/organization-page.component';
import { OrganizationRoutingModule } from './organization-routing.module';
import { OrganizationDetailsComponent } from './organization-details/organization-details.component';

import { OrganizationFilterPipe } from './organization-filter/organization-filter.pipe';

/* UI Widgets */
import { OrganizationCard } from './widgets/organization-card/organization-card.widget';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { OrganizationDetailsInfoCard } from './widgets/organization-details-info-card/organization-details-info-card.widget';
import { OrganizationEditorComponent } from '/workspace/frontend/src/app/organization/organization-editor/organization-editor.component';
import { OrganizationNotFoundCard } from './widgets/organization-not-found-card/organization-not-found-card.widget';
import { OrganizationRosterCard } from './widgets/organization-roster-card/organization-roster-card.widget';
import { OrganizationRequestFormComponent } from './organization-request-form/organization-request-form.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AddMemberFormComponent } from './add-member-form/add-member-form.component';
import { ProspectiveMembersComponent } from './widgets/prospective-members/prospective-members.widget';
import { ViewRequestComponent } from './view-request/view-request.component';

@NgModule({
  declarations: [
    OrganizationPageComponent,
    OrganizationDetailsComponent,
    OrganizationEditorComponent,
    OrganizationRequestFormComponent,
    AddMemberFormComponent,

    // Pipes
    OrganizationFilterPipe,

    // UI Widgets
    OrganizationCard,
    OrganizationDetailsInfoCard,
    OrganizationNotFoundCard,
    OrganizationRosterCard,
    AddMemberFormComponent,
    ProspectiveMembersComponent,
    ViewRequestComponent
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    MatTableModule,
    MatCardModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatListModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
    OrganizationRoutingModule,
    RouterModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatCardModule,
    MatButtonToggleModule,
    MatExpansionModule
  ]
})
export class OrganizationModule {}
