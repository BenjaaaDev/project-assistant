#!/bin/bash
# Script para hacer commit y push automático a GitHub
# Uso: ./deploy.sh "mensaje del commit"

MENSAJE=${1:-"Actualización automática"}

echo "🔄 Agregando cambios..."
git add .

echo "💾 Haciendo commit..."
git commit -m "$MENSAJE"

echo "🚀 Subiendo a GitHub..."
git push

echo "✅ ¡Cambios subidos exitosamente!"
