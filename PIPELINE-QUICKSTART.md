# 🚀 SyncSpace CI/CD Pipeline Quick Start

## What's Included

✅ **GitHub Actions Workflow** - Automated build, test, and deploy  
✅ **Docker Support** - Containerized client & server  
✅ **Docker Compose** - Local development with all services  
✅ **Database Migrations** - Automatic PostgreSQL schema updates  
✅ **Test Coverage** - Pytest for backend, ESLint for frontend  
✅ **Container Registry** - Push to GitHub Container Registry  

---

## 🎯 Quick Start (Local Development)

### Option 1: Docker Compose (Recommended)

```bash
# Copy environment file
cp .env.example .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f server
docker-compose logs -f client
```

**Access:**
- Frontend: http://localhost:5173
- API: http://localhost:8000
- Docs: http://localhost:8000/docs

### Option 2: Local Setup

**Frontend:**
```bash
cd client
npm install
npm run dev
```

**Backend:**
```bash
cd server
python -m venv venv
source venv/bin/activate
pip install -e .

# Setup database
export DATABASE_URL=postgresql://user:password@localhost:5432/dbname
alembic upgrade head

# Run server
uvicorn src.server.main:app --reload
```

---

## 🔧 Pipeline Configuration

### 1. GitHub Secrets Setup

Navigate to: **Settings → Secrets and variables → Actions**

Add these secrets:
```
AZURE_CREDENTIALS      # JSON with clientId, clientSecret, subscriptionId, tenantId
AZURE_RESOURCE_GROUP   # Your Azure resource group name
AZURE_SUBSCRIPTION_ID  # Your Azure subscription ID
```

Generate Azure credentials:
```bash
az ad sp create-for-rbac --name "github-actions" --role contributor --scopes /subscriptions/{subscriptionId}
```

### 2. Update Workflow Variables

Edit `.github/workflows/ci-cd.yml`:
- Change `CLIENT_IMAGE_NAME` and `SERVER_IMAGE_NAME` to match your repo
- Update `REGISTRY` if using a different container registry
- Modify `deploy` job for your Azure setup

### 3. Create Azure Container Apps

```bash
az containerapp create --name client-app --resource-group your-rg \
  --image ghcr.io/your-org/client:latest \
  --target-port 5173 --ingress external \
  --registry-server ghcr.io --registry-username $USERNAME --registry-password $PASSWORD

az containerapp create --name server-app --resource-group your-rg \
  --image ghcr.io/your-org/server:latest \
  --target-port 8000 --ingress internal
```

---

## 📊 Pipeline Workflow

```
┌─────────────────────────────────────────────────────────┐
│              Push/PR to main or develop                  │
└─────────────┬───────────────────────────────┬────────────┘
              │                               │
        ┌─────▼─────┐                  ┌─────▼──────┐
        │ Client     │                  │   Server   │
        │ Build/Test │                  │ Build/Test │
        └─────┬─────┘                  └─────┬──────┘
              │                               │
              └───────────┬───────────────────┘
                          │
                    ┌─────▼──────┐
                    │ Docker     │  (Only on push)
                    │ Build/Push │
                    └─────┬──────┘
                          │
                    ┌─────▼──────┐
                    │ Deploy to  │  (Only main branch)
                    │ Azure      │
                    └────────────┘
```

---

## 📝 File Structure

```
.github/
  workflows/
    ci-cd.yml                 # Main pipeline definition
client/
  Dockerfile                  # Client build image
  .dockerignore
server/
  Dockerfile                  # Server build image
  .dockerignore
docker-compose.yml            # Local dev environment
.env.example                  # Environment template
CI-CD-SETUP.md               # Detailed configuration guide
```

---

## 🔍 Monitoring & Debugging

### View Pipeline Status
1. Go to **Actions** tab in GitHub
2. Click on workflow run to see detailed logs

### Common Issues

**Docker build fails:**
```bash
# Rebuild without cache
docker-compose build --no-cache

# Check image
docker images | grep syncspace
```

**Database migration fails:**
```bash
# Check database connection
psql -h localhost -U syncspace_user -d syncspace_db

# Run migrations manually
cd server
alembic upgrade head
```

**Tests failing locally:**
```bash
# Install dev dependencies
pip install -e ".[dev]"

# Run specific test
pytest tests/test_auth.py -v
```

---

## 🚀 Deployment

### Automatic (on push to main)
The pipeline automatically deploys to Azure Container Apps.

### Manual Deployment
```bash
az login
docker-compose up -d  # or deploy manually

# Verify
curl http://localhost:8000/health
curl http://localhost:5173
```

---

## 📚 Additional Resources

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Docker Docs](https://docs.docker.com/)
- [Azure Container Apps Docs](https://learn.microsoft.com/en-us/azure/container-apps/)
- [See detailed setup guide](./CI-CD-SETUP.md)

---

## ✅ Checklist

- [ ] Copy `.env.example` to `.env`
- [ ] Add GitHub Secrets
- [ ] Create Azure Container Apps
- [ ] Run `docker-compose up` locally
- [ ] Push to repository to trigger pipeline
- [ ] Verify deployment in Azure

---

Need help? Check [CI-CD-SETUP.md](./CI-CD-SETUP.md) for detailed configuration.
