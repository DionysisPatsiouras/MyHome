from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from .consumers import notification_group_name


def broadcast_notification_event(user_id, payload):
    channel_layer = get_channel_layer()
    if channel_layer is None:
        return

    async_to_sync(channel_layer.group_send)(
        notification_group_name(user_id),
        {
            "type": "notification.event",
            "payload": payload,
        },
    )
