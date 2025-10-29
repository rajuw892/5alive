// frontend/src/components/Game/WinnerModal.tsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Home, RotateCcw, Crown } from 'lucide-react';
import { Player } from '../../types/game.types';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { useNavigate } from 'react-router-dom';

interface WinnerModalProps {
  winner: Player;
  myPlayerId: string;
  onPlayAgain?: () => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({
  winner,
  myPlayerId,
  onPlayAgain,
}) => {
  const navigate = useNavigate();
  const { playSound } = useSoundEffects();
  const isWinner = winner.id === myPlayerId;

  useEffect(() => {
    playSound(isWinner ? 'game-win' : 'game-lose');
  }, [isWinner, playSound]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      {/* Confetti Effect */}
      {isWinner && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: '50%',
                y: '50%',
                opacity: 1,
                scale: 0,
              }}
              animate={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                opacity: 0,
                scale: Math.random() * 2 + 1,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: Math.random() * 2 + 1,
                delay: Math.random() * 0.5,
              }}
              className="absolute text-4xl"
            >
              {['🎉', '🎊', '✨', '⭐', '🌟'][Math.floor(Math.random() * 5)]}
            </motion.div>
          ))}
        </div>
      )}

      {/* Main Modal */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className="relative w-full max-w-2xl"
      >
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-12 shadow-2xl border border-white/10 text-center">
          {/* Trophy Animation */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="mb-6"
          >
            {isWinner ? (
              <div className="text-9xl">🏆</div>
            ) : (
              <div className="text-9xl">😔</div>
            )}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-6xl font-black mb-4 ${
              isWinner
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500'
                : 'text-gray-400'
            }`}
          >
            {isWinner ? 'VICTORY!' : 'GAME OVER'}
          </motion.h1>

          {/* Winner Info */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring' }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-4 mb-3">
              <Crown className="w-8 h-8 text-yellow-400" />
              <div className="text-4xl font-bold text-white">{winner.username}</div>
              <Crown className="w-8 h-8 text-yellow-400" />
            </div>
            <p className="text-xl text-blue-300">
              {isWinner ? 'You are the champion!' : 'Won the game!'}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-green-400 font-bold text-lg">
                {winner.livesRemaining} {winner.livesRemaining === 1 ? 'life' : 'lives'} remaining
              </span>
            </div>
          </motion.div>

          {/* Sparkle Divider */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="text-3xl"
            >
              ⭐
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-3xl"
            >
              ✨
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="text-3xl"
            >
              ⭐
            </motion.div>
          </div>

          {/* Stats */}
          {isWinner && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-8 grid grid-cols-3 gap-4"
            >
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-4xl mb-2">💪</div>
                <div className="text-white font-bold">Survived</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-4xl mb-2">🎯</div>
                <div className="text-white font-bold">Strategic</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-4xl mb-2">👑</div>
                <div className="text-white font-bold">Champion</div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex gap-4 justify-center"
          >
            {onPlayAgain && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onPlayAgain}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl"
              >
                <RotateCcw className="w-6 h-6" />
                Play Again
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl"
            >
              <Home className="w-6 h-6" />
              Home
            </motion.button>
          </motion.div>

          {/* Thank You Message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-gray-400 text-sm"
          >
            Thanks for playing 5 ALIVE! 🎴
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};
