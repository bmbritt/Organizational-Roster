import { Component } from '@angular/core';
import { Route } from '@angular/router';
import { profileResolver } from 'src/app/profile/profile.resolver';
import { organizationDetailResolver } from '../organization.resolver';

@Component({
  selector: 'app-view-request',
  templateUrl: './view-request.component.html',
  styleUrls: ['./view-request.component.css']
})
export class ViewRequestComponent {
  public static Route: Route = {
    path: ':slug/view-request/:id',
    component: ViewRequestComponent,
    title: 'View Request Component',
    canActivate: [],
    resolve: {
      profile: profileResolver,
      organization: organizationDetailResolver
    }
  };
}
