from .models import *
from .serializers import *

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from django.contrib.auth.hashers import check_password, make_password



@api_view(["POST"])
@permission_classes([])
def insert(request):

    serializer = UserSerializer(data=request.data)

    serializer.is_valid(raise_exception=True)

    password = serializer.validated_data.get("password")
    serializer.validated_data["password"] = make_password(password)

    serializer.save()

    return Response(
        {
            "message": "Created",
            "status": 201
        },
        status=status.HTTP_201_CREATED,
    )
