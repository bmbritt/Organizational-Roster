import { Profile } from 'src/app/models.module';
import { Event } from '../../event/event.model';
import { Member } from '../../organization/organization-roster.model';
import { Organization } from '../organization.model';

/** Interface for Organization Type (used on frontend for organization detail) */

export interface CompletedRequestObject {
  id: number | null;
  organization: Organization;
  requestToJoinForm: any;
  profile: Profile;
}
