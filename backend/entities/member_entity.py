# from sqlalchemy import Integer, String, Boolean, DateTime, ForeignKey
# from sqlalchemy.orm import Mapped, mapped_column, relationship

# from backend.entities.organization_entity import OrganizationEntity
# from backend.models.member import Member
# from ..models.event_details import EventDetails
# from .entity_base import EntityBase
# from typing import Self
# from ..models.event import DraftEvent, Event
# from ..models.registration_type import RegistrationType
# from ..models.user import User

# from datetime import datetime


# class MemberEntity(EntityBase):
#     """Serves as the database model schema defining the shape of the `Member` table"""

#     # Name for the events table in the PostgreSQL database
#     __tablename__ = "member"




#     id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

#     name: Mapped[str] = mapped_column(String)

#     affiliation: Mapped[str] = mapped_column(String)

#     primary_contact: Mapped[str] = mapped_column(String)

#     # Organization members
#     # NOTE: This defines a one-to-many relationship between the organization and member tables.
#     organization_id: Mapped[int] = mapped_column(ForeignKey("organization.id"))
#     organization: Mapped["OrganizationEntity"] = relationship(back_populates="member")

#     #TODO THIS SHOULD BE WORKED ON WHEN MEMBERS WANT TO JOIN A CLUB
#     ## Registrations for the event
#     ## NOTE: This is part of a many-to-many relationship between members and organizations, via the event registration table.
#     #registrations: Mapped[list["EventRegistrationEntity"]] = relationship(
#     #    back_populates="event", cascade="all,delete"
#     #)



#     @classmethod
#     def from_model(cls, model: Member) -> Self:
#         """
#         Class method that converts an `Event` model into a `EventEntity`

#         Parameters:
#             - model (Member): Model to convert into an entity
#         Returns:
#             MemberEntity: Entity created from model
#         """
#         return cls(
#             name=model.name,
#             affiliation=model.affiliation,
#             primary_contact=model.primary_contact
#         )

#     def to_model(self) -> Member:
#         """
#         Converts a `MemberEntity` object into a `Member` model object

#         Returns:
#             Event: `Member` object from the entity
#         """

#         return Member(
#             name=self.name,
#             affiliation=self.affiliation,
#             primary_contact= self.primary_contact
#         )