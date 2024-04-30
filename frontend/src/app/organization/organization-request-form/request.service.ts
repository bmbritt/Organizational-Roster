import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Organization } from '../organization.model';
import { Member } from '../organization-roster.model';
import { organizationDetailResolver } from '../organization.resolver';
import { CompletedRequestObject } from './organization-request.model';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  constructor(protected http: HttpClient) {}

  addRequest(
    slug: String,
    request: CompletedRequestObject
  ): Observable<CompletedRequestObject> {
    return this.http.post<CompletedRequestObject>(
      '/api/requests/organization/' + slug,
      request
    );
  }
}
