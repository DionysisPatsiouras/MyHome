from rest_framework import serializers
from .models import *


class TenantSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tenant
        # fields = '__all__'
        exclude = ('created_at', 'updated_at')
