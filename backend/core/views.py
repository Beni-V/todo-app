from django.db import transaction
from django.db.models import Max
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
        ids = [item['id'] for item in request.data]
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
        return self.request.user.todo_items.all()

    def create(self, request, *args, **kwargs):
        # Set the order_id to the max order_id + 1 in case there are other `TodoItem`s, else set it to 1
        self.fulfill_request_data_with_order_id(request)

        return super().create(request, *args, **kwargs)

    def fulfill_request_data_with_order_id(self, request):
        """
        This method assigns a unique order_id to each item in the request data.

        If the request data is a list, it assigns an order_id to each item in the list.
        If the request data is a single object, it assigns an order_id to that object.

        Attributes
        ----------
        request: dict
            Request object containing the user and data.
        """
        max_order_id = self._get_max_order_id()

        if isinstance(request.data, list):
            for item in request.data:
                max_order_id = self._assign_next_order_id(item, max_order_id)
        else:
            self._assign_next_order_id(request.data, max_order_id)

    def _get_max_order_id(self):
        """
        Retrieve the maximum order_id associated with the given user's todo_items.

        Returns
        -------
        int
            The maximum order_id value for user `TodoItem`s or None if no order_id is found.
        """
        return self.get_queryset().aggregate(Max("order_id"))["order_id__max"]

    @staticmethod
    def _assign_next_order_id(item, current_max_order_id):
        """
        Assign the next available order_id to the given item and return the updated max_order_id.

        Attributes
        ----------
        item: dict
            Dictionary containing the item data.

        current_max_order_id: int
            The current maximum order_id.

        Returns
        -------
        int:
            The updated maximum order_id after assigning it to the item.
        """
        if current_max_order_id is not None:
            item["order_id"] = current_max_order_id + 1
        else:
            item["order_id"] = 1

        return item["order_id"]

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
