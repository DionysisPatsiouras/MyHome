from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from .models import Notification
from .realtime import broadcast_notification_event
from .serializers import NotificationReadSerializer, NotificationSerializer


def _user_notifications(request):
    return Notification.objects.filter(user=request.user, is_deleted=False)


def _get_user_notification(request, notification_id):
    try:
        return _user_notifications(request).get(pk=notification_id)
    except Notification.DoesNotExist as exc:
        raise NotFound("Notification not found") from exc


@api_view(["GET", "POST"])
def notification_list(request):
    if request.method == "POST":
        serializer = NotificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        notification = serializer.save(user=request.user)
        return Response(
            NotificationSerializer(notification).data,
            status=status.HTTP_201_CREATED,
        )

    status_filter = request.query_params.get("status", "all")
    notifications = _user_notifications(request)

    if status_filter == "unread":
        notifications = notifications.filter(is_read=False)
    elif status_filter == "read":
        notifications = notifications.filter(is_read=True)
    elif status_filter != "all":
        return Response(
            {"detail": "Status must be one of: all, unread, read."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    return Response(NotificationSerializer(notifications, many=True).data)


@api_view(["GET", "PATCH", "DELETE"])
def notification_detail(request, notification_id):
    notification = _get_user_notification(request, notification_id)

    if request.method == "GET":
        return Response(NotificationSerializer(notification).data)

    if request.method == "PATCH":
        serializer = NotificationReadSerializer(notification, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(NotificationSerializer(notification).data)

    notification.is_deleted = True
    notification.deleted_at = timezone.now()
    notification.save(update_fields=["is_deleted", "deleted_at", "updated_at"])

    return Response(
        {"success": True, "message": "Notification deleted successfully."},
        status=status.HTTP_202_ACCEPTED,
    )


@api_view(["GET"])
def unread_count(request):
    count = _user_notifications(request).filter(is_read=False).count()
    return Response({"unread_count": count})


@api_view(["PATCH"])
def mark_all_as_read(request):
    now = timezone.now()
    unread_notifications = _user_notifications(request).filter(is_read=False)
    updated_ids = list(unread_notifications.values_list("id", flat=True))
    updated_count = unread_notifications.update(
        is_read=True,
        read_at=now,
        updated_at=now,
    )

    if updated_ids:
        broadcast_notification_event(
            request.user.id,
            {
                "type": "notifications.read_all",
                "notification_ids": updated_ids,
                "read_at": now.isoformat(),
            },
        )

    return Response(
        {
            "success": True,
            "updated_count": updated_count,
            "unread_count": 0,
        }
    )
