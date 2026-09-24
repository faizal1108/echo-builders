$ErrorActionPreference = "Stop"
$env:ANDROID_HOME = "C:\Users\moham\AppData\Local\Android\Sdk"
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME
# Use the user Gradle cache that already has Gradle 9.3.1 (do not isolate to a empty A: cache).
Remove-Item Env:GRADLE_USER_HOME -ErrorAction SilentlyContinue

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $root

$pkg = Get-Content (Join-Path $root "package.json") -Raw
if ($pkg -match '"expo-dev-client"') {
  throw "expo-dev-client is still in package.json. Remove it before building a standalone release APK."
}

Write-Host "Building standalone release APK (JS + ONNX embedded; Metro is not used at runtime)."
Set-Location (Join-Path $root "android")
& .\gradlew.bat assembleRelease -PreactNativeArchitectures=arm64-v8a --no-daemon
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$apk = Join-Path $root "android\app\build\outputs\apk\release\app-release.apk"
if (-not (Test-Path $apk)) {
  throw "Release APK was not produced: $apk"
}
Write-Host "Release APK: $apk"
Write-Host "Install (USB, Metro stopped): adb install -r `"$apk`""
