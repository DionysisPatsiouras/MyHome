import re

from rest_framework import serializers
from decouple import config


EMAIL_REGEX = re.compile(
    r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?"
    r"(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$"
)

PASSWORD_MIN_LENGTH = 8

PASSWORD_RULES = (
    (re.compile(r".{%d,}" % PASSWORD_MIN_LENGTH), f"Password must be at least {PASSWORD_MIN_LENGTH} characters long."),
    (re.compile(r"[a-z]"), "Password must contain at least one lowercase letter."),
    (re.compile(r"[A-Z]"), "Password must contain at least one uppercase letter."),
    (re.compile(r"\d"), "Password must contain at least one digit."),
    (re.compile(r"[!@#$%^&*(),.?\":{}|<>_\-+=\[\]/\\;'~`]"), "Password must contain at least one special character."),
)



def validate_email_format(value):

    if not EMAIL_REGEX.match(value):
        raise serializers.ValidationError("Enter a valid email address.")

    return value



def validate_password_format(value):

    if not config("STRICT_PASSWORD", default=False, cast=bool):
        return value

    errors = [message for pattern, message in PASSWORD_RULES if not pattern.search(value)]

    if errors:
        raise serializers.ValidationError(errors)

    return value