from typing import Self
from backend.entities.entity_base import EntityBase
from sqlalchemy import ForeignKey, Integer, String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.models.request import Request


class RequestEntity(EntityBase):
    """Serves as the database model schema defining the shape of the `request` table"""
    __tablename__ = "request"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    name: Mapped[str] = mapped_column(String, nullable=False, default="")

    strength: Mapped[str] = mapped_column(String, nullable=False, default="")

    reasoning: Mapped[str] = mapped_column(String, nullable=False, default="")

    major: Mapped[str] = mapped_column(String, nullable=False, default="")

    profile_id: Mapped[int] = mapped_column(Integer, nullable=False)

    organization_id: Mapped[int] = mapped_column(ForeignKey("organization.id"))

    organization: Mapped["OrganizationEntity"] = relationship(back_populates="requests")

    @classmethod
    def from_model(cls, model: Request) -> Self:
        """
        Class method that converts a `Request` model into a `RequestEntity`

        Parameters:
            - model (Organization): Model to convert into an entity
        Returns:
            OrganizationEntity: Entity created from model
        """
        return cls(
            id=model.id,
            name=model.name,
            strength=model.strength,
            reasoning=model.reasoning,
            major=model.major,
            profile_id=model.profile_id,
            organization_id=model.organization_id,
        )

    def to_model(self) -> Request:
        """
        Converts a `RequestEntity` object into a `Request` model object

        Returns:
            Request: `Request` object from the entity
        """

        return Request(
            id=self.id,
            name=self.name,
            organization_id=self.organization_id,
            strength=self.strength,
            reasoning=self.reasoning,
            major=self.major,
            profile_id=self.profile_id,
        )
