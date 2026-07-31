
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.html import strip_tags


from users.models import CustomUser, LoginAttempts, ResetPassword, VerifyRequests

from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView



@api_view(["POST"])
@permission_classes([])
def resetPassword(request):
    token = request.data.get("token")
    requestId = request.data.get("requestId")
    password = request.data.get("password")

    if not token or not requestId or not password:
        return Response(
            {"code": 108, "message": "Token, request ID and password are required"},
            status=400,
        )

    try:
        reset_request = ResetPassword.objects.get(pk=requestId, token=token)
    except ResetPassword.DoesNotExist:
        raise AuthenticationFailed(
            {"code": 105, "message": "Invalid reset token"}
        )

    if not reset_request.is_valid:
        return Response(
            {"code": 107, "message": "Token expired or already used"}, status=400
        )

    user = reset_request.user
    user.password = make_password(password)
    user.save(update_fields=["password"])

    reset_request.used_at = timezone.now()
    reset_request.save(update_fields=["used_at"])

    html_content = render_to_string(
        "emails/reset_password_success.html",
        {"first_name": user.first_name},
    )

    email_message = EmailMultiAlternatives(
        subject="Ο κωδικός σου άλλαξε - MyHome",
        body=strip_tags(html_content),
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )
    email_message.attach_alternative(html_content, "text/html")
    email_message.send(fail_silently=False)

    return Response({"code": 200, "message": "Password reset successfully"})


@api_view(["POST"])
@permission_classes([])
def forgotPassword(request):
    email = request.data.get("email")

    if not email:
        return Response(
            {"code": 108, "message": "Email is required"},
            status=400,
        )

    try:
        user = CustomUser.objects.get(email=email)
    except CustomUser.DoesNotExist:
        raise AuthenticationFailed(
            {
                "code": 101,
                "message": "User not exist",
                "messageGR": "Δεν βρέθηκε λογαρισμός με αυτά τα στοιχεία",
            }
        )

    reset_request = ResetPassword.objects.create(user=user)

    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={reset_request.token}&requestId={reset_request.id}"

    html_content = render_to_string(
        "emails/reset_password.html",
        {"first_name": user.first_name, "reset_url": reset_url},
    )

    email_message = EmailMultiAlternatives(
        subject="Επαναφορά κωδικού πρόσβασης - MyHome",
        body=strip_tags(html_content),
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )
    email_message.attach_alternative(html_content, "text/html")
    email_message.send(fail_silently=False)

    return Response({"code": 200, "message": "Reset link sent"})

@api_view(["POST"])
@permission_classes([])
def verifyRequest(request):
    token = request.query_params.get("token")
    requestId = request.query_params.get("requestId")

    if not token or not requestId:
        return Response(
            {
                "code": 108,
                "message": "Verification token and request ID are required"
            },
            status=400,
        )

    try:
        verify_request = VerifyRequests.objects.get(pk=requestId, token=token)
    except VerifyRequests.DoesNotExist:
        raise AuthenticationFailed(
            {"code": 105, "message": "Invalid verification token"}
        )

    if verify_request.date_verified:
        return Response({"code": 106, "message": "Already verified"}, status=400)

    if verify_request.expires_at < timezone.now():
        return Response({"code": 107, "message": "Token expired"}, status=400)

    verify_request.date_verified = timezone.now()
    verify_request.save(update_fields=["date_verified"])

    user = verify_request.user
    user.is_verified = True
    user.save(update_fields=["is_verified"])

    return Response({"code": 200, "message": "Account verified successfully"})


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
            current_ip_address = self.context.get("request").META.get("REMOTE_ADDR")


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