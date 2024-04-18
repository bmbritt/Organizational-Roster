import { Profile } from 'src/app/models.module';
import { Event } from '../../event/event.model';
import { Member } from '../../organization/organization-roster.model';
import { Organization } from '../organization.model';

/** Interface for Organization Type (used on frontend for organization detail) */

export interface CompletedRequestObject {
  id: number | null;
  name: string | undefined | null;
  organization_id: number | null;
  strength: string | undefined;
  reasoning: string | undefined;
  major: string | undefined;
  profile_id: number | null | undefined;
}
