 // src/types/game.types.ts
export type WildType =
  | 'bomb'
  | 'hand-in-redeal'
  | 'equals-zero'
  | 'equals-ten'
  | 'equals-21'
  | 'draw-one'
  | 'draw-two'
  | 'reverse'
  | 'skip'
  | 'pass-me-by';

export interface Card {
  id: string;
  type: 'number' | 'wild';
  value: number;
  wildType?: WildType;
  displayValue: string;
}

export interface Player {
  id: string;
  username: string;
  isGuest: boolean;
  hand: Card[];
  livesRemaining: number;
  aliveCards: boolean[];
  isEliminated: boolean;
  isHost: boolean;
  isMuted: boolean;
  isConnected: boolean;
  avatarUrl?: string;
}

export type GamePhase = 'waiting' | 'playing' | 'finished';
export type Direction = 'clockwise' | 'counterclockwise';

export interface GameState {
  roomId: string;
  players: Player[];
  currentPlayerIndex: number;
  runningTotal: number;
  direction: Direction;
  discardPile: Card[];
  deck: Card[]; // The actual deck of cards
  deckCount: number; // Count for display purposes
  phase: GamePhase;
  winner: Player | null;
  createdAt: Date;
  startedAt?: Date;
  finishedAt?: Date;
}

export interface Room {
  id: string;
  hostId: string;
  players: Player[];
  maxPlayers: number;
  gameState?: GameState;
  createdAt: Date;
  password?: string;
  voiceRoomId?: string;
}

export interface CreateRoomPayload {
  username: string;
  isGuest: boolean;
  maxPlayers?: number;
  password?: string;
}

export interface JoinRoomPayload {
  roomId: string;
  username: string;
  isGuest: boolean;
  password?: string;
}

export interface PlayCardPayload {
  roomId: string;
  cardId: string;
}

export interface ChatMessagePayload {
  roomId: string;
  message: string;
}

export interface GameEvent {
  type: 'card-played' | 'life-flipped' | 'player-eliminated' | 'turn-changed' | 'game-over';
  playerId?: string;
  playerName?: string;
  card?: Card;
  newTotal?: number;
  livesRemaining?: number;
  message: string;
}

export const INITIAL_LIVES = 5;
export const INITIAL_CARDS = 10;
export const MAX_TOTAL = 21;
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 6;