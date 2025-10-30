// src/services/roomManager.service.ts
import { Room, Player } from '../types/game.types.js';

export class RoomManager {
  private rooms: Map<string, Room> = new Map();

  /**
   * Generates a short, readable room code (6 uppercase alphanumeric characters)
   */
  private generateRoomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';

    // Keep generating until we get a unique code
    do {
      code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (this.rooms.has(code));

    return code;
  }

  createRoom(host: Player, maxPlayers: number = 6, password?: string): Room {
    const room: Room = {
      id: this.generateRoomCode(),
      hostId: host.id,
      players: [host],
      maxPlayers,
      createdAt: new Date(),
      password,
    };

    this.rooms.set(room.id, room);
    return room;
  }

  joinRoom(roomId: string, player: Player, password?: string): Room {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      throw new Error('Room not found');
    }

    if (room.password && room.password !== password) {
      throw new Error('Invalid password');
    }

    if (room.players.length >= room.maxPlayers) {
      throw new Error('Room is full');
    }

    if (room.gameState?.phase === 'playing') {
      throw new Error('Game already in progress');
    }

    room.players.push(player);
    return room;
  }

  leaveRoom(roomId: string, playerId: string): {
    room: Room | null;
    newHost?: Player;
  } {
    const room = this.rooms.get(roomId);
    
    if (!room) {
      return { room: null };
    }

    room.players = room.players.filter(p => p.id !== playerId);

    if (room.players.length === 0) {
      this.rooms.delete(roomId);
      return { room: null };
    }

    let newHost: Player | undefined;
    if (room.hostId === playerId) {
      newHost = room.players[0];
      room.hostId = newHost.id;
      newHost.isHost = true;
    }

    return { room, newHost };
  }

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId);
  }

  findPlayerRooms(playerId: string): Room[] {
    return Array.from(this.rooms.values()).filter(room =>
      room.players.some(p => p.id === playerId)
    );
  }

  getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }
}