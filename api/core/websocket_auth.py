from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError


NOTIFICATIONS_SUBPROTOCOL = "myhome.notifications"


@database_sync_to_async
def _get_user_from_token(token):
    if not token:
        return AnonymousUser()

    authentication = JWTAuthentication()

    try:
        validated_token = authentication.get_validated_token(token)
        return authentication.get_user(validated_token)
    except (AuthenticationFailed, InvalidToken, TokenError):
        return AnonymousUser()


class JwtAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        scope = dict(scope)
        subprotocols = scope.get("subprotocols", [])
        token = None

        if NOTIFICATIONS_SUBPROTOCOL in subprotocols:
            protocol_index = subprotocols.index(NOTIFICATIONS_SUBPROTOCOL)
            if len(subprotocols) > protocol_index + 1:
                token = subprotocols[protocol_index + 1]

        scope["user"] = await _get_user_from_token(token)
        return await super().__call__(scope, receive, send)
