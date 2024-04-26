"The Member Service allows the API to manipulate the members data in the database"


from fastapi import Depends
from sqlalchemy import and_, select
from sqlalchemy.orm import Session

from backend.models.organization import Organization
from backend.models.organization_details import OrganizationDetails

from ..database import db_session
from ..models.member import Member
from ..entities.member_entity import MemberEntity
from ..entities.organization_entity import OrganizationEntity
from ..models import User
from ..models import Member
from .permission import PermissionService

from .exceptions import ResourceNotFoundException


class MemberService:
    "Service that performs all the action on MemberTable"

    def __init__(
        self,
        session: Session = Depends(db_session),
        permission: PermissionService = Depends(),
    ):
        """Initializes the `MemberService` session, and `PermissionService`"""
        self._session = session
        self._permission = permission

    def all(self, organizationID: int) -> list[Member]:
        """
        Retrieves all Members from the specified organization table

        Parameters:
            organizationid (int): the primary key of a specific organization

        Returns:
            list[Member]: List of all `Member` from the specified organization
        """
        memberEntities = (
            self._session.query(MemberEntity)
            .where(MemberEntity.organization_id == organizationID)
            .all()
        )

        return [member.to_model() for member in memberEntities]

    def add(self, member: Member) -> Member:
        """
        Adds a specified Member to the database

        Parameters:
            Member (model) to be added into the database

        Returns:
            Member (model)
        """
        member_entity = MemberEntity.from_model(member)
        self._session.add(member_entity)
        self._session.commit()
        return member_entity.to_model()

    def add_member_public(self, subject: User, organization: Organization) -> Member:
        """
        Adds a user to an organization, specifically used when they press "joinOrganization" button in front end

        Parameters:
            subject: a valid User model representing the currently logged in User
            organization (Organization): Organization to add to table

        Returns:
            Member (model)
        Raises:
            ValueError: If organization does not exist
            ValueError: If subject does not have a valid ID
        """
        if organization.id is None:
            raise ValueError("Organization must exist to add a member.")

        if subject.id is None:
            raise ValueError("Subject must have a valid ID.")

        full_name = f"{subject.first_name} {subject.last_name}"

        member_data = Member(
            id=None,
            name=full_name,
            profile_id=subject.id,
            role="Member",
            title="",
            organization_id=organization.id,
        )

        member_entity = MemberEntity.from_model(member_data)
        self._session.add(member_entity)
        self._session.commit()

        return member_entity.to_model()

    def deleteSelf(self, subject: User, organization: Organization) -> None:
        """
        Deletes a user from an organization, specifically used when they press "leaveOrganization" button in front end

        Parameters:
            subject: a valid User model representing the currently logged in User
            organization (Organization): Organization to add to table

        Raises:
            ResourceNotFoundException: if a subject does not exist or an organization does not exist 
        """
        member = (
            self._session.query(MemberEntity)
            .filter(
                and_(
                    MemberEntity.profile_id == subject.id,
                    MemberEntity.organization_id == organization.id,
                )
            )
            .one_or_none()
        )

        if member is None:
            raise ResourceNotFoundException(
                f"No member found with profile ID {subject.id} and organization ID {organization.id}"
            )

        self._session.delete(member)
        self._session.commit()

    def deleteOther(self, memberID: int) -> None:
        """
        Deletes a user other than the current subject from the current organization database

        Parameters:
            memberID: the pid of the specified member being deleted

        Raises:
            ResourceNotFoundException: if a member does not exist 
        """
        member = (
            self._session.query(MemberEntity)
            .filter(
                and_(
                    MemberEntity.id == memberID,
                    True,
                )
            )
            .one_or_none()
        )

        if member is None:
            raise ResourceNotFoundException(f"No matching member found.")

        self._session.delete(member)
        self._session.commit()
