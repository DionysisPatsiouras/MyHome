from django.urls import path

from . import views


urlpatterns = [
    path("", views.notification_list, name="notification-list"),
    path("unread-count", views.unread_count, name="notification-unread-count"),
    path("read-all", views.mark_all_as_read, name="notification-read-all"),
    path("<int:notification_id>", views.notification_detail, name="notification-detail"),
]
