from django.db import transaction
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_bulk import BulkModelViewSet

from core.serializers import TodoItemSerializer


class TodoItemViewSet(BulkModelViewSet):
    """View-set for `TodoItem`s"""

    serializer_class = TodoItemSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    # since it's not an actual bulk, and the deletion performed by iteration, do it in transaction
    @transaction.atomic
    def bulk_destroy(self, request, *args, **kwargs):
        ids = [item["id"] for item in request.data]
        qs = self.get_queryset().filter(id__in=ids)
        self.perform_bulk_destroy(qs)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def initialize_request(self, request, *args, **kwargs):
        # Set the user to the current user from the request
        request = super().initialize_request(request, *args, **kwargs)

        self.fulfill_request_data_with_user_id(request)

        return request

    def get_queryset(self):
        """Return the `TodoItem`s for the current user"""
        return self.request.user.todo_items.all().order_by("order_id")

    @staticmethod
    def fulfill_request_data_with_user_id(request):
        """
        Fulfill the request data with the user id

        Will assign the user id to each item in the request data if the request data is a list.
        Will assign the user id to the request data if the request data is a single object.
        """
        if isinstance(request.data, list):
            for item in request.data:
                item["user"] = request.user.id
        else:
            request.data["user"] = request.user.id
