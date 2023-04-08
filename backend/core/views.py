from django.db.models import Max
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from core.serializers import TodoItemSerializer


class TodoItemViewSet(viewsets.ModelViewSet):
    """View-set for `TodoItem`s"""

    serializer_class = TodoItemSerializer
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return the todo items for the current user"""
        return self.request.user.todo_items.all()

    def create(self, request, *args, **kwargs):
        # Set the user to the current user from the request
        request.data['user'] = request.user.id

        # Set the order_id to the max order_id + 1 in case there are other todo items, else set it to 1
        max_order_id = request.user.todo_items.aggregate(
            Max("order_id")
        )["order_id__max"]

        if max_order_id is not None:
            request.data['order_id'] = max_order_id + 1
        else:
            request.data['order_id'] = 1

        return super().create(request, *args, **kwargs)

