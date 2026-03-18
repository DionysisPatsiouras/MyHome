from django.db import models

from users.models import CustomUser


class TechnicianType(models.Model):

    avatar = models.CharField(max_length=200, null=False)    
    name = models.CharField(max_length=200, null=False)    

    class Meta:
        db_table = "technician_types"



class Technician(models.Model):

    full_name = models.CharField(max_length=200, null=False)
    phone_1 = models.CharField(max_length=10, null=True)
    phone_2 = models.CharField(max_length=10, null=True)


    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False, null=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    technicianType = models.ForeignKey(TechnicianType, on_delete=models.CASCADE)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    class Meta:
        db_table = "technicians"


