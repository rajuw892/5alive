// frontend/src/contexts/GameContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameState, Player, Card } from '../types/game.types';

interface GameContextType {
  socket: Socket | null;
  roomId: string | null;
  gameState: GameState | null;
  myHand: Card[];
  currentPlayer: Player | null;
  isMyTurn: boolean;
  players: Player[];
  createRoom: (username: string, maxPlayers?: number, password?: string) => void;
  joinRoom: (roomId: string, username: string, password?: string) => void;
  startGame: () => void;
  playCard: (cardId: string) => void;
  cannotPlay: () => void;
  sendMessage: (message: string) => void;
  toggleMic: (muted: boolean) => void;
  leaveRoom: () => void;
  error: string | null;
  isConnected: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [myHand, setMyHand] = useState<Card[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to server');
      setIsConnected(true);
      setError(null);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setError('Failed to connect to server');
    });

    newSocket.on('error', (errorData: { error: string; code: string }) => {
      console.error('Socket error:', errorData);
      setError(errorData.error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Room events
    socket.on('room-created', ({ roomId: newRoomId, room }) => {
      console.log('Room created:', newRoomId);
      setRoomId(newRoomId);
      setError(null);
      // Initialize game state in waiting phase
      if (room) {
        setGameState({
          roomId: newRoomId,
          players: room.players,
          currentPlayerIndex: 0,
          runningTotal: 0,
          direction: 'clockwise',
          discardPile: [],
          deckCount: 0,
          phase: 'waiting',
          winner: null,
          createdAt: room.createdAt,
        });
      }
    });

    socket.on('room-joined', ({ room }) => {
      console.log('Joined room:', room.id);
      setRoomId(room.id);
      setError(null);
      // Initialize game state in waiting phase
      setGameState({
        roomId: room.id,
        players: room.players,
        currentPlayerIndex: 0,
        runningTotal: 0,
        direction: 'clockwise',
        discardPile: [],
        deckCount: 0,
        phase: 'waiting',
        winner: null,
        createdAt: room.createdAt,
      });
    });

    socket.on('player-joined', ({ player, room }) => {
      console.log('Player joined:', player.username);
      setGameState(prevState => {
        if (!prevState) return prevState;
        return {
          ...prevState,
          players: room.players,
        };
      });
    });

    socket.on('player-left', ({ playerId, room }) => {
      console.log('Player left:', playerId);
      if (room) {
        setGameState(prevState => {
          if (!prevState) return prevState;
          return {
            ...prevState,
            players: room.players,
          };
        });
      }
    });

    socket.on('host-changed', ({ newHostId }) => {
      console.log('New host:', newHostId);
    });

    // Game events
    socket.on('game-started', ({ gameState: newGameState, yourHand }) => {
      console.log('🎮 Game started!');
      console.log('📊 Game state:', newGameState);
      console.log('🃏 Your hand:', yourHand);
      console.log('👤 Current player index:', newGameState.currentPlayerIndex);
      console.log('👥 Players:', newGameState.players);
      setGameState(newGameState);
      setMyHand(yourHand);
      setError(null);
    });

    socket.on('game-state-update', ({ gameState: newGameState, yourHand }) => {
      console.log('Game state updated');
      setGameState(newGameState);
      if (yourHand) {
        setMyHand(yourHand);
      }
    });

    socket.on('game-effect', (effect) => {
      console.log('Game effect:', effect);
      // Handle visual effects, animations, etc.
    });

    // Chat events
    socket.on('message-received', ({ username, message }) => {
      console.log(`${username}: ${message}`);
    });

    return () => {
      socket.off('room-created');
      socket.off('room-joined');
      socket.off('player-joined');
      socket.off('player-left');
      socket.off('host-changed');
      socket.off('game-started');
      socket.off('game-state-update');
      socket.off('game-effect');
      socket.off('message-received');
    };
  }, [socket]);

  // Create room
  const createRoom = useCallback(
    (username: string, maxPlayers: number = 6, password?: string) => {
      if (!socket) {
        setError('Not connected to server');
        return;
      }
      console.log('Creating room...');
      socket.emit('create-room', {
        username,
        isGuest: true,
        maxPlayers,
        password,
      });
    },
    [socket]
  );

  // Join room
  const joinRoom = useCallback(
    (roomId: string, username: string, password?: string) => {
      if (!socket) {
        setError('Not connected to server');
        return;
      }
      console.log('Joining room:', roomId);
      socket.emit('join-room', {
        roomId,
        username,
        isGuest: true,
        password,
      });
    },
    [socket]
  );

  // Start game
  const startGame = useCallback(() => {
    if (!socket || !roomId) {
      setError('Cannot start game');
      return;
    }
    console.log('Starting game...');
    socket.emit('start-game', { roomId });
  }, [socket, roomId]);

  // Play card
  const playCard = useCallback(
    (cardId: string) => {
      if (!socket || !roomId) {
        setError('Cannot play card');
        return;
      }
      console.log('Playing card:', cardId);
      socket.emit('play-card', { roomId, cardId });
    },
    [socket, roomId]
  );

  // Cannot play
  const cannotPlay = useCallback(() => {
    if (!socket || !roomId) {
      setError('Cannot submit');
      return;
    }
    console.log('Cannot play - losing a life');
    socket.emit('cannot-play', { roomId });
  }, [socket, roomId]);

  // Send message
  const sendMessage = useCallback(
    (message: string) => {
      if (!socket || !roomId) return;
      socket.emit('send-message', { roomId, message });
    },
    [socket, roomId]
  );

  // Toggle mic
  const toggleMic = useCallback(
    (muted: boolean) => {
      if (!socket || !roomId) return;
      socket.emit('toggle-mic', { roomId, muted });
    },
    [socket, roomId]
  );

  // Leave room
  const leaveRoom = useCallback(() => {
    if (!socket || !roomId) return;
    console.log('Leaving room...');
    socket.emit('leave-room', { roomId });
    setRoomId(null);
    setGameState(null);
    setMyHand([]);
  }, [socket, roomId]);

  // Computed values
  const currentPlayer = gameState?.players[gameState.currentPlayerIndex] || null;
  const isMyTurn = currentPlayer?.id === socket?.id;
  const players = gameState?.players || [];

  const value: GameContextType = {
    socket,
    roomId,
    gameState,
    myHand,
    currentPlayer,
    isMyTurn,
    players,
    createRoom,
    joinRoom,
    startGame,
    playCard,
    cannotPlay,
    sendMessage,
    toggleMic,
    leaveRoom,
    error,
    isConnected,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
