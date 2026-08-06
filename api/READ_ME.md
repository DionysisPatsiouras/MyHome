See the root [`README.md`](../README.md) and [`docs/`](../docs/) for setup, architecture, and feature documentation.

### Generate a new secret key
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(64))"
```

### Check health
```bash
python3 manage.py check
```
