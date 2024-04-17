import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Member } from '../../organization-roster.model';
import { Organization } from '../../organization.model';
import { ActivatedRoute } from '@angular/router';
import { Profile } from 'src/app/models.module';

@Injectable({
  providedIn: 'root'
})
export class RosterService {
  private rosterSubject: BehaviorSubject<Member[]> = new BehaviorSubject<
    Member[]
  >([]);

  constructor(private http: HttpClient) {}

  get roster$(): Observable<Member[]> {
    return this.rosterSubject.asObservable();
  }

  getMembersByOrganization(slug: string | undefined): void {
    this.http
      .get<Member[]>('/api/members/organization/' + slug)
      .subscribe((data) => {
        this.rosterSubject.next(data);
      });
  }

  loadMembersByOrganization(slug: string): void {
    this.http
      .get<Member[]>('/api/members/organization/' + slug)
      .subscribe((data) => {
        this.rosterSubject.next(data);
      });
  }

  //   updateRoster(): void {
  //     this.http.get<Member[]>().subscribe((data) => {
  //       this.rosterSubject.next(data);
  //     });
  //   }

  addMember(organizationSlug: string, subject: Profile): void {
    this.http
      .post<Member>('/api/members/organization/' + organizationSlug, subject)
      .pipe(tap(() => this.loadMembersByOrganization(organizationSlug)))
      .subscribe();
  }
}
