from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    Represents the user for the application

    Inherits from AbstractUser which is a django class that provides the basic functionality for a user
    """