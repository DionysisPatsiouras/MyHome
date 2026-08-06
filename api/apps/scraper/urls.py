from django.urls import path
import importlib

app_name = __name__.split('.')[0]
views = importlib.import_module(f"{app_name}.views")


urlpatterns = [
    path("gov-announcements/run", views.run_gov_announcements),  # POST
]

