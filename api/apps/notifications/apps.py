from django.apps import AppConfig


class NotificationsConfig(AppConfig):
    default_auto_field = "django.db.models.AutoField"
    name = "notifications"

    def ready(self):
        import notifications.signals  # noqa: F401
