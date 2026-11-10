@echo off
REM Instala el complemento "Votacion EUDE" en PowerPoint (Windows)
net session >nul 2>&1 || (powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs" & exit /b)
set "DIR=C:\EUDE-Complementos"
if not exist "%DIR%" mkdir "%DIR%"
powershell -NoProfile -Command "Invoke-WebRequest -UseBasicParsing https://eude-votacion.netlify.app/addin/manifest.xml -OutFile '%DIR%\votacion-eude.xml'"
net share EUDE-Complementos /delete >nul 2>&1
net share EUDE-Complementos="%DIR%" /GRANT:Everyone,READ >nul 2>&1 || net share EUDE-Complementos="%DIR%" /GRANT:Todos,READ
set "K=HKCU\Software\Microsoft\Office\16.0\WEF\TrustedCatalogs\{8e70c87c-0b7a-4d34-9b86-e2bb76e70241}"
reg add "%K%" /v Id /t REG_SZ /d "{8e70c87c-0b7a-4d34-9b86-e2bb76e70241}" /f >nul
reg add "%K%" /v Url /t REG_SZ /d "\\%COMPUTERNAME%\EUDE-Complementos" /f >nul
reg add "%K%" /v Flags /t REG_DWORD /d 1 /f >nul
echo.
echo Listo. Cierra PowerPoint por completo y vuelve a abrirlo.
echo Despues: Insertar ^> Complementos ^> Mis complementos ^> CARPETA COMPARTIDA ^> Votacion EUDE
pause
