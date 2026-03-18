from rest_framework import serializers
from .models import *



class TechnicianTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = TechnicianType
        fields = '__all__'

class TechnicianSerializer(serializers.ModelSerializer):

    
    technicianType = TechnicianTypeSerializer(many=False, read_only=True)

    technicianType_id = serializers.PrimaryKeyRelatedField(
        queryset=TechnicianType.objects.all(), source='technicianType', write_only=True
    )

    class Meta:
        model = Technician
        fields = '__all__'




# class ResidenceSerializer(serializers.ModelSerializer):

#     residenceType = ResidenceTypeSerializer(many=False, read_only=True)

#     residenceType_id = serializers.PrimaryKeyRelatedField(
#         queryset=ResidenceType.objects.all(), source='residenceType', write_only=True
#     )

#     class Meta:
#         model = Residence
#         exclude = ('created_at', 'is_deleted', 'deleted_at', 'updated_at')


