# OVERTOOLS — sitio web

Incluye:
- Landing page responsive con identidad oscura y acentos azul/morado.
- Verificación Cloudflare Turnstile validada en servidor antes del OAuth.
- Inicio de sesión Discord, perfil básico y cierre de sesión.
- Lectura de comandos slash registrados en Discord.
- Páginas separadas de Términos y Privacidad.
- Esquema SQL inicial para tickets y Staff en Supabase.

## Antes de publicar
1. Sube esta carpeta a GitHub y conecta el repositorio a Netlify.
2. En Netlify usa `public` como Publish directory. Netlify detectará `netlify/functions`.
3. En Discord Developer Portal registra exactamente:
   `https://TU-DOMINIO/.netlify/functions/auth-callback`
   Scopes: `identify guilds.join`.
4. Configura en Netlify todas las variables de `.env.example`.
5. En Turnstile agrega el hostname exacto de tu web y copia Site Key y Secret Key.
6. Cambia `SESSION_SECRET` por un valor aleatorio largo.
7. Para añadir usuarios al servidor, el bot debe estar en el servidor y tener los permisos requeridos por Discord.
8. Ejecuta `supabase/schema.sql` en el SQL Editor de Supabase si vas a preparar la base de datos de soporte.

## Importante sobre el alcance
Este ZIP contiene el sitio público, autenticación y consulta de comandos. El módulo web de tickets (crear/ver/responder/subir imágenes) y el panel de gestión de Staff todavía no están implementados; el SQL incluido solo prepara sus tablas. No actives ni anuncies esas funciones como disponibles hasta completar su API e interfaz.

## Logo
Se utiliza una marca temporal de texto “OT”. El archivo original del logo no estaba disponible en los archivos accesibles al generar este paquete; reemplaza la marca por el logo oficial cuando lo tengas en el repositorio.

## Seguridad
Nunca subas `.env`, tokens, secretos OAuth, la clave privada de Turnstile, la Service Role Key de Supabase ni la URL del webhook a GitHub. Si una URL de webhook se compartió públicamente, revócala y crea otra.
