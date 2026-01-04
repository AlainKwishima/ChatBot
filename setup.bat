@echo off
echo ==========================================
echo      Chatbot Project Setup Script
echo ==========================================

echo [1/4] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error installing dependencies.
    pause
    exit /b %errorlevel%
)

echo [2/4] Building Widget...
call npm run build:widget
if %errorlevel% neq 0 (
    echo Error building widget.
    pause
    exit /b %errorlevel%
)

echo [3/4] Building Server...
call npm run build:server
if %errorlevel% neq 0 (
    echo Error building server.
    pause
    exit /b %errorlevel%
)

echo [4/4] Creating default environment variables...
if not exist "server\.env" (
    copy "server\.env.example" "server\.env"
    echo Created server\.env - Please edit it with your API Key!
)

echo ==========================================
echo        Setup Complete!
echo ==========================================
echo.
echo To run the project:
echo   1. Edit server\.env with your OpenAI API Key.
echo   2. Run: npm run dev:server
echo   3. In another terminal: npm run dev:widget
echo.
pause
