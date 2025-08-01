import { motion } from 'framer-motion';
import { Shield, Globe, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVoiceStore } from '@/stores/voiceStore';

export const Header = () => {
  const { language, setLanguage, connectionStatus } = useVoiceStore();

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'हिंदी' },
    { value: 'hi-en', label: 'Hinglish' },
  ];

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="tricolor-border bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center space-x-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-12 h-12 bg-gradient-to-br from-saffron to-green rounded-full flex items-center justify-center shadow-lg"
            >
              <Shield className="w-6 h-6 text-white" />
            </motion.div>
            
            <div>
              <h1 className="text-2xl font-bold text-primary">LokSeva AI</h1>
              <p className="text-sm text-muted-foreground">Voice Assistant for Citizens</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-status-connected animate-pulse' :
                connectionStatus === 'connecting' ? 'bg-status-thinking animate-pulse' :
                connectionStatus === 'error' ? 'bg-status-error' :
                'bg-muted'
              }`} />
              <span className="text-sm font-medium capitalize">{connectionStatus}</span>
            </div>

            {/* Action Buttons */}
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="sm">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};