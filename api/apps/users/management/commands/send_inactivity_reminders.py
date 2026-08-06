from datetime import timedelta
from django.conf import settings
from django.utils import timezone
from django.core.management.base import BaseCommand

from users.models import CustomUser
from infra.EmailService import EmailService


class Command(BaseCommand):

    def handle(self, *args, **kwargs):

        target_date = timezone.now().date() - timedelta(days=180)

        inactive_users = CustomUser.objects.filter(
            is_deleted=False,
            last_login__date=target_date,
        )

        if not inactive_users.exists():
            print("No users reached 6 months of inactivity today.")
            return

        login_url = f"{settings.FRONTEND_URL}/auth/sign-in"

        for user in inactive_users:
            EmailService(
                'users/inactivity_reminder.html',
                "Μας λείπεις στο MyHome",
                {
                    "first_name": user.first_name,
                    "login_url": login_url,
                },
                [user.email]
            )
