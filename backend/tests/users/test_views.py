from unittest.mock import patch

import pytest
from rest_framework.exceptions import ErrorDetail
from rest_framework.test import APIClient


@pytest.mark.django_db
@pytest.mark.parametrize(
    "user_input, expected_response_body, expected_response_status_code",
    [
        (
            {"username": "TestUsername", "password": "12345"},
            {
                "non_field_errors": [
                    ErrorDetail(
                        string="This password is too short. It must contain at least 8 characters.",
                        code="password_too_short",
                    ),
                    ErrorDetail(
                        string="This password is too common.",
                        code="password_too_common",
                    ),
                    ErrorDetail(
                        string="This password is entirely numeric.",
                        code="password_entirely_numeric",
                    ),
                ]
            },
            400,
        ),
        (
            {"username": "TestUsername", "password": "Kej38Iewo"},
            {"username": "TestUsername", "password": "hashed_password"},
            201,
        ),
        (
            {"username": "", "password": "Kej38Iewo"},
            {
                "username": [
                    ErrorDetail(string="This field may not be blank.", code="blank")
                ]
            },
            400,
        ),
        (
            {"username": "TestUsername", "password": ""},
            {
                "password": [
                    ErrorDetail(string="This field may not be blank.", code="blank")
                ]
            },
            400,
        ),
    ],
)
def test_user_registration_endpoint(
    user_input: dict, expected_response_body: dict, expected_response_status_code: int
):
    """Sends api request for user registration and checks the response"""

    # mock password hashing function since we won't be able to check the hashed password
    with patch(
        "django.contrib.auth.models.make_password", return_value="hashed_password"
    ):
        response = APIClient().post("/api/register/", user_input)

    assert response.status_code == expected_response_status_code
    assert response.data == expected_response_body
