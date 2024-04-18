"""Contains the mock data for testing the request feature"""

import pytest
from sqlalchemy.orm import Session

from ....models import Request
from ....entities import RequestEntity


request = Request(
    id=None,
    name="Norah Binny",
    organization_id=1,
    strength="Love to Code",
    reasoning="Love to Code OFC",
    major="Computer Science",
    profile_id=1,
)

request2 = Request(
    id=None,
    name="Kush Patel",
    organization_id=1,
    strength="Love to Code",
    reasoning="Love to Code OFC",
    major="Computer Science",
    profile_id=3,
)


requests = [request, request2]


def insert_fake_data(session: Session):
    """ "Inserts fake event data into the test session."""

    global requests

    # Create entities for test event data
    entities = []
    for request in requests:
        request_entity = RequestEntity.from_model(request)
        session.add(request_entity)
        entities.append(request_entity)

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
