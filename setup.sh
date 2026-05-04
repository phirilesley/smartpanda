#!/bin/bash

# Smart Panda School System - Automated Setup Script
# This script sets up the entire development environment

set -e

echo "🚀 Smart Panda School System - Setup Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker Desktop first."
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    # Check .NET
    if ! command -v dotnet &> /dev/null; then
        print_error ".NET SDK is not installed. Please install .NET 8 SDK first."
        exit 1
    fi
    
    # Check Git
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
    
    print_status "All prerequisites are installed! ✓"
}

# Start Docker services
start_docker_services() {
    print_status "Starting Docker services..."
    
    # Start SQL Server
    print_status "Starting SQL Server..."
    if ! docker ps | grep -q sqlserver; then
        docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong@Password123" \
           -p 1433:1433 --name sqlserver \
           -d mcr.microsoft.com/mssql/server:2022-latest
        print_status "SQL Server started ✓"
    else
        print_warning "SQL Server is already running"
    fi
    
    # Start Redis
    print_status "Starting Redis..."
    if ! docker ps | grep -q redis; then
        docker run -d -p 6379:6379 --name redis redis:latest
        print_status "Redis started ✓"
    else
        print_warning "Redis is already running"
    fi
    
    # Wait for services to be ready
    print_status "Waiting for services to be ready..."
    sleep 10
}

# Setup Backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend/src/SmartSchool.API
    
    # Restore dependencies
    print_status "Restoring .NET dependencies..."
    dotnet restore
    
    # Update database
    print_status "Updating database..."
    dotnet ef database update || {
        print_warning "Database update failed, trying to create database..."
        dotnet ef database update
    }
    
    print_status "Backend setup completed ✓"
    cd ../../..
}

# Setup Frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing Node.js dependencies..."
    npm install
    
    print_status "Frontend setup completed ✓"
    cd ..
}

# Setup Mobile (optional)
setup_mobile() {
    print_status "Setting up mobile apps..."
    
    cd mobile
    
    # Install dependencies
    print_status "Installing React Native dependencies..."
    npm install
    
    # Check for mobile development environment
    if command -v adb &> /dev/null; then
        print_status "Android development environment detected ✓"
    else
        print_warning "Android development environment not found. Install Android Studio for Android development."
    fi
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if command -v xcodebuild &> /dev/null; then
            print_status "iOS development environment detected ✓"
        else
            print_warning "iOS development environment not found. Install Xcode for iOS development."
        fi
    fi
    
    print_status "Mobile setup completed ✓"
    cd ..
}

# Create environment files
create_env_files() {
    print_status "Creating environment files..."
    
    # Backend environment
    cat > backend/src/SmartSchool.API/appsettings.Development.json << EOF
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=SmartSchoolDb;User Id=sa;Password=YourStrong@Password123;TrustServerCertificate=True",
    "Redis": "localhost:6379"
  },
  "JwtSettings": {
    "SecretKey": "dev-super-secret-jwt-key-for-development-only",
    "Issuer": "SmartSchool",
    "Audience": "SmartSchoolUsers",
    "ExpiryMinutes": 60
  },
  "EmailSettings": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": 587,
    "Username": "your-email@gmail.com",
    "Password": "your-app-password"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
EOF
    
    # Frontend environment
    cat > frontend/.env.local << EOF
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_SIGNALR_URL=http://localhost:5000/hubs/notifications
REACT_APP_ENVIRONMENT=development
EOF
    
    print_status "Environment files created ✓"
}

# Run initial data seeding
seed_data() {
    print_status "Seeding initial data..."
    
    cd backend/src/SmartSchool.API
    
    # Create and run a simple seeding script
    cat > seed-data.sql << EOF
-- Create admin user if not exists
IF NOT EXISTS (SELECT 1 FROM AspNetUsers WHERE Email = 'admin@smartschool.com')
BEGIN
    -- This would be handled by the application's user registration
    PRINT 'Admin user will be created on first login'
END

-- Create sample school data
IF NOT EXISTS (SELECT 1 FROM Schools WHERE Name = 'Demo School')
BEGIN
    INSERT INTO Schools (Id, Name, Address, Phone, Email, CreatedAtUtc, UpdatedAtUtc)
    VALUES (NEWID(), 'Demo School', '123 Main St', '+263-123-456-789', 'info@demo.com', GETUTCDATE(), GETUTCDATE())
    PRINT 'Demo school created'
END
EOF
    
    # Apply seed data
    sqlcmd -S localhost -U sa -P "YourStrong@Password123" -d SmartSchoolDb -i seed-data.sql || {
        print_warning "Data seeding completed with warnings"
    }
    
    rm seed-data.sql
    cd ../../..
    
    print_status "Initial data seeding completed ✓"
}

# Start services
start_services() {
    print_status "Starting all services..."
    
    # Start backend in background
    print_status "Starting backend API..."
    cd backend/src/SmartSchool.API
    dotnet run > ../../logs/backend.log 2>&1 &
    BACKEND_PID=$!
    cd ../../..
    
    # Wait for backend to start
    print_status "Waiting for backend to start..."
    sleep 15
    
    # Check if backend is running
    if curl -s http://localhost:5000/health > /dev/null; then
        print_status "Backend API is running ✓"
    else
        print_error "Backend API failed to start"
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
    
    # Start frontend
    print_status "Starting frontend..."
    cd frontend
    npm start > ../logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    cd ..
    
    print_status "All services started ✓"
}

# Display access information
display_access_info() {
    echo ""
    echo "🎉 Setup Complete!"
    echo "=================="
    echo ""
    echo "🌐 Access Points:"
    echo "   Frontend:        http://localhost:3000"
    echo "   Backend API:     http://localhost:5000"
    echo "   API Documentation: http://localhost:5000/swagger"
    echo "   Hangfire Dashboard: http://localhost:5000/hangfire"
    echo ""
    echo "👤 Default Credentials:"
    echo "   Admin Email:     admin@smartschool.com"
    echo "   Admin Password:  Admin123!"
    echo ""
    echo "📱 Mobile Apps:"
    echo "   Android:         npx react-native run-android (from mobile/ directory)"
    echo "   iOS:             npx react-native run-ios (from mobile/ directory, macOS only)"
    echo ""
    echo "📊 Services:"
    echo "   Database:        localhost:1433 (SQL Server)"
    echo "   Cache:           localhost:6379 (Redis)"
    echo ""
    echo "📝 Logs:"
    echo "   Backend:         logs/backend.log"
    echo "   Frontend:        logs/frontend.log"
    echo ""
    echo "🛠️ Development Commands:"
    echo "   Backend:         cd backend/src/SmartSchool.API && dotnet run"
    echo "   Frontend:        cd frontend && npm start"
    echo "   Mobile:          cd mobile && npx react-native run-android"
    echo ""
    echo "📚 Documentation:"
    echo "   Full Guide:       DEPLOYMENT.md"
    echo "   API Docs:        docs/API_DOCUMENTATION.md"
    echo ""
    echo "🆘 Support:"
    echo "   Issues:          https://github.com/your-org/smart-panda-school-system/issues"
    echo "   Email:           support@smartschool.com"
    echo ""
    echo "Press Ctrl+C to stop all services"
    echo ""
}

# Cleanup function
cleanup() {
    print_status "Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    print_status "Services stopped"
}

# Main execution
main() {
    # Create logs directory
    mkdir -p logs
    
    # Setup trap for cleanup
    trap cleanup EXIT
    
    # Run setup steps
    check_prerequisites
    start_docker_services
    create_env_files
    setup_backend
    setup_frontend
    setup_mobile
    seed_data
    start_services
    display_access_info
    
    # Keep script running
    print_status "Services are running. Press Ctrl+C to stop."
    while true; do
        sleep 1
    done
}

# Run main function
main "$@"
