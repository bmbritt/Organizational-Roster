import pytest
from unittest.mock import create_autospec

from ....models import Request
from ....services import RequestService


from ..fixtures import request_service_integration
from ..core_data import setup_insert_data_fixture

from .request_test_data import request, request2, requests


def test_add_request(request_service_integration: RequestService):
    "Test for adding a request to the database"
    created_request = request_service_integration.add("app-team", request)

    assert created_request is not None
    assert created_request.id is not None


def test_add_request2(request_service_integration: RequestService):
    "Test for adding a request to the database"
    created_request = request_service_integration.add("app-team", request)

    assert created_request.major == "Computer Science"
    assert created_request.profile_id == 1
