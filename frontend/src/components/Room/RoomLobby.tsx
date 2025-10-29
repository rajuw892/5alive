// frontend/src/components/Room/RoomLobby.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Crown, Users, Play, LogOut } from 'lucide-react';
import { Player } from '../../types/game.types';

interface RoomLobbyProps {
  roomId: string;
  players: Player[];
  isHost: boolean;
  maxPlayers: number;
  onStartGame: () => void;
  onLeaveRoom: () => void;
}

export const RoomLobby: React.FC<RoomLobbyProps> = ({
  roomId,
  players,
  isHost,
  maxPlayers,
  onStartGame,
  onLeaveRoom,
}) => {
  const [copied, setCopied] = useState(false);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canStart = players.length >= 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl opacity-10"
            initial={{
              x: Math.random() * window.innerWidth,
              y: -100,
            }}
            animate={{
              y: window.innerHeight + 100,
              rotate: 360,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            🎴
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 w-full max-w-4xl"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🎮
            </motion.div>
            <h1 className="text-4xl font-black text-white mb-2">Game Lobby</h1>
            <p className="text-blue-200">Waiting for players to join...</p>
          </div>

          {/* Room Code */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-center">
              <div className="text-white/80 text-sm font-semibold mb-2">
                ROOM CODE
              </div>
              <div className="flex items-center justify-center gap-4">
                <div className="text-5xl font-black text-white tracking-wider font-mono">
                  {roomId}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={copyRoomCode}
                  className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-xl transition-all"
                >
                  {copied ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <Copy className="w-6 h-6" />
                  )}
                </motion.button>
              </div>
              {copied && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-300 text-sm font-semibold mt-2"
                >
                  ✓ Copied to clipboard!
                </motion.div>
              )}
            </div>
          </div>

          {/* Players Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Users className="w-6 h-6" />
                Players ({players.length}/{maxPlayers})
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Actual Players */}
              {players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur rounded-2xl p-4 border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                        {player.username[0].toUpperCase()}
                      </div>
                      {player.isHost && (
                        <div className="absolute -top-1 -right-1 text-2xl">
                          <Crown className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-bold truncate">
                        {player.username}
                      </div>
                      <div className="text-blue-200 text-xs">
                        {player.isHost ? 'Host' : 'Player'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Empty Slots */}
              {[...Array(maxPlayers - players.length)].map((_, index) => (
                <motion.div
                  key={`empty-${index}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: (players.length + index) * 0.1 }}
                  className="bg-white/5 backdrop-blur rounded-2xl p-4 border-2 border-dashed border-white/20 flex items-center justify-center"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2 opacity-50">👤</div>
                    <div className="text-white/50 text-sm font-semibold">
                      Waiting...
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {isHost ? (
              <motion.button
                whileHover={{ scale: canStart ? 1.02 : 1 }}
                whileTap={{ scale: canStart ? 0.98 : 1 }}
                onClick={onStartGame}
                disabled={!canStart}
                className={`w-full py-5 px-6 rounded-2xl font-bold text-xl shadow-xl flex items-center justify-center gap-3 transition-all ${
                  canStart
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Play className="w-6 h-6" />
                {canStart ? 'Start Game' : 'Need at least 2 players'}
                {canStart && <span className="animate-pulse">🚀</span>}
              </motion.button>
            ) : (
              <div className="bg-blue-500/20 backdrop-blur rounded-2xl p-4 border border-blue-500/30 text-center">
                <div className="text-blue-200 font-semibold">
                  ⏳ Waiting for host to start the game...
                </div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLeaveRoom}
              className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-200 py-4 px-6 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border border-red-500/30"
            >
              <LogOut className="w-5 h-5" />
              Leave Room
            </motion.button>
          </div>

          {/* Tips */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="text-center text-white/60 text-sm">
              <p className="mb-2">💡 <span className="font-semibold">Tip:</span> Share the room code with your friends!</p>
              <p>Voice chat will be enabled once the game starts 🎤</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
