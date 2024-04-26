"""Request API

Request routes that are used to add requests to the Requests Database

"""

from fastapi import APIRouter, Depends, HTTPException

from ..models.request import Request
from ..services import RequestService


api = APIRouter(prefix="/api/requests")
openapi_tags = {
    "name": "Request",
    "description": "Add requests to database",
}


@api.post("/organization/{slug}", response_model=Request, tags=["Requests"])
def addMember(
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
