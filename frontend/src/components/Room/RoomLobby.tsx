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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-3 md:p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl md:text-6xl opacity-10"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: -100,
            }}
            animate={{
              y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 100,
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
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl border border-white/20 max-h-[95vh] overflow-y-auto">
          {/* Header */}
          <div className="text-center mb-4 md:mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl md:text-5xl mb-2 md:mb-3"
            >
              🎮
            </motion.div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-1 md:mb-2">Game Lobby</h1>
            <p className="text-sm md:text-base text-blue-200">Waiting for players to join...</p>
          </div>

          {/* Room Code */}
          <div className="mb-4 md:mb-5">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-3 md:p-4 text-center">
              <div className="text-white/80 text-xs font-semibold mb-1">
                ROOM CODE
              </div>
              <div className="flex items-center justify-center gap-2 md:gap-3">
                <div className="text-4xl md:text-5xl font-black text-white tracking-widest font-mono">
                  {roomId}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={copyRoomCode}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-xl transition-all"
                >
                  {copied ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
              {copied && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-green-300 text-xs font-semibold mt-1"
                >
                  ✓ Copied!
                </motion.div>
              )}
            </div>
          </div>

          {/* Players Grid */}
          <div className="mb-4 md:mb-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 md:w-6 md:h-6" />
                Players ({players.length}/{maxPlayers})
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
              {/* Actual Players */}
              {players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur rounded-xl md:rounded-2xl p-2 md:p-3 border border-white/10"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-base md:text-lg">
                        {player.username[0].toUpperCase()}
                      </div>
                      {player.isHost && (
                        <div className="absolute -top-1 -right-1">
                          <Crown className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-yellow-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm md:text-base font-bold truncate">
                        {player.username}
                      </div>
                      <div className="text-blue-200 text-[10px] md:text-xs">
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
                  className="bg-white/5 backdrop-blur rounded-xl md:rounded-2xl p-2 md:p-3 border-2 border-dashed border-white/20 flex items-center justify-center min-h-[60px] md:min-h-[70px]"
                >
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl mb-1 opacity-50">👤</div>
                    <div className="text-white/50 text-[10px] md:text-xs font-semibold">
                      Waiting...
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 md:space-y-3">
            {isHost ? (
              <motion.button
                whileHover={{ scale: canStart ? 1.02 : 1 }}
                whileTap={{ scale: canStart ? 0.98 : 1 }}
                onClick={onStartGame}
                disabled={!canStart}
                className={`w-full py-3 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl font-bold text-base md:text-lg shadow-xl flex items-center justify-center gap-2 md:gap-3 transition-all ${
                  canStart
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Play className="w-5 h-5 md:w-6 md:h-6" />
                <span className="text-sm md:text-base">{canStart ? 'Start Game' : 'Need at least 2 players'}</span>
                {canStart && <span className="animate-pulse">🚀</span>}
              </motion.button>
            ) : (
              <div className="bg-blue-500/20 backdrop-blur rounded-xl md:rounded-2xl p-3 md:p-4 border border-blue-500/30 text-center">
                <div className="text-blue-200 text-sm md:text-base font-semibold">
                  ⏳ Waiting for host to start the game...
                </div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLeaveRoom}
              className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-200 py-3 md:py-4 px-4 md:px-6 rounded-xl md:rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border border-red-500/30 text-sm md:text-base"
            >
              <LogOut className="w-4 h-4 md:w-5 md:h-5" />
              Leave Room
            </motion.button>
          </div>

          {/* Tips */}
          <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-white/10">
            <div className="text-center text-white/60 text-xs md:text-sm">
              <p className="mb-1 md:mb-2">💡 <span className="font-semibold">Tip:</span> Share the room code with your friends!</p>
              <p className="hidden sm:block">Voice chat will be enabled once the game starts 🎤</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
