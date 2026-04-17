from django.db import models

from residences.models import Residence


class Maintenance(models.Model):

    title = models.CharField(max_length=250, null=False)
    residence = models.ForeignKey(Residence, on_delete=models.CASCADE)
    recurrence = models.IntegerField(null=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False, null=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "maintenances"


class MaintenanceHistory(models.Model):

    maintenanceId = models.ForeignKey(Maintenance, on_delete=models.CASCADE)
    comments = models.CharField(max_length=500, null=True)
    date = models.DateTimeField(null=False, blank=False)
    cost = models.IntegerField(null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False, null=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "maintenance_history"
