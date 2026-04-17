from rest_framework import serializers
from .models import *


# from residences.serializers import ResidenceSerializer
# from residences.models import Residence

from tenants.serializers import TenantSerializer
from tenants.models import Tenant


class RentalSerializer(serializers.ModelSerializer):

    # residence = ResidenceSerializer(many=False, read_only=True)

    # residence_id = serializers.PrimaryKeyRelatedField(
    #     queryset=Residence.objects.all(), source='residence', write_only=True
    # )

    tenant = TenantSerializer(many=False, read_only=True)

    tenant_id = serializers.PrimaryKeyRelatedField(
        queryset=Tenant.objects.all(), source="tenant", write_only=True
    )

    class Meta:
        model = Rental
        # fields = '__all__'
        exclude = ("created_at", "is_deleted", "deleted_at", "updated_at")
        extra_kwargs = {"duration": {"read_only": True}}
