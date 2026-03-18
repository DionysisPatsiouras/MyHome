from django.db import models

from users.models import CustomUser


class Repair(models.Model):

    description = models.CharField(max_length=200, null=False)
    cost = models.DecimalField(max_digits=8, decimal_places=2)

    date = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False, null=False)
    deleted_at = models.DateTimeField(null=True, blank=True)


    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    class Meta:
        db_table = "repairs"


