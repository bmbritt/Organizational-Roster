from pydantic import BaseModel


class Member(BaseModel):
    """
    Pydantic model to represent an 'Member'

    This model will be based on 'MemberEntity' model, which defines the shape of the `Member` database in PostgreSQL database.
    """

    name: str
    affiliation: str
    primary_contact: bool
