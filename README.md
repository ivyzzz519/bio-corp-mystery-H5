# Bio Corp Mystery Mobile H5

This directory is the independent mobile H5 edition of the game.

## Current status

- Phase 5 mobile page migration completed on top of the canonical runtime pages and local assets.
- Phase 6 asset cleanup and package-size optimization completed.
- The original project files outside this directory remain unchanged.

## Local entry

Open `index.html` through a local static web server. The final TapTap package will keep `index.html` at the project root.

## Packaging notes

Run the following command from the project root to generate the lightweight delivery ZIP:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\package-release.ps1
```

The package keeps `index.html` at the ZIP root and excludes development notes, simulated download payloads and unused legacy assets. Build output is written to `release/` and is not committed to Git.
