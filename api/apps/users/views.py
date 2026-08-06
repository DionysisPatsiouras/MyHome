from .models import *
from .serializers import *

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from django.contrib.auth.hashers import check_password, make_password

from infra.EmailService import EmailService
from decouple import config


from infra.Helpers import *


_UPDATABLE_PROFILE_FIELDS = ("first_name", "last_name")

@api_view(["POST"])
def changePassword(request):

    user = request.user

    serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
    serializer.is_valid(raise_exception=True)

    password = serializer.validated_data["new_password"]

    user.password = make_password(password)
    user.save(update_fields=["password"])


    EmailService(
        'auth/password_changed.html',
        'Ο κωδικός πρόσβασης άλλαξε',
        {"first_name": user.first_name},
        [user.email]
    )

    return Updated_200()


@api_view(["POST"])
def verifyPassword(request):

    serializer = VerifyPasswordSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    password = serializer.validated_data["password"]

    if not check_password(password, request.user.password):
        return Response(
            {
                "success": False,
                "code": 102,
                "message": "Wrong password",
                "message_gr": "Λανθασμένος κωδικός",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    return Response({
        "success": True,
        "code": 200,
        "message": "Password verified",
        "message_gr": "Ο κωδικός επιβεβαιώθηκε",
    })


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
        'auth/welcome.html', 
        'Καλώς ήρθατε στο MyHome',
        {"first_name": user.first_name},
        [user.email]
    )

    
    verify_url = f"{config("FRONTEND_URL")}/auth/verify?token={verify_request.token}&requestId={verify_request.id}"

    EmailService(
        'auth/verify_email.html', 
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
