import { Component } from '@angular/core';
import { Route } from '@angular/router';
import { profileResolver } from 'src/app/profile/profile.resolver';
import { organizationDetailResolver } from '../organization.resolver';

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
}
