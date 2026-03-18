from django.db import models

import datetime
import random

# from django.utils import timezone

# import uuid


from tenants.models import *
from users.models import CustomUser


def generate_uniqueId():
    minute = datetime.datetime.now().minute
    second = datetime.datetime.now().second
    randomNumber = random.randrange(1, 500)

    id = str(minute * second * randomNumber) + str(randomNumber * 2)

    return id


class ResidenceType(models.Model):

    name = models.CharField(max_length=200, null=False)

    class Meta:
        db_table = "residence_types"


class Residence(models.Model):

    uniqueId = models.CharField(default=generate_uniqueId, unique=True)

    # uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    address = models.CharField(max_length=200, null=False)
    road_number = models.CharField(max_length=50, null=True)

    floor = models.IntegerField(null=True)
    flat_number = models.CharField(max_length=50, null=True)
    square_meters = models.DecimalField(max_digits=6, decimal_places=2, null=False)

    energy_class = models.CharField(max_length=10, null=True, blank=False)
    power_supply_number = models.CharField(max_length=50, null=True, blank=False)
    zip_code = models.CharField(max_length=5, null=True, blank=False)

    latitude = models.CharField(max_length=200, null=True)
    longitude = models.CharField(max_length=200, null=True)
    construction_year = models.IntegerField(null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False, null=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    residenceType = models.ForeignKey(ResidenceType, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    class Meta:
        db_table = "residences"


class ResidenceFile(models.Model):

    # upload_to ??
    # file = models.ImageField(null=True, blank=True, upload_to="uploads/")
    name = models.CharField(max_length=200, null=False)
    description = models.CharField(max_length=1000, null=False)
    residence = models.ForeignKey(Residence, null=False, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False, null=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "residence_files"
