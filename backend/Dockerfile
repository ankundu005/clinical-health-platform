FROM python:3.9-slim

WORKDIR /app

# Install poetry
RUN pip install poetry==1.4.2

# Copy poetry configuration files
COPY pyproject.toml poetry.lock* ./

# Configure poetry to not use a virtual environment
RUN poetry config virtualenvs.create false

# Install dependencies
RUN poetry install --no-interaction --no-ansi --no-root

# Copy application code
COPY . .

# Install application
RUN poetry install --no-interaction --no-ansi

# Expose the port
EXPOSE 8000

# Run the application
CMD ["poetry", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0"]
