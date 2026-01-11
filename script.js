import { RealtimeAgent } from '@openai/agents/realtime';

const voiceCircle = document.getElementById('voiceCircle');
const microphoneButton = document.getElementById('microphoneButton');
let agent = null;
let isConnected = false;

// Inicializar el botón como inactivo
microphoneButton.classList.add('inactive');

// Función para obtener la API key de forma segura desde el servidor
async function getApiKey() {
  try {
    const response = await fetch('/api/auth');
    if (!response.ok) {
      throw new Error('Error al obtener autenticación del servidor');
    }
    
    const data = await response.json();
    
    if (data.success && data.apiKey) {
      return data.apiKey;
    }
    
    throw new Error('No se pudo obtener la API key del servidor');
  } catch (error) {
    console.error('Error al obtener API key:', error);
    throw error;
  }
}

// Función para inicializar el agente
async function initializeAgent() {
  try {
    const apiKey = await getApiKey();
    
    if (!apiKey) {
      throw new Error('No se pudo obtener la API key. Verifica la configuración en Vercel.');
    }
    
    // Crear el agente con las instrucciones personalizadas
    // El SDK automáticamente usará WebRTC en el navegador
    const agentConfig = {
      name: 'Asistente de Voz',
      apiKey: apiKey,
      instructions: `# Personalidad y Tono
## Identidad
Eres un asistente de voz amigable y útil. Eres paciente, comprensivo y siempre estás listo para ayudar.

## Tarea
Tu tarea principal es ayudar al usuario de manera conversacional y natural, respondiendo a sus preguntas y proporcionando asistencia cuando sea necesario.

## Demeanor
Sé paciente, amigable y empático. Muestra interés genuino en ayudar al usuario.

## Tono
Usa un tono cálido y conversacional. Sé natural y accesible.

## Nivel de Entusiasmo
Mantén un nivel moderado de entusiasmo - no demasiado exagerado, pero tampoco monótono.

## Nivel de Formalidad
Usa un lenguaje casual pero respetuoso. Puedes ser amigable sin ser demasiado informal.

## Nivel de Emoción
Sé expresivo pero apropiado. Muestra comprensión y empatía cuando sea necesario.

## Palabras de Relleno
Ocasionalmente puedes usar palabras de relleno como "um" o "eh" para sonar más natural, pero no exageres.

## Ritmo
Habla a un ritmo natural y cómodo. No te apresures, pero tampoco seas demasiado lento.

# Instrucciones
- Si el usuario proporciona información importante como nombres, números o detalles específicos, repítelos de vuelta para confirmar que entendiste correctamente.
- Si el usuario corrige algo, reconoce la corrección de manera directa y confirma la nueva información.
- Mantén las respuestas concisas pero completas.
- Si no estás seguro de algo, admítelo honestamente.
- Sé útil y proactivo en tus respuestas.`,
      model: 'gpt-4o-realtime-preview',
    };

    agent = new RealtimeAgent(agentConfig);

    // Configurar eventos del agente
    agent.on('conversation.item.input_audio_buffer.committed', () => {
      console.log('Audio del usuario recibido');
      if (!isConnected) {
        isConnected = true;
        updateUI(true);
      }
    });

    agent.on('conversation.item.output_audio.delta', () => {
      if (!isConnected) {
        isConnected = true;
        updateUI(true);
      }
    });

    agent.on('conversation.item.completed', () => {
      console.log('Conversación completada');
    });

    agent.on('error', (error) => {
      console.error('Error en el agente:', error);
      isConnected = false;
      updateUI(false);
      
      // Mensaje de error más específico
      if (error.message && error.message.includes('API key')) {
        alert('Error de autenticación. Por favor, verifica que OPENAI_API_KEY esté configurada en Vercel.');
      } else {
        alert('Error en la conexión. Por favor, intenta de nuevo.');
      }
    });

    agent.on('disconnect', () => {
      console.log('Desconectado del agente');
      isConnected = false;
      updateUI(false);
    });

    console.log('Agente inicializado correctamente');
    return true;

  } catch (error) {
    console.error('Error al inicializar el agente:', error);
    alert('Error al conectar con el asistente de voz. Por favor, verifica tu conexión y la configuración de la API key.');
    return false;
  }
}

// Función para actualizar la UI según el estado de conexión
function updateUI(connected) {
  if (connected) {
    voiceCircle.classList.add('listening');
    microphoneButton.classList.remove('inactive');
    microphoneButton.classList.add('active');
  } else {
    voiceCircle.classList.remove('listening');
    microphoneButton.classList.remove('active');
    microphoneButton.classList.add('inactive');
  }
}

// Función para iniciar la conversación
async function startConversation() {
  if (!agent) {
    const initialized = await initializeAgent();
    if (!initialized) {
      return;
    }
  }

  try {
    await agent.connect();
    isConnected = true;
    updateUI(true);
    console.log('Conversación iniciada');
  } catch (error) {
    console.error('Error al iniciar conversación:', error);
    
    if (error.message && error.message.includes('API key')) {
      alert('Error de autenticación. Por favor, verifica que OPENAI_API_KEY esté configurada correctamente en las variables de entorno de Vercel.');
    } else {
      alert('Error al iniciar la conversación. Por favor, intenta de nuevo.');
    }
    
    updateUI(false);
  }
}

// Función para detener la conversación
async function stopConversation() {
  if (agent && isConnected) {
    try {
      await agent.disconnect();
      isConnected = false;
      updateUI(false);
      console.log('Conversación detenida');
    } catch (error) {
      console.error('Error al detener conversación:', error);
      updateUI(false);
    }
  }
}

// Controlar el micrófono con el botón
microphoneButton.addEventListener('click', async () => {
  if (!isConnected) {
    await startConversation();
  } else {
    await stopConversation();
  }
});

// Verificar compatibilidad del navegador
if (typeof window !== 'undefined') {
  // Verificar si el navegador soporta WebRTC (necesario para el SDK)
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.warn('Tu navegador no soporta WebRTC');
    microphoneButton.style.cursor = 'not-allowed';
    microphoneButton.addEventListener('click', () => {
      alert('Tu navegador no soporta las funciones necesarias. Por favor, usa Chrome, Edge o Firefox actualizado.');
    });
  } else {
    // Solicitar permisos de micrófono al cargar la página
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        console.log('Permisos de micrófono concedidos');
      })
      .catch((error) => {
        console.warn('Permisos de micrófono no concedidos:', error);
        microphoneButton.style.cursor = 'not-allowed';
      });
  }
}
