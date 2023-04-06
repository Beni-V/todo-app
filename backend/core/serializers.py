from core.models import TodoItem


class TodoItemSerializer:
    class Meta:
        model = TodoItem
        fields = "__all__"
