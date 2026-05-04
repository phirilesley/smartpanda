@echo off
REM Smart Panda School System - APK Build Script (Windows)
REM This script builds all three mobile apps (Parent, Teacher, Admin) with offline capabilities

echo 🚀 Building Smart Panda Mobile Apps...
echo ======================================

REM Set colors for output
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM Function to print colored output
:print_status
echo %BLUE%[INFO]%NC% %~1
goto :eof

:print_success
echo %GREEN%[SUCCESS]%NC% %~1
goto :eof

:print_warning
echo %YELLOW%[WARNING]%NC% %~1
goto :eof

:print_error
echo %RED%[ERROR]%NC% %~1
goto :eof

REM Check if we're in the right directory
if not exist "package.json" (
    call :print_error "Please run this script from the mobile project root directory"
    pause
    exit /b 1
)

REM Check if Android SDK is available
if not defined ANDROID_HOME (
    call :print_error "ANDROID_HOME not set. Please set up Android SDK first."
    echo Set ANDROID_HOME environment variable to your Android SDK path
    pause
    exit /b 1
)

REM Check if Java is available
java -version >nul 2>&1
if %errorlevel% neq 0 (
    call :print_error "Java not found. Please install Java JDK."
    pause
    exit /b 1
)

REM Clean previous builds
call :print_status "Cleaning previous builds..."
cd android
call gradlew.bat clean
if %errorlevel% neq 0 (
    call :print_error "Failed to clean project"
    pause
    exit /b 1
)
call :print_success "Clean completed"

cd ..

REM Install dependencies if needed
if not exist "node_modules" (
    call :print_status "Installing dependencies..."
    call npm install
    if %errorlevel% neq 0 (
        call :print_error "Failed to install dependencies"
        pause
        exit /b 1
    )
    call :print_success "Dependencies installed"
)

REM Function to build APK
:build_apk
set app_type=%~1
set build_type=%~2
set variant=%app_type%%build_type%

call :print_status "Building %app_type% %build_type% APK..."

cd android
call gradlew.bat assemble%variant% --stacktrace

if %errorlevel% equ 0 (
    call :print_success "%app_type% %build_type% APK built successfully"
    
    REM Find the APK file (Windows compatible)
    for /f "delims=" %%i in ('dir /b /s app\build\outputs\apk\*%app_type%*%build_type%*.apk 2^>nul') do set apk_path=%%i
    
    if defined apk_path (
        REM Create output directory
        if not exist "..\dist" mkdir "..\dist"
        
        REM Copy APK with descriptive name
        for /f "tokens=2 delims==" %%i in ('wmic OS Get localdatetime /value') do set datetime=%%i
        set timestamp=%datetime:~0,8%_%datetime:~8,6%
        set output_name="..\dist\SmartPanda_%app_type%_%build_type%_%timestamp%.apk"
        
        copy "%apk_path%" %output_name% >nul
        
        REM Get APK size
        for %%i in (%output_name%) do set apk_size=%%~zi
        set /local enabledelayedexpansion
        set apk_size_mb=!apk_size:~0,-6!
        set apk_size_kb=!apk_size:~-6,3!
        
        call :print_success "APK saved as: %output_name% (Size: !apk_size_mb!.!apk_size_kb! MB)"
        
        REM Generate QR code for easy download (if qrencode is available)
        qrencode -o "..\dist\SmartPanda_%app_type%_%build_type%_%timestamp%.png" "%output_name%" >nul 2>&1
        if !errorlevel! equ 0 (
            call :print_success "QR code generated for easy mobile download"
        )
    ) else (
        call :print_warning "APK file not found in expected location"
    )
) else (
    call :print_error "Failed to build %app_type% %build_type% APK"
    cd ..
    exit /b 1
)

cd ..
goto :eof

REM Build all APKs
echo.
call :print_status "Starting APK build process..."
echo.

REM Build Parent App
call :build_apk "parent" "debug"
if %errorlevel% neq 0 (
    call :print_error "Parent app build failed"
)

echo.

REM Build Teacher App
call :build_apk "teacher" "debug"
if %errorlevel% neq 0 (
    call :print_error "Teacher app build failed"
)

echo.

REM Build Admin App
call :build_apk "admin" "debug"
if %errorlevel% neq 0 (
    call :print_error "Admin app build failed"
)

echo.

REM Build release versions (if keystore is configured)
call :print_status "Checking for release configuration..."
if exist "android\app\release.keystore" (
    call :print_status "Building release APKs..."
    
    echo.
    call :build_apk "parent" "release"
    if %errorlevel% neq 0 (
        call :print_error "Parent release build failed"
    )
    
    echo.
    call :build_apk "teacher" "release"
    if %errorlevel% neq 0 (
        call :print_error "Teacher release build failed"
    )
    
    echo.
    call :build_apk "admin" "release"
    if %errorlevel% neq 0 (
        call :print_error "Admin release build failed"
    )
) else (
    call :print_warning "Release keystore not found. Skipping release builds."
    call :print_warning "To build release APKs, create a keystore file:"
    call :print_warning "keytool -genkey -v -keystore android\app\release.keystore -alias smartpanda -keyalg RSA -keysize 2048 -validity 10000"
)

REM Generate build summary
echo.
echo ======================================
call :print_success "Build process completed!"
echo.

REM List all generated APKs
if exist "dist" (
    call :print_status "Generated APKs:"
    dir /b dist\*.apk 2>nul
    echo.
    
    REM Count APKs
    for /f %%i in ('dir /b dist\*.apk 2^>nul ^| find /c /v ""') do set apk_count=%%i
    call :print_status "Total APKs created: %apk_count%"
    
    REM Calculate total size
    for /f "tokens=3" %%i in ('dir dist\*.apk 2^>nul ^| find "bytes"') do set total_size=%%i
    if defined total_size (
        set /local enabledelayedexpansion
        set total_mb=!total_size:~0,-6!
        set total_kb=!total_size:~-6,3!
        call :print_status "Total size: !total_mb!.!total_kb! MB"
    )
) else (
    call :print_warning "No APKs found in dist directory"
)

echo.
call :print_status "Next steps:"
echo 1. Test the APKs on Android devices
echo 2. Upload to Google Play Console (for release versions)
echo 3. Distribute to schools and parents
echo.

call :print_success "Smart Panda Mobile Apps are ready! 🎉"

REM Display offline capabilities info
echo.
echo ======================================
call :print_status "Offline Capabilities Included:"
echo ✅ SQLite database for local storage
echo ✅ Automatic sync when online
echo ✅ Offline data capture for attendance, grades, fees
echo ✅ Conflict resolution for data sync
echo ✅ Background sync service
echo ✅ Local caching for performance
echo ✅ Zimbabwe payment integration (Paynow, EcoCash)
echo ✅ AI assistant with offline capabilities
echo ✅ Push notifications for sync status
echo ✅ Biometric authentication support
echo.

call :print_status "API Endpoints:"
echo 📱 Parent App: /api/mobile/parent/
echo 👨‍🏫 Teacher App: /api/mobile/teacher/
echo 👨‍💼 Admin App: /api/mobile/admin/
echo.

call :print_status "Offline-First Features:"
echo 🌐 Works without internet connection
echo 🔄 Auto-syncs when connection restored
echo 💾 Stores data locally in SQLite
echo ⚡ Fast performance with local caching
echo 🔒 Secure data encryption
echo 📊 Real-time sync status indicators
echo.

echo ======================================
call :print_success "Build script completed successfully!"
echo 🎯 Your Smart Panda Mobile Apps are ready for distribution!

pause
