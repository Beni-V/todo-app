from django.contrib.auth.password_validation import validate_password
from rest_framework.serializers import ModelSerializer

from users.models import User


class UserRegistrationSerializer(ModelSerializer):
    """Serializer for user registration request"""
    class Meta:
        model = User
        fields = ("username", "password")

    def create(self, validated_data):
        """
        Create a new user with django `UserManager` and return it

        Django built in manager hashes the password and normalizes the inputs
        """
        return User.objects.create_user(**validated_data)

    def validate(self, attrs):
        """Validate user input for registration and return it"""

        # validate password with django provided function
        validate_password(attrs.get("password"))

        return super().validate(attrs)
