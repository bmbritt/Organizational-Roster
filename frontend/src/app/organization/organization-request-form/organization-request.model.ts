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
