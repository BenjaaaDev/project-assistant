# Script para hacer commit y push automático a GitHub
# Uso: .\deploy.ps1 "mensaje del commit"

param(
    [Parameter(Mandatory=$false)]
    [string]$mensaje = "Actualización automática"
)

Write-Host "🔄 Agregando cambios..." -ForegroundColor Cyan
git add .

Write-Host "💾 Haciendo commit..." -ForegroundColor Cyan
git commit -m $mensaje

Write-Host "🚀 Subiendo a GitHub..." -ForegroundColor Cyan
git push

Write-Host "✅ ¡Cambios subidos exitosamente!" -ForegroundColor Green
