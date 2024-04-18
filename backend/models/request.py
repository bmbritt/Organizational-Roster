from pydantic import BaseModel


class Request(BaseModel):
    """
    Pydantic model to represent an 'Request'

    This model will be based on 'RequestEntity' model, which defines the shape of the `Request` database in PostgreSQL database.
    """

    id: int | None
    name: str
    organization_id: int
    strength: str
    reasoning: str
    major: str
    profile_id: int
