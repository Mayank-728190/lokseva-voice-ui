import { Room, RoomEvent, RemoteTrack, RemoteAudioTrack } from 'livekit-client';

export interface LiveKitConfig {
  url: string;
  token: string;
  roomName: string;
}

export class LiveKitService {
  private room: Room;
  private onTranscriptReceived: (transcript: string, isFinal: boolean) => void;
  private onAgentReply: (reply: string) => void;
  private onStatusChange: (status: 'connected' | 'disconnected' | 'error') => void;
  private onAudioLevel: (level: number) => void;

  constructor(
    onTranscriptReceived: (transcript: string, isFinal: boolean) => void,
    onAgentReply: (reply: string) => void,
    onStatusChange: (status: 'connected' | 'disconnected' | 'error') => void,
    onAudioLevel: (level: number) => void
  ) {
    this.room = new Room();
    this.onTranscriptReceived = onTranscriptReceived;
    this.onAgentReply = onAgentReply;
    this.onStatusChange = onStatusChange;
    this.onAudioLevel = onAudioLevel;
    
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Connection events
    this.room.on(RoomEvent.Connected, () => {
      console.log('Connected to LiveKit room');
      this.onStatusChange('connected');
    });

    this.room.on(RoomEvent.Disconnected, () => {
      console.log('Disconnected from LiveKit room');
      this.onStatusChange('disconnected');
    });

    this.room.on(RoomEvent.ConnectionStateChanged, (state) => {
      console.log('Connection state changed:', state);
      // Handle connection state changes
      try {
        if (state.toString().includes('failed') || state.toString().includes('closed')) {
          this.onStatusChange('error');
        } else if (state.toString().includes('reconnecting')) {
          this.onStatusChange('disconnected');
        }
      } catch (error) {
        console.error('Error handling connection state change:', error);
      }
    });

    // Data events for transcripts and replies
    this.room.on(RoomEvent.DataReceived, (payload: Uint8Array) => {
      try {
        const decoder = new TextDecoder();
        const data = JSON.parse(decoder.decode(payload));
        
        console.log('Received data:', data);
        
        // Handle different message types
        switch (data.type) {
          case 'transcript':
            this.onTranscriptReceived(data.text, data.is_final || false);
            break;
          case 'agent_reply':
          case 'response':
            this.onAgentReply(data.text || data.message);
            break;
          case 'audio_level':
            this.onAudioLevel(data.level || 0);
            break;
          default:
            console.log('Unknown data type:', data.type);
        }
      } catch (error) {
        console.error('Error parsing received data:', error);
      }
    });

    // Audio track events
    this.room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack) => {
      if (track.kind === 'audio') {
        const audioTrack = track as RemoteAudioTrack;
        const audioElement = audioTrack.attach();
        document.body.appendChild(audioElement);
        audioElement.play();
      }
    });

    // Audio level monitoring for local tracks
    this.room.on(RoomEvent.LocalTrackPublished, (publication) => {
      if (publication.track?.kind === 'audio') {
        // Monitor audio levels
        this.monitorAudioLevel(publication.track);
      }
    });
  }

  private monitorAudioLevel(track: any) {
    // Simple audio level monitoring
    const interval = setInterval(() => {
      if (!track || track.isMuted) {
        this.onAudioLevel(0);
        return;
      }
      
      // Simulate audio level - in real implementation, you'd analyze the audio stream
      const randomLevel = Math.random() * 0.8 + 0.1;
      this.onAudioLevel(randomLevel);
    }, 100);

    track.on('ended', () => {
      clearInterval(interval);
    });
  }

  async connect(config: LiveKitConfig) {
    try {
      console.log('Connecting to LiveKit with config:', { ...config, token: '***' });
      await this.room.connect(config.url, config.token);
      return true;
    } catch (error) {
      console.error('Failed to connect to LiveKit:', error);
      this.onStatusChange('error');
      return false;
    }
  }

  async enableMicrophone() {
    try {
      await this.room.localParticipant.setMicrophoneEnabled(true);
      return true;
    } catch (error) {
      console.error('Failed to enable microphone:', error);
      return false;
    }
  }

  async disableMicrophone() {
    try {
      await this.room.localParticipant.setMicrophoneEnabled(false);
      return true;
    } catch (error) {
      console.error('Failed to disable microphone:', error);
      return false;
    }
  }

  async sendMessage(message: string) {
    try {
      const data = JSON.stringify({
        type: 'user_message',
        text: message,
        timestamp: new Date().toISOString()
      });
      
      const encoder = new TextEncoder();
      await this.room.localParticipant.publishData(
        encoder.encode(data),
        { reliable: true }
      );
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }

  async disconnect() {
    try {
      await this.room.disconnect();
      this.onStatusChange('disconnected');
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  }

  isConnected() {
    return this.room.state === 'connected';
  }

  getRoom() {
    return this.room;
  }
}