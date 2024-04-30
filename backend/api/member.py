"""Member API 

Member routes that are use to create, retrieve, and update Members within an organization.""
"""

from fastapi import APIRouter, Depends, HTTPException


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
    """
    Get all members of an organization

    Parameters:
        slug: a string representing a unique identifier of an organization
        organization_service: a valid OrganizationService
        member_service: a valid MemberService

    Returns:
        list[Members]: All `Members`s of an organization with the matching organizationID
    """

    organizationID = organization_service.get_by_slug(slug).id
    if organizationID:
        return member_service.all(organizationID)



@api.get(
    "/{id}", responses={404: {"model": None}}, response_model=Member, tags=["Members"]
)
def get_member(id: int, member_service: MemberService = Depends()) -> Member:
    """
    Get Member

    Parameters:
        id: id of Member to get
        member_service: a valid MemberService

    Returns:
        Member: Created Member
    """

    return member_service.getMember(id)


@api.post("/organization/{slug}", response_model=Member, tags=["Members"])
def addMember(newMember: Member, member_service: MemberService = Depends()) -> Member:
    """
    Create member

    Parameters:
        newMember: a valid Member model
        member_service: a valid MemberService

    Returns:
        Member: Created Member

    """
    return member_service.add(newMember)



@api.put("", responses={404: {"model": None}}, response_model=Member, tags=["Members"])
def update_member(member: Member, member_service: MemberService = Depends()) -> Member:
    """
    Update Member

    Parameters:
    member: a valid Member model
    member_service: a valid MemberService

    """

    return member_service.update_member(member)


@api.delete("/organization/{slug}", tags=["Members"])
def delete(
    slug: str,
    subject: User = Depends(registered_user),
    member_service: MemberService = Depends(),
    organization_service: OrganizationService = Depends(),
):
    """
    Delete Member

    Parameters:
        slug: a string representing a unique identifier of an organization
        member_service: a valid MemberService
        subject: a valid User model representing the currently logged in User
        organization_service: a valid OrganizationService

    Raises:
        ResourceNotFoundException: if a subject does not exist or an organization does not exist
    """
    organization = organization_service.get_by_slug(slug)
    return member_service.deleteSelf(subject, organization)


@api.delete("/delete/{memberID}", tags=["Members"])
def deleteOther(memberID: int, member_service: MemberService = Depends()):
    """
    Delete Member

    Parameters:
        memberID: A member's PID
        member_service: a valid MemberService

    Raises:
        ResourceNotFoundException: if a member does not exist
    """
    return member_service.deleteOther(memberID)
