from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.validators import UnicodeUsernameValidator
from django.db import models


class User(AbstractBaseUser):
    """
    Represents the user for the application

    Inherits from AbstractBaseUser which is a django class that provides the basic functionality for a user
    like password validation and last login time.

    Attributes:
    -----------
    username: str
        The username of the user
    username_validator: RegexValidator
        The validator for the username provided by django
    """

    username_validator = UnicodeUsernameValidator()

    username = models.CharField(
        max_length=150, unique=True, validators=[username_validator]
    )

    USERNAME_FIELD = "username"
