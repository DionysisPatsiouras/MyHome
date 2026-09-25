from django.db import migrations, models
import users.constraints


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0001_initial"),
    ]

    operations = [
        # Existing records may have incorrect dates. NOT VALID still enforces
        # the constraint for every new row and every updated row.
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.RunSQL(
                    sql=(
                        "ALTER TABLE users ADD CONSTRAINT users_birthdate_adult "
                        "CHECK (birthdate <= (CURRENT_DATE - INTERVAL '18 years')::date) "
                        "NOT VALID"
                    ),
                    reverse_sql="ALTER TABLE users DROP CONSTRAINT users_birthdate_adult",
                ),
            ],
            state_operations=[
                migrations.AddConstraint(
                    model_name="customuser",
                    constraint=models.CheckConstraint(
                        condition=models.Q(birthdate__lte=users.constraints.AdultBirthdateCutoff()),
                        name="users_birthdate_adult",
                    ),
                ),
            ],
        ),
    ]
