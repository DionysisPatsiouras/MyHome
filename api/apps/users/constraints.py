from django.db import models


class AdultBirthdateCutoff(models.Func):
    template = "(CURRENT_DATE - INTERVAL '18 years')::date"
    output_field = models.DateField()
    arity = 0
