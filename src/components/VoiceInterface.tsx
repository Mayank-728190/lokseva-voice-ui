import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Wifi, Settings, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useVoiceStore } from '@/stores/voiceStore';
import { LiveKitService } from '@/services/livekitService';
import { Header } from './Header';
import { MicButton } from './MicButton';
import { ChatFeed } from './ChatFeed';
import { StatusBar } from './StatusBar';
import { AudioVisualizer } from './AudioVisualizer';

// LiveKit configuration - replace with your actual values
const LIVEKIT_CONFIG = {
  url: 'wss://aimanthan-3mucbuid.livekit.cloud',
  // Note: In production, tokens should be generated server-side
  token: '', // Will be generated dynamically
  roomName: 'lokseva-ai-room'
};

export const VoiceInterface = () => {
  const { toast } = useToast();
  const livekitServiceRef = useRef<LiveKitService | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  
  const {
    connectionStatus,
    agentStatus,
    isRecording,
    setConnectionStatus,
    setAgentStatus,
    setRecording,
    addMessage,
    updateCurrentTranscript,
    clearCurrentTranscript,
    setAudioLevel,
    setRoomName,
    setToken
  } = useVoiceStore();

  // Initialize LiveKit service
  useEffect(() => {
    if (!livekitServiceRef.current) {
      livekitServiceRef.current = new LiveKitService(
        // onTranscriptReceived
        (transcript: string, isFinal: boolean) => {
          if (isFinal) {
            addMessage({
              type: 'user',
              content: transcript,
              isComplete: true
            });
            clearCurrentTranscript();
            setRecording(false);
            setAgentStatus('thinking');
          } else {
            updateCurrentTranscript(transcript);
          }
        },
        
        // onAgentReply
        (reply: string) => {
          addMessage({
            type: 'agent',
            content: reply,
            isComplete: true
          });
          setAgentStatus('speaking');
          
          // Reset to idle after speaking (simulate TTS completion)
          setTimeout(() => {
            setAgentStatus('idle');
          }, 2000);
        },
        
        // onStatusChange
        (status) => {
          setConnectionStatus(status);
          
          if (status === 'connected') {
            toast({
              title: 'Connected',
              description: 'Successfully connected to LokSeva AI',
            });
          } else if (status === 'error') {
            toast({
              title: 'Connection Error',
              description: 'Failed to connect to LokSeva AI service',
              variant: 'destructive',
            });
          }
        },
        
        // onAudioLevel
        (level: number) => {
          setAudioLevel(level);
        }
      );
    }

    return () => {
      if (livekitServiceRef.current) {
        livekitServiceRef.current.disconnect();
      }
    };
  }, []);

  const connectToRoom = async () => {
    if (!livekitServiceRef.current || isInitializing) return;

    setIsInitializing(true);
    setConnectionStatus('connecting');

    try {
      // Generate a simple token for demo purposes
      // In production, this should be done server-side with proper JWT
      const demoToken = generateDemoToken();
      
      const config = {
        ...LIVEKIT_CONFIG,
        token: demoToken
      };

      setToken(demoToken);
      setRoomName(config.roomName);

      const connected = await livekitServiceRef.current.connect(config);
      
      if (connected) {
        // Enable microphone after connection
        await livekitServiceRef.current.enableMicrophone();
        
        // Add welcome message
        setTimeout(() => {
          addMessage({
            type: 'agent',
            content: 'Hello! I\'m your LokSeva AI assistant. How can I help you with government services today?',
            isComplete: true
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Connection failed:', error);
      setConnectionStatus('error');
      toast({
        title: 'Connection Failed',
        description: 'Unable to connect to LokSeva AI. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsInitializing(false);
    }
  };

  const handleToggleRecording = async () => {
    if (!livekitServiceRef.current || connectionStatus !== 'connected') {
      await connectToRoom();
      return;
    }

    if (isRecording) {
      // Stop recording
      await livekitServiceRef.current.disableMicrophone();
      setRecording(false);
      setAgentStatus('thinking');
    } else {
      // Start recording
      await livekitServiceRef.current.enableMicrophone();
      setRecording(true);
      setAgentStatus('listening');
      clearCurrentTranscript();
    }
  };

  const handleReconnect = async () => {
    if (livekitServiceRef.current) {
      await livekitServiceRef.current.disconnect();
    }
    setTimeout(() => {
      connectToRoom();
    }, 1000);
  };

  // Generate a demo token (replace with server-side implementation)
  const generateDemoToken = () => {
    // This is a simplified token for demo purposes
    // In production, use proper JWT with your LiveKit credentials
    return `demo_token_${Date.now()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Left Panel - Media & Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Main Voice Control */}
            <Card className="p-6 text-center bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-lg font-semibold mb-6 text-card-foreground">
                  Voice Assistant
                </h3>
                
                <MicButton 
                  onToggleRecording={handleToggleRecording}
                  className="mb-6"
                />
                
                {/* Connection Controls */}
                {connectionStatus !== 'connected' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <Button
                      onClick={connectToRoom}
                      disabled={isInitializing}
                      className="w-full"
                      size="lg"
                    >
                      <Wifi className="w-4 h-4 mr-2" />
                      {isInitializing ? 'Connecting...' : 'Connect to LokSeva AI'}
                    </Button>
                  </motion.div>
                )}
                
                {connectionStatus === 'connected' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <Button
                      variant="outline"
                      onClick={handleReconnect}
                      className="w-full"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reconnect
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </Card>

            {/* Status Panel */}
            <StatusBar />
            
            {/* Audio Visualization */}
            <Card className="p-6 bg-gradient-to-br from-audio-bg to-card/80">
              <h4 className="text-sm font-medium mb-4 text-card-foreground">
                Audio Activity
              </h4>
              <div className="flex justify-center">
                <AudioVisualizer 
                  isActive={isRecording || agentStatus === 'speaking'}
                  size="lg"
                />
              </div>
            </Card>
          </div>

          {/* Right Panel - Chat */}
          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-200px)] bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
              <ChatFeed />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};