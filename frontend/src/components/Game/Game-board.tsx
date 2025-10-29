// frontend/src/components/Game/GameBoard.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card as CardType, Player, GameState } from '../../types/game.types';
import { Card } from '../UI/Card';
import { Volume2, VolumeX, Users, Trophy, LogOut, Settings, Mic, MicOff } from 'lucide-react';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { isCardPlayable } from '../../utils/cardPlayability';
import { useVoiceChat } from '../../hooks/useVoiceChat';

interface GameBoardProps {
  gameState: GameState;
  myHand: CardType[];
  isMyTurn: boolean;
  currentPlayer: Player | null;
  myPlayerId: string;
  onPlayCard: (cardId: string) => void;
  onCannotPlay: () => void;
  onLeaveGame?: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  myHand,
  isMyTurn,
  currentPlayer,
  myPlayerId,
  onPlayCard,
  onCannotPlay,
  onLeaveGame,
}) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const { playSound, isMuted, toggleMute } = useSoundEffects();

  // Voice chat integration
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const {
    isConnected: voiceConnected,
    isMuted: voiceMuted,
    isConnecting,
    speakingUsers,
    error: voiceError,
    toggleMute: toggleVoiceMute,
  } = useVoiceChat({
    roomId: gameState.roomId,
    userId: myPlayerId,
    enabled: voiceEnabled,
  });

  const me = gameState.players.find(p => p.id === myPlayerId);
  const otherPlayers = gameState.players.filter(p => p.id !== myPlayerId);

  // Play sound when it's your turn
  useEffect(() => {
    if (isMyTurn) {
      playSound('notification');
    }
  }, [isMyTurn, playSound]);

  const handleCardClick = (cardId: string) => {
    console.log('🎴 Card clicked:', cardId);
    console.log('🎯 Is my turn:', isMyTurn);
    console.log('👤 My player ID:', myPlayerId);
    console.log('🃏 Current player:', currentPlayer);
    console.log('🎴 My hand:', myHand);

    if (!isMyTurn) {
      console.log('❌ Not my turn - ignoring click');
      return;
    }

    // Play the card immediately on first click
    console.log('✅ Playing card:', cardId);
    const card = myHand.find(c => c.id === cardId);
    if (card?.type === 'wild') {
      playSound('wild-card');
    } else {
      playSound('card-play');
    }
    onPlayCard(cardId);
  };

  const handleLifeCardClick = (lifeIndex: number) => {
    if (!isMyTurn) return;
    const hasPlayableCards = myHand.some(card => isCardPlayable(card, gameState.runningTotal, false));

    // Only allow losing a life if no cards are playable
    if (!hasPlayableCards && me?.aliveCards[lifeIndex]) {
      playSound('life-lost');
      onCannotPlay();
    }
  };

  const handleLeaveConfirm = () => {
    playSound('button-click');
    if (onLeaveGame) {
      onLeaveGame();
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-950 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 animate-pulse" style={{
          backgroundImage: `radial-gradient(circle at 30% 40%,
            rgba(16,185,129,0.4) 0%,
            transparent 50%),
            radial-gradient(circle at 70% 60%,
            rgba(5,150,105,0.3) 0%,
            transparent 50%)`
        }} />
      </div>

      {/* Decorative animated orbs */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-green-500/20 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-emerald-400/10 to-transparent rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col p-2 md:p-4 overflow-hidden">

        {/* Top Bar - Game Controls */}
        <div className="shrink-0 mb-1 md:mb-2 flex items-center justify-between flex-wrap gap-1 md:gap-2">
          <div className="flex items-center gap-1 md:gap-2">
            {/* Sound Toggle */}
            <motion.button
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMute}
              className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl text-white p-1.5 md:p-2.5 rounded-lg md:rounded-xl border border-emerald-500/30 hover:border-emerald-400/60 transition-all shadow-lg hover:shadow-emerald-500/20"
              title={isMuted ? 'Unmute Sounds' : 'Mute Sounds'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <Volume2 className="w-3.5 h-3.5 md:w-4 md:h-4" />}
            </motion.button>

            {/* Game Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-xl rounded-lg md:rounded-xl px-2 md:px-4 py-1 md:py-2 border border-emerald-500/30 shadow-lg"
            >
              <div className="flex items-center gap-1 md:gap-2 text-white">
                <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400" />
                <span className="font-semibold text-[10px] md:text-sm">
                  {gameState.players.filter(p => !p.isEliminated).length} / {gameState.players.length}
                </span>
              </div>
            </motion.div>

            {/* Voice Call Controls */}
            <div className="flex items-center gap-1">
              {/* Voice Call Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                disabled={isConnecting}
                className={`
                  flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1 md:py-2 rounded-lg md:rounded-xl font-bold transition-all shadow-lg text-[10px] md:text-xs border
                  ${voiceConnected
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 border-emerald-400'
                    : isConnecting
                    ? 'bg-gradient-to-r from-yellow-600 to-orange-600 border-yellow-400'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-blue-400'
                  }
                  text-white disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {isConnecting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Volume2 className="w-3 h-3 md:w-4 md:h-4" />
                    </motion.div>
                    <span className="hidden sm:inline">Connecting...</span>
                  </>
                ) : voiceConnected ? (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Volume2 className="w-3 h-3 md:w-4 md:h-4" />
                    </motion.div>
                    <span className="hidden sm:inline">Voice On</span>
                    {!voiceMuted && speakingUsers.has(myPlayerId) && (
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="w-1.5 h-1.5 bg-white rounded-full"
                      />
                    )}
                  </>
                ) : (
                  <>
                    <Mic className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="hidden sm:inline">Voice</span>
                  </>
                )}
              </motion.button>

              {/* Mute Button (shows when connected) */}
              <AnimatePresence>
                {voiceConnected && (
                  <motion.button
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleVoiceMute}
                    className={`
                      flex items-center gap-1 px-2 md:px-3 py-1 md:py-2 rounded-lg md:rounded-xl font-bold transition-all shadow-lg border
                      ${voiceMuted
                        ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-red-400'
                        : 'bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 border-slate-500'
                      }
                      text-white
                    `}
                    title={voiceMuted ? 'Unmute' : 'Mute'}
                  >
                    {voiceMuted ? (
                      <MicOff className="w-3 h-3 md:w-4 md:h-4" />
                    ) : (
                      <Mic className="w-3 h-3 md:w-4 md:h-4" />
                    )}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Turn Indicator - Top Right */}
          <div className="flex items-center gap-1 md:gap-2">
            <AnimatePresence mode="wait">
              {isMyTurn ? (
                <motion.div
                  key="my-turn"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 100, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="inline-flex items-center gap-1 md:gap-1.5 bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 text-black px-2 py-0.5 md:px-3 md:py-1 rounded-full font-black text-[10px] md:text-sm shadow-lg ring-1 md:ring-2 ring-yellow-400/60 border border-yellow-300"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="text-xs md:text-sm"
                  >
                    🎯
                  </motion.div>
                  <span className="hidden sm:inline">YOUR TURN</span>
                  <span className="sm:hidden">YOUR TURN</span>
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="text-xs md:text-sm"
                  >
                    ⚡
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="waiting"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 100, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="inline-flex items-center gap-1 md:gap-1.5 bg-slate-800/95 backdrop-blur-xl text-white px-2 py-1 md:px-3 md:py-1.5 rounded-full font-semibold text-[10px] md:text-xs shadow-lg border border-slate-700/50"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-1 h-1 md:w-1.5 md:h-1.5 bg-emerald-400 rounded-full"
                  />
                  <span className="hidden sm:inline">Waiting for {currentPlayer?.username}...</span>
                  <span className="sm:hidden">{currentPlayer?.username}'s turn</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Leave Game Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLeaveConfirm(true)}
              className="bg-gradient-to-br from-red-600/95 to-red-700/95 backdrop-blur-xl hover:from-red-700 hover:to-red-800 text-white px-2 md:px-4 py-1 md:py-2 rounded-lg md:rounded-xl font-bold transition-all flex items-center gap-1 md:gap-1.5 border border-red-500/50 hover:border-red-400/70 shadow-lg hover:shadow-red-500/30 text-[10px] md:text-sm"
            >
              <LogOut className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Leave</span>
              <span className="sm:hidden">Exit</span>
            </motion.button>
          </div>
        </div>

        {/* Top: Other Players - Optimized for up to 6 players */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="shrink-0 mb-2 md:mb-3"
        >
          <div className="flex justify-center gap-1.5 md:gap-2.5 flex-wrap max-w-full px-2">
            {otherPlayers.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <PlayerAvatar
                  player={player}
                  isCurrentTurn={currentPlayer?.id === player.id}
                  voiceConnected={voiceConnected}
                  isSpeaking={speakingUsers.has(player.id)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Center: Game Table */}
        <div className="flex-1 flex items-center justify-center py-1 md:py-2 min-h-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-[550px] px-2"
          >
            {/* Poker Table */}
            <div className="relative w-full aspect-[9/5] max-h-[200px] md:max-h-[250px] bg-gradient-to-br from-emerald-700 via-green-700 to-emerald-800 rounded-[50%] border-[6px] md:border-[8px] border-amber-700 shadow-2xl ring-4 md:ring-6 ring-amber-900/60">
              {/* Table felt texture */}
              <div className="absolute inset-0 rounded-[50%] opacity-30">
                <div className="absolute inset-0" style={{
                  backgroundImage: `repeating-linear-gradient(
                    90deg,
                    transparent,
                    transparent 2px,
                    rgba(0,0,0,0.05) 2px,
                    rgba(0,0,0,0.05) 4px
                  )`
                }} />
              </div>

              {/* Table Inner Shadow */}
              <div className="absolute inset-4 md:inset-5 rounded-[50%] shadow-inner bg-gradient-to-br from-emerald-800 to-green-900 opacity-70" />

              {/* Glossy highlight */}
              <div className="absolute inset-0 rounded-[50%] bg-gradient-to-br from-white/10 via-transparent to-transparent" />

              {/* Animated subtle glow */}
              <motion.div
                className="absolute inset-0 rounded-[50%] bg-gradient-to-br from-emerald-400/5 to-transparent"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Game Elements Container */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 md:gap-4 px-2 md:px-4">
                
                {/* Draw Pile */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative shrink-0"
                >
                  <div className="w-14 h-20 md:w-20 md:h-28 bg-gradient-to-br from-blue-800 to-blue-950 rounded-xl md:rounded-2xl border-2 md:border-3 border-blue-600 shadow-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-base md:text-xl mb-0.5">🎴</div>
                      <div className="text-white text-[9px] md:text-xs font-bold">
                        {gameState.deckCount}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block absolute -top-1 -left-1 w-20 h-28 bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl -z-10" />
                </motion.div>

                {/* Running Total Display - Enhanced Premium Design */}
                <motion.div
                  key={gameState.runningTotal}
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="relative shrink-0"
                >
                  {/* Outer Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/40 to-yellow-400/40 blur-xl"
                    animate={{
                      opacity: [0.5, 0.8, 0.5],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />

                  {/* Main Circle Container */}
                  <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full">
                    {/* Outer Ring - Gold */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-500 via-amber-500 to-yellow-600 shadow-2xl p-[3px] md:p-[4px]">
                      {/* Middle Ring - Light Gold */}
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-500 p-[2px] md:p-[3px] shadow-inner">
                        {/* Inner Circle - White Background */}
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-white via-gray-50 to-white shadow-xl relative overflow-hidden flex items-center justify-center">

                          {/* Radial Pattern Background */}
                          <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                              backgroundImage: `radial-gradient(circle at center,
                                rgba(251, 191, 36, 0.3) 0%,
                                transparent 50%),
                                repeating-conic-gradient(
                                  from 0deg at 50% 50%,
                                  rgba(251, 191, 36, 0.1) 0deg 30deg,
                                  transparent 30deg 60deg
                                )`
                            }} />
                          </div>

                          {/* 3D Inset Shadow */}
                          <div className="absolute inset-0 rounded-full shadow-[inset_0_4px_8px_rgba(0,0,0,0.1),inset_0_-2px_6px_rgba(255,255,255,0.5)]" />

                          {/* Top Glossy Shine */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/60 via-white/10 to-transparent" style={{ maskImage: 'linear-gradient(to bottom, black 0%, transparent 60%)' }} />

                          {/* Animated Sparkle Ring */}
                          <motion.div
                            className="absolute inset-3 md:inset-4 rounded-full border-2 border-amber-300/40"
                            animate={{
                              opacity: [0.3, 0.7, 0.3],
                              scale: [0.95, 1.05, 0.95],
                              rotate: [0, 180, 360]
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                          />

                          {/* Content Container */}
                          <div className="relative z-10 flex flex-col items-center justify-center h-full py-2 md:py-3 px-3 md:px-4">
                            {/* "TOTAL" Label */}
                            <div className="text-amber-700 text-[10px] md:text-xs font-black uppercase tracking-wide drop-shadow-sm">
                              Total
                            </div>

                            {/* Main Number */}
                            <motion.div
                              key={gameState.runningTotal}
                              initial={{ scale: 0.5, opacity: 0, rotateY: 180 }}
                              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                              transition={{ type: "spring", stiffness: 200, damping: 15 }}
                              className={`text-3xl md:text-5xl font-black leading-none drop-shadow-lg my-1 ${
                                gameState.runningTotal > 21
                                  ? 'text-red-600 animate-pulse'
                                  : gameState.runningTotal === 21
                                  ? 'text-emerald-600'
                                  : 'text-gray-900'
                              }`}
                              style={{
                                textShadow: gameState.runningTotal > 21
                                  ? '0 0 20px rgba(220, 38, 38, 0.5)'
                                  : gameState.runningTotal === 21
                                  ? '0 0 20px rgba(5, 150, 105, 0.5)'
                                  : '0 2px 4px rgba(0, 0, 0, 0.2)'
                              }}
                            >
                              {gameState.runningTotal}
                            </motion.div>

                            {/* "/ 21" Limit */}
                            <div className="text-gray-600 text-[10px] md:text-xs font-bold mb-1">
                              / 21
                            </div>

                            {/* Direction Indicator Badge */}
                            <motion.div
                              animate={{
                                rotate: gameState.direction === 'clockwise' ? 360 : -360,
                              }}
                              transition={{ duration: 1 }}
                              className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-[10px] md:text-xs font-black shadow-lg border-2 border-white/50"
                              style={{
                                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3)'
                              }}
                            >
                              {gameState.direction === 'clockwise' ? '↻' : '↺'}
                            </motion.div>
                          </div>

                          {/* Bottom Shadow for Depth */}
                          <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/5 to-transparent rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Discard Pile */}
                <div className="relative shrink-0">
                  <AnimatePresence mode="wait">
                    {gameState.discardPile.length > 0 ? (
                      <motion.div
                        key={gameState.discardPile[gameState.discardPile.length - 1].id}
                        initial={{ x: -100, opacity: 0, rotate: -20 }}
                        animate={{ x: 0, opacity: 1, rotate: 0 }}
                        exit={{ x: 100, opacity: 0, rotate: 20 }}
                      >
                        <Card
                          card={gameState.discardPile[gameState.discardPile.length - 1]}
                          onClick={() => {}}
                          disabled
                          size="small"
                        />
                      </motion.div>
                    ) : (
                      <div className="w-14 h-20 md:w-20 md:h-28 border-2 border-dashed border-gray-600 rounded-xl md:rounded-2xl flex items-center justify-center">
                        <div className="text-gray-500 text-[10px] md:text-xs">Discard</div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>


        {/* Bottom: Your Hand */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="shrink-0 relative z-20 pb-2 md:pb-4"
        >
          <div className="bg-gradient-to-t from-slate-900/98 via-slate-900/90 to-transparent backdrop-blur-xl rounded-2xl md:rounded-3xl p-1.5 md:p-2 border-t-[3px] md:border-t-4 border-emerald-500/40 shadow-2xl ring-2 ring-emerald-500/20">
            {/* Your Info - Compact Horizontal Layout */}
            {me && (
              <div className="flex items-center justify-between mb-1 md:mb-1.5">
                <div className="flex items-center gap-1 md:gap-1.5">
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs md:text-base shadow-lg ring-1 ring-white/20"
                  >
                    {me.username[0].toUpperCase()}
                  </motion.div>
                  <div className="flex items-center gap-1 md:gap-1.5">
                    <div className="text-white font-bold text-xs md:text-sm">
                      {me.username}
                    </div>
                    {/* A-L-I-V-E Life Cards Display - Inline */}
                    <div className="flex gap-0.5">
                      {['A', 'L', 'I', 'V', 'E'].map((letter, idx) => {
                        const alive = me.aliveCards[idx];
                        return (
                          <motion.button
                            key={idx}
                            onClick={() => handleLifeCardClick(idx)}
                            initial={{ rotateY: 0, opacity: 0 }}
                            animate={{
                              rotateY: alive ? 0 : 180,
                              scale: alive ? 1 : 0.92,
                              opacity: 1
                            }}
                            whileHover={alive && isMyTurn && !myHand.some(card => isCardPlayable(card, gameState.runningTotal, false)) ? { scale: 1.1 } : {}}
                            whileTap={alive && isMyTurn && !myHand.some(card => isCardPlayable(card, gameState.runningTotal, false)) ? { scale: 0.95 } : {}}
                            transition={{
                              rotateY: { type: 'spring', stiffness: 260, damping: 20 },
                              opacity: { duration: 0.3, delay: idx * 0.1 }
                            }}
                            className={`relative ${alive && isMyTurn && !myHand.some(card => isCardPlayable(card, gameState.runningTotal, false)) ? 'cursor-pointer' : 'cursor-default'}`}
                            style={{ perspective: 1000 }}
                            disabled={!alive || !isMyTurn || myHand.some(card => isCardPlayable(card, gameState.runningTotal, false))}
                          >
                            {/* Alive Letter Card (Front) */}
                            <div
                              className={`w-4 h-5 md:w-5 md:h-6 rounded transition-all duration-300 ${
                                alive ? 'opacity-100' : 'opacity-0'
                              }`}
                              style={{
                                backfaceVisibility: 'hidden',
                                transformStyle: 'preserve-3d',
                              }}
                            >
                              <div className={`w-full h-full bg-gradient-to-br from-emerald-500 to-green-600 rounded shadow-lg border-2 flex items-center justify-center relative overflow-hidden ${
                                alive && isMyTurn && !myHand.some(card => isCardPlayable(card, gameState.runningTotal, false))
                                  ? 'border-red-400 ring-2 ring-red-400 animate-pulse'
                                  : 'border-emerald-400/60'
                              }`}>
                                {/* Glossy overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/10" />
                                <div className="text-white font-black text-[10px] md:text-xs relative z-10 drop-shadow">
                                  {letter}
                                </div>
                              </div>
                            </div>

                            {/* Lost/Dead Card (Back) */}
                            <div
                              className={`absolute inset-0 w-4 h-5 md:w-5 md:h-6 rounded transition-all duration-300 ${
                                !alive ? 'opacity-100' : 'opacity-0'
                              }`}
                              style={{
                                backfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)',
                                transformStyle: 'preserve-3d',
                              }}
                            >
                              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-950 rounded shadow border border-red-900/50 flex items-center justify-center relative">
                                <div className="text-gray-600/50 font-black text-[10px] md:text-xs relative">
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-red-600/80 font-black text-sm">☠️</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Hand */}
            <div className="flex gap-1 md:gap-1.5 justify-center flex-wrap max-w-full overflow-visible">
              <AnimatePresence>
                {myHand.map((card, index) => {
                  // Check if this specific card is playable
                  const canPlayThisCard = isMyTurn && isCardPlayable(
                    card,
                    gameState.runningTotal,
                    false
                  );

                  return (
                    <motion.div
                      key={card.id}
                      initial={{ y: 100, opacity: 0, rotate: -10 }}
                      animate={{
                        y: 0,
                        opacity: 1,
                        rotate: hoveredCard === card.id ? 0 : (index - myHand.length / 2) * 0.5,
                      }}
                      exit={{ y: -100, opacity: 0, scale: 0.5 }}
                      transition={{ delay: index * 0.05 }}
                      onHoverStart={() => setHoveredCard(card.id)}
                      onHoverEnd={() => setHoveredCard(null)}
                      className="shrink-0"
                    >
                      <Card
                        card={card}
                        onClick={() => handleCardClick(card.id)}
                        disabled={!canPlayThisCard}
                        isPlayable={canPlayThisCard}
                        size="small"
                        isSelected={false}
                      />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* No Playable Cards Suggestion */}
            {isMyTurn && !myHand.some(card => isCardPlayable(card, gameState.runningTotal, false)) && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="mt-1.5 md:mt-2 w-full bg-gradient-to-r from-red-600/95 to-red-700/95 backdrop-blur-sm text-white py-2 md:py-2.5 px-3 md:px-4 rounded-xl font-bold text-xs md:text-sm shadow-2xl flex items-center justify-center gap-1.5 border-2 border-red-500/50 ring-2 ring-red-500/30"
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  💔
                </motion.span>
                <span className="drop-shadow">No playable cards! Click any ALIVE letter to lose a life</span>
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ☠️
                </motion.span>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Leave Confirmation Modal */}
      <AnimatePresence>
        {showLeaveConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLeaveConfirm(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-md border border-white/20 shadow-2xl"
            >
              <div className="text-6xl text-center mb-4">⚠️</div>
              <h2 className="text-3xl font-bold text-white text-center mb-4">
                Leave Game?
              </h2>
              <p className="text-gray-300 text-center mb-6">
                Are you sure you want to leave? You'll lose your progress in this game.
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowLeaveConfirm(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-xl font-bold transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLeaveConfirm}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-6 rounded-xl font-bold transition-all"
                >
                  Leave
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Player Avatar Component
interface PlayerAvatarProps {
  player: Player;
  isCurrentTurn: boolean;
  isSpeaking?: boolean;
  voiceConnected?: boolean;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  player,
  isCurrentTurn,
  isSpeaking = false,
  voiceConnected = false
}) => {
  return (
    <motion.div
      animate={{
        scale: isCurrentTurn ? 1.05 : 1,
        y: isCurrentTurn ? -3 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20
      }}
      className={`
        relative bg-gradient-to-br from-slate-800/98 to-slate-900/98 backdrop-blur-xl rounded-lg md:rounded-xl p-1.5 md:p-2
        border-2 transition-all shadow-xl
        ${isCurrentTurn ? 'border-yellow-400 shadow-yellow-400/70 shadow-2xl ring-2 md:ring-3 ring-yellow-400/40 scale-105' : 'border-slate-600/60 hover:border-emerald-500/60'}
        ${player.isEliminated ? 'opacity-40 grayscale' : 'hover:shadow-emerald-500/30 hover:scale-[1.02]'}
      `}
    >
      {/* Current Turn Indicator */}
      {isCurrentTurn && (
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity }
          }}
          className="absolute -top-2 md:-top-3 left-1/2 transform -translate-x-1/2 text-base md:text-lg drop-shadow-lg"
        >
          ⭐
        </motion.div>
      )}

      <div className="flex flex-col items-center gap-0.5 md:gap-1 min-w-[70px] md:min-w-[85px]">
        {/* Avatar */}
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 5 }}
            animate={isSpeaking ? {
              scale: [1, 1.12, 1],
              boxShadow: [
                '0 0 0px rgba(16, 185, 129, 0.6)',
                '0 0 20px rgba(16, 185, 129, 1)',
                '0 0 0px rgba(16, 185, 129, 0.6)'
              ]
            } : {}}
            transition={isSpeaking ? {
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut"
            } : {}}
            className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm md:text-base shadow-2xl border-2 relative ${
              isSpeaking ? 'border-green-400 ring-3 md:ring-4 ring-green-400/60' : 'border-white/40 ring-2 ring-white/20'
            }`}
          >
            {/* Glossy overlay */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-transparent to-black/10" />
            <span className="relative z-10">{player.username[0].toUpperCase()}</span>
          </motion.div>

          {/* Voice Indicator */}
          {voiceConnected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 md:w-5 md:h-5 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg border border-white"
            >
              {isSpeaking ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  <Mic className="w-2 h-2 md:w-2.5 md:h-2.5 text-white" />
                </motion.div>
              ) : (
                <Mic className="w-2 h-2 md:w-2.5 md:h-2.5 text-white/70" />
              )}
            </motion.div>
          )}

          {player.isHost && (
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-0.5 -right-0.5 text-sm md:text-base drop-shadow-lg"
            >
              👑
            </motion.div>
          )}
        </div>

        {/* Username */}
        <div className="text-white font-bold text-[10px] md:text-xs text-center truncate max-w-full">
          {player.username}
        </div>

        {/* Card Count */}
        <div className="bg-gray-700 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
          <span className="text-xs md:text-sm">🎴</span>
          <span className="text-white text-[10px] md:text-xs font-bold">{player.hand.length}</span>
        </div>

        {/* Lives - A L I V E Mini Letter Cards */}
        <div className="flex gap-0.5">
          {['A', 'L', 'I', 'V', 'E'].map((letter, index) => {
            const alive = player.aliveCards[index];
            return (
              <motion.div
                key={index}
                initial={{ rotateY: 0 }}
                animate={{
                  rotateY: alive ? 0 : 180,
                  scale: alive ? 1 : 0.88
                }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 20
                }}
                className="relative"
                style={{ perspective: 500 }}
              >
                {/* Alive Mini Letter Card */}
                <div
                  className={`w-3 h-4 md:w-3.5 md:h-5 rounded-sm transition-all duration-300 ${
                    alive ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    backfaceVisibility: 'hidden',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-green-600 rounded-sm shadow-md border border-emerald-400/50 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent" />
                    <div className="text-white text-[8px] md:text-[9px] font-black drop-shadow relative z-10">
                      {letter}
                    </div>
                  </div>
                </div>

                {/* Lost Mini Letter Card */}
                <div
                  className={`absolute inset-0 w-3 h-4 md:w-3.5 md:h-5 rounded-sm transition-all duration-300 ${
                    !alive ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-950 rounded-sm shadow-md border border-red-900/50 flex items-center justify-center relative overflow-hidden">
                    {/* Mini crack pattern */}
                    <div className="absolute inset-0 opacity-30">
                      <svg className="w-full h-full" viewBox="0 0 14 20">
                        <path d="M7 2 L8 10 L6 15 L7 18" stroke="rgba(220, 38, 38, 0.5)" strokeWidth="0.5" fill="none"/>
                      </svg>
                    </div>
                    <div className="relative z-10">
                      <div className="text-gray-600/50 text-[8px] md:text-[9px] font-black relative">
                        {letter}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-red-600/60 text-[9px] md:text-[10px] font-black">✕</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Eliminated Overlay */}
      {player.isEliminated && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl">
          <div className="text-red-500 font-bold text-xs md:text-sm">ELIMINATED</div>
        </div>
      )}
    </motion.div>
  );
};
