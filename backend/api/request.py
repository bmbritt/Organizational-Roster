"""Request API

Request routes that are used to add requests to the Requests Database

"""

from fastapi import APIRouter, Depends, HTTPException

from ..models.request import Request
from ..services import RequestService
from ..services import OrganizationService


api = APIRouter(prefix="/api/requests/organization")
openapi_tags = {
    "name": "Request",
    "description": "Add requests to database",
}


@api.post("/{slug}", response_model=Request, tags=["Requests"])
def addRequest(
    slug: str, newRequest: Request, request_service: RequestService = Depends()
) -> Request:
    """
    Create a request

    Parameters:
        slug: a string representing a unique identifier of an organization
        newRequest: a valid Request Model
        request_service: a valid RequestService

    Returns:
        Request (model)

    """
    return request_service.add(slug, newRequest)


@api.delete("/{requestID}", tags=["Requests"])
def delete_request(requestID: int, request_service: RequestService = Depends()):
    return request_service.delete(requestID)


@api.get("/{slug}", response_model=list[Request], tags=["Requests"])
def getRequests(
    slug: str,
    request_service: RequestService = Depends(),
    organization_service: OrganizationService = Depends(),
) -> list[Request]:
    """Gets all the requests of that organization"""

    organization = organization_service.get_by_slug(slug)

    return request_service.all(organization.id)
