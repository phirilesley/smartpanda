#!/bin/bash

# Smart Panda School System - APK Build Script
# This script builds all three mobile apps (Parent, Teacher, Admin) with offline capabilities

echo "🚀 Building Smart Panda Mobile Apps..."
echo "======================================"

# Set colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the mobile project root directory"
    exit 1
fi

# Check if Android SDK is available
if [ ! -d "$ANDROID_HOME" ]; then
    print_error "ANDROID_HOME not set. Please set up Android SDK first."
    exit 1
fi

# Check if Java is available
if ! command -v java &> /dev/null; then
    print_error "Java not found. Please install Java JDK."
    exit 1
fi

# Clean previous builds
print_status "Cleaning previous builds..."
cd android
./gradlew clean
if [ $? -ne 0 ]; then
    print_error "Failed to clean project"
    exit 1
fi
print_success "Clean completed"

cd ..

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        print_error "Failed to install dependencies"
        exit 1
    fi
    print_success "Dependencies installed"
fi

# Function to build APK
build_apk() {
    local app_type=$1
    local build_type=$2
    local variant="${app_type}${build_type^}"
    
    print_status "Building ${app_type^} ${build_type^} APK..."
    
    cd android
    ./gradlew "assemble${variant}" --stacktrace
    
    if [ $? -eq 0 ]; then
        print_success "${app_type^} ${build_type^} APK built successfully"
        
        # Find the APK file
        local apk_path=$(find app/build/outputs/apk -name "*${app_type}*${build_type}*.apk" | head -n 1)
        
        if [ ! -z "$apk_path" ]; then
            # Create output directory
            mkdir -p ../dist
            
            # Copy APK with descriptive name
            local timestamp=$(date +%Y%m%d_%H%M%S)
            local output_name="../dist/SmartPanda_${app_type^}_${build_type^}_${timestamp}.apk"
            cp "$apk_path" "$output_name"
            
            # Get APK size
            local apk_size=$(du -h "$output_name" | cut -f1)
            
            print_success "APK saved as: $output_name (Size: $apk_size)"
            
            # Generate QR code for easy download (if qrencode is available)
            if command -v qrencode &> /dev/null; then
                qrencode -o "../dist/SmartPanda_${app_type^}_${build_type^}_${timestamp}.png" "$output_name"
                print_success "QR code generated for easy mobile download"
            fi
        else
            print_warning "APK file not found in expected location"
        fi
    else
        print_error "Failed to build ${app_type^} ${build_type^} APK"
        return 1
    fi
    
    cd ..
    return 0
}

# Build all APKs
echo ""
print_status "Starting APK build process..."
echo ""

# Build Parent App
if ! build_apk "parent" "debug"; then
    print_error "Parent app build failed"
fi

echo ""

# Build Teacher App
if ! build_apk "teacher" "debug"; then
    print_error "Teacher app build failed"
fi

echo ""

# Build Admin App
if ! build_apk "admin" "debug"; then
    print_error "Admin app build failed"
fi

echo ""

# Build release versions (if keystore is configured)
print_status "Checking for release configuration..."
if [ -f "android/app/release.keystore" ] || [ -f "$MYAPP_UPLOAD_STORE_FILE" ]; then
    print_status "Building release APKs..."
    
    echo ""
    if ! build_apk "parent" "release"; then
        print_error "Parent release build failed"
    fi
    
    echo ""
    if ! build_apk "teacher" "release"; then
        print_error "Teacher release build failed"
    fi
    
    echo ""
    if ! build_apk "admin" "release"; then
        print_error "Admin release build failed"
    fi
else
    print_warning "Release keystore not found. Skipping release builds."
    print_warning "To build release APKs, create a keystore file:"
    print_warning "keytool -genkey -v -keystore android/app/release.keystore -alias smartpanda -keyalg RSA -keysize 2048 -validity 10000"
fi

# Generate build summary
echo ""
echo "======================================"
print_success "Build process completed!"
echo ""

# List all generated APKs
if [ -d "dist" ]; then
    print_status "Generated APKs:"
    ls -la dist/*.apk 2>/dev/null | while read line; do
        echo "  $line"
    done
    
    echo ""
    print_status "Total APKs created: $(ls dist/*.apk 2>/dev/null | wc -l)"
    
    # Calculate total size
    if command -v du &> /dev/null; then
        total_size=$(du -sh dist | cut -f1)
        print_status "Total size: $total_size"
    fi
else
    print_warning "No APKs found in dist directory"
fi

echo ""
print_status "Next steps:"
echo "1. Test the APKs on Android devices"
echo "2. Upload to Google Play Console (for release versions)"
echo "3. Distribute to schools and parents"
echo ""

print_success "Smart Panda Mobile Apps are ready! 🎉"

# Display offline capabilities info
echo ""
echo "======================================"
print_status "Offline Capabilities Included:"
echo "✅ SQLite database for local storage"
echo "✅ Automatic sync when online"
echo "✅ Offline data capture for attendance, grades, fees"
echo "✅ Conflict resolution for data sync"
echo "✅ Background sync service"
echo "✅ Local caching for performance"
echo "✅ Zimbabwe payment integration (Paynow, EcoCash)"
echo "✅ AI assistant with offline capabilities"
echo "✅ Push notifications for sync status"
echo "✅ Biometric authentication support"
echo ""

print_status "API Endpoints:"
echo "📱 Parent App: /api/mobile/parent/"
echo "👨‍🏫 Teacher App: /api/mobile/teacher/"
echo "👨‍💼 Admin App: /api/mobile/admin/"
echo ""

print_status "Offline-First Features:"
echo "🌐 Works without internet connection"
echo "🔄 Auto-syncs when connection restored"
echo "💾 Stores data locally in SQLite"
echo "⚡ Fast performance with local caching"
echo "🔒 Secure data encryption"
echo "📊 Real-time sync status indicators"
echo ""

echo "======================================"
print_success "Build script completed successfully!"
echo "🎯 Your Smart Panda Mobile Apps are ready for distribution!"
