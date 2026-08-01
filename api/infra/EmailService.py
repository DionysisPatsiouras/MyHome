from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.utils.html import strip_tags
from decouple import config

def EmailService(template: str, subject: str, vars: dict, receivers: list[str]):

    if not config("MAILS_ENABLED", cast=bool, default=True):
        return

    html_content = render_to_string(f"emails/{template}", vars)

    email_message = EmailMultiAlternatives(
        subject=subject,
        body=strip_tags(html_content),
        from_email=config("DEFAULT_FROM_EMAIL"),
        to=receivers,
    )
    email_message.attach_alternative(html_content, "text/html")
    email_message.send(fail_silently=False)
