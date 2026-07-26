param(
  [string]$OutputDirectory = (Join-Path $PSScriptRoot "release")
)

$ErrorActionPreference = "Stop"

$projectRoot = [IO.Path]::GetFullPath($PSScriptRoot)
$releaseRoot = [IO.Path]::GetFullPath($OutputDirectory)
$version = (git -C $projectRoot describe --tags --always HEAD 2>$null)
if (-not $version) {
  $version = "local"
}

$packageName = "bio-corp-mystery-H5-$version"
$stagePath = Join-Path $releaseRoot (".staging-" + $packageName)
$packageRoot = Join-Path $stagePath $packageName
$zipPath = Join-Path $releaseRoot ($packageName + ".zip")

New-Item -ItemType Directory -Path $releaseRoot -Force | Out-Null

if (Test-Path -LiteralPath $stagePath) {
  Remove-Item -LiteralPath $stagePath -Recurse -Force
}
if (Test-Path -LiteralPath $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}

try {
  New-Item -ItemType Directory -Path $packageRoot | Out-Null

  Get-ChildItem -LiteralPath $projectRoot -File |
    Where-Object { $_.Extension -in ".html", ".js", ".css" } |
    Copy-Item -Destination $packageRoot

  $assetTarget = Join-Path $packageRoot "assets"
  New-Item -ItemType Directory -Path $assetTarget | Out-Null
  Get-ChildItem -LiteralPath (Join-Path $projectRoot "assets") -File |
    Where-Object { $_.Name -notin "preflight.vendor.css", "tw_colors.js", "vip-list.png" } |
    Copy-Item -Destination $assetTarget

  $imageTarget = Join-Path $packageRoot "images"
  New-Item -ItemType Directory -Path $imageTarget | Out-Null
  @(
    "news1-ai-labeled.png",
    "news3-ai-labeled.png",
    "news4-ai-labeled.png",
    "news_changgao_visit-ai-labeled.png"
  ) | ForEach-Object {
    Copy-Item -LiteralPath (Join-Path $projectRoot "images\$_") -Destination $imageTarget
  }

  $mediaTarget = Join-Path $packageRoot "media"
  New-Item -ItemType Directory -Path $mediaTarget | Out-Null
  Copy-Item -LiteralPath (Join-Path $projectRoot "media\cwb-112304-ai-labeled.png") -Destination $mediaTarget

  if (-not (Test-Path -LiteralPath (Join-Path $packageRoot "index.html"))) {
    throw "Package entry index.html is missing."
  }

  Add-Type -AssemblyName System.IO.Compression.FileSystem
  Add-Type -AssemblyName System.IO.Compression
  $zipStream = [IO.File]::Open($zipPath, [IO.FileMode]::CreateNew)
  try {
    $outputArchive = [IO.Compression.ZipArchive]::new(
      $zipStream,
      [IO.Compression.ZipArchiveMode]::Create,
      $false
    )
    try {
      Get-ChildItem -LiteralPath $packageRoot -File -Recurse | ForEach-Object {
        $relativePath = $_.FullName.Substring($stagePath.Length + 1).Replace("\", "/")
        [IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
          $outputArchive,
          $_.FullName,
          $relativePath,
          [IO.Compression.CompressionLevel]::Optimal
        ) | Out-Null
      }
    } finally {
      $outputArchive.Dispose()
    }
  } finally {
    $zipStream.Dispose()
  }

  $archive = [IO.Compression.ZipFile]::OpenRead($zipPath)
  try {
    $expectedIndex = "$packageName/index.html"
    $topLevelItems = @($archive.Entries | ForEach-Object {
      ($_.FullName -split "/")[0]
    } | Sort-Object -Unique)
    $hasNestedIndex = @($archive.Entries | Where-Object { $_.FullName -eq $expectedIndex }).Count -eq 1
    if ($topLevelItems.Count -ne 1 -or $topLevelItems[0] -ne $packageName) {
      throw "Package validation failed: ZIP must contain exactly one top-level folder named $packageName."
    }
    if (-not $hasNestedIndex) {
      throw "Package validation failed: index.html is missing from $packageName."
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
