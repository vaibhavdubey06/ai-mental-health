import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Heart, Sparkles, Volume2, VolumeX, FileText } from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';
import Message from './Message';
import BreathingExercise from './BreathingExercise';
import { generateTherapistResponse } from '../utils/aiResponses';
import { speakText, stopSpeaking } from '../utils/speechSynthesis';
import { getUserInput, getUserInputHistory } from '../utils/deepgramTranscription';
import { getGroqResponse } from '../utils/groqChat';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const TherapistChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showUserInput, setShowUserInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTranscription = async (transcript: string) => {
    if (!transcript.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: transcript,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Get AI response from Groq
      const aiResponse = await getGroqResponse(transcript);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsProcessing(false);
      // Speak the response
      setIsSpeaking(true);
      speakText(aiResponse, () => setIsSpeaking(false));
    } catch (error) {
      setIsProcessing(false);
      const errorMessage = error instanceof Error ? error.message : 'Failed to get AI response.';
      setMessages(prev => [...prev, {
        id: (Date.now() + 2).toString(),
        text: errorMessage,
        isUser: false,
        timestamp: new Date(),
      }]);
    }
  };

  const handleStartChat = () => {
    setHasStarted(true);
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      text: "Hello, I'm Serene, your AI therapy companion. I'm here to listen and provide a safe space for you to share your thoughts and feelings. How are you doing today?",
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
    
    // Speak welcome message
    setIsSpeaking(true);
    speakText(welcomeMessage.text, () => setIsSpeaking(false));
  };

  const handleStopSpeaking = () => {
    stopSpeaking();
    setIsSpeaking(false);
  };

  const UserInputModal = () => {
    const currentInput = getUserInput();
    const inputHistory = getUserInputHistory();

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">User Input Data</h2>
            <button
              onClick={() => setShowUserInput(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Current User Input:</h3>
              <p className="text-blue-700">{currentInput?.text || 'No input saved yet'}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Input History ({inputHistory.length} entries):</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {inputHistory.length > 0 ? (
                  inputHistory.slice(-10).reverse().map((input: any, index: number) => (
                    <div key={index} className="bg-white p-3 rounded border-l-4 border-blue-400">
                      <p className="text-sm text-gray-700">{input.text}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(input.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No input history available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!hasStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Serene</h1>
              <p className="text-gray-600 mb-6">Your AI Therapy Companion</p>
            </div>
            
            <p className="text-gray-700 mb-8 leading-relaxed">
              Welcome to a safe, judgment-free space where you can share your thoughts and feelings. 
              I'm here to listen and provide gentle guidance whenever you need it.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleStartChat}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Begin Our Conversation
              </button>
              
              <button
                onClick={() => setShowBreathing(true)}
                className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 px-6 rounded-2xl font-medium hover:from-green-500 hover:to-blue-600 transform hover:scale-105 transition-all duration-200"
              >
                Start Breathing Exercise
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Powered by Deepgram for voice transcription</p>
              <p className="text-xs text-gray-400">Please ensure you have a Deepgram API key configured</p>
            </div>
          </div>
        </div>
        
        {showBreathing && (
          <BreathingExercise onClose={() => setShowBreathing(false)} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-white/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Serene</h1>
              <p className="text-sm text-gray-600">Always here to listen</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isSpeaking && (
              <button
                onClick={handleStopSpeaking}
                className="p-2 bg-red-100 hover:bg-red-200 rounded-full transition-colors"
                title="Stop speaking"
              >
                <VolumeX className="w-5 h-5 text-red-600" />
              </button>
            )}
            <button
              onClick={() => setShowUserInput(true)}
              className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
              title="View saved user input"
            >
              <FileText className="w-5 h-5 text-blue-600" />
            </button>
            <button
              onClick={() => setShowBreathing(true)}
              className="p-2 bg-green-100 hover:bg-green-200 rounded-full transition-colors"
              title="Breathing exercise"
            >
              <Sparkles className="w-5 h-5 text-green-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-4 py-3 max-w-xs">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-600">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Recorder */}
      <div className="p-4 bg-white/50 backdrop-blur-sm border-t border-white/20">
        <VoiceRecorder
          onTranscription={handleTranscription}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          disabled={isProcessing}
        />
      </div>
      
      {showBreathing && (
        <BreathingExercise onClose={() => setShowBreathing(false)} />
      )}
      
      {showUserInput && <UserInputModal />}
    </div>
  );
};

export default TherapistChat;