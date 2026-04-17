from django.db import models

from residences.models import Residence
from tenants.models import Tenant

class Rental(models.Model):

    residence = models.ForeignKey(Residence, on_delete=models.CASCADE)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    rent_amount = models.DecimalField(max_digits=8, decimal_places=2)
    
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    duration = models.IntegerField(null=False, blank=False)

    declaration_number = models.CharField(max_length=300, null=True)

    # auto calculate duration
    def save(self, *args, **kwargs):
        if self.start_date and self.end_date:
            self.duration = (self.end_date - self.start_date).days
        super().save(*args, **kwargs)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False, null=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "rentals"