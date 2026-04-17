from django.db import models
from users.models import CustomUser


class Tenant(models.Model):

    first_name = models.CharField(max_length=200, null=False)
    last_name = models.CharField(max_length=200, null=False)
    afm = models.CharField(max_length=9, null=False, blank=False)
    phone = models.CharField(max_length=10, null=True, blank=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False, null=False)
    deleted_at = models.DateTimeField(null=True, blank=True)


    class Meta:
        db_table = "tenants"

