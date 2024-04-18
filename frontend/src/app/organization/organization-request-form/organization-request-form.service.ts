import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../../authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Organization } from '../organization.model';
import { Member } from '../organization-roster.model';
import { Profile } from '../../models.module';
import { organizationDetailResolver } from '../organization.resolver';
import { CompletedRequestObject } from './organization-request.model';
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationRequestFormService {
  constructor(
    protected http: HttpClient,
    protected auth: AuthenticationService,
    protected snackBar: MatSnackBar
  ) {}
  public listOfRequests: CompletedRequestObject[] = [];
  public id = 0;

  createOrgJoinRequest(
    completedRequestObject: CompletedRequestObject,
    organization: Organization,
    profile: Profile,
    requestToJoinForm: any
  ) {
    completedRequestObject.id = this.id;
    completedRequestObject.organization_id = organization.id;
    completedRequestObject.profile_id = profile.id;
    // completedRequestObject.requestToJoinForm = requestToJoinForm;
    console.log(completedRequestObject);
    this.listOfRequests.push(completedRequestObject);
    console.log(this.listOfRequests);
    this.id++;
  }

  hasMadeRequest(organization: Organization, profile: Profile): boolean {
    for (const request of this.listOfRequests) {
      if (
        request.organization_id === organization.id &&
        request.profile_id === profile.id
      ) {
        return true;
      }
    }
    return false;
  }
}
