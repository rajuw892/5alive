// frontend/src/hooks/useVoiceChat.ts
import { useState, useEffect, useCallback } from 'react';
import AgoraRTC, {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';

interface UseVoiceChatOptions {
  roomId: string;
  userId: string;
  enabled: boolean;
}

export const useVoiceChat = ({ roomId, userId, enabled }: UseVoiceChatOptions) => {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [speakingUsers, setSpeakingUsers] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  // Initialize Agora client
  useEffect(() => {
    const agoraClient = AgoraRTC.createClient({
      mode: 'rtc',
      codec: 'vp8',
    });

    setClient(agoraClient);

    // Set up event listeners
    agoraClient.on('user-published', async (user, mediaType) => {
      try {
        await agoraClient.subscribe(user, mediaType);
        console.log('✅ Subscribed to user:', user.uid);

        if (mediaType === 'audio') {
          user.audioTrack?.play();
        }
      } catch (err) {
        console.error('❌ Failed to subscribe:', err);
      }
    });

    agoraClient.on('user-unpublished', (user) => {
      console.log('👋 User unpublished:', user.uid);
    });

    agoraClient.on('user-left', (user) => {
      console.log('👋 User left:', user.uid);
    });

    // Monitor speaking users
    agoraClient.enableAudioVolumeIndicator();
    agoraClient.on('volume-indicator', (volumes) => {
      const speaking = new Set<string>();
      volumes.forEach((volume) => {
        if (volume.level > 10) {
          speaking.add(String(volume.uid));
        }
      });
      setSpeakingUsers(speaking);
    });

    return () => {
      agoraClient.removeAllListeners();
    };
  }, []);

  // Join voice channel
  const connect = useCallback(async () => {
    if (!client) {
      console.error('❌ No Agora client available');
      return;
    }

    if (!userId || userId.trim() === '') {
      console.error('❌ Cannot connect: userId is empty');
      setError('User ID is not available');
      return;
    }

    if (!roomId || roomId.trim() === '') {
      console.error('❌ Cannot connect: roomId is empty');
      setError('Room ID is not available');
      return;
    }

    if (isConnected) {
      console.log('ℹ️ Already connected to voice');
      return;
    }

    if (isConnecting) {
      console.log('ℹ️ Already connecting...');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      console.log('🔊 Starting voice connection...');
      console.log('  - Room ID:', roomId);
      console.log('  - User ID:', userId);

      // Fetch token from backend
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      console.log('  - API URL:', API_URL);

      const response = await fetch(`${API_URL}/api/voice/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelName: roomId,
          uid: userId,
        }),
      });

      console.log('  - Token response status:', response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Token fetch failed:', errorData);
        throw new Error(`Failed to get voice token: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('✅ Got token response:', {
        hasToken: !!responseData.token,
        hasAppId: !!responseData.appId,
        testMode: responseData.testMode
      });

      const { token, appId } = responseData;

      // Join channel
      console.log('🔗 Joining Agora channel...');
      await client.join(appId, roomId, token, userId);
      console.log('✅ Joined voice channel successfully');

      // Create and publish audio track
      console.log('🎤 Creating microphone track...');
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
        encoderConfig: 'music_standard',
      });
      console.log('✅ Microphone track created');

      setLocalAudioTrack(audioTrack);

      console.log('📡 Publishing audio track...');
      await client.publish([audioTrack]);
      console.log('✅ Audio track published');

      setIsConnected(true);
      setError(null);
      console.log('🎉 Voice connection complete!');
    } catch (err: any) {
      console.error('❌ Voice connection failed:', err);
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        name: err.name
      });

      let errorMessage = 'Failed to connect to voice';
      if (err.message?.includes('permission')) {
        errorMessage = 'Microphone permission denied';
      } else if (err.message?.includes('NotAllowedError')) {
        errorMessage = 'Please allow microphone access';
      } else if (err.message?.includes('NotFoundError')) {
        errorMessage = 'No microphone found';
      } else if (err.code) {
        errorMessage = `Connection error: ${err.code}`;
      }

      setError(errorMessage);
      setIsConnected(false);

      // Show alert to user
      alert(`Voice call failed: ${errorMessage}`);
    } finally {
      setIsConnecting(false);
    }
  }, [client, isConnected, isConnecting, roomId, userId]);

  // Leave voice channel
  const disconnect = useCallback(async () => {
    if (!client || !isConnected) return;

    try {
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
        setLocalAudioTrack(null);
      }

      await client.leave();
      setIsConnected(false);
      setSpeakingUsers(new Set());
      console.log('👋 Left voice channel');
    } catch (err) {
      console.error('❌ Failed to leave channel:', err);
    }
  }, [client, isConnected, localAudioTrack]);

  // Toggle mute
  const toggleMute = useCallback(async () => {
    if (!localAudioTrack) return;

    const newMutedState = !isMuted;
    await localAudioTrack.setEnabled(!newMutedState);
    setIsMuted(newMutedState);
    console.log(newMutedState ? '🔇 Muted' : '🔊 Unmuted');
  }, [localAudioTrack, isMuted]);

  // Auto-connect when enabled
  useEffect(() => {
    if (enabled && !isConnected && !isConnecting && client) {
      connect();
    } else if (!enabled && isConnected) {
      disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
      }
      if (client && isConnected) {
        client.leave().catch(console.error);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isConnected,
    isMuted,
    isConnecting,
    speakingUsers,
    error,
    connect,
    disconnect,
    toggleMute,
  };
};
