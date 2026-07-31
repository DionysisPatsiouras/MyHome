from .models import *
from .serializers import *

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags




@api_view(["POST"])
@permission_classes([])
def insert(request):

    serializer = UserSerializer(data=request.data)

    serializer.is_valid(raise_exception=True)

    password = serializer.validated_data.get("password")
    serializer.validated_data["password"] = make_password(password)

    user = serializer.save()

    VerifyRequests.objects.create(user=user)

    html_content = render_to_string("emails/welcome.html", {"first_name": user.first_name})

    email = EmailMultiAlternatives(
        subject="Καλώς ήρθατε στο MyHome",
        body=strip_tags(html_content),
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[user.email],
    )
    email.attach_alternative(html_content, "text/html")
    email.send(fail_silently=False)

    return Response(
        {
            "message": "Created",
            "status": 201
        },
        status=status.HTTP_201_CREATED,
    )
