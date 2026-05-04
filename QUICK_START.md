# Smart Panda School System - Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### Prerequisites
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **.NET 8 SDK** - [Download here](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download here](https://git-scm.com/)

### One-Command Setup

```bash
# Clone and setup everything
git clone https://github.com/your-org/smart-panda-school-system.git
cd smart-panda-school-system
chmod +x setup.sh && ./setup.sh
```

### Manual Setup

#### 1. Start Database & Cache with Docker
```bash
# Start SQL Server
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Password123" \
   -p 1433:1433 --name sqlserver \
   -d mcr.microsoft.com/mssql/server:2022-latest

# Start Redis
docker run -d -p 6379:6379 --name redis redis:latest
```

#### 2. Setup Backend
```bash
cd backend/src/SmartSchool.API
dotnet restore
dotnet ef database update
dotnet run
```

#### 3. Setup Frontend
```bash
cd frontend
npm install
npm start
```

#### 4. Setup Mobile (Optional)
```bash
cd mobile
npm install
# For Android
npx react-native run-android
# For iOS (macOS only)
npx react-native run-ios
```

## 🌐 Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | - |
| Backend API | http://localhost:5000 | - |
| API Documentation | http://localhost:5000/swagger | - |
| Hangfire Dashboard | http://localhost:5000/hangfire | - |
| Database | localhost:1433 | SA/YourStrong@Password123 |
| Redis | localhost:6379 | - |

## 📱 Mobile Apps

### Android Setup
```bash
# Install Android Studio
# Set up Android SDK
# Enable developer mode on device
# Run: npx react-native run-android
```

### iOS Setup (macOS only)
```bash
# Install Xcode
# Install CocoaPods: sudo gem install cocoapods
# Run: npx react-native run-ios
```

## 🔧 Default Configuration

### Database Connection
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=SmartSchoolDb;User Id=sa;Password=YourStrong@Password123;TrustServerCertificate=True",
    "Redis": "localhost:6379"
  }
}
```

### Default Admin User
- **Email**: admin@smartschool.com
- **Password**: Admin123!

### Test Users
- **Parent**: parent@smartschool.com / Parent123!
- **Teacher**: teacher@smartschool.com / Teacher123!
- **Student**: student@smartschool.com / Student123!

## 🚨 Common Issues & Solutions

### Database Connection Failed
```bash
# Check if SQL Server is running
docker ps | grep sqlserver

# Restart if needed
docker restart sqlserver
```

### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F

# Kill process (Linux/Mac)
kill -9 <PID>
```

### Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Mobile Build Issues
```bash
# Clear React Native cache
npx react-native start --reset-cache

# Clean build folder
cd android && ./gradlew clean && cd ..
```

## 📊 First Steps

1. **Open Frontend** - Navigate to http://localhost:3000
2. **Login as Admin** - Use admin@smartschool.com / Admin123!
3. **Create School** - Set up your first school
4. **Add Users** - Create teachers, students, and parents
5. **Explore Features** - Test attendance, grades, fees, etc.

## 🛠️ Development Tips

### Hot Reload
- **Frontend**: Auto-reloads on file changes
- **Backend**: Restart on changes (use `dotnet watch run`)
- **Mobile**: Shake device to open developer menu

### Database Changes
```bash
# Create new migration
dotnet ef migrations add MigrationName

# Apply migration
dotnet ef database update
```

### API Testing
- Use Swagger UI at http://localhost:5000/swagger
- Or import Postman collection from `docs/postman-collection.json`

## 📚 Next Steps

1. **Read Full Documentation** - [DEPLOYMENT.md](DEPLOYMENT.md)
2. **Explore Architecture** - [ARCHITECTURE.md](ARCHITECTURE.md)
3. **Review API Docs** - [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)
4. **Check Mobile Guides** - [MOBILE_SETUP.md](docs/MOBILE_SETUP.md)

## 🆘 Need Help?

- **Documentation**: Check the full [DEPLOYMENT.md](DEPLOYMENT.md) guide
- **Issues**: [GitHub Issues](https://github.com/your-org/smart-panda-school-system/issues)
- **Community**: [Discord Server](https://discord.gg/smartschool)
- **Email**: support@smartschool.com

---

**Happy Coding! 🎉**
