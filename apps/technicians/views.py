from .models import *
from .serializers import *

from rest_framework.decorators import api_view

from infra.Helpers import *
# from infra.GenericViews import generateGenericViews



# CUSTOM ENDPOINTS
@api_view(["GET"])
def retrieveTypes(request):
    return retrieveAll(TechnicianType, TechnicianTypeSerializer)
