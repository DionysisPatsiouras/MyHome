from rest_framework import serializers
from .models import *

from django.contrib.auth.hashers import check_password

from infra.Validators import *


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ("email", "first_name", "last_name")

    def validate_email(self, value):
        return validate_email_format(value)


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
