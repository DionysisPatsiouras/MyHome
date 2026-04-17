from rest_framework import serializers
from .models import *


class MaintenanceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Maintenance
        # fields = '__all__'
        exclude = ('created_at', 'is_deleted', 'deleted_at', 'updated_at')

class MaintenanceHistorySerializer(serializers.ModelSerializer):

    class Meta:
        model = MaintenanceHistory
        # fields = '__all__'
        exclude = ('created_at', 'is_deleted', 'deleted_at', 'updated_at')
