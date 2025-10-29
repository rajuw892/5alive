// frontend/src/components/UI/Card.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Card as CardType } from '../../types/game.types';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  isSelected?: boolean;
  isPlayable?: boolean;
}

const sizeClasses = {
  small: 'w-14 h-20 md:w-20 md:h-28',
  medium: 'w-18 h-26 md:w-24 md:h-36',
  large: 'w-22 h-32 md:w-28 md:h-42',
};

const fontSizes = {
  small: 'text-[10px] md:text-xs',
  medium: 'text-xs md:text-sm',
  large: 'text-sm md:text-base',
};

const valueFontSizes = {
  small: 'text-lg md:text-xl',
  medium: 'text-xl md:text-2xl',
  large: 'text-2xl md:text-3xl',
};

export const Card: React.FC<CardProps> = ({
  card,
  onClick,
  disabled = false,
  size = 'medium',
  isSelected = false,
  isPlayable = true,
}) => {
  const isWild = card.type === 'wild';

  const getCardColor = () => {
    if (isWild) {
      switch (card.wildType) {
        case 'bomb':
          return 'from-red-600 via-orange-600 to-yellow-500';
        case 'equals-21':
          return 'from-green-600 via-emerald-600 to-teal-500';
        case 'equals-ten':
          return 'from-blue-600 via-cyan-600 to-sky-500';
        case 'equals-zero':
          return 'from-purple-600 via-violet-600 to-fuchsia-500';
        case 'draw-one':
        case 'draw-two':
          return 'from-pink-600 via-rose-600 to-red-500';
        case 'reverse':
        case 'skip':
        case 'pass-me-by':
          return 'from-indigo-600 via-purple-600 to-pink-500';
        case 'hand-in-redeal':
          return 'from-gray-700 via-gray-800 to-gray-900';
        default:
          return 'from-purple-600 to-pink-600';
      }
    }
    return 'from-white to-gray-50';
  };

  const getTextColor = () => {
    if (isWild) return 'text-white';
    
    // Color number cards based on value
    if (card.value >= 5) return 'text-red-600';
    if (card.value >= 3) return 'text-orange-600';
    if (card.value >= 1) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getBorderColor = () => {
    if (isSelected) return 'border-yellow-400 shadow-yellow-400/50';
    if (!disabled && isPlayable) {
      // Playable cards get a bright green glow
      return 'border-emerald-400 shadow-emerald-400/60';
    }
    if (isWild) return 'border-purple-300';
    return 'border-gray-300';
  };

  const getCardIcon = () => {
    if (!isWild) return null;
    
    const icons: Record<string, string> = {
      'bomb': '💣',
      'equals-21': '🎯',
      'equals-ten': '🔟',
      'equals-zero': '⭕',
      'draw-one': '📥',
      'draw-two': '📥📥',
      'reverse': '↩️',
      'skip': '⏭️',
      'pass-me-by': '⏩',
      'hand-in-redeal': '🔄',
    };
    
    return icons[card.wildType || ''] || '✨';
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled && isPlayable ? {
        scale: 1.1,
        y: -16,
        rotateX: 8,
        rotateZ: Math.random() * 6 - 3,
        boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.7), 0 0 30px rgba(16, 185, 129, 0.4), 0 35px 60px -15px rgba(0, 0, 0, 0.5)'
      } : {}}
      whileTap={!disabled && isPlayable ? { scale: 0.96, y: -8, rotateX: 0 } : {}}
      animate={{
        y: isSelected ? -16 : 0,
        rotateX: isSelected ? 5 : 0,
        boxShadow: isSelected
          ? '0 25px 45px -8px rgba(234, 179, 8, 0.8), 0 18px 20px -5px rgba(234, 179, 8, 0.6), 0 0 35px rgba(234, 179, 8, 0.5), 0 30px 50px -10px rgba(0, 0, 0, 0.4)'
          : !disabled && isPlayable
          ? '0 12px 30px -5px rgba(16, 185, 129, 0.6), 0 8px 16px -3px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.25), 0 15px 30px -8px rgba(0, 0, 0, 0.35)'
          : '0 10px 22px -5px rgba(0, 0, 0, 0.35), 0 6px 12px -3px rgba(0, 0, 0, 0.2), 0 20px 35px -10px rgba(0, 0, 0, 0.3)',
      }}
      transition={{
        type: 'spring',
        stiffness: 280,
        damping: 18
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={`
        ${sizeClasses[size]}
        relative
        rounded-xl md:rounded-2xl
        border-3 md:border-[5px]
        ${getBorderColor()}
        bg-gradient-to-br ${getCardColor()}
        ${disabled ? 'opacity-40 cursor-not-allowed grayscale blur-[0.5px]' : isPlayable ? 'cursor-pointer hover:brightness-115 hover:saturate-110' : 'opacity-60 cursor-not-allowed'}
        transition-all duration-300
        flex flex-col items-center justify-center
        font-bold
        select-none
        overflow-hidden
        backdrop-blur-sm
      `}
    >
      {/* Card Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255,255,255,0.15) 10px,
            rgba(255,255,255,0.15) 20px
          )`
        }} />
      </div>

      {/* Inset shadow for depth */}
      <div className="absolute inset-0 rounded-xl md:rounded-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.15),inset_0_-2px_4px_rgba(255,255,255,0.1)] pointer-events-none" />

      {/* Glossy overlay with enhanced bevel effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/5 to-black/15 pointer-events-none rounded-xl md:rounded-2xl" />

      {/* Top highlight for 3D effect */}
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-t-xl md:rounded-t-2xl" />

      {/* Inner glow for playable cards */}
      {!disabled && isPlayable && (
        <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-br from-emerald-400/20 via-transparent to-emerald-400/10 pointer-events-none" />
      )}

      {/* Card Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-1 py-1.5">
        {/* Wild Card Icon */}
        {isWild && (
          <div className={`${size === 'small' ? 'text-lg md:text-xl' : size === 'medium' ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'} mb-0.5 md:mb-1 drop-shadow-lg`}>
            {getCardIcon()}
          </div>
        )}

        {/* Main Value */}
        <div className={`${valueFontSizes[size]} ${getTextColor()} font-black drop-shadow-lg leading-none`}>
          {!isWild && card.value}
        </div>

        {/* Wild Card Title */}
        {isWild && (
          <div className={`${fontSizes[size]} ${getTextColor()} font-bold drop-shadow-lg text-center leading-tight px-0.5 break-words w-full`}>
            {card.wildType?.split('-').map(w =>
              w.charAt(0).toUpperCase() + w.slice(1)
            ).join(' ')}
          </div>
        )}

        {/* Number Card Subtitle */}
        {!isWild && (
          <div className="text-[10px] md:text-xs text-gray-500 mt-1 font-semibold">
            +{card.value}
          </div>
        )}

        {/* Wild Card Effect Description */}
        {isWild && (
          <div className={`${size === 'small' ? 'text-[8px]' : size === 'medium' ? 'text-[9px]' : 'text-[10px]'} md:text-xs text-white/90 mt-1 px-1 text-center font-medium leading-tight break-words w-full`}>
            {getWildDescription(card.wildType)}
          </div>
        )}
      </div>

      {/* Corner Decorations */}
      <div className={`absolute top-0.5 left-0.5 text-xs ${getTextColor()} font-bold opacity-50`}>
        {isWild ? '★' : card.value}
      </div>
      <div className={`absolute bottom-0.5 right-0.5 text-xs ${getTextColor()} font-bold opacity-50 rotate-180`}>
        {isWild ? '★' : card.value}
      </div>

      {/* Shine Effect */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
          animate={{
            x: ['-100%', '100%'],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        />
      )}

      {/* Playable Indicator - Pulsing Glow */}
      {!disabled && isPlayable && !isSelected && (
        <>
          <motion.div
            className="absolute inset-0 rounded-xl md:rounded-2xl border-2 border-emerald-400 pointer-events-none"
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.03, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -inset-1 rounded-xl md:rounded-2xl bg-emerald-400/20 blur-md pointer-events-none"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </>
      )}
    </motion.button>
  );
};

function getWildDescription(wildType?: string): string {
  const descriptions: Record<string, string> = {
    'bomb': 'Discard 0 or lose life',
    'equals-21': 'Set total to 21',
    'equals-ten': 'Set total to 10',
    'equals-zero': 'Reset to 0',
    'draw-one': 'Others draw 1',
    'draw-two': 'Others draw 2',
    'reverse': 'Reverse direction',
    'skip': 'Skip next player',
    'pass-me-by': 'Pass your turn',
    'hand-in-redeal': 'Redeal all hands',
  };
  return descriptions[wildType || ''] || '';
}
