
from rest_framework.response import Response
from rest_framework.decorators import api_view

from django.contrib.auth.hashers import check_password


from users.models import CustomUser, LoginAttempts

from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# import jwt, datetime

from django.contrib.auth import authenticate
# from django.utils.timezone import now


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    
    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if not email or not password:
            raise AuthenticationFailed(
                {"code": 100, "message": "Email and password are required"}
            )
        

        try:
         
            user = CustomUser.objects.get(email=attrs.get("email"))
            login_attempts = LoginAttempts.objects.filter(user=user.id).count()
            current_ip_address = self.context.get("request").META.get("REMOTE_ADDR"),


            if login_attempts >= 3:
                raise AuthenticationFailed(
                    {"code": 104, "message": "Too many attempts"}
            )

            if not check_password(password, user.password):
                
                if login_attempts <= 2:
                    LoginAttempts.objects.create(
                        user_id=user.id,
                        ip_address=current_ip_address,
                    )    

                if login_attempts >= 2:
                    raise AuthenticationFailed(
                        {"code": 104, "message": "Too many attempts"}
                    )

                raise AuthenticationFailed(
                    {"code": 102, "message": "Wrong password"}
                )
            
           
            else:

                LoginAttempts.objects.filter(user_id=user.id).delete()
                # print(current_ip_address)

                data = super().validate(attrs)
                return data



        except CustomUser.DoesNotExist:
            raise AuthenticationFailed(
                {
                    "code": 101,
                    "message": "User not exist",
                    "messageGR": "Δεν βρέθηκε λογαρισμός με αυτά τα στοιχεία",
                }
            )



    
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