from datetime import date, timedelta
from django.conf import settings
from django.core.mail import send_mail
from django.core.management.base import BaseCommand
from rentals.models import Rental

from infra.EmailService import EmailService

class Command(BaseCommand):

    def handle(self, *args, **kwargs):

        target_date_week = date.today() + timedelta(days=7)
        target_date_tomorrow = date.today() + timedelta(days=1)

        expiring_rentals_week = Rental.objects.filter(
            is_deleted=False,
            end_date=target_date_week,
        )
        
        expiring_rentals_tomorrow = Rental.objects.filter(
                    is_deleted=False,
                    end_date=target_date_tomorrow,
        )

        if not expiring_rentals_week.exists():
            print("No rentals expiring in 7 days.")
        else:
            for rental in expiring_rentals_week:
                owner_email = rental.residence.user.email
                tenant_name = f"{rental.tenant.first_name} {rental.tenant.last_name}"

                EmailService(
                    'rentals/rental_expiring_soon.html',
                    f"Η μίσθωση λήγει σε 7 ημέρες - {rental.residence.address} {rental.residence.road_number}",
                    {
                        "address": f"{rental.residence.address} {rental.residence.road_number}",
                        "tenant_name": tenant_name,
                        "end_date": rental.end_date,
                    },
                    [owner_email]
                )


        if not expiring_rentals_tomorrow.exists():
            print("No rentals expiring tomorrow.")
        else:
            for rental in expiring_rentals_tomorrow:
                owner_email = rental.residence.user.email
                tenant_name = f"{rental.tenant.first_name} {rental.tenant.last_name}"

                EmailService(
                    'rentals/rental_expiring_tomorrow.html',
                    f"Η μίσθωση λήγει αύριο - {rental.residence.address} {rental.residence.road_number}",
                    {
                        "address": f"{rental.residence.address} {rental.residence.road_number}",
                        "tenant_name": tenant_name,
                        "end_date": rental.end_date,
                    },
                    [owner_email]
                )

