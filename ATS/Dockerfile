# Dockerfile

FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Copy only requirements first to cache deps
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy rest of the app
COPY . .

# Set environment variables via Dockerfile (optional)
# ENV FLASK_ENV=production

# Start app using Gunicorn
CMD ["gunicorn", "run:app", "--bind", "0.0.0.0:5000"]
