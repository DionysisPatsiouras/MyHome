import json
import re
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup
from django.core.management.base import BaseCommand
from django.utils.dateparse import parse_datetime

from scraper.models import GovAnnouncement

BASE_URL = "https://www.gov.gr"
CATEGORY_URLS = [
    "https://www.gov.gr/el/categories/periousia-kai-phorologia/epidoteseis-politon",
    "https://www.gov.gr/el/categories/periousia-kai-phorologia/diakheirise-akinetes-periousias",
]
HEADERS = {"User-Agent": "MyHome-Scraper/1.0"}

# gov.gr renders its lists client-side: the data is embedded as escaped JSON
# inside `self.__next_f.push(...)` script tags (Next.js RSC payload) rather
# than as plain HTML. These helpers extract that JSON.
NEXT_F_PUSH_RE = re.compile(r"self\.__next_f\.push\((\[.*?\])\)\s*</script>", re.DOTALL)
NEXT_F_ENTRY_RE = re.compile(r"(?m)^([0-9a-fA-F]+):")


class Command(BaseCommand):

    def handle(self, *args, **kwargs):
        session = requests.Session()
        session.headers.update(HEADERS)

        existing_urls = set(GovAnnouncement.objects.values_list("announcement_url", flat=True))

        for category_url in CATEGORY_URLS:
            response = session.get(category_url, timeout=10)
            response.raise_for_status()
            response.encoding = "utf-8"

            subcategory = self._find_subcategory(response.text)
            if not subcategory:
                self.stdout.write(
                    self.style.ERROR(f"Could not find subcategory data on the page: {category_url}")
                )
                continue

            category_title = subcategory.get("title", {}).get("el_text")
            services = [
                service
                for group in subcategory.get("groups", [])
                for service in group.get("services", [])
            ]

            for service in services:
                slug = service.get("slug")
                human_readable_id = service.get("human_readable_id")
                if not slug or not human_readable_id:
                    continue

                announcement_url = urljoin(BASE_URL, f"/el/services/{human_readable_id}/{slug}")
                if announcement_url in existing_urls:
                    continue

                title = service.get("title", {}).get("el_text")

                summary, organization, published_at = self._fetch_details(session, announcement_url)

                GovAnnouncement.objects.create(
                    announcement_url=announcement_url,
                    title=title,
                    summary=summary,
                    category=category_title,
                    organization=organization,
                    published_at=published_at,
                )
                self.stdout.write(self.style.SUCCESS(f"Created: {title}"))
                return

        self.stdout.write("No new announcements found.")

    def _fetch_details(self, session, url):
        response = session.get(url, timeout=10)
        response.raise_for_status()
        response.encoding = "utf-8"

        soup = BeautifulSoup(response.text, "html.parser")
        meta_description = soup.select_one('meta[name="description"]')
        summary = (
            meta_description["content"].strip()
            if meta_description and meta_description.get("content")
            else None
        )

        organization = None
        published_at = None
        service = self._find_service(response.text)
        if service:
            organization = (service.get("organization") or {}).get("title", {}).get("el_text")
            created = service.get("created")
            if created:
                published_at = parse_datetime(created)

        return summary, organization, published_at

    def _find_subcategory(self, html):
        for chunk in self._next_f_chunks(html):
            found = self._find_dict_with_keys(chunk, "groups", "title")
            if found:
                return found
        return None

    def _find_service(self, html):
        for chunk in self._next_f_chunks(html):
            found = self._find_dict_with_keys(chunk, "human_readable_id", "organization")
            if found:
                return found
        return None

    def _next_f_chunks(self, html):
        full_text = ""
        for match in NEXT_F_PUSH_RE.findall(html):
            try:
                arr = json.loads(match)
            except (json.JSONDecodeError, ValueError):
                continue
            if len(arr) >= 2 and isinstance(arr[1], str):
                full_text += arr[1] + "\n"

        entries = list(NEXT_F_ENTRY_RE.finditer(full_text))
        chunks = []
        for i, entry in enumerate(entries):
            start = entry.end()
            end = entries[i + 1].start() if i + 1 < len(entries) else len(full_text)
            try:
                chunks.append(json.loads(full_text[start:end]))
            except (json.JSONDecodeError, ValueError):
                continue
        return chunks

    def _find_dict_with_keys(self, obj, *keys):
        if isinstance(obj, dict):
            if all(key in obj for key in keys):
                return obj
            for value in obj.values():
                found = self._find_dict_with_keys(value, *keys)
                if found:
                    return found
        elif isinstance(obj, list):
            for value in obj:
                found = self._find_dict_with_keys(value, *keys)
                if found:
                    return found
        return None
