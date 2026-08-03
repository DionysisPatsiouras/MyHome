
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from django.utils import timezone

from users.models import CustomUser, LoginAttempts, ResetPassword, VerifyRequests

from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from infra.EmailService import EmailService

from decouple import config



@api_view(["POST"])
@permission_classes([])
def resetPassword(request):
    token = request.data.get("token")
    requestId = request.data.get("requestId")
    password = request.data.get("password")

    if not token or not requestId or not password:
        return Response(
            {
                "success": False,
                "code": 108,
                "message": "Token, request ID and password are required",
                "message_gr": "Το token, το request ID και ο κωδικός είναι υποχρεωτικά",
            },
            status=400,
        )

    try:
        reset_request = ResetPassword.objects.get(pk=requestId, token=token)
    except ResetPassword.DoesNotExist:
        raise AuthenticationFailed(
            {
                "success": False,
                "code": 105,
                "message": "Invalid reset token",
                "message_gr": "Μη έγκυρο token επαναφοράς",
            }
        )

    if not reset_request.is_valid:
        return Response(
            {
                "success": False,
                "code": 107,
                "message": "Token expired or already used",
                "message_gr": "Το token έχει λήξει ή έχει ήδη χρησιμοποιηθεί",
            },
            status=400,
        )

    user = reset_request.user
    user.password = make_password(password)
    user.save(update_fields=["password"])

    reset_request.used_at = timezone.now()
    reset_request.save(update_fields=["used_at"])

    EmailService(
        'reset_password_success.html', 
        'Ο κωδικός σου άλλαξε - MyHome',
        {"first_name": user.first_name},
        [user.email]
    )

    return Response({
        "success": True,
        "code": 200,
        "message": "Password reset successfully",
        "message_gr": "Ο κωδικός άλλαξε με επιτυχία",
    })


@api_view(["POST"])
@permission_classes([])
def forgotPassword(request):
    email = request.data.get("email")

    if not email:
        return Response(
            {
                "success": False,
                "code": 108,
                "message": "Email is required",
                "message_gr": "Το email είναι υποχρεωτικό",
            },
            status=400,
        )

    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        raise AuthenticationFailed(
            {
                "success": False,
                "code": 101,
                "message": "User not exist",
                "message_gr": "Δεν βρέθηκε λογαριασμός με αυτά τα στοιχεία",
            }
        )

    reset_request = ResetPassword.objects.create(user=user)

    reset_url = f"{config("FRONTEND_URL")}/reset-password?token={reset_request.token}&requestId={reset_request.id}"

    EmailService(
        'reset_password.html', 
        'Επαναφορά κωδικού πρόσβασης - MyHome',
        {"first_name": user.first_name, "reset_url": reset_url},
        [user.email]
    )

    return Response({
        "success": True,
        "code": 200,
        "message": "Reset link sent",
        "message_gr": "Ο σύνδεσμος επαναφοράς εστάλη",
    })


@api_view(["POST"])
@permission_classes([])
def resendVerification(request):
    email = request.data.get("email")

    if not email:
        return Response(
            {
                "success": False,
                "code": 108,
                "message": "Email is required",
                "message_gr": "Το email είναι υποχρεωτικό",
            },
            status=400,
        )

    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        raise AuthenticationFailed(
            {
                "success": False,
                "code": 101,
                "message": "User not exist",
                "message_gr": "Δεν βρέθηκε λογαριασμός με αυτά τα στοιχεία",
            }
        )

    if user.is_verified:
        return Response(
            {
                "success": False,
                "code": 106,
                "message": "Already verified",
                "message_gr": "Έχει ήδη επιβεβαιωθεί",
            },
            status=400,
        )

    verify_request = VerifyRequests.objects.create(user=user)

    verify_url = f"{config("FRONTEND_URL")}/auth/verify?token={verify_request.token}&requestId={verify_request.id}"

    EmailService(
        'verify_email.html',
        'Επιβεβαίωση email - MyHome',
        {"first_name": user.first_name, "verify_url": verify_url},
        [user.email]
    )

    return Response({
        "success": True,
        "code": 200,
        "message": "Verification email sent",
        "message_gr": "Το email επιβεβαίωσης εστάλη",
    })


@api_view(["POST"])
@permission_classes([])
def verifyEmail(request):

    token = request.data.get("token")
    requestId = request.data.get("requestId")

    if not token or not requestId:
        return Response(
            {
                "success": False,
                "code": 108,
                "message": "Verification token and request ID are required",
                "message_gr": "Το token επιβεβαίωσης και το request ID είναι υποχρεωτικά",
            },
            status=400,
        )

    try:
        verify_request = VerifyRequests.objects.get(pk=requestId, token=token)
    except VerifyRequests.DoesNotExist:
        raise AuthenticationFailed(
            {
                "success": False,
                "code": 105,
                "message": "Invalid verification token",
                "message_gr": "Μη έγκυρο token επιβεβαίωσης",
            }
        )

    if verify_request.date_verified:
        return Response(
            {
                "code": 106,
                "message": "Already verified",
                "message_gr": "Έχει ήδη επιβεβαιωθεί",
            },
            status=400,
        )

    if verify_request.expires_at < timezone.now():
        return Response(
            {
                "code": 107,
                "message": "Token expired",
                "message_gr": "Το token έχει λήξει",
            },
            status=400,
        )

    verify_request.date_verified = timezone.now()
    verify_request.save(update_fields=["date_verified"])

    user = verify_request.user
    user.is_verified = True
    user.save(update_fields=["is_verified"])


    EmailService(
        'verify_success.html', 
        'Το email σου επιβεβαιώθηκε - MyHome',
        {"first_name": user.first_name, "login_url": config("FRONTEND_LOGIN_URL")},
        [user.email]
    )


    return Response({
        "success": False,
        "code": 200,
        "message": "Account verified successfully",
        "message_gr": "Ο λογαριασμός επιβεβαιώθηκε με επιτυχία",
    })


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    
    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if not email or not password:
            raise AuthenticationFailed(
                {
                    "success": False,
                    "code": 100,
                    "message": "Email and password are required",
                    "message_gr": "Το email και ο κωδικός είναι υποχρεωτικά",
                }
            )
        

        try:
         
            user = CustomUser.objects.get(email=attrs.get("email"))

            if not user.is_verified:
                raise AuthenticationFailed(
                    {
                        "success": False,
                        "code": 109,
                        "message": "Account is not verified",
                        "message_gr": "Ο λογαριασμός δεν έχει επιβεβαιωθεί",
                    }
                )

            login_attempts = LoginAttempts.objects.filter(user=user.id).count()
            current_ip_address = self.context.get("request").META.get("REMOTE_ADDR")


            if login_attempts >= 3:
                raise AuthenticationFailed(
                    {
                        "success": False,
                        "code": 104,
                        "message": "Too many attempts",
                        "message_gr": "Πάρα πολλές προσπάθειες",
                    }
            )

            if not check_password(password, user.password):
                
                if login_attempts <= 2:
                    LoginAttempts.objects.create(
                        user_id=user.id,
                        ip_address=current_ip_address,
                    )    

                if login_attempts >= 2:
                    raise AuthenticationFailed(
                        {
                            "success": False,
                            "code": 104,
                            "message": "Too many attempts",
                            "message_gr": "Πάρα πολλές προσπάθειες",
                        }
                    )

                raise AuthenticationFailed(
                    {
                        "success": False,
                        "code": 102,
                        "message": "Wrong password",
                        "message_gr": "Λανθασμένος κωδικός",
                    }
                )
        
            else:
                LoginAttempts.objects.filter(user_id=user.id).delete()

                data = super().validate(attrs)
                data["success"] = True
                return data



        except CustomUser.DoesNotExist:
            raise AuthenticationFailed(
                {
                    "success": False,
                    "code": 101,
                    "message": "User not exist",
                    "message_gr": "Δεν βρέθηκε λογαριασμός με αυτά τα στοιχεία",
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