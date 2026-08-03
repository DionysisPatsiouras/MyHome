from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    """
    DRF's default handler stringifies every leaf value in an exception's
    detail dict (via ErrorDetail), so `{"success": False, "code": 102}`
    is returned to the client as `{"success": "False", "code": "102"}`.
    That breaks any client-side check like `if (res.success)`, since a
    non-empty string is truthy. Restore the original types here.
    """
    response = exception_handler(exc, context)

    if response is not None and isinstance(response.data, dict):
        data = response.data

        if "success" in data:
            data["success"] = str(data["success"]) == "True"

        if "code" in data:
            try:
                data["code"] = int(data["code"])
            except (TypeError, ValueError):
                pass

    return response
