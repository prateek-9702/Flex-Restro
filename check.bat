@echo off
echo Checking frontends:
for %%d in (web-app admin-panel qr-page) do (
  if exist frontend\%%d\node_modules (
    echo %%d: node_modules exists
  ) else (
    echo %%d: node_modules missing
  )
  if exist frontend\%%d\build (
    echo %%d: build exists
  ) else (
    echo %%d: build missing
  )
)
echo.
echo Checking services:
for %%d in (auth-service restaurant-service menu-service order-service payment-service analytics-service qr-service admin-service notification-service connector-service) do (
  if exist services\%%d\node_modules (
    echo %%d: node_modules exists
  ) else (
    echo %%d: node_modules missing
  )
  if exist services\%%d\dist (
    echo %%d: dist exists
  ) else (
    echo %%d: dist missing
  )
)
