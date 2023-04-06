import pytest
from model_bakery import baker
from rest_framework.authtoken.models import Token

from users.models import User


@pytest.mark.django_db
def test_token_creation():
    """Test that a token is created by signal when user is created."""
    user = baker.make(User)
    assert Token.objects.filter(user=user).exists()
