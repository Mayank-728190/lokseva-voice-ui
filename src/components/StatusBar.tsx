import { motion } from 'framer-motion';
import { Wifi, WifiOff, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useVoiceStore } from '@/stores/voiceStore';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

export const StatusBar = () => {
  const { 
    connectionStatus, 
    agentStatus, 
    isAudioEnabled, 
    volume, 
    setVolume, 
    setAudioEnabled 
  } = useVoiceStore();

  const getConnectionIcon = () => {
    return connectionStatus === 'connected' ? (
      <Wifi className="w-4 h-4 text-status-connected" />
    ) : (
      <WifiOff className="w-4 h-4 text-muted-foreground" />
    );
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected to LokSeva AI';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Connection Failed';
      default:
        return 'Disconnected';
    }
  };

  const getAgentStatusText = () => {
    switch (agentStatus) {
      case 'listening':
        return 'Listening to your voice';
      case 'thinking':
        return 'Processing your request';
      case 'speaking':
        return 'Responding to you';
      default:
        return 'Ready to help';
    }
  };

  const getStatusColor = () => {
    if (connectionStatus !== 'connected') return 'text-muted-foreground';
    
    switch (agentStatus) {
      case 'listening':
        return 'text-status-listening';
      case 'thinking':
        return 'text-status-thinking';
      case 'speaking':
        return 'text-status-connected';
      default:
        return 'text-foreground';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-lg p-4 space-y-4"
    >
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getConnectionIcon()}
          <div>
            <p className="text-sm font-medium">{getConnectionText()}</p>
            <p className={`text-xs ${getStatusColor()}`}>
              {getAgentStatusText()}
            </p>
          </div>
        </div>
        
        {connectionStatus === 'connected' && (
          <motion.div
            animate={agentStatus === 'listening' ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
            className={`w-3 h-3 rounded-full ${
              agentStatus === 'listening' ? 'bg-status-listening' :
              agentStatus === 'thinking' ? 'bg-status-thinking animate-pulse' :
              agentStatus === 'speaking' ? 'bg-status-connected' :
              'bg-muted'
            }`}
          />
        )}
      </div>

      {/* Audio Controls */}
      <div className="space-y-3 pt-3 border-t border-border">
        {/* Audio Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isAudioEnabled ? (
              <Mic className="w-4 h-4 text-foreground" />
            ) : (
              <MicOff className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">
              Microphone {isAudioEnabled ? 'On' : 'Off'}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAudioEnabled(!isAudioEnabled)}
            className="h-8"
          >
            {isAudioEnabled ? 'Disable' : 'Enable'}
          </Button>
        </div>

        {/* Volume Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {volume > 0 ? (
                <Volume2 className="w-4 h-4 text-foreground" />
              ) : (
                <VolumeX className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">Volume</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {Math.round(volume * 100)}%
            </span>
          </div>
          
          <Slider
            value={[volume]}
            onValueChange={(value) => setVolume(value[0])}
            max={1}
            step={0.1}
            className="w-full"
          />
        </div>
      </div>

      {/* Help Text */}
      <div className="pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          💡 <strong>Tip:</strong> Speak clearly and naturally. 
          The AI understands English, Hindi, and Hinglish.
        </p>
      </div>
    </motion.div>
  );
};