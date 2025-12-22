#!/usr/bin/env pwsh
# Script tiện lợi để start frontend dev server

Write-Host "🚀 Starting Doctoris Frontend..." -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies first..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  WARNING: .env.local not found!" -ForegroundColor Red
    Write-Host "Creating default .env.local..." -ForegroundColor Yellow
    
    $envContent = @"
# Frontend toggles
VITE_USE_N8N_RAG=true

# n8n Webhook URL
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/doctoris-chat

# Optional: API key cho webhook authentication
VITE_N8N_API_KEY=

# Gemini API (nếu USE_N8N_RAG=false)
GEMINI_API_KEY=your-gemini-api-key-here
"@
    
    $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "✅ Created .env.local with default values" -ForegroundColor Green
    Write-Host ""
}

# Kill any existing node processes on port 3000
Write-Host "🧹 Cleaning up old processes..." -ForegroundColor Gray
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    $pid = $port3000.OwningProcess
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    Write-Host "   Stopped process on port 3000 (PID: $pid)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🌐 Starting Vite dev server..." -ForegroundColor Cyan
Write-Host "   Local: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Tip: Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""

npm run dev
