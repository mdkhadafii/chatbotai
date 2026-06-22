param(
    [int]$ApiPort = 8000,
    [int]$ChromaPort = 8001,
    [switch]$SkipInstall,
    [switch]$Detached
)

$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent $PSScriptRoot
$VenvPython = Join-Path $RepoRoot ".venv\Scripts\python.exe"
$ChromaExe = Join-Path $RepoRoot ".venv\Scripts\chroma.exe"
$Requirements = Join-Path $RepoRoot "requirements.txt"
$StorageChroma = Join-Path $RepoRoot "storage\chroma"
$RuntimeDir = Join-Path $RepoRoot ".runtime"
$FallbackChroma = Join-Path $env:TEMP "chatbotai-chroma"
$FallbackLog = Join-Path $env:TEMP "chatbotai-chroma.log"

function Write-Step {
    param([string]$Message)
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Test-PortListening {
    param([int]$Port)

    $client = [System.Net.Sockets.TcpClient]::new()
    try {
        $connection = $client.BeginConnect("127.0.0.1", $Port, $null, $null)
        if (-not $connection.AsyncWaitHandle.WaitOne(1000, $false)) {
            return $false
        }

        $client.EndConnect($connection)
        return $true
    }
    catch {
        return $false
    }
    finally {
        $client.Close()
    }
}

function Test-WritableDirectory {
    param([string]$Path)

    try {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
        $testFile = Join-Path $Path ".write-test-$PID.tmp"
        New-Item -ItemType File -Path $testFile -Force | Out-Null
        Remove-Item -Path $testFile -Force
        return $true
    }
    catch {
        return $false
    }
}

function Start-HiddenProcess {
    param(
        [string]$FileName,
        [string[]]$Arguments,
        [string]$WorkingDirectory
    )

    $psi = [System.Diagnostics.ProcessStartInfo]::new()
    $psi.FileName = $FileName
    $psi.Arguments = ($Arguments | ForEach-Object {
        if ($_ -match '[\s"]') {
            '"' + ($_ -replace '"', '\"') + '"'
        }
        else {
            $_
        }
    }) -join " "
    $psi.WorkingDirectory = $WorkingDirectory
    $psi.UseShellExecute = $false
    $psi.CreateNoWindow = $true

    return [System.Diagnostics.Process]::Start($psi)
}

Set-Location $RepoRoot
New-Item -ItemType Directory -Path $RuntimeDir -Force | Out-Null

if (-not (Test-Path $VenvPython)) {
    Write-Step "Membuat virtual environment .venv"
    python -m venv .venv
}

if (-not $SkipInstall) {
    if (-not (Test-Path $ChromaExe)) {
        Write-Step "Menginstall dependency backend"
        & $VenvPython -m pip install -r $Requirements
    }
}

if (-not (Test-Path $ChromaExe)) {
    throw "chroma.exe tidak ditemukan. Jalankan: .\.venv\Scripts\python.exe -m pip install -r requirements.txt"
}

if (Test-WritableDirectory $StorageChroma) {
    $ChromaDataDir = $StorageChroma
    $ChromaLog = Join-Path $StorageChroma "chroma.log"
}
else {
    Write-Host "Folder storage\chroma tidak writable, memakai folder sementara: $FallbackChroma" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $FallbackChroma -Force | Out-Null
    $ChromaDataDir = $FallbackChroma
    $ChromaLog = $FallbackLog
}

if (Test-PortListening $ChromaPort) {
    Write-Step "ChromaDB sudah berjalan di port $ChromaPort"
}
else {
    Write-Step "Menjalankan ChromaDB di port $ChromaPort"
    $chromaProcess = Start-HiddenProcess `
        -FileName $ChromaExe `
        -Arguments @("run", "--host", "127.0.0.1", "--port", "$ChromaPort", "--path", $ChromaDataDir, "--log-path", $ChromaLog) `
        -WorkingDirectory $RepoRoot

    Start-Sleep -Seconds 4

    if (-not (Test-PortListening $ChromaPort)) {
        if ($null -ne $chromaProcess -and $chromaProcess.HasExited) {
            Write-Host "ChromaDB gagal start. Log: $ChromaLog" -ForegroundColor Red
        }
        throw "ChromaDB belum listening di port $ChromaPort."
    }
}

if (Test-PortListening $ApiPort) {
    Write-Host "FastAPI sudah berjalan di port ${ApiPort}: http://localhost:${ApiPort}/docs" -ForegroundColor Green
    exit 0
}

Write-Step "Menjalankan FastAPI di port $ApiPort"
Write-Host "Docs:   http://localhost:${ApiPort}/docs" -ForegroundColor Green
Write-Host "Health: http://localhost:${ApiPort}/api/health" -ForegroundColor Green

if ($Detached) {
    $ApiLog = Join-Path $RuntimeDir "api.log"
    $apiCommand = "& '$VenvPython' -m uvicorn app.main:app --reload --host 0.0.0.0 --port $ApiPort *> '$ApiLog'"
    [void](Start-HiddenProcess `
        -FileName "powershell.exe" `
        -Arguments @("-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", $apiCommand) `
        -WorkingDirectory $RepoRoot)

    Start-Sleep -Seconds 5

    if (-not (Test-PortListening $ApiPort)) {
        Write-Host "FastAPI gagal start. Log: $ApiLog" -ForegroundColor Red
        throw "FastAPI belum listening di port $ApiPort."
    }

    Write-Host "FastAPI berjalan di background. Log: $ApiLog" -ForegroundColor Green
    exit 0
}

Write-Host "Tekan Ctrl+C untuk menghentikan FastAPI." -ForegroundColor Yellow

& $VenvPython -m uvicorn app.main:app --reload --host 0.0.0.0 --port $ApiPort
