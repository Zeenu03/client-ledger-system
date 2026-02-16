@echo off
echo ================================================
echo  Starting Client Ledger System
echo ================================================
echo.
echo Installing concurrently if needed...
call npm install
echo.
echo Starting Frontend and Backend servers...
echo.
echo Frontend will run on: http://localhost:5173
echo Backend will run on: http://localhost:5000
echo.
echo Press Ctrl+C to stop both servers
echo ================================================
echo.
call npm run dev
