let currentUtterance: SpeechSynthesisUtterance | null = null;

export const speakText = (text: string, onEnd?: () => void): void => {
  if ('speechSynthesis' in window) {
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings for a calm, therapeutic tone
    utterance.rate = 0.8; // Slightly slower for calmness
    utterance.pitch = 1.0; // Normal pitch
    utterance.volume = 0.8; // Slightly quieter
    
    // Try to use a female voice if available (often perceived as more comforting)
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('woman') ||
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('alex')
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onend = () => {
      currentUtterance = null;
      if (onEnd) onEnd();
    };
    
    utterance.onerror = () => {
      currentUtterance = null;
      if (onEnd) onEnd();
    };
    
    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }
};

export const stopSpeaking = (): void => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
};

export const isSpeaking = (): boolean => {
  return 'speechSynthesis' in window && window.speechSynthesis.speaking;
};