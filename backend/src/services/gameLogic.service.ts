// backend/src/services/gameLogic.service.ts
import {
  GameState,
  Player,
  Card,
  Direction,
  INITIAL_LIVES,
  INITIAL_CARDS,
  MAX_TOTAL
} from '../types/game.types.js';
import {
  createDeck,
  shuffleDeck,
  dealCards,
  calculateNewTotal,
  findZeroCards,
  drawCardsFromDeck,
  redealAllHands
} from '../utils/cardDeck.util.js';

// Card play effect types
export interface CardPlayEffect {
  type: string;
  playerId?: string;
  card?: Card;
  newTotal?: number;
  count?: number;
  direction?: Direction;
  livesRemaining?: number;
  reason?: string;
  cardDiscarded?: Card;
}

export class GameLogic {
  /**
   * Initializes a new game
   */
  static initializeGame(roomId: string, players: Player[]): GameState {
    const deck = shuffleDeck(createDeck());
    const { hands, remainingDeck } = dealCards(deck, players.length, INITIAL_CARDS);

    // Assign hands to players and initialize lives
    const initializedPlayers = players.map((player, index) => ({
      ...player,
      hand: hands[index],
      livesRemaining: INITIAL_LIVES,
      aliveCards: Array(INITIAL_LIVES).fill(true),
      isEliminated: false,
    }));

    return {
      roomId,
      players: initializedPlayers,
      currentPlayerIndex: 0,
      runningTotal: 0,
      direction: 'clockwise',
      discardPile: [],
      deck: remainingDeck,
      deckCount: remainingDeck.length,
      phase: 'playing',
      winner: null,
      createdAt: new Date(),
      startedAt: new Date(),
    };
  }

  /**
   * Validates if a card play is legal
   */
  static validateCardPlay(
    gameState: GameState,
    playerId: string,
    card: Card
  ): { valid: boolean; error?: string } {
    const player = gameState.players.find(p => p.id === playerId);
    
    if (!player) {
      return { valid: false, error: 'Player not found' };
    }

    if (gameState.phase !== 'playing') {
      return { valid: false, error: 'Game is not in playing phase' };
    }

    if (player.isEliminated) {
      return { valid: false, error: 'Player is eliminated' };
    }

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.id !== playerId) {
      return { valid: false, error: 'Not your turn' };
    }

    if (!player.hand.find(c => c.id === card.id)) {
      return { valid: false, error: 'Card not in hand' };
    }

    return { valid: true };
  }

  /**
   * Processes a card play and returns updated game state
   */
  static playCard(
    gameState: GameState,
    playerId: string,
    cardId: string
  ): {
    newState: GameState;
    effects: CardPlayEffect[];
  } {
    const player = gameState.players.find(p => p.id === playerId);
    const card = player?.hand.find(c => c.id === cardId);

    if (!player || !card) {
      throw new Error('Invalid play');
    }

    const effects: CardPlayEffect[] = [];
    const newState = { ...gameState };

    // Remove card from player's hand
    player.hand = player.hand.filter(c => c.id !== cardId);

    // Add to discard pile
    newState.discardPile = [...newState.discardPile, card];

    // Calculate new total
    const newTotal = calculateNewTotal(card, newState.runningTotal);
    newState.runningTotal = newTotal;

    effects.push({
      type: 'card-played',
      playerId: player.id,
      card,
      newTotal,
    });

    // Process wild card effects
    if (card.type === 'wild') {
      const wildEffects = this.processWildCard(newState, card, player);
      effects.push(...wildEffects);
    }

    // Check if player played their last card
    if (player.hand.length === 0) {
      effects.push({
        type: 'last-card-played',
        playerId: player.id,
      });

      // All other players lose a life
      newState.players.forEach(p => {
        if (p.id !== player.id && !p.isEliminated) {
          this.flipLife(p);
          effects.push({
            type: 'life-flipped',
            playerId: p.id,
            livesRemaining: p.livesRemaining,
          });

          if (p.isEliminated) {
            effects.push({
              type: 'player-eliminated',
              playerId: p.id,
            });
          }
        }
      });

      // Reshuffle and deal new hand
      effects.push({ type: 'reshuffle-needed' });
    } else {
      // Move to next player
      newState.currentPlayerIndex = this.getNextPlayerIndex(newState);
      effects.push({
        type: 'turn-changed',
        playerId: newState.players[newState.currentPlayerIndex].id,
      });
    }

    // Check for winner
    const activePlayers = newState.players.filter(p => !p.isEliminated);
    if (activePlayers.length === 1) {
      newState.winner = activePlayers[0];
      newState.phase = 'finished';
      newState.finishedAt = new Date();
      effects.push({
        type: 'game-over',
        playerId: activePlayers[0].id,
      });
    }

    return { newState, effects };
  }

  /**
   * Processes wild card special effects
   */
  private static processWildCard(
    gameState: GameState,
    card: Card,
    player: Player
  ): CardPlayEffect[] {
    const effects: CardPlayEffect[] = [];

    switch (card.wildType) {
      case 'draw-one':
        gameState.players.forEach(p => {
          if (p.id !== player.id && !p.isEliminated) {
            // Actually draw cards from deck
            const { drawnCards, remainingDeck } = drawCardsFromDeck(gameState.deck, 1);
            gameState.deck = remainingDeck;
            gameState.deckCount = remainingDeck.length;

            // Add drawn cards to player's hand
            p.hand.push(...drawnCards);

            effects.push({
              type: 'draw-cards',
              playerId: p.id,
              count: drawnCards.length,
            });
          }
        });
        break;

      case 'draw-two':
        gameState.players.forEach(p => {
          if (p.id !== player.id && !p.isEliminated) {
            // Actually draw cards from deck
            const { drawnCards, remainingDeck } = drawCardsFromDeck(gameState.deck, 2);
            gameState.deck = remainingDeck;
            gameState.deckCount = remainingDeck.length;

            // Add drawn cards to player's hand
            p.hand.push(...drawnCards);

            effects.push({
              type: 'draw-cards',
              playerId: p.id,
              count: drawnCards.length,
            });
          }
        });
        break;

      case 'reverse':
        gameState.direction = gameState.direction === 'clockwise' 
          ? 'counterclockwise' 
          : 'clockwise';
        effects.push({
          type: 'direction-reversed',
          direction: gameState.direction,
        });
        break;

      case 'skip':
        const skippedIndex = this.getNextPlayerIndex(gameState);
        const skippedPlayer = gameState.players[skippedIndex];
        effects.push({
          type: 'player-skipped',
          playerId: skippedPlayer.id,
        });
        gameState.currentPlayerIndex = this.getNextPlayerIndex(gameState, skippedIndex);
        break;

      case 'pass-me-by':
        gameState.currentPlayerIndex = this.getNextPlayerIndex(gameState);
        effects.push({
          type: 'player-passed',
          playerId: gameState.players[gameState.currentPlayerIndex].id,
        });
        break;

      case 'bomb':
        gameState.players.forEach(p => {
          if (p.id !== player.id && !p.isEliminated) {
            const zeroCards = findZeroCards(p.hand);
            if (zeroCards.length > 0) {
              // Player discards a 0
              p.hand = p.hand.filter(c => c.id !== zeroCards[0].id);
              effects.push({
                type: 'bomb-defended',
                playerId: p.id,
                cardDiscarded: zeroCards[0],
              });
            } else {
              // Player loses a life
              this.flipLife(p);
              effects.push({
                type: 'life-flipped',
                playerId: p.id,
                livesRemaining: p.livesRemaining,
                reason: 'bomb',
              });

              if (p.isEliminated) {
                effects.push({
                  type: 'player-eliminated',
                  playerId: p.id,
                });
              }
            }
          }
        });
        break;

      case 'hand-in-redeal':
        // Collect all player hands
        const playerHands = gameState.players.map(p => p.hand);

        // Redeal all cards
        const { hands, remainingDeck, newDiscardPile } = redealAllHands(
          playerHands,
          gameState.discardPile,
          gameState.deck,
          INITIAL_CARDS
        );

        // Update game state
        gameState.players.forEach((p, index) => {
          p.hand = hands[index];
        });
        gameState.deck = remainingDeck;
        gameState.deckCount = remainingDeck.length;
        gameState.discardPile = newDiscardPile;
        gameState.runningTotal = 0; // Reset total after redeal

        effects.push({
          type: 'hand-in-redeal',
          reason: 'All cards reshuffled and redealt'
        });
        break;
    }

    return effects;
  }

  /**
   * Flips a life for a player
   */
  private static flipLife(player: Player): void {
    if (player.livesRemaining > 0) {
      player.livesRemaining--;
      const lifeIndex = player.aliveCards.findIndex(alive => alive);
      if (lifeIndex !== -1) {
        player.aliveCards[lifeIndex] = false;
      }
      if (player.livesRemaining === 0) {
        player.isEliminated = true;
      }
    }
  }

  /**
   * Gets the next player index based on direction
   */
  private static getNextPlayerIndex(
    gameState: GameState,
    currentIndex?: number
  ): number {
    const startIndex = currentIndex ?? gameState.currentPlayerIndex;
    const playerCount = gameState.players.length;
    let nextIndex = startIndex;

    do {
      if (gameState.direction === 'clockwise') {
        nextIndex = (nextIndex + 1) % playerCount;
      } else {
        nextIndex = (nextIndex - 1 + playerCount) % playerCount;
      }
    } while (gameState.players[nextIndex].isEliminated && nextIndex !== startIndex);

    return nextIndex;
  }

  /**
   * Handles when a player cannot play without going over 21
   */
  static handleCannotPlay(gameState: GameState, playerId: string): {
    newState: GameState;
    effects: CardPlayEffect[];
  } {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    const effects: CardPlayEffect[] = [];

    // Player loses a life
    this.flipLife(player);
    effects.push({
      type: 'life-flipped',
      playerId: player.id,
      livesRemaining: player.livesRemaining,
      reason: 'cannot-play',
    });

    if (player.isEliminated) {
      effects.push({
        type: 'player-eliminated',
        playerId: player.id,
      });
    }

    // Reset running total
    gameState.runningTotal = 0;

    // Move to next player
    gameState.currentPlayerIndex = this.getNextPlayerIndex(gameState);
    effects.push({
      type: 'turn-changed',
      playerId: gameState.players[gameState.currentPlayerIndex].id,
    });

    // Check for winner
    const activePlayers = gameState.players.filter(p => !p.isEliminated);
    if (activePlayers.length === 1) {
      gameState.winner = activePlayers[0];
      gameState.phase = 'finished';
      gameState.finishedAt = new Date();
      effects.push({
        type: 'game-over',
        playerId: activePlayers[0].id,
      });
    }

    return { newState: gameState, effects };
  }
}
