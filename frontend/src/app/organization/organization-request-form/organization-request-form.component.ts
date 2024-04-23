import { Component, inject } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivateFn,
  Route,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { profileResolver } from 'src/app/profile/profile.resolver';
import { PermissionService } from 'src/app/permission.service';
import { Organization } from '../organization.model';
import { OrganizationService } from '../organization.service';
import { Profile } from 'src/app/profile/profile.service';
import { organizationDetailResolver } from '../organization.resolver';
import { CompletedRequestObject } from './organization-request.model';
import { OrganizationRequestFormService } from './organization-request-form.service';
import { RequestService } from './request.service';

@Component({
  selector: 'app-organization-request-form',
  templateUrl: './organization-request-form.component.html',
  styleUrls: ['./organization-request-form.component.css']
})
export class OrganizationRequestFormComponent {
  public static Route: Route = {
    path: ':slug/request',
    component: OrganizationRequestFormComponent,
    title: 'Organization Request Form',
    canActivate: [],
    resolve: {
      profile: profileResolver,
      organization: organizationDetailResolver
    }
  };

  public organization: Organization;
  public profile: Profile | null = null;
  organization_slug: string = 'new';
  public completedRequestObject = {};
  public id = 0;

  tellAbout = new FormControl('', [Validators.maxLength(2000)]);
  whyJoin = new FormControl('', [Validators.maxLength(2000)]);
  major = new FormControl('', [Validators.maxLength(50)]);
  graduation = new FormControl(new Date(), [Validators.required]);

  public requestToJoinForm = this.formBuilder.group({
    tellAbout: this.tellAbout,
    whyJoin: this.whyJoin,
    major: this.major,
    graduation: this.graduation
  });

  /** Constructs the organization editor component */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    protected formBuilder: FormBuilder,
    protected snackBar: MatSnackBar,
    private organizationRequestFormService: OrganizationRequestFormService,
    private requestService: RequestService
  ) {
    /** Initialize data from resolvers. */
    const data = this.route.snapshot.data as {
      profile: Profile;
      organization: Organization;
    };

    this.profile = data.profile;
    this.organization = data.organization;

    /** Get id from the url */
    let organization_slug = this.route.snapshot.params['slug'];
    this.organization_slug = organization_slug;
  }

  /** Event handler to handle cancelling the editor and going back to
   * the previous organization page.
   * @returns {void}
   */
  onCancel(): void {
    this.router.navigate([`organizations/${this.organization_slug}`]);
  }

  /** Event handler to handle the first change in the organization name field
   * Automatically generates a slug from the organization name (that can be edited)
   * @returns {void}
   */

  /** Opens a confirmation snackbar when an organization is successfully updated.
   * @returns {void}
   */
  private onSuccess(organization: Organization): void {
    this.router.navigate(['/organizations/', organization.slug]);
    this.snackBar.open('Request Sent', '', { duration: 2000 });
  }

  /** Opens a snackbar when there is an error updating an organization.
   * @returns {void}
   */
  private onError(err: any): void {
    this.snackBar.open('You have already applied for this Organization.', '', {
      duration: 2000
    });
  }
  onSubmit() {
    if (
      this.organizationRequestFormService.hasMadeRequest(
        this.organization,
        this.profile as Profile
      )
    ) {
      this.onError('no');
      return;
    }
    if (this.requestToJoinForm.value) {
      Object.assign(
        this.completedRequestObject,
        this.organization,
        this.requestToJoinForm.value,
        this.profile
      );
      this.organizationRequestFormService.createOrgJoinRequest(
        this.completedRequestObject as CompletedRequestObject,
        this.organization,
        this.profile as Profile,
        this.requestToJoinForm.value
      );
      let newRequest = {
        id: null,
        name: this.profile?.first_name,
        organization_id: null,
        strength: this.tellAbout.value ?? '',
        reasoning: this.whyJoin.value ?? '',
        major: this.major.value ?? '',
        profile_id: this.profile?.id
      };
      this.requestService.addRequest(this.organization_slug, newRequest);
      this.onSuccess(this.organization);
    }
  }
}
