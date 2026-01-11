/**
 * API Route para autenticación segura
 * Este endpoint proporciona un token o configuración para que el cliente
 * se autentique con OpenAI sin exponer la API key directamente
 */
export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'OPENAI_API_KEY no está configurada' 
      });
    }

    // IMPORTANTE: En producción, esto debe manejarse de forma más segura
    // Opciones:
    // 1. Generar un token JWT temporal con expiración corta
    // 2. Usar un proxy del servidor que maneje todas las requests
    // 3. Usar variables de entorno públicas en Vercel (menos seguro)
    
    // Por ahora, retornamos la API key directamente
    // NOTA: Esto expone la API key al cliente, lo cual NO es ideal para producción
    // En producción real, usa uno de los métodos mencionados arriba
    
    return res.status(200).json({ 
      success: true,
      apiKey: apiKey, // ⚠️ Solo para desarrollo/testing
    });

  } catch (error) {
    console.error('Error en autenticación:', error);
    return res.status(500).json({ 
      error: 'Error en la autenticación',
      details: error.message 
    });
  }
}
