#!/usr/bin/env pwsh
# Test n8n webhook với payload mới

Write-Host "Testing n8n webhook endpoint..." -ForegroundColor Cyan
Write-Host ""

$webhookUrl = "http://localhost:5678/webhook/doctoris-chat"

$testPayload = @{
    message = "Xin hướng dẫn xử trí đau đầu nhẹ"
    sessionId = "test-$(Get-Date -Format 'yyyyMMddHHmmss')"
    searchType = "SYMPTOM"
} | ConvertTo-Json

Write-Host "Payload:" -ForegroundColor Yellow
Write-Host $testPayload
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri $webhookUrl `
        -Method POST `
        -ContentType "application/json" `
        -Body $testPayload `
        -TimeoutSec 30

    Write-Host "✅ Success! Response:" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 10)
}
catch {
    Write-Host "❌ Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response body: $responseBody" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Tip: Check n8n Executions tab for details" -ForegroundColor Gray
