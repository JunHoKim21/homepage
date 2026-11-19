$ErrorActionPreference = "Stop"

$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
if (-not (Test-Path $chrome)) {
    throw "Chrome executable not found at $chrome"
}

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$outDir = Join-Path $baseDir "out"
if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir | Out-Null
}

$targets = @(
    @{ Html = "thumbnail.html"; Out = "kmong-thumbnail-652x488.png"; W = 652; H = 488; Scale = 1 },
    @{ Html = "thumbnail.html"; Out = "kmong-thumbnail-1304x976.png"; W = 652; H = 488; Scale = 2 },
    @{ Html = "detail-01-hook.html"; Out = "kmong-detail-01-hook.png"; W = 860; H = 1480; Scale = 1 },
    @{ Html = "detail-02-comparison.html"; Out = "kmong-detail-02-comparison.png"; W = 860; H = 1240; Scale = 1 },
    @{ Html = "detail-03-showcase.html"; Out = "kmong-detail-03-showcase.png"; W = 860; H = 1390; Scale = 1 },
    @{ Html = "detail-04-admin-trust.html"; Out = "kmong-detail-04-admin-trust.png"; W = 860; H = 1250; Scale = 1 },
    @{ Html = "detail-05-pricing.html"; Out = "kmong-detail-05-pricing.png"; W = 860; H = 1350; Scale = 1 },
    @{ Html = "detail-06-process-faq.html"; Out = "kmong-detail-06-process-faq.png"; W = 860; H = 1280; Scale = 1 }
)

foreach ($t in $targets) {
    $htmlPath = Join-Path $baseDir $t.Html
    if (-not (Test-Path $htmlPath)) {
        throw "Missing HTML file: $htmlPath"
    }
    $outPath = Join-Path $outDir $t.Out
    $fileUri = ([System.Uri]$htmlPath).AbsoluteUri

    $args = @(
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--allow-file-access-from-files",
        "--virtual-time-budget=4000",
        "--window-size=$($t.W),$($t.H)",
        "--force-device-scale-factor=$($t.Scale)",
        "--screenshot=$outPath",
        $fileUri
    )

    $proc = Start-Process -FilePath $chrome -ArgumentList $args -Wait -PassThru -NoNewWindow
    if ($proc.ExitCode -ne 0 -or -not (Test-Path $outPath)) {
        throw "Failed to render $($t.Out) (ExitCode=$($proc.ExitCode))"
    }
}

Add-Type -AssemblyName System.Drawing
Write-Host "=== Rendered PNG Dimensions ==="
foreach ($t in $targets) {
    $outPath = Join-Path $outDir $t.Out
    $img = [System.Drawing.Image]::FromFile($outPath)
    $w = $img.Width
    $h = $img.Height
    $img.Dispose()
    $sizeKb = [math]::Round((Get-Item $outPath).Length / 1KB, 1)
    Write-Host ("{0,-34} {1}x{2} px  ({3} KB)" -f $t.Out, $w, $h, $sizeKb)
}
