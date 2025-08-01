import { motion } from 'framer-motion';
import { Mic, MicOff, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceStore } from '@/stores/voiceStore';
import { AudioVisualizer } from './AudioVisualizer';

interface MicButtonProps {
  onToggleRecording: () => void;
  className?: string;
}

export const MicButton = ({ onToggleRecording, className = '' }: MicButtonProps) => {
  const { isRecording, agentStatus, connectionStatus, isAudioEnabled } = useVoiceStore();

  const isConnected = connectionStatus === 'connected';
  const isListening = agentStatus === 'listening';
  const isSpeaking = agentStatus === 'speaking';
  const isThinking = agentStatus === 'thinking';

  const getButtonState = () => {
    if (!isConnected) return 'disabled';
    if (isRecording) return 'recording';
    if (isSpeaking) return 'speaking';
    if (isThinking) return 'thinking';
    return 'idle';
  };

  const buttonState = getButtonState();

  const buttonVariants = {
    idle: { scale: 1, rotate: 0 },
    recording: { scale: 1.1, rotate: 0 },
    speaking: { scale: 1.05, rotate: 0 },
    thinking: { scale: 1, rotate: 0 },
    disabled: { scale: 0.95, rotate: 0 }
  };

  const getStatusText = () => {
    switch (buttonState) {
      case 'recording': return 'Listening...';
      case 'speaking': return 'Speaking...';
      case 'thinking': return 'Thinking...';
      case 'disabled': return 'Connect to start';
      default: return 'Tap to speak';
    }
  };

  const getIcon = () => {
    if (!isAudioEnabled) return <MicOff className="w-8 h-8" />;
    if (isRecording) return <Square className="w-6 h-6" />;
    return <Mic className="w-8 h-8" />;
  };

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Audio Visualizer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isListening || isSpeaking ? 1 : 0.3,
          scale: isListening || isSpeaking ? 1 : 0.8
        }}
        className="flex justify-center"
      >
        <AudioVisualizer 
          isActive={isListening || isSpeaking} 
          size="lg"
        />
      </motion.div>

      {/* Main Mic Button */}
      <motion.div
        variants={buttonVariants}
        animate={buttonState}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="relative"
      >
        <Button
          size="lg"
          disabled={!isConnected}
          onClick={onToggleRecording}
          className={`
            w-20 h-20 rounded-full transition-all duration-300 border-4 border-white/20
            ${buttonState === 'recording' ? 'mic-button-active animate-mic-active' :
              buttonState === 'speaking' ? 'bg-status-thinking hover:bg-status-thinking/90' :
              buttonState === 'thinking' ? 'bg-status-thinking animate-pulse hover:bg-status-thinking/90' :
              buttonState === 'disabled' ? 'mic-button-inactive opacity-50 cursor-not-allowed' :
              'mic-button-inactive hover:scale-105'
            }
          `}
        >
          {getIcon()}
        </Button>

        {/* Status Ring */}
        {isConnected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: buttonState === 'recording' ? [1, 1.2, 1] : 1,
              opacity: buttonState === 'recording' ? [0.5, 0.2, 0.5] : 0.3
            }}
            transition={{ 
              duration: buttonState === 'recording' ? 1.5 : 0.3,
              repeat: buttonState === 'recording' ? Infinity : 0,
              ease: 'easeInOut'
            }}
            className="absolute inset-0 rounded-full border-4 border-saffron"
          />
        )}
      </motion.div>

      {/* Status Text */}
      <motion.p
        key={buttonState}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-sm font-medium ${
          buttonState === 'recording' ? 'text-saffron' :
          buttonState === 'speaking' ? 'text-status-thinking' :
          buttonState === 'thinking' ? 'text-status-thinking' :
          'text-muted-foreground'
        }`}
      >
        {getStatusText()}
      </motion.p>

      {/* Connection Hint */}
      {!isConnected && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-muted-foreground text-center max-w-48"
        >
          Connect to the LokSeva AI service to start your voice conversation
        </motion.p>
      )}
    </div>
  );
};