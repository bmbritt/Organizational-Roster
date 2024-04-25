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
        Retrieves all Members from the table

        Returns:
            list[Member]: List of all `Member`
        """
        memberEntities = (
            self._session.query(MemberEntity)
            .where(MemberEntity.organization_id == organizationID)
            .all()
        )

        return [member.to_model() for member in memberEntities]

    def add(self, member: Member) -> Member:
        member_entity = MemberEntity.from_model(member)
        self._session.add(member_entity)
        self._session.commit()
        return member_entity.to_model()

    # TODO these functions only works if it is a public organization and they are adding themselves to the org
    # otherwise should create a new function to add someone else to it similar to delete member function
    def add_member_public(self, subject: User, organization: Organization) -> Member:
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
