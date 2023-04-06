from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

from users.models import User


@receiver(post_save, sender=User)
def create_token(_, instance, created, **__):
    if created:
        Token.objects.create(user=instance)
