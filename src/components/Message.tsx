import React from 'react';
import { Heart, User } from 'lucide-react';

interface MessageProps {
  message: {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
  };
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start space-x-3 max-w-xs sm:max-w-md lg:max-w-lg ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
          ${message.isUser 
            ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
            : 'bg-gradient-to-br from-blue-400 to-purple-500'
          }
        `}>
          {message.isUser ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Heart className="w-4 h-4 text-white" />
          )}
        </div>
        
        <div className={`
          rounded-2xl px-4 py-3 backdrop-blur-sm border border-white/20 shadow-sm
          ${message.isUser 
            ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' 
            : 'bg-white/70 text-gray-800'
          }
        `}>
          <p className="text-sm leading-relaxed">{message.text}</p>
          <p className={`text-xs mt-2 ${message.isUser ? 'text-purple-100' : 'text-gray-500'}`}>
            {formatTime(message.timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Message;