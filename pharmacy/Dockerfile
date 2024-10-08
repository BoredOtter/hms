# Use the official Python image as the base image
FROM python:3.13

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory inside the container
WORKDIR /app

# Copy and install requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the FastAPI application code into the container
COPY . .

# Expose the port on which your FastAPI application runs
EXPOSE 8004

# Command to start the FastAPI application with uvicorn and hot reload
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8004", "--reload"]
