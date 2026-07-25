param(
  [string]$OutputDirectory = (Join-Path $PSScriptRoot "release")
)

$ErrorActionPreference = "Stop"

$projectRoot = [IO.Path]::GetFullPath($PSScriptRoot)
$releaseRoot = [IO.Path]::GetFullPath($OutputDirectory)
$commit = (git -C $projectRoot rev-parse --short HEAD 2>$null)
if (-not $commit) {
  $commit = "local"
}

$packageName = "bio-corp-mystery-H5-$commit"
$stagePath = Join-Path $releaseRoot (".staging-" + $packageName)
$zipPath = Join-Path $releaseRoot ($packageName + ".zip")

New-Item -ItemType Directory -Path $releaseRoot -Force | Out-Null

if (Test-Path -LiteralPath $stagePath) {
  Remove-Item -LiteralPath $stagePath -Recurse -Force
}
if (Test-Path -LiteralPath $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}

try {
  New-Item -ItemType Directory -Path $stagePath | Out-Null

  Get-ChildItem -LiteralPath $projectRoot -File |
    Where-Object { $_.Extension -in ".html", ".js", ".css" } |
    Copy-Item -Destination $stagePath

  $assetTarget = Join-Path $stagePath "assets"
  New-Item -ItemType Directory -Path $assetTarget | Out-Null
  Get-ChildItem -LiteralPath (Join-Path $projectRoot "assets") -File |
    Where-Object { $_.Name -notin "preflight.vendor.css", "tw_colors.js" } |
    Copy-Item -Destination $assetTarget

  $imageTarget = Join-Path $stagePath "images"
  New-Item -ItemType Directory -Path $imageTarget | Out-Null
  @(
    "news1.png",
    "news3.png",
    "news4.png",
    "news_changgao_visit.png"
  ) | ForEach-Object {
    Copy-Item -LiteralPath (Join-Path $projectRoot "images\$_") -Destination $imageTarget
  }

  Copy-Item -LiteralPath (Join-Path $projectRoot "media") -Destination $stagePath -Recurse

  if (-not (Test-Path -LiteralPath (Join-Path $stagePath "index.html"))) {
    throw "Package entry index.html is missing."
  }

  Compress-Archive -Path (Join-Path $stagePath "*") -DestinationPath $zipPath -CompressionLevel Optimal

  Add-Type -AssemblyName System.IO.Compression.FileSystem
  $archive = [IO.Compression.ZipFile]::OpenRead($zipPath)
  try {
    $hasRootIndex = @($archive.Entries | Where-Object { $_.FullName -eq "index.html" }).Count -eq 1
    if (-not $hasRootIndex) {
      throw "Package validation failed: index.html is not at the ZIP root."
    }
  } finally {
    $archive.Dispose()
  }

  $zip = Get-Item -LiteralPath $zipPath
  $hash = Get-FileHash -LiteralPath $zipPath -Algorithm SHA256
  [pscustomobject]@{
    Package = $zip.FullName
    SizeMB = [math]::Round($zip.Length / 1MB, 2)
    SHA256 = $hash.Hash
  }
} finally {
  if (Test-Path -LiteralPath $stagePath) {
    Remove-Item -LiteralPath $stagePath -Recurse -Force
  }
}

