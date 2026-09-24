$ErrorActionPreference = "Stop"
$env:ANDROID_HOME = "C:\Users\moham\AppData\Local\Android\Sdk"
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME
$env:GRADLE_USER_HOME = "A:\project\ECHO\.gradle-home"
New-Item -ItemType Directory -Force -Path $env:GRADLE_USER_HOME | Out-Null
Set-Location (Join-Path $PSScriptRoot "..")
npx expo run:android
