from rest_framework import serializers
from .models import *



class ResidenceTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = ResidenceType
        fields = '__all__'




class ResidenceSerializer(serializers.ModelSerializer):

    residenceType = ResidenceTypeSerializer(many=False, read_only=True)

    residenceType_id = serializers.PrimaryKeyRelatedField(
        queryset=ResidenceType.objects.all(), source='residenceType', write_only=True
    )

    class Meta:
        model = Residence
        exclude = ('created_at', 'is_deleted', 'deleted_at', 'updated_at')


