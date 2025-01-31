# This line selects a base image with Python 3.9 installed
FROM python:3.9-slim

# Sets the working directory inside the container
WORKDIR /app

# Copies your requirements.txt file into the container
COPY requirements.txt .

# Installs all your Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copies all your application files into the container
COPY . .

# Sets environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Creates a non-root user for security
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# Specifies the command to run your application
CMD exec gunicorn --bind :$PORT --workers 3 --worker-class gthread --threads 8 --timeout 0 app:app