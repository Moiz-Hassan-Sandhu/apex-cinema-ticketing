# Apex Cinema Lounge - Submission Packaging Script
# Creates the required submission ZIP following the naming convention: RollNo_Name_Section_A#02.zip
# Excludes node_modules, dist, and secrets

param (
    [string]$RollNo = "24I2096",
    [string]$Name = "MoizHassan",
    [string]$Section = "A"
)

$ProgressPreference = 'SilentlyContinue'

$CleanRoll = $RollNo -replace '\s+', '_' -replace '-', ''
$CleanName = $Name -replace '\s+', '_'
$CleanSection = $Section -replace '\s+', '_'

$ZipName = "${CleanRoll}_${CleanName}_${CleanSection}_A#02.zip"
$Destination = Join-Path -Path (Get-Location) -ChildPath $ZipName

Write-Host "Creating submission archive: $ZipName" -ForegroundColor Cyan

if (Test-Path $Destination) {
    Remove-Item $Destination -Force
}

# Create temporary packaging folder
$TempFolder = Join-Path -Path $env:TEMP -ChildPath "pkg_apex_$([System.Guid]::NewGuid().ToString('N'))"
New-Item -ItemType Directory -Path $TempFolder -Force | Out-Null

$itemsToCopy = Get-ChildItem -Path . -Exclude "node_modules", "dist", "*.zip", ".git"
foreach ($item in $itemsToCopy) {
    Copy-Item -Path $item.FullName -Destination $TempFolder -Recurse -Force
}

Compress-Archive -Path "$TempFolder\*" -DestinationPath $Destination -CompressionLevel Optimal
Remove-Item -Path $TempFolder -Recurse -Force

if (Test-Path $Destination) {
    Write-Host "Archive created successfully at: $Destination" -ForegroundColor Green
    Write-Host "Size: $([math]::Round((Get-Item $Destination).Length / 1KB, 2)) KB" -ForegroundColor Cyan
} else {
    Write-Host "Failed to create archive." -ForegroundColor Red
}
