from rest_framework.generics import CreateAPIView

from users.serializers import UserRegistrationSerializer


class UserRegistrationView(CreateAPIView):
    """
    User registration endpoint
    """

    serializer_class = UserRegistrationSerializer
