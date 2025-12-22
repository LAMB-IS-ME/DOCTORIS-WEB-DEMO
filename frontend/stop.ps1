#!/usr/bin/env pwsh
# Script để dừng frontend dev server

Write-Host "🛑 Stopping Doctoris Frontend..." -ForegroundColor Yellow
Write-Host ""

# Find and kill processes on port 3000
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    $pid = $port3000.OwningProcess
    Stop-Process -Id $pid -Force
    Write-Host "✅ Stopped process on port 3000 (PID: $pid)" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No process running on port 3000" -ForegroundColor Gray
}

# Also kill any node processes (fallback)
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | ForEach-Object {
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
        Write-Host "✅ Stopped node process (PID: $($_.Id))" -ForegroundColor Green
    }
} else {
    Write-Host "ℹ️  No node processes found" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✅ All processes stopped" -ForegroundColor Green
