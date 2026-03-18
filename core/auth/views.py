# from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view

# from rest_framework.decorators import APIView

from rest_framework.exceptions import AuthenticationFailed

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# import jwt, datetime

from django.contrib.auth import authenticate
from django.utils.timezone import now


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        username = attrs.get("username") or attrs.get("email")
        password = attrs.get("password")

        if not username or not password:
            raise AuthenticationFailed(
                {"code": 100, "message": "Username and password are required"}
            )

        user = authenticate(
            request=self.context.get("request"), username=username, password=password
        )

        if user is None:
            raise AuthenticationFailed(
                {
                    "code": 101,
                    "message": "User not exist",
                    "messageGR": "Δεν βρέθηκε λογαρισμός με αυτά τα στοιχεία",
                }
            )
        # if user is None:
        #     raise AuthenticationFailed
        # (
        #     {
        #         "code": 101,
        #         "message": "User not exist",
        #         "messageGR": "Δεν βρέθηκε λογαρισμός με αυτά τα στοιχεία",
        #     }
        # )

        if user.is_deleted and user.deleted_at:
            raise AuthenticationFailed(
                {
                    "code": 102,
                    "message": "User is deleted",
                    "messageGR": "Ο λογαριασμός έχει διαγραφεί",
                }
            )

        # if not user.is_verified:
        #     raise AuthenticationFailed(
        #         {
        #             "code": 103,
        #             "message": "User is not verified",
        #             "messageGR": "Ο λογαριασμός δεν έχει επαληθευτεί",
        #         }
        #     )

        data = super().validate(attrs)

        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["email"] = user.email
        # user.last_login = now()
        # user.save(update_fields=["last_login"])
        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(["GET"])
def getRoutes(request):

    routes = ["/api/token", "/api/token/refresh"]
    return Response(routes)