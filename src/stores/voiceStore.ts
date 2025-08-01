import { create } from 'zustand';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';
export type AgentStatus = 'idle' | 'listening' | 'thinking' | 'speaking';

export interface ChatMessage {
  id: string;
  type: 'user' | 'agent' | 'transcript';
  content: string;
  timestamp: Date;
  isComplete?: boolean;
}

export interface VoiceState {
  // Connection
  connectionStatus: ConnectionStatus;
  roomName: string;
  token: string | null;
  
  // Agent Status
  agentStatus: AgentStatus;
  isRecording: boolean;
  isSpeaking: boolean;
  
  // Chat
  messages: ChatMessage[];
  currentTranscript: string;
  
  // Settings
  language: string;
  volume: number;
  
  // Audio
  audioLevel: number;
  isAudioEnabled: boolean;
  
  // Actions
  setConnectionStatus: (status: ConnectionStatus) => void;
  setAgentStatus: (status: AgentStatus) => void;
  setRecording: (recording: boolean) => void;
  setSpeaking: (speaking: boolean) => void;
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  updateCurrentTranscript: (transcript: string) => void;
  clearCurrentTranscript: () => void;
  setLanguage: (language: string) => void;
  setVolume: (volume: number) => void;
  setAudioLevel: (level: number) => void;
  setAudioEnabled: (enabled: boolean) => void;
  setToken: (token: string) => void;
  setRoomName: (roomName: string) => void;
  clearMessages: () => void;
}

export const useVoiceStore = create<VoiceState>((set, get) => ({
  // Initial state
  connectionStatus: 'disconnected',
  roomName: '',
  token: null,
  agentStatus: 'idle',
  isRecording: false,
  isSpeaking: false,
  messages: [],
  currentTranscript: '',
  language: 'en',
  volume: 0.8,
  audioLevel: 0,
  isAudioEnabled: true,
  
  // Actions
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  
  setAgentStatus: (status) => set({ agentStatus: status }),
  
  setRecording: (recording) => set({ 
    isRecording: recording,
    agentStatus: recording ? 'listening' : 'idle'
  }),
  
  setSpeaking: (speaking) => set({ 
    isSpeaking: speaking,
    agentStatus: speaking ? 'speaking' : 'idle'
  }),
  
  addMessage: (message) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    };
    
    set((state) => ({
      messages: [...state.messages, newMessage]
    }));
  },
  
  updateCurrentTranscript: (transcript) => set({ currentTranscript: transcript }),
  
  clearCurrentTranscript: () => set({ currentTranscript: '' }),
  
  setLanguage: (language) => set({ language }),
  
  setVolume: (volume) => set({ volume }),
  
  setAudioLevel: (level) => set({ audioLevel: level }),
  
  setAudioEnabled: (enabled) => set({ isAudioEnabled: enabled }),
  
  setToken: (token) => set({ token }),
  
  setRoomName: (roomName) => set({ roomName }),
  
  clearMessages: () => set({ messages: [], currentTranscript: '' }),
}));