from rest_framework import serializers
from .models import *

from django.contrib.auth.hashers import check_password
from django.utils import timezone
from datetime import date

from infra.Validators import *


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ("email", "first_name", "last_name", "birthdate")

    def validate_email(self, value):
        return validate_email_format(value)

    def validate_birthdate(self, value):
        today = timezone.now().date()
        try:
            cutoff = today.replace(year=today.year - 18)
        except ValueError:
            cutoff = date(today.year - 18, 2, 28)

        if value > cutoff:
            raise serializers.ValidationError("You must be at least 18 years old.")
        return value


class RegistrationSerializer(UserSerializer):
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ("password",)


class VerifyPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(required=True, write_only=True, trim_whitespace=False)


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True, write_only=True, trim_whitespace=False)
    new_password = serializers.CharField(required=True, write_only=True, trim_whitespace=False)
    confirm_password = serializers.CharField(required=True, write_only=True, trim_whitespace=False)

    def validate_password(self, value):
        return validate_password_format(value)

    def validate(self, attrs):
        user = self.context["request"].user

        if not check_password(attrs["current_password"], user.password):
            raise serializers.ValidationError({
                "success": False,
                "code": 102,
                "message": "Wrong password",
                "message_gr": "Λανθασμένος κωδικός",
            })

        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({
                "success": False,
                "code": 110,
                "message": "Passwords do not match",
                "message_gr": "Οι κωδικοί δεν ταιριάζουν",
            })

        return attrs
