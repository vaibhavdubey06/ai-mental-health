import React, { useState, useEffect } from 'react';
import { X, Play, Pause } from 'lucide-react';

interface BreathingExerciseProps {
  onClose: () => void;
}

const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (phase === 'inhale') {
              setPhase('hold');
              return 4;
            } else if (phase === 'hold') {
              setPhase('exhale');
              return 6;
            } else {
              setPhase('inhale');
              setCycle(c => c + 1);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
    }
  };

  const getCircleScale = () => {
    if (phase === 'inhale') return 'scale-150';
    if (phase === 'hold') return 'scale-150';
    return 'scale-100';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Breathing Exercise</h2>
          <p className="text-gray-600">Take a moment to center yourself</p>
        </div>
        
        <div className="flex flex-col items-center space-y-8">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <div className={`
              w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 
              transition-transform duration-1000 ease-in-out ${getCircleScale()}
              shadow-lg
            `}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-lg">{timeLeft}</span>
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{getPhaseText()}</h3>
            <p className="text-sm text-gray-600">Cycle {cycle}</p>
          </div>
          
          <button
            onClick={() => setIsActive(!isActive)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-2xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isActive ? 'Pause' : 'Start'}</span>
          </button>
          
          <p className="text-xs text-gray-500 text-center max-w-xs">
            Follow the circle's rhythm: breathe in for 4 seconds, hold for 4 seconds, breathe out for 6 seconds.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BreathingExercise;