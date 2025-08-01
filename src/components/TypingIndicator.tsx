import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export const TypingIndicator = () => {
  return (
    <div className="max-w-[80%]">
      <div className="chat-bubble-agent p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Bot className="w-4 h-4" />
          <span className="text-xs font-medium opacity-90">
            LokSeva AI
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <span className="text-sm opacity-80">Thinking</span>
          <div className="flex space-x-1 ml-2">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-1.5 h-1.5 bg-white/60 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};