from core.models import TodoItem
from users import serializers


class TodoItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TodoItem
        fields = ["title", "description", "completed", "user", "order_id"]


