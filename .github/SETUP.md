# 🤖 Claude AI Code Review Setup

## Configuración de Secrets

Para habilitar las reviews automáticas con Claude AI, necesitas configurar estos secrets en tu repositorio:

### 1. Ir a Settings del repositorio
```
https://github.com/yagomateos/habitflow/settings/secrets/actions
```

### 2. Añadir secrets necesarios

#### CLAUDE_API_KEY (Opcional - para reviews avanzadas)
```bash
# Cuando tengas acceso a la API de Claude, añade:
CLAUDE_API_KEY=tu-api-key-aqui
```

#### GITHUB_TOKEN (Automático)
- Ya está configurado automáticamente por GitHub Actions
- No necesitas añadirlo manualmente

## Workflows Creados

### 1. `code-review.yml` - Review Básico
- ✅ Análisis de diff automático
- 📊 Estadísticas de cambios
- 💬 Comentarios automáticos en PR

### 2. `claude-review.yml` - Review Avanzado
- 🔍 Análisis inteligente de patrones
- ⚠️ Detección de issues comunes
- 📝 Recomendaciones específicas
- 🤖 Comentarios detallados

## Cómo Funciona

1. **Abres una PR** → Se activa el workflow automáticamente
2. **Analiza cambios** → Revisa diff y archivos modificados
3. **Genera review** → Claude analiza el código
4. **Comenta en PR** → Añade feedback automático
5. **Actualiza automáticamente** → Si haces más commits

## Personalización

### Modificar archivos analizados
En `claude-review.yml` línea 32:
```bash
git diff --name-only origin/${{ github.base_ref }}...HEAD | grep -E '\.(ts|tsx|js|jsx)$'
```

### Añadir más checks
En el script de review, puedes añadir:
```javascript
if (diff.includes('useState')) {
  issues.push('🪝 Consider useCallback for state handlers');
}
```

## Testing

Para probar el workflow:
1. Crea una branch nueva
2. Haz algunos cambios
3. Abre una PR
4. Ve los comentarios automáticos

## Próximos Pasos

- [ ] Configurar API key de Claude cuando esté disponible
- [ ] Personalizar reglas de review específicas
- [ ] Añadir análisis de performance
- [ ] Integrar con herramientas de testing