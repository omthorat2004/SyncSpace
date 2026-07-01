# Configuration Guide for CI/CD Pipeline

## GitHub Secrets Required

Add the following secrets to your GitHub repository settings (**Settings > Secrets and variables > Actions**):

### Azure Credentials
```
AZURE_CREDENTIALS
```
Format (JSON):
```json
{
  "clientId": "your-client-id",
  "clientSecret": "your-client-secret",
  "subscriptionId": "your-subscription-id",
  "tenantId": "your-tenant-id"
}
```

To generate this:
```bash
az ad sp create-for-rbac --name "github-actions" --role contributor --scopes /subscriptions/{subscriptionId}
```

### Azure Deployment Variables
```
AZURE_RESOURCE_GROUP       # Your Azure resource group name
AZURE_SUBSCRIPTION_ID      # Your Azure subscription ID
```

## Pipeline Overview

### Triggers
- **Push**: Automatically triggers on push to `main` or `develop` branches
- **Pull Requests**: Runs tests on all pull requests
- **Manual**: Can be triggered manually from GitHub Actions tab

### Jobs

1. **client-build**
   - Install Node.js dependencies
   - Run ESLint checks
   - Build React/TypeScript frontend
   - Upload artifacts

2. **server-build**
   - Setup Python 3.11
   - Run database migrations (test)
   - Run pytest with coverage
   - Upload coverage to Codecov

3. **docker-build**
   - Build Docker images for both services
   - Push to GitHub Container Registry (ghcr.io)
   - Uses buildx for efficient caching

4. **deploy**
   - Deploys only on push to `main` branch
   - Requires production environment approval
   - Updates Azure Container Apps

## Local Development

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild images
docker-compose build --no-cache
```

Services will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

### Without Docker

#### Frontend
```bash
cd client
npm install
npm run dev
```

#### Backend
```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -e .
alembic upgrade head
uvicorn src.server.main:app --reload
```

## Deployment

### Prerequisites
1. Azure subscription with Container Apps resources
2. GitHub repository with secrets configured
3. Docker images built and pushed to registry

### Manual Deployment
```bash
az login
az containerapp update \
  --name client-app \
  --resource-group your-rg \
  --image ghcr.io/your-org/client:latest

az containerapp update \
  --name server-app \
  --resource-group your-rg \
  --image ghcr.io/your-org/server:latest
```

## Customization

### Update Node.js/Python versions
Edit `.github/workflows/ci-cd.yml`:
- Node.js: Line 61
- Python: Line 102

### Change deployment target
Modify the `deploy` job in `ci-cd.yml` to use:
- **Azure App Service**: `az webapp up`
- **AKS**: `kubectl apply -f deployment.yml`
- **Azure Functions**: `func azure functionapp publish`

### Add more services
1. Create `Dockerfile` in service directory
2. Add build step in workflow
3. Update docker-compose.yml

## Troubleshooting

### Docker image push fails
- Check GitHub Token permissions
- Verify `REGISTRY` environment variable
- Ensure repository is public or token has `write:packages` scope

### Database migration fails
- Verify PostgreSQL is running and accessible
- Check `POSTGRES_` environment variables
- Run migrations manually: `alembic upgrade head`

### Tests fail locally
```bash
# Set test environment
export DATABASE_URL=postgresql://test:test@localhost:5432/testdb
export REDIS_URL=redis://localhost:6379
export TESTING=true

# Run tests
pytest tests/ -v
```

## References
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Azure Container Apps](https://learn.microsoft.com/en-us/azure/container-apps/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
