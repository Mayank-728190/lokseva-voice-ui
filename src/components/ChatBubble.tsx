import { motion } from 'framer-motion';
import { Play, Pause, Volume2, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMessage } from '@/stores/voiceStore';
import { useState } from 'react';

interface ChatBubbleProps {
  message: ChatMessage;
  isLatest?: boolean;
}

export const ChatBubble = ({ message, isLatest = false }: ChatBubbleProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handlePlayAudio = () => {
    // TODO: Implement TTS playback
    setIsPlaying(!isPlaying);
  };

  const getBubbleVariant = () => {
    switch (message.type) {
      case 'user':
        return 'chat-bubble-user';
      case 'agent':
        return 'chat-bubble-agent';
      case 'transcript':
        return 'chat-bubble-transcript';
      default:
        return 'chat-bubble-transcript';
    }
  };

  const getIcon = () => {
    switch (message.type) {
      case 'user':
        return <User className="w-4 h-4" />;
      case 'agent':
        return <Bot className="w-4 h-4" />;
      default:
        return <Volume2 className="w-3 h-3 opacity-60" />;
    }
  };

  const getAlignment = () => {
    return message.type === 'user' ? 'justify-end' : 'justify-start';
  };

  const getAnimation = () => {
    return message.type === 'user' ? 'slide-in-right' : 'slide-in-left';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: message.type === 'user' ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex w-full ${getAlignment()}`}
    >
      <div className={`max-w-[80%] ${message.type === 'transcript' ? 'w-full' : ''}`}>
        <div className={`${getBubbleVariant()} p-4 relative group`}>
          {/* Message Header */}
          <div className="flex items-center space-x-2 mb-2">
            {getIcon()}
            <span className="text-xs font-medium opacity-90">
              {message.type === 'user' ? 'You' : 
               message.type === 'agent' ? 'LokSeva AI' : 'Live Transcript'}
            </span>
            <span className="text-xs opacity-60 ml-auto">
              {formatTime(message.timestamp)}
            </span>
          </div>

          {/* Message Content */}
          <div className="space-y-2">
            <p className={`text-sm leading-relaxed ${
              message.type === 'transcript' ? 'italic' : ''
            } ${
              !message.isComplete && message.type === 'transcript' ? 'opacity-70' : ''
            }`}>
              {message.content}
              {!message.isComplete && message.type === 'transcript' && (
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="ml-1"
                >
                  ●
                </motion.span>
              )}
            </p>

            {/* Agent Reply Controls */}
            {message.type === 'agent' && (
              <div className="flex items-center space-x-2 pt-2 border-t border-white/20">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePlayAudio}
                  className="h-8 px-2 text-white/80 hover:text-white hover:bg-white/10"
                >
                  {isPlaying ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                  <span className="ml-1 text-xs">
                    {isPlaying ? 'Pause' : 'Play'}
                  </span>
                </Button>
              </div>
            )}
          </div>

          {/* Incomplete Indicator */}
          {!message.isComplete && message.type !== 'transcript' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -bottom-1 -right-1 w-3 h-3 bg-status-thinking rounded-full animate-pulse"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};