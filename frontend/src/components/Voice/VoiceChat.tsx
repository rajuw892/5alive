// frontend/src/components/Voice/VoiceChat.tsx
import React, { useEffect, useState } from 'react';
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Phone, PhoneOff } from 'lucide-react';
import { useVoice } from '../../contexts/VoiceContext';

interface VoiceChatProps {
  roomId: string;
  userId: string;
  username: string;
  onError?: (error: string) => void;
}

const APP_ID = import.meta.env.VITE_AGORA_APP_ID || 'a017a84c07a846eda3bb5b0466e88f73';

export const VoiceChat: React.FC<VoiceChatProps> = ({
  roomId,
  userId,
  username,
  onError,
}) => {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [speakingUsers, setSpeakingUsers] = useState<Set<string>>(new Set());
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Initialize Agora client
  useEffect(() => {
    const agoraClient = AgoraRTC.createClient({
      mode: 'rtc',
      codec: 'vp8',
    });

    setClient(agoraClient);

    // Set up event listeners
    agoraClient.on('user-published', async (user, mediaType) => {
      await agoraClient.subscribe(user, mediaType);
      console.log('Subscribe success:', user.uid);

      if (mediaType === 'audio') {
        user.audioTrack?.play();
      }

      setRemoteUsers((prev) => {
        const exists = prev.find((u) => u.uid === user.uid);
        if (exists) return prev;
        return [...prev, user];
      });
    });

    agoraClient.on('user-unpublished', (user) => {
      console.log('User unpublished:', user.uid);
      setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
    });

    agoraClient.on('user-left', (user) => {
      console.log('User left:', user.uid);
      setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
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

  // Join channel
  const joinChannel = async () => {
    if (!client || isJoined) return;

    setIsConnecting(true);
    setConnectionError(null);
    try {
      console.log('🔊 Attempting to join voice channel...');
      console.log('  - Room ID:', roomId);
      console.log('  - User ID:', userId);

      // Fetch token from backend
      console.log('🔑 Fetching voice token from server...');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const tokenResponse = await fetch(`${API_URL}/api/voice/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          channelName: roomId,
          uid: userId,
        }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch voice token from server');
      }

      const tokenData = await tokenResponse.json();
      console.log('✅ Received token from server');
      console.log('  - APP_ID:', tokenData.appId);
      console.log('  - Expires at:', new Date(tokenData.expiresAt * 1000).toLocaleString());

      // Join the channel with token
      await client.join(tokenData.appId, roomId, tokenData.token, userId);
      console.log('✅ Successfully joined Agora channel');

      // Create and publish local audio track
      console.log('🎤 Creating microphone audio track...');
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack({
        encoderConfig: 'music_standard',
      });
      console.log('✅ Microphone track created');

      setLocalAudioTrack(audioTrack);

      // Publish the track
      console.log('📡 Publishing audio track...');
      await client.publish([audioTrack]);
      console.log('✅ Audio track published');

      setIsJoined(true);
      setConnectionError(null);
      console.log('✅ Voice channel fully connected!');
    } catch (error: any) {
      console.error('❌ Failed to join voice channel:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack
      });

      let errorMessage = 'Failed to join voice channel';
      if (error.code === 'INVALID_PARAMS') {
        errorMessage = 'Invalid voice chat configuration. Please check your settings.';
      } else if (error.code === 'CAN_NOT_GET_GATEWAY_SERVER') {
        errorMessage = 'Cannot connect to voice server. Please check your internet connection.';
      } else if (error.message?.includes('permission')) {
        errorMessage = 'Microphone permission denied. Please allow microphone access.';
      } else if (error.message?.includes('NotAllowedError')) {
        errorMessage = 'Microphone access denied. Please grant permission in your browser.';
      } else if (error.message?.includes('NotFoundError')) {
        errorMessage = 'No microphone found. Please connect a microphone and try again.';
      }

      setConnectionError(errorMessage);
      onError?.(errorMessage);
      setIsJoined(false);
    } finally {
      setIsConnecting(false);
    }
  };

  // Leave channel
  const leaveChannel = async () => {
    if (!client || !isJoined) return;

    try {
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
        setLocalAudioTrack(null);
      }

      await client.leave();
      setIsJoined(false);
      setRemoteUsers([]);
      console.log('Left voice channel');
    } catch (error) {
      console.error('Failed to leave channel:', error);
    }
  };

  // Toggle mute
  const toggleMute = async () => {
    if (!localAudioTrack) return;

    const newMutedState = !isMuted;
    await localAudioTrack.setEnabled(!newMutedState);
    setIsMuted(newMutedState);
  };

  // Toggle speaker
  const toggleSpeaker = () => {
    remoteUsers.forEach((user) => {
      if (user.audioTrack) {
        if (isSpeakerMuted) {
          user.audioTrack.play();
        } else {
          user.audioTrack.stop();
        }
      }
    });
    setIsSpeakerMuted(!isSpeakerMuted);
  };

  // Auto-join when client is ready
  useEffect(() => {
    if (client && !isJoined && !isConnecting) {
      console.log('🎯 Client ready, attempting to join voice channel...');
      joinChannel();
    }

    // Cleanup on unmount
    return () => {
      if (client && isJoined) {
        console.log('🧹 Cleaning up voice connection...');
        if (localAudioTrack) {
          localAudioTrack.stop();
          localAudioTrack.close();
        }
        client.leave().catch(err => console.error('Error leaving channel:', err));
      }
    };
  }, [client]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 shadow-2xl border border-white/10 backdrop-blur-xl"
      >
        {/* Status Indicator */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isJoined
                  ? 'bg-green-500 animate-pulse'
                  : isConnecting
                  ? 'bg-yellow-500 animate-pulse'
                  : 'bg-red-500'
              }`}
            />
            <span className="text-white text-sm font-semibold">
              {isJoined
                ? 'Voice Connected'
                : isConnecting
                ? 'Connecting...'
                : 'Disconnected'}
            </span>
          </div>
          {!isJoined && !isConnecting && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={joinChannel}
              className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-all"
            >
              Reconnect
            </motion.button>
          )}
        </div>

        {/* Error Message */}
        {connectionError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 p-2 bg-red-500/20 border border-red-500/50 rounded-lg"
          >
            <p className="text-red-200 text-xs">{connectionError}</p>
          </motion.div>
        )}

        {/* Active Users */}
        <div className="mb-3 max-h-32 overflow-y-auto">
          <AnimatePresence>
            {remoteUsers.map((user) => (
              <motion.div
                key={user.uid}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`flex items-center gap-2 mb-2 p-2 rounded-lg transition-all ${
                  speakingUsers.has(String(user.uid))
                    ? 'bg-green-500/20 border border-green-500/50'
                    : 'bg-white/5'
                }`}
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {String(user.uid).substring(0, 2).toUpperCase()}
                  </div>
                  {speakingUsers.has(String(user.uid)) && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                      className="absolute -bottom-1 -right-1"
                    >
                      🔊
                    </motion.div>
                  )}
                </div>
                <span className="text-white text-sm">
                  User {String(user.uid).substring(0, 6)}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>

          {remoteUsers.length === 0 && isJoined && (
            <div className="text-gray-400 text-xs text-center py-2">
              No other users in voice chat
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {/* Mute/Unmute */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMute}
            disabled={!isJoined}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-semibold transition-all ${
              isMuted
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span className="text-xs">{isMuted ? 'Muted' : 'Mic On'}</span>
          </motion.button>

          {/* Speaker Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSpeaker}
            disabled={!isJoined}
            className={`flex items-center justify-center py-2 px-3 rounded-xl font-semibold transition-all ${
              isSpeakerMuted
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSpeakerMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </motion.button>

          {/* Leave */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={leaveChannel}
            disabled={!isJoined}
            className="flex items-center justify-center py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PhoneOff className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Local Status */}
        {isJoined && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 pt-3 border-t border-white/10"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
                You
              </div>
              <span className="text-white text-xs font-semibold">{username}</span>
              {speakingUsers.has(userId) && (
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  🎤
                </motion.span>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
