from django.db import models

from users.models import User


class TodoItem(models.Model):
    """
    Represents a todo item, task.

    A todo item belongs to a user

    Attributes
    ----------
    title : str
        The name of the todo item.

    description : str
        The description of the todo item.

    completed : bool
        The status of the todo item.

    user : User
        The user for which this todo item belongs.

    order_id : int
        The order of the todo item in the list of `User`s todo items.
    """

    title = models.CharField(max_length=100)
    description = models.CharField(max_length=200, blank=True, null=True)
    completed = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="todo_items")
    order_id = models.PositiveIntegerField(null=True)

    def __str__(self):
        return self.title
