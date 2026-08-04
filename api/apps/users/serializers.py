from rest_framework import serializers
from .models import *

from infra.Validators import *


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        # fields = '__all__'
        exclude = ('groups','user_permissions','is_superuser', 'deleted_at', 'updated_at', 'created_at',)

    def validate_email(self, value):
        return validate_email_format(value)

    def validate_password(self, value):
        return validate_password_format(value)


