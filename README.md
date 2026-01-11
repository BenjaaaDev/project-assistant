# Asistente de Voz IA

Una aplicación web para hablar con una IA usando voz en tiempo real, construida con OpenAI Realtime API y el SDK de Agents.

## Características

- 🎤 Conversación de voz en tiempo real con IA
- 🎨 Interfaz minimalista con animaciones suaves
- 🔊 Audio bidireccional usando WebRTC
- 🚀 Optimizado para deploy en Vercel

## Requisitos Previos

- Node.js 18 o superior
- Cuenta de OpenAI con acceso a la API
- Clave API de OpenAI

## Configuración Local

1. Clona el repositorio:
```bash
git clone <tu-repositorio>
cd project-assistant
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env.local` en la raíz del proyecto:
```
OPENAI_API_KEY=tu_api_key_aqui
```

4. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

## Deploy en Vercel

### Paso 1: Configurar la API Key

**IMPORTANTE**: Debes configurar la variable de entorno `OPENAI_API_KEY` en Vercel antes de hacer deploy.

#### Opción A: Desde el Dashboard de Vercel (Recomendado)

1. Conecta tu repositorio de GitHub a Vercel
2. Ve a tu proyecto en Vercel
3. Navega a **Settings** → **Environment Variables**
4. Agrega una nueva variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Tu clave de API de OpenAI (comienza con `sk-`)
   - Selecciona todos los ambientes (Production, Preview, Development)
5. Guarda los cambios

#### Opción B: Usando Vercel CLI

1. Instala Vercel CLI:
```bash
npm i -g vercel
```

2. Inicia sesión:
```bash
vercel login
```

3. Configura la variable de entorno:
```bash
vercel env add OPENAI_API_KEY
```
Cuando te pregunte, ingresa tu API key de OpenAI.

4. Despliega:
```bash
vercel --prod
```

### Paso 2: Configurar el Proyecto en Vercel

Cuando conectes tu repositorio o crees un nuevo proyecto, Vercel te pedirá configurar:

1. **Framework Preset**: Selecciona **"Other"** o **"Static Site"**
   - No es necesario un framework específico ya que usamos HTML estático con API routes

2. **Root Directory**: Deja en blanco (o usa `./` si te lo pide)

3. **Build Command**: Deja en blanco o usa:
   ```
   npm run build
   ```
   (El proyecto no requiere build, pero el comando existe en package.json)

4. **Output Directory**: ⚠️ **IMPORTANTE**: Deja en blanco o usa `.` (punto)
   - NO pongas `dist`, `build`, `public` u otra carpeta
   - Los archivos están en la raíz del proyecto

5. **Install Command**: 
   ```
   npm install
   ```

### ⚠️ Si ves un error 404 después del deploy:

1. **Verifica el Output Directory**:
   - Ve a **Settings** → **General** en tu proyecto de Vercel
   - Busca "Output Directory"
   - Debe estar **vacío** o tener solo un punto `.`
   - Si tiene otra cosa, cámbialo y haz redeploy

2. **Verifica que los archivos estén en la raíz**:
   - `index.html` debe estar en la raíz del repositorio
   - No debe estar en una carpeta `public/` o `dist/`

3. **Haz un redeploy**:
   - Ve a **Deployments** en Vercel
   - Haz clic en los tres puntos del último deployment
   - Selecciona **Redeploy**

### Paso 3: Hacer Deploy

Una vez configurada la variable de entorno y el proyecto, puedes hacer deploy:

- **Automático**: Si conectaste tu repositorio, Vercel desplegará automáticamente en cada push
- **Manual**: Usa `vercel --prod` desde la CLI

## Estructura del Proyecto

```
project-assistant/
├── api/
│   └── auth.js              # Endpoint para autenticación segura
├── app/
│   ├── microphone.svg       # Icono de micrófono activo
│   └── no-microphone.svg    # Icono de micrófono inactivo
├── index.html               # Página principal
├── script.js                # Lógica del agente de voz (módulo ES6)
├── styles.css               # Estilos y animaciones
├── package.json             # Dependencias del proyecto
├── vercel.json              # Configuración de Vercel
└── README.md                # Este archivo
```

## Tecnologías Utilizadas

- **OpenAI Agents SDK**: SDK oficial para crear agentes de voz
- **OpenAI Realtime API**: API para conversación de voz en tiempo real
- **WebRTC**: Protocolo para comunicación de audio de baja latencia
- **Vercel**: Plataforma de hosting y deployment

## Uso

1. Abre la aplicación en tu navegador
2. Haz clic en el botón del micrófono para iniciar la conversación
3. Habla con la IA - ella te responderá por voz
4. Haz clic nuevamente para detener la conversación

## Notas Importantes

- ⚠️ **Seguridad**: El endpoint `/api/auth` actualmente expone la API key al cliente. Para producción, considera implementar:
  - Tokens JWT temporales con expiración corta
  - Un proxy del servidor que maneje todas las requests
  - Autenticación de usuario antes de proporcionar acceso
  
- La aplicación requiere permisos de micrófono del navegador
- Funciona mejor en Chrome, Edge o Firefox actualizado
- La API key debe estar configurada en las variables de entorno de Vercel
- El modelo usado es `gpt-4o-realtime-preview` que requiere acceso especial a la API de OpenAI
- El SDK de Agents usa WebRTC automáticamente para baja latencia

## Solución de Problemas

### Error: "OPENAI_API_KEY no está configurada"
- Verifica que hayas agregado la variable de entorno en Vercel
- Asegúrate de que el nombre de la variable sea exactamente `OPENAI_API_KEY`

### Error: "Tu navegador no soporta WebRTC"
- Usa un navegador moderno (Chrome, Edge, Firefox)
- Asegúrate de que tu navegador esté actualizado

### No se escucha audio
- Verifica los permisos de micrófono en tu navegador
- Asegúrate de que tu micrófono esté funcionando
- Revisa la consola del navegador para errores

## Licencia

MIT
