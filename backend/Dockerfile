FROM python:3.13-slim

# slim is more compatible than Alpine (If VSCODE mark it blue)

WORKDIR /app

COPY requirements.txt .

# Install dependencies with no cache to get the latest
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]