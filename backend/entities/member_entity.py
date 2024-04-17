from typing import Self
from backend.entities.entity_base import EntityBase
from sqlalchemy import ForeignKey, Integer, String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.models.member import Member
from backend.models.organization import Organization


class MemberEntity(EntityBase):

    __tablename__ = "member"

    ### model fields ###

    # Primary key for member table
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    # name of the member e.g. "Kris Jordan"
    name: Mapped[str] = mapped_column(String, nullable=False, default="")
    affiliation: Mapped[str] = mapped_column(String, nullable=False, default="")
    profile_id: Mapped[int] = mapped_column(Integer, nullable=False)
    # Establishes one to many with organizationEntity
    organization_id: Mapped[int] = mapped_column(ForeignKey("organization.id"))
    organization: Mapped["OrganizationEntity"] = relationship(back_populates="members")

    ### relationship fields ###

    @classmethod
    def from_model(cls, model: Member) -> Self:
        return cls(
            id=model.id,
            name=model.name,
            profile_id=model.profile_id,
            affiliation=model.affiliation,
            organization_id=model.organization_id,
        )

    def to_model(self) -> Member:
        """
        Converts a `OrganizationEntity` object into a `Organization` model object

        Returns:
            Organization: `Organization` object from the entity
        """
        return Member(
            id=self.id,
            name=self.name,
            profile_id=self.profile_id,
            affiliation=self.affiliation,
            organization_id=self.organization_id,
        )
