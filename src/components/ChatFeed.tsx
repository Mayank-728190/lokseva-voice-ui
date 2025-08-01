import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useVoiceStore } from '@/stores/voiceStore';
import { ChatBubble } from './ChatBubble';
import { TypingIndicator } from './TypingIndicator';

export const ChatFeed = () => {
  const { messages, currentTranscript, agentStatus } = useVoiceStore();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, currentTranscript]);

  const isThinking = agentStatus === 'thinking';

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-border bg-card/50">
        <h2 className="text-lg font-semibold text-card-foreground">Conversation</h2>
        <p className="text-sm text-muted-foreground">
          Speak naturally with LokSeva AI assistant
        </p>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {/* Welcome Message */}
            {messages.length === 0 && !currentTranscript && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-saffron to-green rounded-full flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    🎙️
                  </motion.div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Welcome to LokSeva AI
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  I'm here to help you with government services and information. 
                  Press the microphone button and start speaking.
                </p>
              </motion.div>
            )}

            {/* Chat Messages */}
            {messages.map((message, index) => (
              <ChatBubble
                key={message.id}
                message={message}
                isLatest={index === messages.length - 1}
              />
            ))}

            {/* Live Transcript */}
            {currentTranscript && (
              <motion.div
                key="live-transcript"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex justify-start"
              >
                <div className="max-w-[80%]">
                  <div className="chat-bubble-transcript p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-status-listening rounded-full animate-pulse" />
                      <span className="text-xs font-medium opacity-70">
                        Listening...
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground italic">
                      {currentTranscript}
                      <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="ml-1"
                      >
                        |
                      </motion.span>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Thinking Indicator */}
            {isThinking && (
              <motion.div
                key="thinking"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex justify-start"
              >
                <TypingIndicator />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </ScrollArea>

      {/* Input Area (Optional - for text fallback) */}
      <div className="p-4 border-t border-border bg-card/30">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 bg-status-connected rounded-full" />
          <span>Voice conversation active • Tap mic to speak</span>
        </div>
      </div>
    </div>
  );
};