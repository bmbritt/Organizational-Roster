"""Member API 

Member routes that are use to create, retrieve, and update Members within an organization.""
"""

from fastapi import APIRouter, Depends, HTTPException
from backend.models.organization import Organization

from backend.services.organization import OrganizationService

from ..services import MemberService
from ..models.member import Member
from ..models.user import User
from ..api.authentication import registered_user
from backend.services.member import MemberService

api = APIRouter(prefix="/api/members")
openapi_tags = {
    "name": "Member",
    "description": "Create, delete, and retrieve Organization members.",
}


@api.get("/organization/{slug}", response_model=list[Member], tags=["Members"])
def get_members(
    slug: str,
    member_service: MemberService = Depends(),
    organization_service: OrganizationService = Depends(),
):
    """Gets all the members of that organization"""

    organizationID = organization_service.get_by_slug(slug).id
    if organizationID:
        return member_service.all(organizationID)


@api.post("/organization/{slug}", response_model=Member, tags=["Members"])
def addMember(newMember: Member, member_service: MemberService = Depends()) -> Member:
    return member_service.add(newMember)


@api.delete("/organization/{slug}", tags=["Members"])
def delete(
    slug: str,
    subject: User = Depends(registered_user),
    member_service: MemberService = Depends(),
    organization_service: OrganizationService = Depends(),
):
    organization = organization_service.get_by_slug(slug)
    return member_service.deleteSelf(subject, organization)
