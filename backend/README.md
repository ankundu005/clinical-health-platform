# Clinical Health Platform Backend

A FastAPI backend for a clinical healthcare application focused on depression treatment with executive control network dysfunction.

## Features

- Patient management
- Assessment tracking (fMRI, N-back Task, WPAI)
- Treatment management (medication, dosage, efficacy)
- Inflammatory biomarker monitoring

## Tech Stack

- Python 3.9+
- FastAPI
- SQLAlchemy (with SQLite)
- Pydantic
- Alembic for migrations
- Poetry for dependency management
- Pytest for testing

## Setup

1. Install Poetry:
   ```
   curl -sSL https://install.python-poetry.org | python3 -
   ```

2. Install dependencies:
   ```
   cd backend
   poetry install
   ```

3. Initialize the database:
   ```
   poetry run alembic upgrade head
   ```

4. Run the development server:
   ```
   poetry run uvicorn app.main:app --reload
   ```

## Testing

Run tests with pytest:
```
poetry run pytest
```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Environment Variables

Create a `.env` file in the backend directory with the following variables:
```
DATABASE_URL="sqlite:///./clinical_health.db"
SECRET_KEY="your-secret-key-here"
```
