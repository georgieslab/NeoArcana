# Stage 1: Build Frontend
FROM node:20-slim AS frontend-builder
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Python Backend
FROM python:3.9-slim
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Copy built frontend dist from stage 1
COPY --from=frontend-builder /frontend/dist ./frontend/dist

# Create non-root user
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# Run FastAPI with uvicorn
CMD uvicorn api_v2.main:app --host 0.0.0.0 --port ${PORT:-10000}