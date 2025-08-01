import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface LiveKitCredentials {
  apiKey: string;
  apiSecret: string;
}

interface ApiKeyModalProps {
  onCredentialsSet: (credentials: LiveKitCredentials) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ApiKeyModal = ({ onCredentialsSet, isOpen, onOpenChange }: ApiKeyModalProps) => {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved credentials from localStorage
  useState(() => {
    const saved = localStorage.getItem('livekit_credentials');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setApiKey(parsed.apiKey || '');
        setApiSecret(parsed.apiSecret || '');
      } catch (error) {
        console.error('Failed to load saved credentials:', error);
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate credentials format
      if (!apiKey.trim() || !apiSecret.trim()) {
        throw new Error('Both API Key and API Secret are required');
      }

      const credentials = { apiKey: apiKey.trim(), apiSecret: apiSecret.trim() };
      
      // Save to localStorage
      localStorage.setItem('livekit_credentials', JSON.stringify(credentials));
      
      // Pass to parent
      onCredentialsSet(credentials);
      onOpenChange(false);
      
    } catch (error) {
      console.error('Error setting credentials:', error);
      alert('Please check your credentials and try again');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCredentials = () => {
    localStorage.removeItem('livekit_credentials');
    setApiKey('');
    setApiSecret('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-saffron" />
            <span>LiveKit Credentials</span>
          </DialogTitle>
        </DialogHeader>

        <Card className="p-4 bg-muted/50 border-l-4 border-l-saffron">
          <div className="flex items-start space-x-2">
            <div className="text-saffron mt-0.5">⚠️</div>
            <div className="text-sm">
              <p className="font-medium mb-1">Security Notice</p>
              <p className="text-muted-foreground">
                These credentials will be stored in your browser's localStorage. 
                For production apps, use Supabase for secure secret management.
              </p>
            </div>
          </div>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">LiveKit API Key</Label>
            <Input
              id="apiKey"
              type="text"
              placeholder="API7U9LhgAtAGDo..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiSecret">LiveKit API Secret</Label>
            <div className="relative">
              <Input
                id="apiSecret"
                type={showSecret ? 'text' : 'password'}
                placeholder="fEIfj3x6WEaI0ByJ3mmM5aEZK8NdH9fOidIk5UN3H1aB..."
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowSecret(!showSecret)}
              >
                {showSecret ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Setting up...' : 'Connect to LiveKit'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={clearCredentials}
            >
              Clear
            </Button>
          </div>
        </form>

        <div className="text-xs text-muted-foreground mt-4 space-y-1">
          <p>• Get your credentials from the LiveKit Cloud dashboard</p>
          <p>• URL: wss://aimanthan-3mucbuid.livekit.cloud</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};