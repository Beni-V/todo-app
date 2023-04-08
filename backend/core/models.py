from django.db import models

from users.models import User


class TodoItem(models.Model):
    """
    Represents a `TodoItem`, task.

    A `TodoItem` belongs to a user

    Attributes
    ----------
    title : str
        The name of the `TodoItem`.

    description : str
        The description of the `TodoItem`.

    completed : bool
        The status of the `TodoItem`.

    user : User
        The user for which this `TodoItem` belongs.

    order_id : int
        The order of the `TodoItem` in the list of `User`s `TodoItem`s.
    """

    title = models.CharField(max_length=100)
    description = models.CharField(max_length=200, blank=True, null=True)
    completed = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="todo_items")
    order_id = models.PositiveIntegerField(null=True)

    def __str__(self):
        return self.title
