from datetime import date, timedelta
from django.conf import settings
from django.core.mail import send_mail
from django.core.management.base import BaseCommand
from rentals.models import Rental

from infra.EmailService import EmailService

class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        target_date = date.today() + timedelta(days=5)

        expiring_rentals = Rental.objects.filter(
            is_deleted=False,
            end_date=target_date,
        )

        if not expiring_rentals.exists():
            print("No rentals expiring in 5 days.")
            return

        for rental in expiring_rentals:
            owner_email = rental.residence.user.email

            print(
                f"Rental expiring in 5 days: ID {rental.id}, "
                f"Residence {rental.residence.address}, "
                f"Tenant {rental.tenant.first_name} {rental.tenant.last_name}, "
                f"End date {rental.end_date}"
            )

            EmailService(
                'verify_email.html', 
                'Επιβεβαίωση email - MyHome',
                {},
                [owner_email]
            )


            send_mail(
                subject=f"Rental expiring soon: {rental.residence.address}",
                message=(
                    f"The rental at {rental.residence.address} for tenant "
                    f"{rental.tenant.first_name} {rental.tenant.last_name} "
                    f"is expiring on {rental.end_date}."
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[owner_email],
                fail_silently=False,
            )
