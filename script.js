const voiceCircle = document.getElementById('voiceCircle');
const microphoneButton = document.getElementById('microphoneButton');
let isListening = false;
let recognition = null;

// Inicializar el botón como inactivo
microphoneButton.classList.add('inactive');

// Verificar si el navegador soporta reconocimiento de voz
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
        isListening = true;
        voiceCircle.classList.add('listening');
        microphoneButton.classList.remove('inactive');
        microphoneButton.classList.add('active');
        console.log('Escuchando...');
    };

    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        console.log('Has dicho:', transcript);
        // Aquí puedes agregar la lógica para enviar el texto a una IA
    };

    recognition.onerror = (event) => {
        console.error('Error en reconocimiento de voz:', event.error);
        isListening = false;
        voiceCircle.classList.remove('listening');
        microphoneButton.classList.remove('active');
        microphoneButton.classList.add('inactive');
    };

    recognition.onend = () => {
        isListening = false;
        voiceCircle.classList.remove('listening');
        microphoneButton.classList.remove('active');
        microphoneButton.classList.add('inactive');
    };

    // Controlar el micrófono con el botón
    microphoneButton.addEventListener('click', () => {
        if (!isListening) {
            recognition.start();
        } else {
            recognition.stop();
        }
    });
} else {
    console.warn('Tu navegador no soporta reconocimiento de voz');
    microphoneButton.style.cursor = 'not-allowed';
    microphoneButton.addEventListener('click', () => {
        alert('Tu navegador no soporta reconocimiento de voz. Por favor, usa Chrome o Edge.');
    });
}
