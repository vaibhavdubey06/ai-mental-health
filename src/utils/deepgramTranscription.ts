export interface TranscriptionResult {
  success: boolean;
  text?: string;
  error?: string;
}

const getDeepgramApiKey = (): string => {
  const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY;
  
  if (!apiKey || apiKey === 'your_deepgram_api_key_here') {
    throw new Error('Please set your Deepgram API key in the .env file. Replace "your_deepgram_api_key_here" with your actual API key from https://console.deepgram.com/');
  }
  
  return apiKey;
};

export const transcribeAudio = async (audioBlob: Blob): Promise<TranscriptionResult> => {
  try {
    const apiKey = getDeepgramApiKey();
    
    // Convert audio blob to the format Deepgram expects
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.webm');
    
    const response = await fetch('https://api.deepgram.com/v1/listen', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Deepgram API error:', response.status, errorText);
      
      if (response.status === 401) {
        return {
          success: false,
          error: 'Invalid Deepgram API key. Please check your API key configuration.'
        };
      }
      
      if (response.status === 429) {
        return {
          success: false,
          error: 'Deepgram API rate limit exceeded. Please try again in a moment.'
        };
      }
      
      if (response.status === 400) {
        return {
          success: false,
          error: 'Invalid audio format. Please try recording again.'
        };
      }
      
      return {
        success: false,
        error: `Deepgram API error: ${response.status} ${response.statusText}`
      };
    }
    
    const result = await response.json();
    
    // Extract transcript from Deepgram response
    const transcript = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript;
    
    if (!transcript || transcript.trim() === '') {
      return {
        success: false,
        error: 'No speech detected in the audio. Please try speaking more clearly.'
      };
    }
    
    return {
      success: true,
      text: transcript.trim()
    };
    
  } catch (error) {
    console.error('Transcription error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return {
          success: false,
          error: 'Deepgram API key is not configured. Please add your API key to the .env file.'
        };
      }
      
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        return {
          success: false,
          error: 'Network error. Please check your internet connection and try again.'
        };
      }
      
      return {
        success: false,
        error: error.message
      };
    }
    
    return {
      success: false,
      error: 'Failed to transcribe audio. Please try again.'
    };
  }
};

export const saveUserInput = (text: string): void => {
  const timestamp = new Date().toISOString();
  const sessionId = getSessionId();
  
  const userInput = {
    text,
    timestamp,
    sessionId,
    id: Date.now().toString()
  };
  
  // Save current user input
  localStorage.setItem('user_input', JSON.stringify(userInput));
  
  // Save to history
  const history = getUserInputHistory();
  history.unshift(userInput);
  
  // Keep only last 50 entries
  const trimmedHistory = history.slice(0, 50);
  localStorage.setItem('user_input_history', JSON.stringify(trimmedHistory));
};

export const getUserInput = () => {
  const stored = localStorage.getItem('user_input');
  return stored ? JSON.parse(stored) : null;
};

export const getUserInputHistory = () => {
  const stored = localStorage.getItem('user_input_history');
  return stored ? JSON.parse(stored) : [];
};

const getSessionId = (): string => {
  let sessionId = localStorage.getItem('therapy_session_id');
  if (!sessionId) {
    sessionId = Date.now().toString();
    localStorage.setItem('therapy_session_id', sessionId);
  }
  return sessionId;
};