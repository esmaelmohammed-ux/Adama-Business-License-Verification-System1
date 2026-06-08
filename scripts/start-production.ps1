# Start production server (UI + API on port 5000)
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Frontend = Join-Path $Root "frontend"
$Public = Join-Path $Root "backend\public"

Write-Host "==> Building frontend for production (demo UI hidden)..." -ForegroundColor Cyan
Push-Location $Frontend
$env:VITE_SHOW_DEMO = "false"
npm run build
Pop-Location

Write-Host "==> Copying build to backend/public..." -ForegroundColor Cyan
Get-ChildItem $Public -Exclude ".gitkeep" | Remove-Item -Recurse -Force
Copy-Item (Join-Path $Frontend "dist\*") $Public -Recurse -Force

$conn = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -First 1
if ($conn) {
  Stop-Process -Id $conn.OwningProcess -Force
  Write-Host "Stopped previous process on port 5000 (PID $($conn.OwningProcess))" -ForegroundColor Yellow
}

Push-Location (Join-Path $Root "backend")
$env:NODE_ENV = "production"
Write-Host "Starting production server at http://localhost:5000 ..." -ForegroundColor Cyan
node src/server.js
