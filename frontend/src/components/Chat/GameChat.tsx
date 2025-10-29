// frontend/src/components/Chat/GameChat.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Smile } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

interface ChatMessage {
  playerId: string;
  username: string;
  message: string;
  timestamp: Date;
  type?: 'system' | 'player';
}

const QUICK_MESSAGES = [
  '👍 Nice play!',
  '😅 Lucky!',
  '🔥 On fire!',
  '😱 Wow!',
  '🤔 Thinking...',
  '⚡ Too fast!',
  '💪 Got this!',
  '😂 LOL',
];

const EMOJIS = ['😀', '😅', '😂', '🤣', '😎', '🤔', '😱', '🔥', '💪', '👍', '👏', '🎉', '⚡', '💥', '🎯', '🃏'];

export const GameChat: React.FC = () => {
  const { socket, sendMessage } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Listen for chat messages (player messages only)
  useEffect(() => {
    if (!socket) return;

    socket.on('message-received', (data: ChatMessage) => {
      // Only show player chat messages, filter out any system/game move messages
      if (data.type !== 'system' && data.message && data.username) {
        setMessages((prev) => [...prev, { ...data, type: 'player' }]);
      }
    });

    // Explicitly ignore game-effect events (game moves, card plays, etc.)
    socket.on('game-effect', () => {
      // Do nothing - game effects are not shown in chat
    });

    return () => {
      socket.off('message-received');
      socket.off('game-effect');
    };
  }, [socket]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    sendMessage(inputMessage);
    setInputMessage('');
    setShowEmojis(false);
  };

  const handleQuickMessage = (msg: string) => {
    sendMessage(msg);
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputMessage((prev) => prev + emoji);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed left-4 top-20 md:bottom-4 md:top-auto z-40 bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-3 md:p-4 rounded-full shadow-2xl"
        >
          <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
          {messages.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center"
            >
              {messages.length > 9 ? '9+' : messages.length}
            </motion.div>
          )}
        </motion.button>
      )}

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            className="fixed left-4 top-20 md:bottom-4 md:top-auto z-50 w-[85vw] max-w-sm md:w-96 h-[60vh] md:h-[32rem] bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-400" />
                <h3 className="text-white font-bold">Chat</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Messages */}
            <div className="p-3 border-b border-white/10">
              <div className="flex flex-wrap gap-2">
                {QUICK_MESSAGES.slice(0, 4).map((msg, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickMessage(msg)}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded-full transition-all"
                  >
                    {msg}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <AnimatePresence initial={false}>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="bg-white/10 rounded-lg p-3 hover:bg-white/15 transition-colors">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                          {msg.username[0]}
                        </div>
                        <span className="text-white font-semibold text-sm">
                          {msg.username}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-white text-sm ml-8">{msg.message}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Emoji Picker */}
            {showEmojis && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-2 border-t border-white/10 bg-white/5"
              >
                <div className="grid grid-cols-8 gap-2">
                  {EMOJIS.map((emoji, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEmojiSelect(emoji)}
                      className="text-2xl hover:bg-white/10 rounded p-1 transition-all"
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEmojis(!showEmojis)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Smile className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/10 text-white px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  maxLength={200}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
