from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _

from .managers import CustomUserManager


class CustomUser(AbstractBaseUser, PermissionsMixin):

    email = models.EmailField(_("email address"), unique=True)
    first_name = models.CharField(max_length=200, null=False, blank=False)
    last_name = models.CharField(max_length=200, null=False, blank=False)
    password = models.CharField(max_length=500, null=False, blank=False)

    is_verified = models.BooleanField(default=False, null=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False, null=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    class Meta:
        db_table = "users"



# class LoginAttempts(models.Model):

#     user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
#     date_attempted = models.DateTimeField(auto_now_add=True)

