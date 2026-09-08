from channels.generic.websocket import AsyncJsonWebsocketConsumer

from core.websocket_auth import NOTIFICATIONS_SUBPROTOCOL


def notification_group_name(user_id):
    return f"notifications.user.{user_id}"


class NotificationConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        user = self.scope["user"]

        if not user.is_authenticated:
            await self.close(code=4401)
            return

        self.notification_group = notification_group_name(user.id)
        await self.channel_layer.group_add(
            self.notification_group,
            self.channel_name,
        )
        await self.accept(subprotocol=NOTIFICATIONS_SUBPROTOCOL)

    async def disconnect(self, close_code):
        notification_group = getattr(self, "notification_group", None)
        if notification_group:
            await self.channel_layer.group_discard(
                notification_group,
                self.channel_name,
            )

    async def notification_event(self, event):
        await self.send_json(event["payload"])
