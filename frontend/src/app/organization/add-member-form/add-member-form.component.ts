/* eslint-disable prettier/prettier */

import { profileResolver } from 'src/app/profile/profile.resolver';
import { organizationDetailResolver } from '../organization.resolver';
import { Organization } from '../organization.model';
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

import { PermissionService } from 'src/app/permission.service';

import { OrganizationService } from '../organization.service';
import { Profile } from 'src/app/profile/profile.service';

@Component({
  selector: 'app-add-member-form',
  templateUrl: './add-member-form.component.html',
  styleUrls: ['./add-member-form.component.css']
})
export class AddMemberFormComponent {
  public static Route: Route = {
    path: ':slug/add-member',
    component: AddMemberFormComponent,
    title: 'Add Member',
    canActivate: [],
    resolve: {
      profile: profileResolver,
      organization: organizationDetailResolver
    }
  };

  public organization: Organization;

  public completedAddObject = {};
  public profile: Profile | null = null;
  organization_slug: string = '';
  name = new FormControl('');
  pid = new FormControl();
  role = new FormControl('');
  title = new FormControl('');

  public addMemberForm = this.formBuilder.group({
    name: this.name,
    profile_id: this.pid,
    role: this.role,
    title: this.title
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    protected formBuilder: FormBuilder,
    protected snackBar: MatSnackBar,
    private orgService: OrganizationService
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

  onSubmit() {
    if (this.addMemberForm.value) {
      Object.assign(
        this.completedAddObject,

        this.addMemberForm.value,
        {
          id: null,
          organization_id: this.organization.id
        }
      );

      let newMember = {
        id: null,
        name: this.name.value == null ? '' : this.name.value,
        profile_id: this.pid.value,
        role: this.role.value == null ? 'Member' : this.role.value,
        title: this.title.value == null ? '' : this.title.value,
        organization_id: this.organization.id
      };
      console.log(newMember);
      this.orgService.addOther(newMember, this.organization).subscribe();
      this.router.navigate(['/organizations/' + this.organization.slug]);
    }
  }
}
