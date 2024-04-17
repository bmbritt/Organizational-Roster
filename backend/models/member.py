from pydantic import BaseModel


class Member(BaseModel):
    """
    Pydantic model to represent an 'Member'

    This model will be based on 'MemberEntity' model, which defines the shape of the `Member` database in PostgreSQL database.
    """

    id: int | None
    name: str
    profile_id: int
    affiliation: str
    organization_id: int
