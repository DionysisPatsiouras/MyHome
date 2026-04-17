from .models import *
from .serializers import *


from infra.Helpers import *
from infra.GenericViews import generateGenericViews

_MODEL = Repair
_MODEL_SERIALIZER = RepairSerializer


list, record = generateGenericViews(_MODEL, _MODEL_SERIALIZER, auth_field="user")
