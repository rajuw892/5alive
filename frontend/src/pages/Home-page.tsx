// frontend/src/pages/Home.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, LogIn, Sparkles, Trophy, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const { createRoom, joinRoom, isConnected, error, roomId } = useGame();

  // Navigate to game when room is created/joined
  React.useEffect(() => {
    if (roomId) {
      navigate('/game');
    }
  }, [roomId, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 py-6">
        {/* Logo & Title */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6 md:mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl md:text-7xl mb-2"
          >
            🎴
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 drop-shadow-2xl">
            5 ALIVE
          </h1>
          <p className="text-base md:text-lg text-blue-200 font-semibold">
            The Ultimate Card Game Experience
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 md:p-6 shadow-2xl border border-white/20">
            {/* Action Buttons */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowCreateModal(true)}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 md:py-4 px-4 md:px-6 rounded-2xl font-bold text-lg md:text-xl shadow-xl flex items-center justify-center gap-2 md:gap-3 transition-all"
              >
                <Plus className="w-5 h-5 md:w-6 md:h-6" />
                Create Room
                <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/rooms')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-3 md:py-4 px-4 md:px-6 rounded-2xl font-bold text-lg md:text-xl shadow-xl flex items-center justify-center gap-2 md:gap-3 transition-all"
              >
                <Users className="w-5 h-5 md:w-6 md:h-6" />
                Browse Rooms
                <Trophy className="w-4 h-4 md:w-5 md:h-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowJoinModal(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-3 md:py-4 px-4 md:px-6 rounded-2xl font-bold text-lg md:text-xl shadow-xl flex items-center justify-center gap-2 md:gap-3 transition-all"
              >
                <LogIn className="w-5 h-5 md:w-6 md:h-6" />
                Join with Code
                <Zap className="w-4 h-4 md:w-5 md:h-5" />
              </motion.button>
            </div>

            {/* Features */}
            <div className="mt-5 md:mt-6 pt-5 md:pt-6 border-t border-white/20">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-2xl md:text-3xl mb-1">👥</div>
                  <div className="text-white text-xs md:text-sm font-semibold">2-6 Players</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl mb-1">🎤</div>
                  <div className="text-white text-xs md:text-sm font-semibold">Voice Chat</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl mb-1">⚡</div>
                  <div className="text-white text-xs md:text-sm font-semibold">Real-time</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* How to Play - Compact Version */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6 md:mt-8 text-center max-w-2xl w-full"
        >
          <h3 className="text-white text-lg md:text-xl font-bold mb-3">How to Play</h3>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            <div className="bg-white/5 backdrop-blur p-2 md:p-3 rounded-xl border border-white/10">
              <div className="text-2xl md:text-3xl mb-1">1️⃣</div>
              <div className="text-white text-xs md:text-sm font-semibold mb-0.5">Play Cards</div>
              <div className="text-blue-200 text-[10px] md:text-xs">Keep ≤ 21</div>
            </div>
            <div className="bg-white/5 backdrop-blur p-2 md:p-3 rounded-xl border border-white/10">
              <div className="text-2xl md:text-3xl mb-1">2️⃣</div>
              <div className="text-white text-xs md:text-sm font-semibold mb-0.5">Wildcards</div>
              <div className="text-blue-200 text-[10px] md:text-xs">Special powers</div>
            </div>
            <div className="bg-white/5 backdrop-blur p-2 md:p-3 rounded-xl border border-white/10">
              <div className="text-2xl md:text-3xl mb-1">3️⃣</div>
              <div className="text-white text-xs md:text-sm font-semibold mb-0.5">Last Wins</div>
              <div className="text-blue-200 text-[10px] md:text-xs">5 lives max</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <CreateRoomModal
          onClose={() => setShowCreateModal(false)}
          onCreateRoom={createRoom}
          isConnected={isConnected}
          error={error}
        />
      )}

      {/* Join Room Modal */}
      {showJoinModal && (
        <JoinRoomModal
          onClose={() => setShowJoinModal(false)}
          onJoinRoom={joinRoom}
          isConnected={isConnected}
          error={error}
        />
      )}
    </div>
  );
};

// Create Room Modal
const CreateRoomModal: React.FC<{
  onClose: () => void;
  onCreateRoom: (username: string, maxPlayers?: number) => void;
  isConnected: boolean;
  error: string | null;
}> = ({ onClose, onCreateRoom, isConnected, error }) => {
  const [username, setUsername] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(6);

  const handleCreate = () => {
    if (!username.trim()) return;
    if (!isConnected) {
      alert('Not connected to server. Please wait...');
      return;
    }
    onCreateRoom(username, maxPlayers);
    // Navigation will happen automatically via useEffect when roomId is set
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Create Room</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

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
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>

          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Max Players
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  onClick={() => setMaxPlayers(num)}
                  className={`py-3 rounded-xl font-bold transition-all ${
                    maxPlayers === num
                      ? 'bg-blue-500 text-white scale-105'
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {!isConnected && (
            <div className="text-yellow-300 text-sm flex items-center gap-2">
              <span className="animate-pulse">⚠️</span> Connecting to server...
            </div>
          )}

          {error && (
            <div className="text-red-300 text-sm flex items-center gap-2">
              ❌ {error}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreate}
            disabled={!username.trim()}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Room
            <Sparkles className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Join Room Modal
const JoinRoomModal: React.FC<{
  onClose: () => void;
  onJoinRoom: (roomId: string, username: string) => void;
  isConnected: boolean;
  error: string | null;
}> = ({ onClose, onJoinRoom, isConnected, error }) => {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');

  const handleJoin = () => {
    if (!username.trim() || !roomId.trim()) return;
    if (!isConnected) {
      alert('Not connected to server. Please wait...');
      return;
    }
    onJoinRoom(roomId, username);
    // Navigation will happen automatically via useEffect when roomId is set
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/10"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Join Room</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

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
              Room Code
            </label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room code"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-lg tracking-wider"
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            />
          </div>

          {!isConnected && (
            <div className="text-yellow-300 text-sm flex items-center gap-2">
              <span className="animate-pulse">⚠️</span> Connecting to server...
            </div>
          )}

          {error && (
            <div className="text-red-300 text-sm flex items-center gap-2">
              ❌ {error}
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleJoin}
            disabled={!username.trim() || !roomId.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Join Room
            <Users className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
