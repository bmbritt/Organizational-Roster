/* eslint-disable prettier/prettier */
/**
 * The Organization Service abstracts HTTP requests to the backend
 * from the components.
 *
 * @author Ajay Gandecha, Jade Keegan, Brianna Ta, Audrey Toney
 * @copyright 2023
 * @license MIT
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Organization } from './organization.model';
import { Member } from './organization-roster.model';
import { Profile } from '../models.module';
import { organizationDetailResolver } from './organization.resolver';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  constructor(
    protected http: HttpClient,
    protected auth: AuthenticationService,
    protected snackBar: MatSnackBar
  ) {}

  public joinButtonVisible: boolean = true;

  /** Returns all organization entries from the backend database table using the backend HTTP get request.
   * @returns {Observable<Organization[]>}
   */
  getOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>('/api/organizations');
  }
  getRosterByOrganization(slug: string): Observable<Member[]> {
    return this.http.get<Member[]>('/api/organizations/' + slug);
  }

  /** Returns the organization object from the backend database table using the backend HTTP get request.
   * @param slug: String representing the organization slug
   * @returns {Observable<Organization>}
   */
  getOrganization(slug: string): Observable<Organization> {
    return this.http.get<Organization>('/api/organizations/' + slug);
  }

  /** Returns the new organization object from the backend database table using the backend HTTP post request.
   * @param organization: OrganizationSummary representing the new organization
   * @returns {Observable<Organization>}
   */
  createOrganization(organization: Organization): Observable<Organization> {
    organization.roster = [];
    return this.http.post<Organization>('/api/organizations', organization);
  }

  /** Returns the updated organization object from the backend database table using the backend HTTP put request.
   * @param organization: OrganizationSummary representing the updated organization
   * @returns {Observable<Organization>}
   */
  updateOrganization(organization: Organization): Observable<Organization> {
    return this.http.put<Organization>('/api/organizations', organization);
  }

  initializeRoster(organization: Organization): string[] {
    let sampleRoster = [
      ' Abby',
      ' Brian',
      ' Evan',
      ' Norah',
      ' Chasity',
      ' Kris',
      ' Ajay',
      ' Lauren'
    ];

    // The data in the dummy database was not configured with a roster property
    // the line below will reset the roster each time a member is added and is only
    // here to initialize a roster property for the organizations that were not instantiated with one
    organization.roster = [];

    for (let i = 0; i < sampleRoster.length; i++) {
      organization.roster?.push(sampleRoster[i]);
    }

    return organization.roster;
  }

  initializePrimaryContact(organization: Organization): string {
    let samplePrimaryContact = ' Kris ';

    organization.primaryContact = samplePrimaryContact;
    return organization.primaryContact;
  }

  initializePrimaryContactInfo(organization: Organization): string {
    let sampleContactInfo = ' Email: primarycontact@unc.edu ';

    organization.contactInfo = sampleContactInfo;
    return organization.contactInfo;
  }

  initializePresident(organization: Organization): string {
    let samplePresident = ' Ajay ';

    organization.president = samplePresident;
    return organization.president;
  }

  initializeOfficers(organization: Organization): string[] {
    let sampleOfficers = [' Brian', ' Chasity', ' Evan', ' Norah '];
    organization.officers = [];

    for (let i = 0; i < sampleOfficers.length; i++) {
      organization.officers?.push(sampleOfficers[i]);
    }

    return organization.officers;
  }

  joinOrganization(organization: Organization, profile: Profile) {
    let firstName = profile.first_name;
    let lastName = profile.last_name;
    let fullName = firstName + ' ' + lastName;
    //TODO here is where once this is moved to the backend that we should be storing the profile of the user that has registered so that
    //the same user cannot register twice with the same club
    organization.roster?.push(fullName);
    this.joinButtonVisible = false;
    return organization.roster;
  }

  leaveOrganization(organization: Organization, profile: Profile) {
    //TODO here we should check the backend to see if the user is in the database, if they are they should be deleted from it
    //TODO but since is placeholder frontend code we won't do it yet
    let firstName = profile.first_name;
    let last_name = profile.last_name;
    let fullName = firstName + ' ' + last_name;
    if (organization.roster != null) {
      for (let index = 0; index < organization.roster.length; ++index) {
        if (organization.roster[index] == fullName) {
          organization.roster.splice(index, 1);
          break;
        }
      }
    }
    return organization.roster;
  }
}
