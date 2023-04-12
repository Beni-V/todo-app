from rest_framework_bulk import BulkSerializerMixin, BulkListSerializer

from core.models import TodoItem
from rest_framework import serializers


class TodoItemSerializer(BulkSerializerMixin, serializers.ModelSerializer):
    class Meta(object):
        model = TodoItem
        list_serializer_class = BulkListSerializer
        fields = ["title", "description", "completed", "user", "order_id", "id"]
        update_lookup_field = "id"
