from pydantic import BaseModel


class Member(BaseModel):
    """
    Pydantic model to represent an 'Member'

    This model will be based on 'MemberEntity' model, which defines the shape of the `Member` database in PostgreSQL database.
    """

    id: int | None
    name: str
    profile_id: int

    # Role is required (e.g. President, Officer, Admin, Member)
    role: str

    # Title is optional, default to empty string
    title: str
    organization_id: int
