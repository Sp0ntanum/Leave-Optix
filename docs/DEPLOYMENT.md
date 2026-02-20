# Deployment Guide - Workload360

## Prerequisites

- Docker & Docker Compose
- Supabase account
- Domain name (for production)
- SSL certificates (for production)

## Environment Setup

### 1. Supabase Configuration

1. Create a new Supabase project at https://supabase.com
2. Go to Project Settings → API
3. Copy the following:
   - Project URL
   - Anon/Public Key
   - Service Role Key (keep secure!)

4. Go to SQL Editor and run the database migration scripts:
   - `database/migrations/001_initial_schema.sql`
   - `database/migrations/002_rls_policies.sql`
   - `database/migrations/003_functions_triggers.sql`

### 2. Backend Environment Variables

Create `backend/.env` file:

```env
ENVIRONMENT=production
DEBUG=False

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Database
DATABASE_URL=your-database-url

# Security
JWT_SECRET=your-secret-key-min-32-characters
JWT_ALGORITHM=HS256

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=noreply@leave-optix.com
```

### 3. Frontend Environment Variables

Create `frontend/.env` file:

```env
VITE_API_URL=https://api.workload360.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_NAME=Workload360
VITE_APP_VERSION=1.0.0
```

## Docker Deployment

### Development

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production

1. Update `docker-compose.yml` for production:

```yaml
version: '3.8'

services:
  backend:
    image: workload360-backend:latest
    container_name: workload360-backend-prod
    restart: unless-stopped
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env
    depends_on:
      - redis
    networks:
      - workload360-network

  frontend:
    image: workload360-frontend:latest
    container_name: workload360-frontend-prod
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    env_file:
      - ./frontend/.env
    volumes:
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend
    networks:
      - workload360-network

  redis:
    image: redis:7-alpine
    container_name: workload360-redis-prod
    restart: unless-stopped
    volumes:
      - redis-data:/data
    networks:
      - workload360-network

volumes:
  redis-data:

networks:
  workload360-network:
    driver: bridge
```

2. Build and deploy:

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

## Cloud Deployment Options

### AWS Deployment

#### Using ECS (Elastic Container Service)

1. Push images to ECR:
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

docker tag workload360-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/workload360-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/workload360-backend:latest

docker tag workload360-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/workload360-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/workload360-frontend:latest
```

2. Create ECS task definitions and services
3. Set up Application Load Balancer
4. Configure auto-scaling

### Azure Deployment

#### Using Azure Container Instances

```bash
# Create resource group
az group create --name leave-optix-rg --location eastus

# Create container instances
az container create \
  --resource-group leave-optix-rg \
  --name workload360-backend \
  --image workload360-backend:latest \
  --dns-name-label workload360-api \
  --ports 8000 \
  --environment-variables $(cat backend/.env | xargs)

az container create \
  --resource-group workload360-rg \
  --name workload360-frontend \
  --image workload360-frontend:latest \
  --dns-name-label workload360-app \
  --ports 80 443
```

### Google Cloud Platform

#### Using Cloud Run

```bash
# Build and push to GCR
gcloud builds submit --tag gcr.io/PROJECT_ID/workload360-backend backend/
gcloud builds submit --tag gcr.io/PROJECT_ID/workload360-frontend frontend/

# Deploy to Cloud Run
gcloud run deploy workload360-backend \
  --image gcr.io/PROJECT_ID/workload360-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

gcloud run deploy workload360-frontend \
  --image gcr.io/PROJECT_ID/workload360-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## SSL/HTTPS Setup

### Using Let's Encrypt with Certbot

```bash
# Install Certbot
apt-get install certbot python3-certbot-nginx

# Obtain certificate
certbot --nginx -d workload360.com -d api.workload360.com

# Auto-renewal
certbot renew --dry-run
```

## Monitoring and Logging

### Setup Application Monitoring

1. Add Sentry for error tracking
2. Configure CloudWatch/Azure Monitor/Stackdriver
3. Set up health check endpoints
4. Configure alerts for critical issues

### Logging

```bash
# View backend logs
docker logs -f workload360-backend

# View frontend logs
docker logs -f workload360-frontend

# View all logs
docker-compose logs -f
```

## Backup Strategy

### Database Backups

Supabase automatically backs up your database. For additional backups:

```bash
# Manual backup
pg_dump -h db.project.supabase.co -U postgres -d postgres > backup.sql

# Restore
psql -h db.project.supabase.co -U postgres -d postgres < backup.sql
```

### Redis Backups

```bash
# Backup Redis data
docker exec workload360-redis redis-cli SAVE
docker cp workload360-redis:/data/dump.rdb ./backup/
```

## Health Checks

### Backend Health Check
```bash
curl http://localhost:8000/health
```

### Frontend Health Check
```bash
curl http://localhost:3000
```

## Scaling

### Horizontal Scaling

1. Use a load balancer (Nginx, HAProxy, or cloud LB)
2. Scale backend containers:
   ```bash
   docker-compose up -d --scale backend=3
   ```

### Vertical Scaling

Update resource limits in docker-compose.yml:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Enable rate limiting
- [ ] Set up WAF (Web Application Firewall)
- [ ] Regular security updates
- [ ] Enable RLS policies in Supabase
- [ ] Secure environment variables
- [ ] Enable audit logging

## Troubleshooting

### Backend not starting
- Check environment variables
- Verify Supabase connection
- Check logs: `docker logs workload360-backend`

### Frontend not connecting to backend
- Verify CORS settings
- Check API URL in frontend .env
- Verify network connectivity

### Database connection issues
- Verify Supabase credentials
- Check network security groups
- Verify RLS policies are correctly set
