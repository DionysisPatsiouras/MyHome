from datetime import date, datetime, timedelta, timezone as datetime_timezone
from unittest.mock import patch

from django.db import IntegrityError, transaction
from django.test import TestCase
from django.utils import timezone
from rest_framework import serializers
from rest_framework.test import APIClient

from .models import CustomUser
from .serializers import UserSerializer


class AdultBirthdateTests(TestCase):
    def test_leap_day_birthday_becomes_eligible_on_march_first(self):
        serializer = UserSerializer()
        birthdate = date(2008, 2, 29)

        with patch("users.serializers.timezone.now", return_value=datetime(2026, 2, 28, tzinfo=datetime_timezone.utc)):
            with self.assertRaisesMessage(serializers.ValidationError, "at least 18"):
                serializer.validate_birthdate(birthdate)

        with patch("users.serializers.timezone.now", return_value=datetime(2026, 3, 1, tzinfo=datetime_timezone.utc)):
            self.assertEqual(serializer.validate_birthdate(birthdate), birthdate)

    def test_exact_eighteenth_birthday_is_accepted(self):
        serializer = UserSerializer()
        with patch("users.serializers.timezone.now", return_value=datetime(2026, 9, 25, tzinfo=datetime_timezone.utc)):
            self.assertEqual(serializer.validate_birthdate(date(2008, 9, 25)), date(2008, 9, 25))
            with self.assertRaises(serializers.ValidationError):
                serializer.validate_birthdate(date(2008, 9, 26))

    def test_registration_rejects_minor_and_accepts_adult(self):
        client = APIClient()
        today = timezone.now().date()
        minor = today - timedelta(days=365 * 17)
        adult = today - timedelta(days=365 * 20)
        payload = {
            "first_name": "Test",
            "last_name": "Person",
            "email": "test@example.com",
            "password": "Password123!",
        }

        response = client.post("/users/", {**payload, "birthdate": minor.isoformat()}, format="json")
        self.assertEqual(response.status_code, 400)
        self.assertIn("birthdate", response.data)
        self.assertFalse(CustomUser.objects.filter(email=payload["email"]).exists())

        with patch("users.views.EmailService"):
            response = client.post("/users/", {**payload, "birthdate": adult.isoformat()}, format="json")

        self.assertEqual(response.status_code, 201)
        user = CustomUser.objects.get(email=payload["email"])
        self.assertTrue(user.check_password(payload["password"]))

    def test_profile_update_rejects_minor(self):
        user = CustomUser.objects.create_user(
            email="adult@example.com",
            password="Password123!",
            first_name="Test",
            last_name="Person",
            birthdate=date(1990, 1, 1),
        )
        client = APIClient()
        client.force_authenticate(user=user)

        response = client.patch(
            "/users/me",
            {"birthdate": (timezone.now().date() - timedelta(days=365 * 17)).isoformat()},
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("birthdate", response.data)
        user.refresh_from_db()
        self.assertEqual(user.birthdate, date(1990, 1, 1))

    def test_database_rejects_minor_without_api(self):
        adult = CustomUser.objects.create_user(
            email="adult@example.com",
            password="Password123!",
            first_name="Test",
            last_name="Person",
            birthdate=date(1990, 1, 1),
        )

        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                CustomUser.objects.create(
                    email="minor@example.com",
                    first_name="Test",
                    last_name="Person",
                    birthdate=timezone.now().date(),
                    password="irrelevant",
                )

        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                CustomUser.objects.filter(pk=adult.pk).update(birthdate=timezone.now().date())
