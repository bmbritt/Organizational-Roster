/**
 * The Organization Details Info Card widget abstracts the implementation of each
 * individual organization detail card from the whole organization detail page.
 *
 * @author Ajay Gandecha, Jade Keegan, Brianna Ta, Audrey Toney
 * @copyright 2023
 * @license MIT
 */

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Organization } from '../../organization.model';
import { Profile } from 'src/app/profile/profile.service';
import { PermissionService } from 'src/app/permission.service';
import { Observable } from 'rxjs';
import { Member } from '../../organization-roster.model';
import { OrganizationService } from '../../organization.service';
import { OrganizationRequestFormService } from '../../organization-request-form/organization-request-form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'organization-details-info-card',
  templateUrl: './organization-details-info-card.widget.html',
  styleUrls: ['./organization-details-info-card.widget.css']
})
export class OrganizationDetailsInfoCard implements OnInit, OnDestroy {
  /** The organization to show */
  @Input() organization?: Organization;
  /** The currently logged in user */
  @Input() profile?: Profile;
  @Input() member?: Member;
  @Input() roster?: Member[] | null;

  public orgService = OrganizationService;
  /** Holds data on whether or not the user is on a mobile device */
  public isHandset: boolean = false;
  private isHandsetSubscription!: Subscription;

  /** Holds data on whether or not the user is on a tablet */
  public isTablet: boolean = false;
  private isTabletSubscription!: Subscription;
  public joinButtonVisible = true;
  private subscriptions: Subscription = new Subscription();

  /** Constructs the organization detail info card widget */
  constructor(
    private breakpointObserver: BreakpointObserver,
    private permission: PermissionService,
    public orgService2: OrganizationService,
    public orgRequestService: OrganizationRequestFormService,
    private router: ActivatedRoute,
    protected snackBar: MatSnackBar
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
    if (this.organization?.slug && this.profile?.id) {
      this.subscriptions.add(
        this.orgService2
          .getMembersByOrganization(this.organization.slug)
          .pipe(
            map((members: Member[]) =>
              members.map((member) => member.profile_id)
            ),
            tap((roster) => {
              this.joinButtonVisible = !roster.includes(
                this.profile?.id as number
              );
            })
          )
          .subscribe()
      );
    }
  }

  addMember(organization: Organization, profile: Profile): void {
    this.orgService2.addMember(organization, profile).subscribe({
      next: (member) => this.onSuccess(member),
      error: (err) => this.onError(err)
    });
    this.snackBar.open('Joined Organization!', '', { duration: 2000 });
    location.reload();
  }

  private onSuccess(member: any): any {
    return member;
  }

  /** Opens a snackbar when there is an error updating an organization.
   * @returns {void}
   */
  private onError(err: any): void {}
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
  public leaveOrganization(profile: Profile, organization: Organization) {
    this.orgService2.leaveOrganization(profile, organization).subscribe({
      next: (any) => this.onSuccess(any),
      error: (any) => this.onError(any)
    });
    this.snackBar.open('Left Organization!', '', { duration: 2000 });
    location.reload();
  }
}
