from functools import partial

from django.db import transaction
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Notification
from .realtime import broadcast_notification_event
from .serializers import NotificationSerializer


@receiver(post_save, sender=Notification)
def broadcast_saved_notification(sender, instance, created, raw, **kwargs):
    if raw:
        return

    if instance.is_deleted:
        payload = {
            "type": "notification.deleted",
            "notification_id": instance.id,
        }
    else:
        payload = {
            "type": "notification.created" if created else "notification.updated",
            "notification": NotificationSerializer(instance).data,
        }

    transaction.on_commit(
        partial(broadcast_notification_event, instance.user_id, payload)
    )
