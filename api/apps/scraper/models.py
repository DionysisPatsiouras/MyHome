from django.db import models




class GovAnnouncement(models.Model):

    title = models.CharField(max_length=500, null=False)
    summary = models.TextField(null=True, blank=True)
    category = models.CharField(max_length=200, null=True, blank=True)
    organization = models.CharField(max_length=300, null=True, blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    announcement_url = models.CharField(max_length=500, unique=True, null=False)

    created_at = models.DateTimeField(auto_now_add=True)
    scraped_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "gov_announcements"
        ordering = ["-published_at"]
