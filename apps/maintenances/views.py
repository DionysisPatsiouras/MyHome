from .models import *
from .serializers import *

from rest_framework.decorators import api_view
from infra.Helpers import *
from infra.GenericViews import generateGenericViews

_MODEL = Maintenance
_MODEL_SERIALIZER = MaintenanceSerializer

from rest_framework.response import Response
from infra.Responses import Not_Found_404


from datetime import date, timedelta
# from datetime import date

_, record = generateGenericViews(_MODEL, _MODEL_SERIALIZER, auth_field="residence.user")

history_list, history_record = generateGenericViews(
    MaintenanceHistory,
    MaintenanceHistorySerializer,
    auth_field="maintenanceId.residence.user",
)


@api_view(["GET", "POST"])
def list(request):

    if request.method == "GET":
        return retrieveWithFilters(
            _MODEL, _MODEL_SERIALIZER, residence__user=request.user.id
        )

    if request.method == "POST":
        return insert(_MODEL_SERIALIZER, request)


@api_view(["GET"])
def overview(request, id):

    try:
        record = retrieveWithFilters(
            _MODEL, _MODEL_SERIALIZER, pk=id, residence__user=request.user.id
        )

    except _MODEL.DoesNotExist:
        raise NotFound(f"{_MODEL.__name__} not found")

    history = retrieveWithFilters(
        MaintenanceHistory, MaintenanceHistorySerializer, maintenanceId=id
    )


    total_cost = sum(x["cost"] if x["cost"] is not None else 0 for x in history.data)


    dates = [x["date"].replace("T00:00:00Z", "") for x in history.data]
    today = date.today()
    latest = max(dates) if len(history.data) != 0 else None
    last_maintenance = date.fromisoformat(latest.split("T")[0]) if latest else None
    next_maintenance = last_maintenance + timedelta(days=record.data[0]["recurrence"]) if latest else None
    days_left = (next_maintenance - today).days if latest else None


    if len(record.data) != 0:
        return Response(
            {
                "maintenance": record.data,
                "maintenance_history": history.data,
                "last_maintenance": last_maintenance,
                "next_maintenance": next_maintenance,
                "days_left": days_left,
                "total_cost" : total_cost
            }
        )

    else:
        return Not_Found_404()
