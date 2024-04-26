"The Request Service allows the API to manipulate the request data in the database"


from fastapi import Depends
from sqlalchemy import and_, select
from sqlalchemy.orm import Session

from backend.entities.request_entity import RequestEntity
from backend.models.organization import Organization
from backend.models.organization_details import OrganizationDetails
from backend.models.request import Request

from ..database import db_session
from ..models.member import Member
from ..entities.member_entity import MemberEntity
from ..entities.organization_entity import OrganizationEntity
from ..models import User
from ..models import Member
from .permission import PermissionService

from .exceptions import ResourceNotFoundException


class RequestService:
    "Service that performs all the action on RequestTable"

    def __init__(
        self,
        session: Session = Depends(db_session),
        permission: PermissionService = Depends(),
    ):
        """Initializes the `RequestService` session"""
        self._session = session

    def add(
        self,
        slug: str,
        request: Request,
    ) -> Request:
        """
        Adds a Request to the request table

        Parameters:
            slug: the specific slug of the organization that the user is requesting to join
            request: the request model 

        Returns:
            Request (Model)
        """

        org_entity = (
            self._session.query(OrganizationEntity)
            .where(OrganizationEntity.slug == slug)
            .one_or_none()
        )

        org_model = org_entity.to_model()

        request.organization_id = org_model.id

        # Create an enitty from the request model
        request_entity = RequestEntity.from_model(request)

        # Add the entity to the database
        self._session.add(request_entity)

        # Commit the changes

        self._session.commit()

        # Return the pydantic model representaiton of the entity we just created
        return request_entity.to_model()
