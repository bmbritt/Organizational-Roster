"""Contains mock data for the live demo of the member feature."""

import pytest
from sqlalchemy.orm import Session

from ....models.public_user import PublicUser
from ....models import Member, Organization
from ....entities import MemberEntity
from ..organization.organization_test_data import cads, cssg
from ..user_data import root, ambassador, user
from ..reset_table_id_seq import reset_table_id_seq


# Sample Data Objects
# These sample entities will be used to generate the test data.

member = Member(
    id=2,
    name="Evan Menendez",
    profile_id=1,
    role="Member",
    title="",
    organization_id=1,
)

member2 = Member(
    id=3,
    name="Evan Menendez",
    profile_id=2,
    role="Member",
    title="",
    organization_id=1,
)

member3 = Member(
    id=4,
    name="Evan Menendez",
    profile_id=3,
    role="Member",
    title="",
    organization_id=1,
)

members = [member, member2, member3]

member_to_add = Member(
    id=5,
    name="Evan Menendez",
    profile_id=4,
    role="Member",
    title="",
    organization_id=1,
)

member_invalid = Member(
    id=4,
    name="Evan Menendez",
    profile_id=4,
    role="Member",
    title="",
    organization_id=1,
)


# Data Functions


def insert_fake_data(session: Session):
    """Inserts fake event data into the test session."""

    global members

    # Create entities for test event data
    entities = []
    for member in members:
        member_entity = MemberEntity.from_model(member)
        session.add(member_entity)
        entities.append(member_entity)

    # Reset table IDs to prevent ID conflicts
    # reset_table_id_seq(session, MemberEntity, MemberEntity.id, len(members) + 1)

    # Commit all changes
    session.commit()


@pytest.fixture(autouse=True)
def fake_data_fixture(session: Session):
    """Insert fake data the session automatically when test is run.
    Note:
        This function runs automatically due to the fixture property `autouse=True`.
    """
    insert_fake_data(session)
    session.commit()
    yield
