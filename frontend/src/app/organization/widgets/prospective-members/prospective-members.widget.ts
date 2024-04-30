/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable prettier/prettier */
import { Component, Input, OnInit, OnDestroy, NgModule } from '@angular/core';
import { Organization } from '../../organization.model';
import { Profile } from 'src/app/models.module';
import { OrganizationService } from '../../organization.service';
import { Observable, Subscription } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { CompletedRequestObject } from '../../organization-request-form/organization-request.model';
import { MatExpansionModule } from '@angular/material/expansion';
import { RequestService } from '../../organization-request-form/request.service';
import { PermissionService } from 'src/app/permission.service';

@Component({
  selector: 'app-prospective-members',
  templateUrl: './prospective-members.widget.html',
  styleUrls: ['./prospective-members.widget.css']
})
export class ProspectiveMembersComponent {
  @Input() organization?: Organization;
  // @Input() profile?: Profile;
  @Input() requests?: CompletedRequestObject[];

  public orgService = OrganizationService;

  public isHandset: boolean = false;
  private isHandsetSubscription!: Subscription;

  public isTablet: boolean = false;
  private isTabletSubscription!: Subscription;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
    private orgService2: OrganizationService,
    private requestService: RequestService
    private permission: PermissionService
  ) {}

  checkPermissions(): Observable<boolean> {
    return this.permission.check(
      'organization.update',
      `organization/${this.organization?.slug}`
    );
  }
  /** Runs whenever the view is rendered initally on the screen */
  ngOnInit(): void {
    this.isHandsetSubscription = this.initHandset();
    this.isTabletSubscription = this.initTablet();
  }

  /** Unsubscribe from subscribers when the page is destroyed */
  ngOnDestroy(): void {
    this.isHandsetSubscription.unsubscribe();
    this.isTabletSubscription.unsubscribe();
  }

  /** Determines whether the page is being used on a mobile device */
  private initHandset() {
    return this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(map((result) => result.matches))
      .subscribe((isHandset) => (this.isHandset = isHandset));
  }

  /** Determines whether the page is being used on a tablet */
  private initTablet() {
    return this.breakpointObserver
      .observe(Breakpoints.TabletLandscape)
      .pipe(map((result) => result.matches))
      .subscribe((isTablet) => (this.isTablet = isTablet));
  }

  public getRequestSubmitter(): CompletedRequestObject[] | null | undefined {
    let listofReqs = [];
    if (this.requests != undefined) {
      for (let i = 0; i < this.requests.length; i++) {
        listofReqs.push(this.requests[i]);
      }
    }
    return listofReqs;
  }

  public denyRequest(requestID: number): void {
    this.requestService.deleteRequest(requestID).subscribe();
    location.reload();
  }
  public cancel() {
    return;
  }

  public approveRequest(request: CompletedRequestObject): void {
    let newMember = {
      id: null,
      name: request.name == null ? '' : request.name,
      profile_id: request.profile_id == null ? -1 : request.profile_id,
      role: 'Member',
      title: '',
      organization_id: request.organization_id
    };

    if (this.organization !== undefined) {
      this.orgService2.addOther(newMember, this.organization).subscribe();
    }
    if (request.id !== null) {
      this.requestService.deleteRequest(request.id).subscribe();
    }
    location.reload();
  }

  public viewFullRequest(request: CompletedRequestObject | undefined | null) {
    const organizationSlug = this.organization?.slug;
    const requestId = request?.id; // Assuming `id` is a property of the request object

    if (organizationSlug && requestId) {
      this.router.navigate([`${organizationSlug}/view-request/${requestId}`]);
    } else if (!organizationSlug) {
      console.error('Organization slug is missing!');
    } else if (!requestId) {
      console.error('RequestId does not exist');
    }
  }
}
