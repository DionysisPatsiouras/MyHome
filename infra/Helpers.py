from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework import status
from django.utils.timezone import now



from infra.Responses import Updated_200, Created_201, Deleted_202


# RETRIEVE ALL
# For global use ONLY
def retrieveAll(Model, Serializer):

    try:
        result = Model.objects.all()
        serializer = Serializer(result, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Model.DoesNotExist:
        raise NotFound(f"{Model.__name__} not found")


# RETRIEVE ONE
def retrieveOne(Model, Serializer, **filters):

    try:
        result = Model.objects.get(**filters, is_deleted=False)
        serializer = Serializer(result, many=False)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Model.DoesNotExist:
        raise NotFound(f"{Model.__name__} not found")


# RETRIEVE WITH FILTERS
def retrieveWithFilters(Model, Serializer, **filters):

    try:
        result = Model.objects.filter(**filters, is_deleted=False)
        serializer = Serializer(result, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Model.DoesNotExist:
        raise NotFound(f"{Model.__name__} not found")


# INSERT
def insert(ModelSerializer, request):

    serializer = ModelSerializer(data=request.data)

    serializer.is_valid(raise_exception=True)
    serializer.save()

    return Created_201()


# UPDATE ENTITY
def updateEntity(Model, ModelSerializer, request, id):

    result = Model.objects.get(pk=id)

    serializer = ModelSerializer(result, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()

    return Updated_200()


# SOFT DELETE
def softDelete(Model, id):

    try:
        result = Model.objects.get(pk=id)

        result.is_deleted = True
        result.deleted_at = now()
        result.save()

        return Deleted_202()

    except Model.DoesNotExist:
        raise NotFound(f"{Model.__name__} not found")
