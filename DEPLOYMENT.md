# Smart Panda School System - Deployment Guide

## Overview

This guide covers deployment of the Smart Panda School System across different environments:
- **Local Development** - Development and testing on your local machine
- **On-Premises** - Private infrastructure deployment
- **Cloud** - Cloud provider deployment (AWS, Azure, GCP)

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React/Vue)   │◄──►│   (.NET Core)   │◄──►│   (SQL Server)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Background    │
                       │   Jobs (Hangfire)│
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Cache         │
                       │   (Redis)       │
                       └─────────────────┘
```

## Prerequisites

### Development Tools
- **Git** - Version control
- **Node.js** (v18+) - Frontend development
- **.NET 8 SDK** - Backend development
- **Visual Studio 2022** or **VS Code** - IDE
- **Docker Desktop** - Containerization (optional but recommended)

### Database & Cache
- **SQL Server 2022** or **SQL Server Express** - Primary database
- **Redis** - Caching layer (can use Docker)

### Additional Services
- **SMTP Server** - Email notifications
- **SMS Gateway API** - Text messaging (Zimbabwe providers)

---

## 🖥️ Local Development Setup

### 1. Repository Setup

```bash
# Clone the repository
git clone https://github.com/your-org/smart-panda-school-system.git
cd smart-panda-school-system

# Create solution structure
mkdir -src
cd src
```

### 2. Database Setup

#### Option A: SQL Server Express
```bash
# Install SQL Server Express
# Download from: https://www.microsoft.com/en-us/sql-server/sql-server-downloads

# Create database
sqlcmd -S localhost\SQLEXPRESS -E
CREATE DATABASE SmartSchoolDb;
GO
```

#### Option B: Docker SQL Server
```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Password123" \
   -p 1433:1433 --name sqlserver \
   -d mcr.microsoft.com/mssql/server:2022-latest
```

### 3. Redis Cache Setup

#### Option A: Docker Redis
```bash
docker run -d -p 6379:6379 --name redis redis:latest
```

#### Option B: Local Redis Installation
```bash
# Windows
# Download from: https://github.com/microsoftarchive/redis/releases

# macOS
brew install redis

# Linux
sudo apt-get install redis-server
```

### 4. Backend Configuration

```bash
cd backend/src/SmartSchool.API

# Install dependencies
dotnet restore

# Configure appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=SmartSchoolDb;Trusted_Connection=True;TrustServerCertificate=True",
    "Redis": "localhost:6379"
  },
  "JwtSettings": {
    "SecretKey": "your-super-secret-jwt-key-here",
    "Issuer": "SmartSchool",
    "Audience": "SmartSchoolUsers",
    "ExpiryMinutes": 60
  },
  "EmailSettings": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": 587,
    "Username": "your-email@gmail.com",
    "Password": "your-app-password"
  }
}

# Run database migrations
dotnet ef database update

# Start the API
dotnet run
```

### 5. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
# .env.local
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_SIGNALR_URL=http://localhost:5000/hubs/notifications

# Start development server
npm start
```

### 6. Mobile App Setup

```bash
cd mobile

# Install dependencies
npm install

# For Android
npx react-native run-android

# For iOS (macOS only)
npx react-native run-ios
```

---

## 🏢 On-Premises Deployment

### Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| CPU | 4 cores | 8+ cores |
| RAM | 8GB | 16GB+ |
| Storage | 100GB SSD | 500GB+ SSD |
| Network | 100 Mbps | 1 Gbps |

### Software Stack

#### 1. Web Server
```bash
# Install IIS on Windows Server
# Enable features:
# - IIS Management Console
# - ASP.NET Core Runtime
# - URL Rewrite Module
# - IIS Management Scripts and Tools

# Or use Nginx on Linux
sudo apt-get install nginx
```

#### 2. Database Server
```bash
# Install SQL Server Standard/Enterprise
# Configure:
# - Memory allocation
# - Backup schedules
# - Security policies
# - High availability (Always On)
```

#### 3. Application Server
```bash
# Install .NET 8 Runtime
# Download from: https://dotnet.microsoft.com/download/dotnet/8.0

# Configure IIS Application Pool
# - .NET CLR version: No Managed Code
# - Managed pipeline mode: Integrated
# - Identity: ApplicationPoolIdentity
```

#### 4. Cache Server
```bash
# Install Redis on dedicated server
# Configure:
# - Memory limits
# - Persistence
# - Security (password, network isolation)
```

### Deployment Steps

#### 1. Database Deployment
```bash
# Backup development database
sqlcmd -S dev-server -E "BACKUP DATABASE SmartSchoolDb TO DISK='C:\backup\SmartSchoolDb.bak'"

# Restore to production
sqlcmd -S prod-server -E "RESTORE DATABASE SmartSchoolDb FROM DISK='C:\backup\SmartSchoolDb.bak'"

# Run production migrations
dotnet ef database update --connection "ProductionConnectionString"
```

#### 2. Backend Deployment
```bash
# Build for production
cd backend/src/SmartSchool.API
dotnet publish -c Release -o ./publish

# Configure production appsettings.json
# Update connection strings, security keys, etc.

# Deploy to IIS
# Create new website in IIS Manager
# Point to publish folder
# Configure application pool
# Set up HTTPS certificate
```

#### 3. Frontend Deployment
```bash
cd frontend

# Build for production
npm run build

# Deploy to web server
# Copy build/ folder to web root
# Configure web server to serve static files
# Set up routing for SPA
```

#### 4. Monitoring Setup
```bash
# Configure Windows Performance Monitor
# Set up log aggregation (ELK Stack, Splunk)
# Configure backup schedules
# Set up monitoring alerts
```

---

## ☁️ Cloud Deployment

### AWS Deployment

#### 1. Infrastructure Setup (CloudFormation/CDK)

```yaml
# infrastructure.yml
AWSTemplateFormatVersion: '2010-09-09'
Resources:
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      
  DatabaseSubnetGroup:
    Type: AWS::RDS::DBSubnetGroup
    Properties:
      DBSubnetGroupDescription: Subnet group for RDS
      SubnetIds:
        - !Ref PrivateSubnet1
        - !Ref PrivateSubnet2

  Database:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceClass: db.t3.medium
      Engine: sqlserver-ex
      MasterUsername: admin
      MasterUserPassword: !Ref DatabasePassword
      AllocatedStorage: 100
      DBSubnetGroupName: !Ref DatabaseSubnetGroup
      VPCSecurityGroups:
        - !Ref DatabaseSecurityGroup

  Elasticache:
    Type: AWS::ElastiCache::CacheCluster
    Properties:
      CacheNodeType: cache.t3.micro
      Engine: redis
      NumCacheNodes: 1
      VpcSecurityGroupIds:
        - !Ref CacheSecurityGroup
```

#### 2. Application Deployment

```bash
# Build and push Docker image
cd backend/src/SmartSchool.API
docker build -t smart-school-api .
docker tag smart-school-api:latest your-account.dkr.ecr.region.amazonaws.com/smart-school-api:latest
docker push your-account.dkr.ecr.region.amazonaws.com/smart-school-api:latest

# Deploy to ECS/EKS
aws ecs create-cluster --cluster-name smart-school
aws ecs register-task-definition --cli-input-json file://task-definition.json
aws ecs create-service --cluster smart-school --service-name api --task-definition smart-school-api
```

#### 3. Frontend Deployment (S3 + CloudFront)

```bash
# Build and deploy to S3
cd frontend
npm run build
aws s3 sync build/ s3://smart-school-frontend --delete

# Configure CloudFront distribution
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

### Azure Deployment

#### 1. Resource Setup (ARM Template/Bicep)

```bicep
# main.bicep
resource sqlServer 'Microsoft.Sql/servers@2021-11-01' = {
  name: 'smart-school-sql'
  location: resourceGroup().location
  properties: {
    administratorLogin: 'sqladmin'
    administratorLoginPassword: sqlPassword
    version: '12.0'
  }
}

resource sqlDatabase 'Microsoft.Sql/servers/databases@2021-11-01' = {
  parent: sqlServer
  name: 'SmartSchoolDb'
  location: resourceGroup().location
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
}

resource redisCache 'Microsoft.Cache/redis@2022-06-01' = {
  name: 'smart-school-cache'
  location: resourceGroup().location
  properties: {
    sku: {
      name: 'Basic'
      family: 'C'
      capacity: 0
    }
  }
}
```

#### 2. App Service Deployment

```bash
# Create App Service
az webapp create --resource-group smart-school-rg --plan smart-school-plan --name smart-school-api --runtime "DOTNETCORE|8.0"

# Deploy using ZIP
cd backend/src/SmartSchool.API
dotnet publish -c Release -o ./publish
zip -r publish.zip ./publish/*
az webapp deployment source config-zip --resource-group smart-school-rg --name smart-school-api --src publish.zip
```

### GCP Deployment

#### 1. Infrastructure Setup (Terraform)

```hcl
# main.tf
resource "google_sql_database_instance" "main" {
  name             = "smart-school-db"
  database_version = "SQLSERVER_2019_STANDARD"
  region           = var.region
  
  settings {
    tier = "db-n1-standard-2"
  }
}

resource "google_redis_instance" "cache" {
  name           = "smart-school-cache"
  tier           = "STANDARD_HA"
  memory_size_gb = 1
  region         = var.region
}
```

#### 2. Cloud Run Deployment

```bash
# Build and deploy
cd backend/src/SmartSchool.API
gcloud builds submit --tag gcr.io/PROJECT-ID/smart-school-api
gcloud run deploy smart-school-api --image gcr.io/PROJECT-ID/smart-school-api --platform managed
```

---

## 🔧 Configuration Management

### Environment Variables

| Environment | Database | Redis | JWT Secret | Logging |
|-------------|----------|-------|------------|---------|
| Development | Local SQL | Local Redis | DevSecret | Debug |
| Staging | Staging SQL | Staging Redis | StagingSecret | Information |
| Production | Production SQL | Production Redis | ProductionSecret | Warning |

### Security Configuration

#### 1. Database Security
```sql
-- Create dedicated user
CREATE LOGIN SmartSchoolUser WITH PASSWORD = 'StrongPassword123!';
CREATE USER SmartSchoolUser FOR LOGIN SmartSchoolUser;

-- Grant minimum permissions
ALTER ROLE db_datareader ADD MEMBER SmartSchoolUser;
ALTER ROLE db_datawriter ADD MEMBER SmartSchoolUser;
```

#### 2. API Security
```json
{
  "Security": {
    "EnableHttps": true,
    "RequireHttpsMetadata": true,
    "HstsMaxAge": 31536000,
    "EnableCors": true,
    "AllowedOrigins": ["https://yourdomain.com"],
    "RateLimiting": {
      "Enable": true,
      "RequestsPerMinute": 100
    }
  }
}
```

#### 3. Redis Security
```bash
# Configure redis.conf
requirepass your-redis-password
bind 127.0.0.1 10.0.0.100
protected-mode yes
```

---

## 📊 Monitoring & Logging

### Application Monitoring

#### 1. Health Checks
```bash
# Configure health check endpoints
/health - Basic health check
/health/detailed - Detailed component status
/health/live - Liveness probe
/health/ready - Readiness probe
```

#### 2. Metrics Collection
```bash
# Application Insights (Azure)
# CloudWatch (AWS)
# Stackdriver (GCP)
# Prometheus + Grafana (Self-hosted)
```

#### 3. Log Aggregation
```bash
# ELK Stack (Elasticsearch, Logstash, Kibana)
# Splunk
# Papertrail
# Seq
```

### Performance Monitoring

#### 1. Database Performance
```sql
-- Monitor slow queries
SELECT 
    qs.total_elapsed_time / qs.execution_count AS avg_elapsed_time,
    qs.execution_count,
    SUBSTRING(qt.text, (qs.statement_start_offset/2)+1, 
        ((CASE qs.statement_end_offset
            WHEN -1 THEN DATALENGTH(qt.text)
            ELSE qs.statement_end_offset END 
            - qs.statement_start_offset)/2) + 1) AS query_text
FROM sys.dm_exec_query_stats qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) qt
ORDER BY avg_elapsed_time DESC;
```

#### 2. Application Performance
```bash
# Configure Application Performance Monitoring (APM)
# New Relic
# Datadog
# Dynatrace
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy Smart School System

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: '8.0.x'
    
    - name: Restore dependencies
      run: dotnet restore backend/src/SmartSchool.API/SmartSchool.API.csproj
    
    - name: Build
      run: dotnet build backend/src/SmartSchool.API/SmartSchool.API.csproj --configuration Release
    
    - name: Test
      run: dotnet test backend/src/SmartSchool.API.Tests/SmartSchool.API.Tests.csproj
    
    - name: Publish
      run: dotnet publish backend/src/SmartSchool.API/SmartSchool.API.csproj --configuration Release --output ./publish
    
    - name: Deploy to Azure
      uses: azure/webapps-deploy@v2
      with:
        app-name: smart-school-api
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: ./publish
```

---

## 🚀 Performance Optimization

### Database Optimization

#### 1. Indexing Strategy
```sql
-- Review missing indexes
SELECT 
    migs.avg_total_user_cost,
    migs.avg_user_impact,
    mid.statement,
    mid.equality_columns,
    mid.inequality_columns,
    mid.included_columns
FROM sys.dm_db_missing_index_details mid
JOIN sys.dm_db_missing_index_groups mig ON mid.index_handle = mig.index_handle
JOIN sys.dm_db_missing_index_group_stats migs ON mig.index_group_handle = migs.group_handle
ORDER BY migs.avg_user_impact DESC;
```

#### 2. Query Optimization
```sql
-- Enable query store
ALTER DATABASE SmartSchoolDb SET QUERY_STORE = ON;
ALTER DATABASE SmartSchoolDb SET QUERY_STORE (OPERATION_MODE = READ_WRITE);
```

### Application Optimization

#### 1. Caching Strategy
```csharp
// Configure Redis caching
services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = "localhost:6379";
    options.InstanceName = "SmartSchool:";
});
```

#### 2. Background Jobs
```csharp
// Configure Hangfire
services.AddHangfire(config => config
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UseSqlServerStorage(connectionString));
```

---

## 🔒 Security Hardening

### Network Security

#### 1. Firewall Configuration
```bash
# Windows Firewall
netsh advfirewall firewall add rule name="SmartSchool-API" dir=in action=allow protocol=TCP localport=5000

# Linux iptables
iptables -A INPUT -p tcp --dport 5000 -j ACCEPT
```

#### 2. SSL/TLS Configuration
```bash
# Generate SSL certificate
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365

# Configure IIS HTTPS binding
# Or configure Nginx SSL
```

### Application Security

#### 1. Input Validation
```csharp
// Enable data annotations validation
services.AddFluentValidationAutoValidation();
services.AddValidatorsFromAssemblyContaining<Program>();
```

#### 2. Authentication & Authorization
```csharp
// Configure JWT authentication
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            // ... other settings
        };
    });
```

---

## 📋 Deployment Checklist

### Pre-Deployment Checklist

- [ ] Database backups created
- [ ] SSL certificates obtained
- [ ] DNS records configured
- [ ] Firewall rules updated
- [ ] Environment variables set
- [ ] Security policies applied
- [ ] Monitoring configured
- [ ] Backup schedules set
- [ ] Load testing completed
- [ ] Security testing completed

### Post-Deployment Checklist

- [ ] Application health verified
- [ ] Database connectivity tested
- [ ] Cache connectivity tested
- [ ] Email/SMS services tested
- [ ] Performance metrics collected
- [ ] Error monitoring active
- [ ] Backup verification completed
- [ ] Documentation updated
- [ ] Team training completed

---

## 🆘 Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check SQL Server service
net start mssqlserver

# Test connection
sqlcmd -S localhost -E

# Check firewall
netstat -an | findstr :1433
```

#### 2. Redis Connection Issues
```bash
# Check Redis service
redis-cli ping

# Check Redis logs
tail -f /var/log/redis/redis-server.log
```

#### 3. Application Startup Issues
```bash
# Check .NET runtime
dotnet --version

# Check application logs
tail -f /var/log/smart-school/api.log

# Check event viewer (Windows)
eventvwr.msc
```

### Performance Issues

#### 1. Slow Database Queries
```sql
-- Check active queries
SELECT 
    r.session_id,
    r.status,
    r.command,
    r.cpu_time,
    r.total_elapsed_time
FROM sys.dm_exec_requests r
WHERE r.session_id > 50;
```

#### 2. High Memory Usage
```bash
# Check memory usage
free -m

# Check .NET memory usage
dotnet-counters monitor --process-id <pid>
```

---

## 📞 Support & Maintenance

### Maintenance Schedule

| Task | Frequency | Description |
|------|-----------|-------------|
| Database Backup | Daily | Automated database backups |
| Security Updates | Weekly | Apply security patches |
| Performance Review | Monthly | Analyze performance metrics |
| Log Review | Weekly | Check for errors and issues |
| Capacity Planning | Quarterly | Review resource utilization |

### Emergency Procedures

1. **Database Failure**
   - Restore from latest backup
   - Verify data integrity
   - Update connection strings

2. **Application Crash**
   - Restart application services
   - Review error logs
   - Check system resources

3. **Security Incident**
   - Isolate affected systems
   - Review access logs
   - Update security policies

---

## 📚 Additional Resources

### Documentation
- [Microsoft .NET Documentation](https://docs.microsoft.com/en-us/dotnet/)
- [React Documentation](https://reactjs.org/docs/)
- [Redis Documentation](https://redis.io/documentation)
- [SQL Server Documentation](https://docs.microsoft.com/en-us/sql/)

### Community Support
- [Stack Overflow](https://stackoverflow.com/)
- [GitHub Issues](https://github.com/your-org/smart-panda-school-system/issues)
- [Microsoft Q&A](https://docs.microsoft.com/en-us/answers/)

### Training Resources
- [Microsoft Learn](https://docs.microsoft.com/en-us/learn/)
- [Pluralsight](https://www.pluralsight.com/)
- [Udemy](https://www.udemy.com/)

---

## 📄 License

This deployment guide is part of the Smart Panda School System project. Please refer to the main project license for usage terms and conditions.

---

**Last Updated**: November 2024  
**Version**: 1.0  
**Maintainer**: Smart Panda Development Team
