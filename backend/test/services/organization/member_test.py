import pytest
from unittest.mock import create_autospec

from backend.services.exceptions import (
    UserPermissionException,
    ResourceNotFoundException,
)

# Tested Dependencies
from ....models import Organization
from ....services import OrganizationService
from ....models import Member
from ....services import MemberService
from ....models import User

# Injected Service Fixtures
from ..fixtures import (
    member_service_integration,
    user_svc_integration,
    event_svc_integration,
)

# Explicitly import Data Fixture to load entities in database
from ..core_data import setup_insert_data_fixture

# Data Models for Fake Data Inserted in Setup
from .member_test_data import (
    members,
    member,
    member2,
    member3,
    member_invalid,
    member_to_add,
    member_to_edit,
)
from .organization_test_data import (
    organizations,
    to_add,
    cads,
    new_cads,
    to_add_conflicting_id,
)
from ..user_data import root, user


def test_get_all(member_service_integration: MemberService):
    "Test getting a Roster From an Organization that you have set up the data for (acm)"
    fetched_roster = member_service_integration.all(1)
    assert fetched_roster is not None
    assert len(fetched_roster) == 3
    assert isinstance(fetched_roster[0], Member)


def test_delete_self(member_service_integration: MemberService):
    "Test deleting yourself From an Organization that you have set up the data for (acm)"
    fetched_roster = member_service_integration.all(1)
    member_service_integration.deleteSelf(
        User(
            id=1,
            pid=1,
            first_name="",
            last_name="",
            pronouns="",
            github="",
            onyen="",
            email="",
            github_id=1,
            github_avatar="1",
            accepted_community_agreement=True,
        ),
        cads,
    )
    assert fetched_roster != member_service_integration.all(1)[0]
    assert len(member_service_integration.all(1)) == 2


def test_add_member_public(member_service_integration: MemberService):
    "Test adding yourself to an Organization that you have set up the data for (acm)"
    fetched_roster = member_service_integration.all(1)
    member_service_integration.add_member_public(
        User(
            id=5,
            pid=5,
            first_name="Evan",
            last_name="Menendez",
            pronouns="",
            github="",
            onyen="",
            email="",
            github_id=4,
            github_avatar="4",
            accepted_community_agreement=True,
        ),
        cads,
    )
    fetched_roster2 = member_service_integration.all(1)
    assert fetched_roster != fetched_roster2
    assert len(fetched_roster) + 1 == len(fetched_roster2)
    assert fetched_roster2[3].profile_id == 5


def test_add(member_service_integration: MemberService):
    "Test adding to a Roster on an Organization"
    fetched_roster = member_service_integration.all(1)
    member_service_integration.add(member_to_add)
    fetched_roster2 = member_service_integration.all(1)
    assert len(fetched_roster) == len(fetched_roster2) - 1
    assert fetched_roster2[3].profile_id == 4


def test_get_member(member_service_integration: MemberService):
    "Test for getinng a specific member based on id"
    fetched_member = member_service_integration.getMember(4)
    assert fetched_member is not None
    assert isinstance(fetched_member, Member)
    assert fetched_member.id == 4


def test_edit_member(member_service_integration: MemberService):
    "Test for editing a specific member"
    edit_member = member_service_integration.update_member(member_to_edit)
    fetched_member = member_service_integration.getMember(4)
    assert fetched_member is not None
    assert fetched_member.id == 4
    assert fetched_member.name == "Kush"
    assert fetched_member.profile_id == 6
    assert fetched_member.role == "President"
    assert fetched_member.organization_id == 1
