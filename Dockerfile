FROM python:3.11.9-slim

# SET ENVIRONMENT VARIABLE agar Python bisa menemukan package di src/
ENV PYTHONPATH=/app/src

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["sh", "-c", "python init_db_render.py && gunicorn --paste src/config/production.ini"]