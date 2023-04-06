from unittest.mock import patch

import pytest
from rest_framework.exceptions import ErrorDetail
from rest_framework.test import APIClient

from users.models import User


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
            # test that username will be normalized (trimmed)
            {"username": "        TestUsername  ", "password": "Kej38Iewo"},
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


@pytest.mark.django_db
@pytest.mark.parametrize(
    "user_input, expected_response_body, expected_response_status_code",
    [
        (
            {"username": "TestUsername", "password": "TestPassword"},
            {"token": "test_token"},
            200,
        ),
        (
            {"blabla": "blabla"},
            {
                "username": [
                    ErrorDetail(string="This field is required.", code="required")
                ],
                "password": [
                    ErrorDetail(string="This field is required.", code="required")
                ],
            },
            400,
        ),
        (
            {"password": "wrong_password"},
            {
                "username": [
                    ErrorDetail(string="This field is required.", code="required")
                ]
            },
            400,
        ),
        (
            {"username": "wrong_username", "password": "wrong_password"},
            {
                "non_field_errors": [
                    ErrorDetail(
                        string="Unable to log in with provided credentials.",
                        code="authorization",
                    )
                ]
            },
            400,
        ),
        (
            {"username": "TestUsername", "password": "wrong_password"},
            {
                "non_field_errors": [
                    ErrorDetail(
                        string="Unable to log in with provided credentials.",
                        code="authorization",
                    )
                ]
            },
            400,
        ),
        (
            {"username": "wrong_username", "password": "TestPassword"},
            {
                "non_field_errors": [
                    ErrorDetail(
                        string="Unable to log in with provided credentials.",
                        code="authorization",
                    )
                ]
            },
            400,
        ),
    ],
)
def test_user_login_endpoint(
    user_input, expected_response_body, expected_response_status_code
):
    """Sends api request for user login and checks the response"""

    # fake token to allow parametrization
    with patch(
        "rest_framework.authtoken.models.Token.generate_key", return_value="test_token"
    ):
        User.objects.create_user(username="TestUsername", password="TestPassword")

    response = APIClient().post("/api/login/", user_input)

    assert response.status_code == expected_response_status_code
    assert response.data == expected_response_body
