/* eslint-disable prettier/prettier */
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
import { map } from 'rxjs/operators';
import { Organization } from '../../organization.model';
import { Profile } from 'src/app/profile/profile.service';
import { PermissionService } from 'src/app/permission.service';
import { Observable } from 'rxjs';
import { Member } from '../../organization-roster.model';
import { OrganizationService } from '../../organization.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NONE_TYPE } from '@angular/compiler';

@Component({
  selector: 'organization-roster-card',
  templateUrl: './organization-roster-card.widget.html',
  styleUrls: ['./organization-roster-card.widget.css']
})
export class OrganizationRosterCard implements OnInit, OnDestroy {
  /** The organization to show */
  @Input() organization?: Organization;
  /** The currently logged in user */
  @Input() profile?: Profile;
  @Input() roster?: Member[];

  public orgService = OrganizationService;
  /** Holds data on whether or not the user is on a mobile device */
  public isHandset: boolean = false;
  private isHandsetSubscription!: Subscription;

  /** Holds data on whether or not the user is on a tablet */
  public isTablet: boolean = false;
  private isTabletSubscription!: Subscription;

  /** Constructs the organization detail info card widget */
  constructor(
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
    private permission: PermissionService,
    private orgService3: OrganizationService
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
    let organization_slug = this.organization?.slug;
    this.orgService3

      .getMembersByOrganization(organization_slug)
      .pipe(map((member: Member[]) => member))
      .subscribe((roster: Member[]) => {
        this.roster = roster;
      });
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

  public getPresident(): Member {
    if (this.roster != undefined) {
      for (let i = 0; i < this.roster.length; i++) {
        if (this.roster[i].role == 'President') {
          return this.roster[i];
          break;
        }
      }
    }
    return {
      id: null,
      name: '',
      profile_id: null,
      role: '',
      title: '',
      organization_id: null
    };
  }

  public getOfficers(): Member[] {
    let result: Member[] = [];
    if (this.roster != undefined) {
      for (let i = 0; i < this.roster.length; i++) {
        if (this.roster[i].role == 'Officer') {
          result.push(this.roster[i]);
        }
      }
    }
    return result;
  }

  public getGeneralMembers(): Member[] {
    let result: Member[] = [];
    if (this.roster != undefined) {
      for (let i = 0; i < this.roster.length; i++) {
        if (this.roster[i].role == 'Member') {
          result.push(this.roster[i]);
        }
      }
    }
    return result;
  }

  private onSuccess(member: any): any {
    return member;
  }
  private onError(err: any): void {}

  public removeMember(member: Member) {
    this.orgService3.removeMember(member).subscribe({
      next: (any) => this.onSuccess(any),
      error: (any) => this.onError(any)
    });

    location.reload();
  }
}
