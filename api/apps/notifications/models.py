from django.conf import settings
from django.db import models
from django.utils import timezone


class Notification(models.Model):
    class Type(models.TextChoices):
        GENERAL = "general", "General"
        REPAIR = "repair", "Repair"
        RENTAL = "rental", "Rental"
        PAYMENT = "payment", "Payment"
        TENANT = "tenant", "Tenant"
        MAINTENANCE = "maintenance", "Maintenance"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(
        max_length=32,
        choices=Type.choices,
        default=Type.GENERAL,
    )
    action_url = models.CharField(max_length=500, blank=True, default="")

    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "notifications"
        ordering = ["-created_at"]
        indexes = [
            models.Index(
                fields=["user", "is_deleted", "is_read", "-created_at"],
                name="notif_user_status_idx",
            ),
        ]

    def mark_as_read(self):
        if self.is_read:
            return

        self.is_read = True
        self.read_at = timezone.now()
        self.save(update_fields=["is_read", "read_at", "updated_at"])

    def mark_as_unread(self):
        if not self.is_read:
            return

        self.is_read = False
        self.read_at = None
        self.save(update_fields=["is_read", "read_at", "updated_at"])

    def __str__(self):
        return self.title
