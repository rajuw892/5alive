// frontend/src/pages/RoomList.tsx
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Lock, Play, RefreshCw, ArrowLeft, Clock, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';

interface RoomInfo {
  id: string;
  hostName: string;
  playerCount: number;
  maxPlayers: number;
  hasPassword: boolean;
  phase: 'waiting' | 'playing' | 'finished';
  createdAt: Date;
}

export const RoomList: React.FC = () => {
  const navigate = useNavigate();
  const { socket, joinRoom, isConnected } = useGame();
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    if (!socket) return;

    // Request room list
    socket.emit('get-rooms');

    // Listen for room list updates
    socket.on('rooms-list', (roomsList: RoomInfo[]) => {
      setRooms(roomsList);
      setLoading(false);
    });

    socket.on('room-update', () => {
      socket.emit('get-rooms');
    });

    return () => {
      socket.off('rooms-list');
      socket.off('room-update');
    };
  }, [socket]);

  const handleRefresh = () => {
    setLoading(true);
    socket?.emit('get-rooms');
  };

  const handleJoinRoom = (roomId: string, hasPassword: boolean) => {
    setSelectedRoom(roomId);
    if (hasPassword || !username) {
      setShowJoinModal(true);
    } else {
      joinRoom(roomId, username);
      navigate('/game');
    }
  };

  const handleModalJoin = () => {
    if (!username.trim() || !selectedRoom) return;
    joinRoom(selectedRoom, username, password || undefined);
    navigate('/game');
    setShowJoinModal(false);
  };

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-8 pt-4"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg font-semibold">Back</span>
          </button>

          <h1 className="text-4xl font-black text-white">Active Rooms</h1>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            <span className="font-semibold">Refresh</span>
          </button>
        </motion.div>

        {/* Connection Status */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-200 px-6 py-3 rounded-xl mb-6 text-center"
          >
            <span className="animate-pulse">⚠️</span> Connecting to server...
          </motion.div>
        )}

        {/* Room Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur rounded-2xl h-48 animate-pulse"
              />
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 text-center"
          >
            <div className="text-6xl mb-4">🎴</div>
            <h2 className="text-2xl font-bold text-white mb-2">No Active Rooms</h2>
            <p className="text-blue-200 mb-6">Be the first to create a room!</p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
            >
              Create Room
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence>
              {rooms.map((room, index) => (
                <motion.div
                  key={room.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all group"
                >
                  {/* Room Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Crown className="w-4 h-4 text-yellow-400" />
                        <span className="text-white font-bold">{room.hostName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-200">
                        <Clock className="w-3 h-3" />
                        <span>{getTimeAgo(room.createdAt)}</span>
                      </div>
                    </div>
                    {room.hasPassword && (
                      <Lock className="w-5 h-5 text-yellow-400" />
                    )}
                  </div>

                  {/* Room Code */}
                  <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-xl p-3 mb-4 text-center">
                    <div className="text-xs text-white/60 mb-1">ROOM CODE</div>
                    <div className="text-2xl font-black text-white font-mono tracking-wider">
                      {room.id.substring(0, 6).toUpperCase()}
                    </div>
                  </div>

                  {/* Room Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-300" />
                      <span className="text-white font-semibold">
                        {room.playerCount}/{room.maxPlayers}
                      </span>
                    </div>
                    <div>
                      {room.phase === 'waiting' ? (
                        <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-bold">
                          WAITING
                        </span>
                      ) : room.phase === 'playing' ? (
                        <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold">
                          IN GAME
                        </span>
                      ) : (
                        <span className="bg-gray-500/20 text-gray-300 px-3 py-1 rounded-full text-xs font-bold">
                          FINISHED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Join Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleJoinRoom(room.id, room.hasPassword)}
                    disabled={room.playerCount >= room.maxPlayers || room.phase !== 'waiting'}
                    className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      room.playerCount >= room.maxPlayers || room.phase !== 'waiting'
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white hover:from-blue-600 hover:to-cyan-700'
                    }`}
                  >
                    <Play className="w-5 h-5" />
                    {room.playerCount >= room.maxPlayers
                      ? 'Room Full'
                      : room.phase !== 'waiting'
                      ? 'Game Started'
                      : 'Join Room'}
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Join Modal */}
      {showJoinModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowJoinModal(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/10"
          >
            <h2 className="text-3xl font-bold text-white mb-6">Join Room</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={20}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-white text-sm font-semibold mb-2">
                  Password (if required)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleModalJoin()}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleModalJoin}
                  disabled={!username.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 px-4 rounded-xl font-bold transition-all"
                >
                  Join
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
