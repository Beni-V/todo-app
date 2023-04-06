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
