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
    return request_service.add(slug, newRequest)
