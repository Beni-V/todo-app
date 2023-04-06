from django.contrib.auth.password_validation import validate_password
from rest_framework.serializers import ModelSerializer

from users.models import User


class UserRegistrationSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "password")

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

    def validate(self, attrs):
        validate_password(attrs.get("password"))
        return super().validate(attrs)
