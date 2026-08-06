from rest_framework import serializers
from .models import *



class ResidenceTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = ResidenceType
        fields = '__all__'


class PrefectureSerializer(serializers.ModelSerializer):

    class Meta:
        model = Prefecture
        fields = '__all__'


class CitySerializer(serializers.ModelSerializer):

    prefecture = PrefectureSerializer(many=False, read_only=True)

    prefecture_id = serializers.PrimaryKeyRelatedField(
        queryset=Prefecture.objects.all(), source='prefecture', write_only=True, required=True
    )

    class Meta:
        model = City
        fields = '__all__'




class ResidenceSerializer(serializers.ModelSerializer):

    residenceType = ResidenceTypeSerializer(many=False, read_only=True)

    residenceType_id = serializers.PrimaryKeyRelatedField(
        queryset=ResidenceType.objects.all(), source='residenceType', write_only=True
    )

    city = CitySerializer(many=False, read_only=True)

    city_id = serializers.PrimaryKeyRelatedField(
        queryset=City.objects.all(), source='city', write_only=True
    )

    class Meta:
        model = Residence
        exclude = ('created_at', 'is_deleted', 'deleted_at', 'updated_at')


