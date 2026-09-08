from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = (
            "id",
            "title",
            "message",
            "notification_type",
            "action_url",
            "is_read",
            "read_at",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "is_read",
            "read_at",
            "created_at",
            "updated_at",
        )

    def validate_action_url(self, value):
        if value and (not value.startswith("/") or value.startswith("//")):
            raise serializers.ValidationError("Action URL must be an internal path.")

        return value


class NotificationReadSerializer(serializers.Serializer):
    is_read = serializers.BooleanField()

    def update(self, instance, validated_data):
        if validated_data["is_read"]:
            instance.mark_as_read()
        else:
            instance.mark_as_unread()

        return instance

    def create(self, validated_data):
        raise NotImplementedError
