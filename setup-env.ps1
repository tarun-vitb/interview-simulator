# Helper script to set up .env.local with your Gemini API key
Write-Host "=== Gemini API Key Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (Test-Path .env.local) {
    Write-Host "Found .env.local file" -ForegroundColor Green
    $content = Get-Content .env.local -Raw
    
    if ($content -match "your_api_key_here") {
        Write-Host "WARNING: .env.local still contains placeholder 'your_api_key_here'" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Please follow these steps:" -ForegroundColor Cyan
        Write-Host "1. Open .env.local in your editor"
        Write-Host "2. Replace 'your_api_key_here' with your actual Gemini API key"
        Write-Host "3. Save the file"
        Write-Host "4. Restart your dev server (Ctrl+C, then 'npm run dev')"
        Write-Host ""
        Write-Host "Get your API key from: https://makersuite.google.com/app/apikey" -ForegroundColor Yellow
    } else {
        Write-Host ".env.local appears to have an API key set" -ForegroundColor Green
    }
} else {
    Write-Host ".env.local not found. Creating it..." -ForegroundColor Yellow
    
    $apiKey = Read-Host "Enter your Gemini API key"
    
    if ($apiKey -and $apiKey -ne "") {
        @"
# Google AI Studio (Gemini) API Key
GEMINI_API_KEY=$apiKey
NEXT_PUBLIC_GEMINI_API_KEY=$apiKey
"@ | Out-File -FilePath ".env.local" -Encoding utf8
        
        Write-Host ".env.local created successfully!" -ForegroundColor Green
        Write-Host "Now restart your dev server (Ctrl+C, then 'npm run dev')" -ForegroundColor Cyan
    } else {
        Write-Host "No API key provided. Exiting." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")



