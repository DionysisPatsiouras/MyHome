#!/bin/bash
# Set PostgreSQL connection variables
export PGHOST=localhost
export PGPORT=5432
export PGUSER=postgres
export PGPASSWORD=3276

# Specify the database names
DB=my_db

# Drop the old database
echo "Dropping database $DB..."
psql -U $PGUSER -d postgres -c "DROP DATABASE IF EXISTS $DB;"
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to drop database $DB."
    exit 1
fi

# Create the new database
echo "Creating database $DB..."
psql -U $PGUSER -d postgres -c "CREATE DATABASE $DB;"
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to create database $DB."
    exit 1
fi

echo "Operation completed successfully."



cd ../..
# Run Django migrations

echo "Deleting existing migrations.."
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete

echo "Create new migrations.."
python3 manage.py makemigrations


echo "Running migrations..."
python3 manage.py migrate
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to run migrations."
    exit 1
fi

echo "Loading data..."
python3 manage.py loaddata data.json
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to load data."
    exit 1
fi

echo "All done!"

