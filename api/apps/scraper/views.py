from django.core.management import call_command
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import GovAnnouncement


@api_view(["POST"])
def run_gov_announcements(request):
    before = GovAnnouncement.objects.count()
    call_command("scrape_gov_announcements")
    after = GovAnnouncement.objects.count()

    return Response({
        "detail": "Scraper finished.",
        "total_announcements": after,
        "new_announcements": after - before,
    })
