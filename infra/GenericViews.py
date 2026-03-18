from rest_framework.decorators import api_view

from infra.Helpers import *

from infra.Responses import Forbidden_403


# syntax
# list, record = generateGenericViews(_MODEL, _MODEL_SERIALIZER, auth_field="user")



def generateGenericViews(_MODEL, _MODEL_SERIALIZER, auth_field=None, base_name=None):


    @api_view(["GET", "POST"])
    def list(request):

        if request.method == "GET":
            return retrieveWithFilters(_MODEL, _MODEL_SERIALIZER)

        if request.method == "POST":
            return insert(_MODEL_SERIALIZER, request)

        return list

    @api_view(["GET", "PATCH", "DELETE"])
    def record(request, id):

        try:
            entity = _MODEL.objects.get(pk=id)

            obj = entity
            for part in auth_field.split("."):
                obj = getattr(obj, part)
           
            if obj.id != request.user.id:
                return Forbidden_403()
            
        except _MODEL.DoesNotExist:
            raise NotFound(f"{_MODEL.__name__} not found")


        if request.method == "GET":
            return retrieveOne(_MODEL, _MODEL_SERIALIZER, pk=id)

        if request.method == "PATCH":
            return updateEntity(_MODEL, _MODEL_SERIALIZER, request, id)

        if request.method == "DELETE":
            return softDelete(_MODEL, id)
        

    return list, record



