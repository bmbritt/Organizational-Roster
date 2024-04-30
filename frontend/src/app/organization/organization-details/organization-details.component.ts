/* eslint-disable prettier/prettier */
/**
 * The Organization Detail Component displays more information and options regarding
 * UNC CS organizations.
 *
 * @author Ajay Gandecha, Jade Keegan, Brianna Ta, Audrey Toney
 * @copyright 2023
 * @license MIT
 */

import { Component } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ResolveFn,
  Route
} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { profileResolver } from '/workspace/frontend/src/app/profile/profile.resolver';
import { Organization } from '../organization.model';
import { Profile } from '/workspace/frontend/src/app/profile/profile.service';
import {
  organizationDetailResolver,
  organizationEventsResolver
} from '../organization.resolver';
import { EventService } from 'src/app/event/event.service';
import { Event } from 'src/app/event/event.model';
import { Observable, map } from 'rxjs';
import { PermissionService } from 'src/app/permission.service';
import { OrganizationService } from '../organization.service';
import { Member } from '../organization-roster.model';
import { CompletedRequestObject } from '../organization-request-form/organization-request.model';

/** Injects the organization's name to adjust the title. */
let titleResolver: ResolveFn<string> = (route: ActivatedRouteSnapshot) => {
  return route.parent!.data['organization']?.name ?? 'Organization Not Found';
};

@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.css']
})
export class OrganizationDetailsComponent {
  /** Route information to be used in Organization Routing Module */

  public static Route: Route = {
    path: ':slug',
    component: OrganizationDetailsComponent,
    resolve: {
      profile: profileResolver,
      organization: organizationDetailResolver,
      events: organizationEventsResolver
    },
    children: [
      {
        path: '',
        title: titleResolver,
        component: OrganizationDetailsComponent
      }
    ]
  };

  /** Store the currently-logged-in user's profile.  */
  public profile: Profile;

  /** The organization to show */
  public organization: Organization;

  /** Store a map of days to a list of events for that day */
  public eventsPerDay: [string, Event[]][];

  /** Whether or not the user has permission to update events. */
  public eventCreationPermission$: Observable<boolean>;
  public roster: Member[];

  public requests: CompletedRequestObject[] = [];
  /** Constructs the Organization Detail component */
  constructor(
    private route: ActivatedRoute,
    protected snackBar: MatSnackBar,
    protected eventService: EventService,
    private permission: PermissionService,
    public orgservice: OrganizationService
  ) {
    /** Initialize data from resolvers. */
    const data = this.route.snapshot.data as {
      profile: Profile;
      organization: Organization;
      events: Event[];
    };
    let organization_slug = this.route.snapshot.params['slug'];

    this.roster = [];

    this.profile = data.profile;
    this.organization = data.organization;
    orgservice
      .getMembersByOrganization(organization_slug)
      .pipe(map((member: Member[]) => member))
      .subscribe((roster: Member[]) => {
        this.roster = roster;
      });

    orgservice
      .getRequestsByOrganization(organization_slug)
      .pipe(map((request: CompletedRequestObject[]) => request))
      .subscribe((requests: CompletedRequestObject[]) => {
        this.requests = requests;
      });

    this.eventsPerDay = eventService.groupEventsByDate(data.events ?? []);
    this.eventCreationPermission$ = this.permission.check(
      'organization.events.*',
      `organization/${this.organization?.id ?? -1}`
    );
  }
}
