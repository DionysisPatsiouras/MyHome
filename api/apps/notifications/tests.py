from datetime import date

from channels.db import database_sync_to_async
from channels.testing import WebsocketCommunicator
from django.test import TransactionTestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from core.asgi import application
from users.models import CustomUser

from .models import Notification


class NotificationEndpointsTests(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            email="owner@example.com",
            password="test-password",
            first_name="Owner",
            last_name="User",
            birthdate=date(1990, 1, 1),
        )
        self.other_user = CustomUser.objects.create_user(
            email="other@example.com",
            password="test-password",
            first_name="Other",
            last_name="User",
            birthdate=date(1991, 1, 1),
        )
        self.client.force_authenticate(self.user)

    def test_list_is_scoped_to_current_user_and_supports_status_filter(self):
        unread = Notification.objects.create(
            user=self.user,
            title="Unread",
            message="Unread message",
        )
        read = Notification.objects.create(
            user=self.user,
            title="Read",
            message="Read message",
        )
        read.mark_as_read()
        Notification.objects.create(
            user=self.other_user,
            title="Other user",
            message="Should not be returned",
        )
        Notification.objects.create(
            user=self.user,
            title="Deleted",
            message="Should not be returned",
            is_deleted=True,
        )

        response = self.client.get(reverse("notification-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual({row["id"] for row in response.data}, {unread.id, read.id})

        unread_response = self.client.get(
            reverse("notification-list"),
            {"status": "unread"},
        )
        self.assertEqual([row["id"] for row in unread_response.data], [unread.id])

    def test_list_requires_authentication(self):
        anonymous_client = APIClient()

        response = anonymous_client.get(reverse("notification-list"))

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_assigns_notification_to_current_user(self):
        response = self.client.post(
            reverse("notification-list"),
            {
                "title": "New notification",
                "message": "Notification body",
                "notification_type": Notification.Type.REPAIR,
                "action_url": "/dashboard/residences/1",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        notification = Notification.objects.get(pk=response.data["id"])
        self.assertEqual(notification.user, self.user)
        self.assertFalse(notification.is_read)

    def test_patch_marks_notification_as_read_and_unread(self):
        notification = Notification.objects.create(
            user=self.user,
            title="Reminder",
            message="Reminder body",
        )
        url = reverse("notification-detail", args=[notification.id])

        response = self.client.patch(url, {"is_read": True}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        notification.refresh_from_db()
        self.assertTrue(notification.is_read)
        self.assertIsNotNone(notification.read_at)

        response = self.client.patch(url, {"is_read": False}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        notification.refresh_from_db()
        self.assertFalse(notification.is_read)
        self.assertIsNone(notification.read_at)

    def test_user_cannot_access_another_users_notification(self):
        notification = Notification.objects.create(
            user=self.other_user,
            title="Private",
            message="Private body",
        )

        response = self.client.get(
            reverse("notification-detail", args=[notification.id])
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_mark_all_as_read_only_updates_current_users_notifications(self):
        own_notifications = [
            Notification.objects.create(
                user=self.user,
                title=f"Own {index}",
                message="Body",
            )
            for index in range(2)
        ]
        other_notification = Notification.objects.create(
            user=self.other_user,
            title="Other",
            message="Body",
        )

        response = self.client.patch(reverse("notification-read-all"), format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["updated_count"], 2)
        self.assertTrue(
            all(
                Notification.objects.get(pk=notification.id).is_read
                for notification in own_notifications
            )
        )
        other_notification.refresh_from_db()
        self.assertFalse(other_notification.is_read)

        count_response = self.client.get(reverse("notification-unread-count"))
        self.assertEqual(count_response.data, {"unread_count": 0})

    def test_delete_soft_deletes_notification(self):
        notification = Notification.objects.create(
            user=self.user,
            title="Delete me",
            message="Body",
        )

        response = self.client.delete(
            reverse("notification-detail", args=[notification.id])
        )

        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        notification.refresh_from_db()
        self.assertTrue(notification.is_deleted)
        self.assertIsNotNone(notification.deleted_at)

        detail_response = self.client.get(
            reverse("notification-detail", args=[notification.id])
        )
        self.assertEqual(detail_response.status_code, status.HTTP_404_NOT_FOUND)


class NotificationWebSocketTests(TransactionTestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            email="websocket@example.com",
            password="test-password",
            first_name="WebSocket",
            last_name="User",
            birthdate=date(1990, 1, 1),
        )
        self.token = str(AccessToken.for_user(self.user))

    async def test_authenticated_user_receives_created_notification(self):
        communicator = WebsocketCommunicator(
            application,
            "/ws/notifications/",
            headers=[(b"origin", b"http://localhost:3000")],
            subprotocols=["myhome.notifications", self.token],
        )

        connected, accepted_subprotocol = await communicator.connect()

        self.assertTrue(connected)
        self.assertEqual(accepted_subprotocol, "myhome.notifications")

        notification = await database_sync_to_async(Notification.objects.create)(
            user=self.user,
            title="Real-time notification",
            message="Delivered through the WebSocket.",
        )
        message = await communicator.receive_json_from(timeout=2)

        self.assertEqual(message["type"], "notification.created")
        self.assertEqual(message["notification"]["id"], notification.id)
        self.assertEqual(message["notification"]["title"], notification.title)

        await communicator.disconnect()

    async def test_invalid_token_is_rejected(self):
        communicator = WebsocketCommunicator(
            application,
            "/ws/notifications/",
            headers=[(b"origin", b"http://localhost:3000")],
            subprotocols=["myhome.notifications", "invalid-token"],
        )

        connected, close_code = await communicator.connect()

        self.assertFalse(connected)
        self.assertEqual(close_code, 4401)
