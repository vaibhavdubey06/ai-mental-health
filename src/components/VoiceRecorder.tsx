import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, AlertCircle, Loader } from 'lucide-react';
import { transcribeAudio, saveUserInput } from '../utils/deepgramTranscription';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  disabled?: boolean;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscription,
  isRecording,
  setIsRecording,
  disabled
}) => {
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Check if MediaRecorder is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
      setIsSupported(false);
      setError('Audio recording is not supported in your browser');
    }

    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    if (!isSupported || disabled || isTranscribing) return;

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      streamRef.current = stream;
      audioChunksRef.current = [];

      // Create MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }

        // Transcribe using Deepgram
        if (audioBlob.size > 0) {
          setIsTranscribing(true);
          setError(null); // Clear any previous errors
          
          try {
            const result = await transcribeAudio(audioBlob);
            
            if (result.success && result.text && result.text.trim()) {
              // Save the transcribed text as user_input
              saveUserInput(result.text);
              onTranscription(result.text);
            } else {
              setError(result.error || 'Failed to transcribe audio. Please try again.');
            }
          } catch (err) {
            console.error('Transcription error:', err);
            setError(err instanceof Error ? err.message : 'Failed to transcribe audio. Please try again.');
          }
          
          setIsTranscribing(false);
        }
      };

      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setError('Recording error occurred');
        setIsRecording(false);
      };

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      setError(null);

    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Microphone access denied. Please allow microphone access to use voice chat.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  if (!isSupported) {
    return (
      <div className="text-center p-4">
        <div className="flex items-center justify-center space-x-2 text-amber-600 mb-2">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">Voice recording not supported in this browser</span>
        </div>
        <p className="text-xs text-gray-500">Please try Chrome, Safari, or Edge</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {error && (
        <div className="flex items-start space-x-2 text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg max-w-md text-left">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span className="break-words">{error}</span>
        </div>
      )}
      
      <div className="flex items-center space-x-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled || isTranscribing}
          className={`
            w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-lg
            ${isRecording 
              ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse shadow-red-200' 
              : disabled || isTranscribing
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-blue-200'
            }
          `}
        >
          {isTranscribing ? (
            <Loader className="w-8 h-8 text-white animate-spin" />
          ) : isRecording ? (
            <MicOff className="w-8 h-8 text-white" />
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </button>
      </div>
      
      <div className="text-center">
        <p className="text-sm font-medium text-gray-700">
          {isTranscribing 
            ? 'Transcribing...' 
            : isRecording 
            ? 'Recording...' 
            : 'Tap to speak'
          }
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {isTranscribing 
            ? 'Processing your voice with Deepgram AI...'
            : isRecording 
            ? 'Speak naturally, I\'m here to listen' 
            : 'Share what\'s on your mind'
          }
        </p>
      </div>
      
      {isRecording && (
        <div className="flex items-center space-x-1">
          <div className="w-1 h-4 bg-red-400 rounded-full animate-pulse"></div>
          <div className="w-1 h-6 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-1 h-8 bg-red-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1 h-6 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
          <div className="w-1 h-4 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      )}

      {isTranscribing && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
            <Loader className="w-4 h-4 text-blue-600 animate-spin" />
            <span className="text-sm text-blue-700">Using Deepgram AI to understand your voice...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;