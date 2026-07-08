from datetime import date, timedelta
from django.core.management.base import BaseCommand
from rentals.models import Rental
from residences.models import Residence
from tenants.models import Tenant


class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        residence = Residence.objects.filter(is_deleted=False).first()
        tenant = Tenant.objects.filter(is_deleted=False).first()

        if not residence or not tenant:
            print("No residence or tenant found, skipping rental creation.")
            return

        start_date = date.today()
        end_date = start_date + timedelta(days=30)

        rental = Rental.objects.create(
            residence=residence,
            tenant=tenant,
            rent_amount=500.00,
            start_date=start_date,
            end_date=end_date,
        )

        print(f"Rental created: ID {rental.id}, Residence {residence.address}, Tenant {tenant.first_name} {tenant.last_name}")
