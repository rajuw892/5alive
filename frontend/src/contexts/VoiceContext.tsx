// frontend/src/contexts/VoiceContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface VoiceContextType {
  isJoined: boolean;
  setIsJoined: (joined: boolean) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  speakingUsers: Set<string>;
  setSpeakingUsers: (users: Set<string>) => void;
  remoteUsers: string[];
  setRemoteUsers: (users: string[]) => void;
}

const VoiceContext = createContext<VoiceContextType | null>(null);

export const VoiceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speakingUsers, setSpeakingUsers] = useState<Set<string>>(new Set());
  const [remoteUsers, setRemoteUsers] = useState<string[]>([]);

  return (
    <VoiceContext.Provider
      value={{
        isJoined,
        setIsJoined,
        isMuted,
        setIsMuted,
        speakingUsers,
        setSpeakingUsers,
        remoteUsers,
        setRemoteUsers,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};
