```markdown
# Deployment Guide

## Prerequisites

- Python 3.11+
- Docker & Docker Compose
- Supabase account
- Redis (optional, for caching)

---

## Environment Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd Leave-Optix/backend
```

### 2. Create Environment File
```bash
cp .env.example .env
```

### 3. Configure Environment Variables
```env
# Environment
ENVIRONMENT=production
DEBUG=False

# CORS
ALLOWED_ORIGINS=["https://app.workload360.com"]

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Security
JWT_SECRET=your_secure_random_string_here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Redis (optional)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
```

---

## Local Development

### Using Python Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Using Docker

```bash
# Build image
docker build -t workload360-backend .

# Run container
docker run -p 8000:8000 --env-file .env workload360-backend
```

---

## Production Deployment

### Option 1: Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env
    depends_on:
      - redis
    restart: unless-stopped

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    restart: unless-stopped
```

```bash
docker-compose up -d
```

### Option 2: Cloud Platforms

#### AWS ECS
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker build -t workload360-backend .
docker tag workload360-backend:latest <account>.dkr.ecr.us-east-1.amazonaws.com/workload360-backend:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/workload360-backend:latest

# Deploy to ECS
aws ecs update-service --cluster workload360 --service backend --force-new-deployment
```

#### Google Cloud Run
```bash
# Build and deploy
gcloud builds submit --tag gcr.io/PROJECT_ID/workload360-backend
gcloud run deploy workload360-backend --image gcr.io/PROJECT_ID/workload360-backend --platform managed
```

#### Azure Container Instances
```bash
# Build and push to ACR
az acr build --registry myregistry --image workload360-backend .

# Deploy
az container create --resource-group mygroup --name workload360-backend --image myregistry.azurecr.io/workload360-backend --dns-name-label workload360 --ports 8000
```

---

## Database Setup

### Supabase Configuration

1. Create Supabase project
2. Run migrations (if any)
3. Set up Row Level Security (RLS)
4. Configure authentication

### Required Tables
- users
- teams
- leave_requests
- leave_balances
- approval_rules

---

## Redis Setup (Optional)

### Local Redis
```bash
# Using Docker
docker run -d -p 6379:6379 redis:alpine

# Using package manager
# Ubuntu/Debian
sudo apt-get install redis-server

# macOS
brew install redis
```

### Cloud Redis
- AWS ElastiCache
- Google Cloud Memorystore
- Azure Cache for Redis

---

## Health Checks

### Endpoint
```
GET /health
```

### Response
```json
{
  "status": "healthy",
```
