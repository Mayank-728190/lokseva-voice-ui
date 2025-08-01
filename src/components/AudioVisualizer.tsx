import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useVoiceStore } from '@/stores/voiceStore';

interface AudioVisualizerProps {
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AudioVisualizer = ({ 
  isActive = false, 
  size = 'md',
  className = '' 
}: AudioVisualizerProps) => {
  const { audioLevel, isRecording, isSpeaking } = useVoiceStore();
  const [bars, setBars] = useState<number[]>([]);

  const sizeClasses = {
    sm: { container: 'h-8 w-16', bar: 'w-1' },
    md: { container: 'h-12 w-24', bar: 'w-1.5' },
    lg: { container: 'h-16 w-32', bar: 'w-2' }
  };

  const barCount = size === 'sm' ? 8 : size === 'md' ? 12 : 16;

  useEffect(() => {
    if (isActive || isRecording || isSpeaking) {
      const interval = setInterval(() => {
        const newBars = Array.from({ length: barCount }, () => {
          const baseHeight = audioLevel * 100;
          const randomVariation = Math.random() * 30;
          return Math.max(10, Math.min(100, baseHeight + randomVariation));
        });
        setBars(newBars);
      }, 100);

      return () => clearInterval(interval);
    } else {
      setBars(Array(barCount).fill(10));
    }
  }, [isActive, isRecording, isSpeaking, audioLevel, barCount]);

  return (
    <div className={`${sizeClasses[size].container} flex items-end justify-center space-x-1 ${className}`}>
      {bars.map((height, index) => (
        <motion.div
          key={index}
          className={`audio-bar ${sizeClasses[size].bar} ${isActive ? 'active' : ''}`}
          initial={{ height: '10%' }}
          animate={{ 
            height: isActive || isRecording || isSpeaking ? `${height}%` : '10%',
            opacity: isActive || isRecording || isSpeaking ? 1 : 0.3
          }}
          transition={{
            duration: 0.1,
            ease: 'easeOut',
            delay: index * 0.05
          }}
        />
      ))}
    </div>
  );
};