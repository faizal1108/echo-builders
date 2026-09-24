$ErrorActionPreference = "Stop"
$env:ANDROID_HOME = "C:\Users\moham\AppData\Local\Android\Sdk"
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME
Remove-Item Env:GRADLE_USER_HOME -ErrorAction SilentlyContinue
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $root
Write-Host "Installing standalone release APK (not a development client)."
& (Join-Path $PSScriptRoot "build-release-apk.ps1")
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
$apk = Join-Path $root "android\app\build\outputs\apk\release\app-release.apk"
$adb = Join-Path $env:ANDROID_HOME "platform-tools\adb.exe"
& $adb uninstall com.echobuilders.paddyaiscanner
& $adb install -r $apk
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
Write-Host "Installed. Launch Paddy AI Scanner from the phone launcher. Do not start Metro."
