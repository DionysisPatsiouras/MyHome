from .models import *
from .serializers import *

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from django.contrib.auth.hashers import make_password

from infra.EmailService import EmailService
from decouple import config


from infra.Helpers import *


_UPDATABLE_PROFILE_FIELDS = ("first_name", "last_name", "password")

@api_view(["GET", "PATCH"])
def me(request):

    user = request.user

    if request.method == "GET":

        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == "PATCH":

        data = {
            field: request.data[field]
            for field in _UPDATABLE_PROFILE_FIELDS
            if field in request.data
        }

        serializer = UserSerializer(user, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

    return Updated_200()

@api_view(["POST"])
@permission_classes([])
def insert(request):

    serializer = UserSerializer(data=request.data)

    serializer.is_valid(raise_exception=True)

    password = serializer.validated_data.get("password")
    serializer.validated_data["password"] = make_password(password)

    user = serializer.save()

    verify_request = VerifyRequests.objects.create(user=user)


    EmailService(
        'welcome.html', 
        'Καλώς ήρθατε στο MyHome',
        {"first_name": user.first_name},
        [user.email]
    )

    
    verify_url = f"{config("FRONTEND_URL")}/auth/verify?token={verify_request.token}&requestId={verify_request.id}"

    EmailService(
        'verify_email.html', 
        'Επιβεβαίωση email - MyHome',
        {"first_name": user.first_name, "verify_url": verify_url},
        [user.email]
    )


    return Response(
        {
            "success": True,
            "message": "Created",
            "status": 201
        },
        status=status.HTTP_201_CREATED,
    )
