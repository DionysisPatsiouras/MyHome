from .models import *
from .serializers import *

from rest_framework.decorators import api_view

from infra.Helpers import *
from infra.GenericViews import generateGenericViews


_MODEL = Technician
_MODEL_SERIALIZER = TechnicianSerializer



list, record = generateGenericViews(_MODEL, _MODEL_SERIALIZER, auth_field="user")



# CUSTOM ENDPOINTS
@api_view(["GET"])
def retrieveTypes(request):
    return retrieveAll(TechnicianType, TechnicianTypeSerializer)
