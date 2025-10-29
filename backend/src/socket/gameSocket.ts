// backend/src/socket/gameSocket.ts
import { Server, Socket } from 'socket.io';
import {
  CreateRoomPayload,
  JoinRoomPayload,
  PlayCardPayload,
  ChatMessagePayload,
  Player,
  Room
} from '../types/game.types';
import { RoomManager } from '../services/roomManager.services';
import { GameLogic } from '../services/gameLogic.service';

export class GameSocket {
  private io: Server;
  private roomManager: RoomManager;

  constructor(io: Server) {
    this.io = io;
    this.roomManager = new RoomManager();
  }

  /**
   * Initialize all socket event handlers
   */
  initialize(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);

      this.handleGetRooms(socket);
      this.handleCreateRoom(socket);
      this.handleJoinRoom(socket);
      this.handleLeaveRoom(socket);
      this.handleStartGame(socket);
      this.handlePlayCard(socket);
      this.handleCannotPlay(socket);
      this.handleChatMessage(socket);
      this.handleToggleMic(socket);
      this.handleDisconnect(socket);
    });
  }

  /**
   * Handle get rooms request
   */
  private handleGetRooms(socket: Socket): void {
    socket.on('get-rooms', () => {
      const rooms = this.roomManager.getAllRooms();
      const roomsList = rooms.map((room: Room) => ({
        id: room.id,
        hostName: room.players.find((p: Player) => p.isHost)?.username || 'Unknown',
        playerCount: room.players.length,
        maxPlayers: room.maxPlayers,
        hasPassword: !!room.password,
        phase: room.gameState?.phase || 'waiting',
        createdAt: room.createdAt,
      }));
      socket.emit('rooms-list', roomsList);
    });
  }

  /**
   * Handle room creation
   */
  private handleCreateRoom(socket: Socket): void {
    socket.on('create-room', async (payload: CreateRoomPayload) => {
      try {
        const player: Player = {
          id: socket.id,
          username: payload.username,
          isGuest: payload.isGuest,
          hand: [],
          livesRemaining: 5,
          aliveCards: [true, true, true, true, true],
          isEliminated: false,
          isHost: true,
          isMuted: false,
          isConnected: true,
        };

        const room = this.roomManager.createRoom(
          player,
          payload.maxPlayers,
          payload.password
        );

        // Join the socket room
        socket.join(room.id);

        // Send response to creator
        socket.emit('room-created', {
          roomId: room.id,
          hostId: player.id,
          room,
        });

        console.log(`Room created: ${room.id} by ${player.username}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        socket.emit('error', {
          error: errorMessage,
          code: 'CREATE_ROOM_FAILED',
        });
      }
    });
  }

  /**
   * Handle joining a room
   */
  private handleJoinRoom(socket: Socket): void {
    socket.on('join-room', async (payload: JoinRoomPayload) => {
      try {
        const player: Player = {
          id: socket.id,
          username: payload.username,
          isGuest: payload.isGuest,
          hand: [],
          livesRemaining: 5,
          aliveCards: [true, true, true, true, true],
          isEliminated: false,
          isHost: false,
          isMuted: false,
          isConnected: true,
        };

        const room = this.roomManager.joinRoom(
          payload.roomId,
          player,
          payload.password
        );

        // Join the socket room
        socket.join(payload.roomId);

        // Notify all players in room
        this.io.to(payload.roomId).emit('player-joined', {
          player,
          room,
        });

        // Send current room state to new player
        socket.emit('room-joined', {
          room,
        });

        console.log(`${player.username} joined room: ${payload.roomId}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        socket.emit('error', {
          error: errorMessage,
          code: 'JOIN_ROOM_FAILED',
        });
      }
    });
  }

  /**
   * Handle leaving a room
   */
  private handleLeaveRoom(socket: Socket): void {
    socket.on('leave-room', async ({ roomId }: { roomId: string }) => {
      try {
        const result = this.roomManager.leaveRoom(roomId, socket.id);

        if (result.newHost) {
          // Notify about new host
          this.io.to(roomId).emit('host-changed', {
            newHostId: result.newHost.id,
          });
        }

        // Notify others
        this.io.to(roomId).emit('player-left', {
          playerId: socket.id,
          room: result.room,
        });

        socket.leave(roomId);
        console.log(`Player ${socket.id} left room: ${roomId}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        socket.emit('error', {
          error: errorMessage,
          code: 'LEAVE_ROOM_FAILED',
        });
      }
    });
  }

  /**
   * Handle starting a game
   */
  private handleStartGame(socket: Socket): void {
    socket.on('start-game', async ({ roomId }: { roomId: string }) => {
      try {
        const room = this.roomManager.getRoom(roomId);

        if (!room) {
          throw new Error('Room not found');
        }

        if (room.hostId !== socket.id) {
          throw new Error('Only host can start game');
        }

        if (room.players.length < 2) {
          throw new Error('Need at least 2 players');
        }

        // Initialize game
        const gameState = GameLogic.initializeGame(roomId, room.players);
        room.gameState = gameState;

        // Update room.players with the game state players (which have cards dealt)
        room.players = gameState.players;

        console.log(`🎮 Game initialized for room: ${roomId}`);
        console.log(`📊 Number of players: ${gameState.players.length}`);
        console.log(`🎴 Deck count: ${gameState.deckCount}`);

        // Send game state to all players (with individual hands)
        gameState.players.forEach(player => {
          console.log(`👤 Sending to player ${player.username} (${player.id})`);
          console.log(`   🃏 Hand size: ${player.hand.length} cards`);
          console.log(`   🎴 Hand: ${player.hand.map(c => c.displayValue).join(', ')}`);

          this.io.to(player.id).emit('game-started', {
            gameState: this.sanitizeGameStateForPlayer(gameState, player.id),
            yourHand: player.hand,
          });
        });

        console.log(`✅ Game started in room: ${roomId}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        socket.emit('error', {
          error: errorMessage,
          code: 'START_GAME_FAILED',
        });
      }
    });
  }

  /**
   * Handle playing a card
   */
  private handlePlayCard(socket: Socket): void {
    socket.on('play-card', async (payload: PlayCardPayload) => {
      try {
        const room = this.roomManager.getRoom(payload.roomId);
        if (!room || !room.gameState) {
          throw new Error('Game not found');
        }

        const gameState = room.gameState;

        // Find the card in player's hand
        const player = gameState.players.find(p => p.id === socket.id);
        const card = player?.hand.find(c => c.id === payload.cardId);

        if (!card) {
          throw new Error('Card not found in hand');
        }

        // Validate the play
        const validation = GameLogic.validateCardPlay(gameState, socket.id, card);
        if (!validation.valid) {
          socket.emit('error', {
            error: validation.error || 'Invalid play',
            code: 'INVALID_PLAY',
          });
          return;
        }

        // Process the card play
        const { newState, effects } = GameLogic.playCard(
          gameState,
          socket.id,
          payload.cardId
        );

        room.gameState = newState;

        // Emit effects to all players
        effects.forEach(effect => {
          this.io.to(payload.roomId).emit('game-effect', effect);
        });

        // Send updated game state
        this.broadcastGameState(payload.roomId, newState);

        console.log(`Card played in room ${payload.roomId}: ${card.displayValue}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        socket.emit('error', {
          error: errorMessage,
          code: 'PLAY_CARD_FAILED',
        });
      }
    });
  }

  /**
   * Handle when player cannot play
   */
  private handleCannotPlay(socket: Socket): void {
    socket.on('cannot-play', async ({ roomId }: { roomId: string }) => {
      try {
        const room = this.roomManager.getRoom(roomId);
        if (!room || !room.gameState) {
          throw new Error('Game not found');
        }

        const { newState, effects } = GameLogic.handleCannotPlay(
          room.gameState,
          socket.id
        );

        room.gameState = newState;

        // Emit effects
        effects.forEach(effect => {
          this.io.to(roomId).emit('game-effect', effect);
        });

        // Send updated game state
        this.broadcastGameState(roomId, newState);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        socket.emit('error', {
          error: errorMessage,
          code: 'CANNOT_PLAY_FAILED',
        });
      }
    });
  }

  /**
   * Handle chat messages
   */
  private handleChatMessage(socket: Socket): void {
    socket.on('send-message', async (payload: ChatMessagePayload) => {
      try {
        const room = this.roomManager.getRoom(payload.roomId);
        if (!room) {
          throw new Error('Room not found');
        }

        const player = room.players.find(p => p.id === socket.id);
        if (!player) {
          throw new Error('Player not in room');
        }

        this.io.to(payload.roomId).emit('message-received', {
          playerId: socket.id,
          username: player.username,
          message: payload.message,
          timestamp: new Date(),
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        socket.emit('error', {
          error: errorMessage,
          code: 'SEND_MESSAGE_FAILED',
        });
      }
    });
  }

  /**
   * Handle mic toggle
   */
  private handleToggleMic(socket: Socket): void {
    socket.on('toggle-mic', async ({ roomId, muted }: { roomId: string; muted: boolean }) => {
      try {
        const room = this.roomManager.getRoom(roomId);
        if (!room) {
          throw new Error('Room not found');
        }

        const player = room.players.find(p => p.id === socket.id);
        if (player) {
          player.isMuted = muted;

          this.io.to(roomId).emit('player-mic-changed', {
            playerId: socket.id,
            muted,
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        socket.emit('error', {
          error: errorMessage,
          code: 'TOGGLE_MIC_FAILED',
        });
      }
    });
  }

  /**
   * Handle disconnect
   */
  private handleDisconnect(socket: Socket): void {
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);

      // Find and handle all rooms the player was in
      const rooms = this.roomManager.findPlayerRooms(socket.id);
      rooms.forEach(room => {
        try {
          const result = this.roomManager.leaveRoom(room.id, socket.id);

          if (result.newHost) {
            this.io.to(room.id).emit('host-changed', {
              newHostId: result.newHost.id,
            });
          }

          this.io.to(room.id).emit('player-left', {
            playerId: socket.id,
            room: result.room,
          });
        } catch (error) {
          console.error('Error handling disconnect:', error);
        }
      });
    });
  }

  /**
   * Broadcast game state to all players (with sanitization)
   */
  private broadcastGameState(roomId: string, gameState: any): void {
    gameState.players.forEach((player: Player) => {
      this.io.to(player.id).emit('game-state-update', {
        gameState: this.sanitizeGameStateForPlayer(gameState, player.id),
        yourHand: player.hand,
      });
    });
  }

  /**
   * Remove other players' hands and deck from game state for security
   */
  private sanitizeGameStateForPlayer(gameState: any, playerId: string): any {
    return {
      ...gameState,
      deck: undefined, // Never send the deck to clients
      players: gameState.players.map((p: Player) => ({
        ...p,
        hand: p.id === playerId ? p.hand : Array(p.hand.length).fill({ id: 'hidden', type: 'hidden', value: 0, displayValue: '?' }), // Show card count but hide details
      })),
    };
  }
}
