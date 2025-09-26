# 🔧 Configuración de Supabase para Emails

## Problema: No llegan emails de confirmación

### Solución 1: Deshabilitar confirmación por email (Desarrollo)

1. **Ve a tu dashboard:** https://supabase.com/dashboard/project/sknsmnwxscgbjojpljie
2. **Authentication → Settings**
3. **Desactiva "Enable email confirmations"**
4. **Guarda cambios**

### Solución 2: Configurar SMTP personalizado (Producción)

#### Email Settings:
- **From email:** tu-email@dominio.com
- **From name:** HabitFlow
- **Reply-to:** noreply@dominio.com

#### SMTP Configuration:
```
Host: smtp.gmail.com (o tu proveedor)
Port: 587
Username: tu-email@gmail.com
Password: tu-app-password
```

### Solución 3: URLs de Redirect

#### Site URL:
```
https://gentlemanreactp-jfnxv880g-yagomateos-projects.vercel.app
```

#### Redirect URLs:
```
https://gentlemanreactp-*.vercel.app/**
http://localhost:8080/**
https://localhost:8080/**
```

### Verificar configuración

1. **Authentication → Users** - Ver usuarios registrados
2. **Authentication → Logs** - Ver logs de emails
3. **Settings → API** - Verificar keys

### Email Templates

Personalizar templates en **Authentication → Email Templates:**
- **Confirm signup**
- **Reset password**
- **Magic link**

## Testing

Después de configurar:

1. Registra una cuenta nueva
2. Revisa la consola del navegador para logs
3. Verifica en **Authentication → Users** si aparece el usuario
4. Si está deshabilitada la confirmación, debería funcionar inmediatamente

## Troubleshooting

- **Email no llega:** Revisa spam/promociones
- **URLs incorrectas:** Verifica redirect URLs
- **SMTP error:** Revisa configuración SMTP
- **Rate limiting:** Supabase limita emails en plan gratuito