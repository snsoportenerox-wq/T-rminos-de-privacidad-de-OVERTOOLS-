OVERTOOLS — CENTRO LEGAL
========================

ARCHIVOS
- index.html: página y documentos legales.
- styles.css: diseño adaptable a móviles.
- app.js: inicio de sesión con Google usando Firebase Authentication.
- logo-overt​ools.jpg: logo proporcionado para OVERTOOLS.

CONFIGURAR FIREBASE
1. Entra en https://console.firebase.google.com/ y crea un proyecto.
2. Añade una aplicación web y copia la configuración que Firebase muestra.
3. En Authentication > Sign-in method, habilita Google.
4. En Authentication > Settings > Authorized domains, añade el dominio donde publicarás la web.
5. Abre app.js y reemplaza TU_API_KEY, TU_PROJECT_ID y TU_APP_ID por los valores reales.
   El authDomain debe ser el indicado por Firebase para tu proyecto.
6. Publica los archivos en un hosting que sirva la página por HTTPS.
   Para probar localmente, usa un servidor local; no abras index.html directamente como archivo.

IMPORTANTE ANTES DE PUBLICAR
- La Política de Privacidad contiene campos [PENDIENTES] que deben completarse.
- Confirma qué datos almacena realmente el bot, dónde se guardan, por cuánto tiempo y qué proveedores los procesan.
- Añade una fecha real de publicación y un contacto oficial.
- Los textos incluidos son una plantilla inicial, no una revisión legal.
- Recomendación: publica los documentos legales en URLs accesibles sin iniciar sesión. La autenticación puede usarse para funciones de cuenta o para registrar una aceptación, pero no debería ser una barrera para leer la política antes de iniciar sesión.

NOTA DE SEGURIDAD
Firebase Authentication gestiona el inicio de sesión en el navegador. No guardes contraseñas de Google ni claves privadas en estos archivos. La configuración web de Firebase identifica el proyecto, pero la seguridad de los datos requiere reglas y configuración correctas en los servicios que utilices.
