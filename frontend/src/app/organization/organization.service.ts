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
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { SubscriptionLog } from 'rxjs/internal/testing/SubscriptionLog';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  constructor(
    protected http: HttpClient,
    protected auth: AuthenticationService,
    protected snackBar: MatSnackBar
  ) {}

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

  addMember(organization: Organization, profile: Profile): Observable<Member> {
    let newMember = this.createMember(organization, profile);
    return this.http.post<Member>(
      '/api/members/organization/' + organization.slug,
      newMember
    );
  }

  createMember(organization: Organization, profile: Profile): Member {
    return {
      id: null,
      name: profile.first_name + ' ' + profile.last_name,
      profile_id: profile.id,
      affiliation: '',
      organization_id: organization.id
    };
  }

  leaveOrganization(profile: Profile, organization: Organization) {
    return this.http.delete<Member>(
      '/api/members/organization/' + organization.slug
    );
  }

  getMembersByOrganization(slug: string | undefined): Observable<Member[]> {
    return this.http.get<Member[]>('/api/members/organization/' + slug);
  }
}
