from rest_framework import viewsets

from core.serializers import TodoItemSerializer


class TodoItemViewSet(viewsets.ModelViewSet):
    serializer_class = TodoItemSerializer

    def get_queryset(self):
        return self.request.user.todo_items.all()
