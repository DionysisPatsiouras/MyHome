from .models import *
from .serializers import *

from rest_framework.decorators import api_view
from infra.Helpers import *
from infra.GenericViews import generateGenericViews

_MODEL = Rental
_MODEL_SERIALIZER = RentalSerializer

_, record = generateGenericViews(_MODEL, _MODEL_SERIALIZER, auth_field="residence.user")


@api_view(["GET", "POST"])
def list(request):

    if request.method == "GET":
        return retrieveWithFilters(
            _MODEL, _MODEL_SERIALIZER, residence__user=request.user.id
        )

    if request.method == "POST":
        return insert(_MODEL_SERIALIZER, request)
