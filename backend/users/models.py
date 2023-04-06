from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    User of the system

    Inherits from AbstractUser which is a django class that provides the basic functionality for a user
    """