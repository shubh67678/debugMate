# Define the log directory and file
$TmpFolder = "$HOME\tmp"
if (!(Test-Path -Path $TmpFolder)) {
    New-Item -ItemType Directory -Path $TmpFolder -Force | Out-Null
}

$LogFile = Join-Path $TmpFolder "terminal_output_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"

# Start logging all terminal output
Start-Transcript -Path $LogFile -Append

# Notify the user where logs are being saved (optional)
# Remove this line to keep it entirely transparent
Write-Host "Logging terminal output to $LogFile"

# Keep the session running as usual
Write-Host "Terminal logging enabled. Use the terminal as normal."

# Keep PowerShell running
while ($true) {
    Start-Sleep -Seconds 1
}
