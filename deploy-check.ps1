# ============================================
# DEPLOYMENT SCRIPT untuk Windows PowerShell
# Mahir Arab Gundul Platform
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Mahir Arab Gundul - Deploy Setup    " -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function untuk check command
function Test-CommandExists {
    param($command)
    $null = Get-Command $command -ErrorAction SilentlyContinue
    return $?
}

# 1. Check Git
Write-Host "1. Checking Git..." -ForegroundColor Green
if (Test-CommandExists git) {
    $gitVersion = git --version
    Write-Host "   ✓ $gitVersion" -ForegroundColor Green
}
else {
    Write-Host "   ✗ Git not found. Install from https://git-scm.com" -ForegroundColor Red
    exit 1
}

# 2. Check Node.js
Write-Host "2. Checking Node.js..." -ForegroundColor Green
if (Test-CommandExists node) {
    $nodeVersion = node --version
    Write-Host "   ✓ Node $nodeVersion" -ForegroundColor Green
}
else {
    Write-Host "   ✗ Node.js not found. Install from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# 3. Check if in git repo
Write-Host "3. Checking Git repository..." -ForegroundColor Green
if (Test-Path ".git") {
    Write-Host "   ✓ Git repository exists" -ForegroundColor Green
}
else {
    Write-Host "   ℹ Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "   ✓ Git initialized" -ForegroundColor Green
}

# 4. Check .env file
Write-Host "4. Checking environment file..." -ForegroundColor Green
if (Test-Path ".env") {
    Write-Host "   ✓ .env file exists" -ForegroundColor Green
}
else {
    Write-Host "   ⚠ .env file not found" -ForegroundColor Yellow
    Write-Host "   Creating from .env.example..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "   ✓ .env created. Please edit with your API keys!" -ForegroundColor Green
    }
    else {
        Write-Host "   ✗ .env.example not found" -ForegroundColor Red
    }
}

# 5. Build test
Write-Host "5. Testing build..." -ForegroundColor Green
Write-Host "   Building project..." -ForegroundColor Yellow
$buildResult = npm run build 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Build successful" -ForegroundColor Green
}
else {
    $buildResult | ForEach-Object { Write-Host $_ }
    Write-Host "   ✗ Build failed. Check errors above." -ForegroundColor Red
    exit 1
}

# 6. Git status
Write-Host "6. Checking Git status..." -ForegroundColor Green
$status = git status --short
if ($status) {
    Write-Host "   Files to commit:" -ForegroundColor Yellow
    git status --short
}
else {
    Write-Host "   ✓ No changes to commit" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Next Steps:                         " -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Edit .env file with your API keys" -ForegroundColor White
Write-Host "2. Create GitHub repository" -ForegroundColor White
Write-Host "3. Run these commands:" -ForegroundColor White
Write-Host ""
Write-Host "   git add ." -ForegroundColor Cyan
Write-Host "   git commit -m 'Initial commit'" -ForegroundColor Cyan
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/mahir-arab-gundul.git" -ForegroundColor Cyan
Write-Host "   git push -u origin main" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Deploy to Cloudflare Pages:" -ForegroundColor White
Write-Host "   - Visit https://dash.cloudflare.com" -ForegroundColor Cyan
Write-Host "   - Import your GitHub repository" -ForegroundColor Cyan
Write-Host "   - Add environment variables" -ForegroundColor Cyan
Write-Host ""
Write-Host "✨ Good luck with your deployment! ✨" -ForegroundColor Green
Write-Host ""
