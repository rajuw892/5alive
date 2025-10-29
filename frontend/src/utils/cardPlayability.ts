// frontend/src/utils/cardPlayability.ts
import { Card, GameState } from '../types/game.types';

/**
 * Determines if a card can be played based on the current game state
 */
export function isCardPlayable(
  card: Card,
  runningTotal: number,
  hasZeroCards: boolean
): boolean {
  // Wild cards can always be played (they have special effects)
  if (card.type === 'wild') {
    return true;
  }

  // Number cards - check if they would exceed MAX_TOTAL (21)
  const MAX_TOTAL = 21;
  const newTotal = runningTotal + card.value;

  // If playing this card would exceed 21, it's not playable
  // UNLESS the player has no playable cards (then they must play and lose a life)
  if (newTotal > MAX_TOTAL) {
    return false;
  }

  // Otherwise, the card is playable
  return true;
}

/**
 * Checks if any card in the hand is playable
 */
export function hasPlayableCard(
  hand: Card[],
  runningTotal: number
): boolean {
  return hand.some(card => isCardPlayable(card, runningTotal, false));
}

/**
 * Get all playable cards from a hand
 */
export function getPlayableCards(
  hand: Card[],
  runningTotal: number
): Card[] {
  return hand.filter(card => isCardPlayable(card, runningTotal, false));
}

/**
 * Check if player has any zero-value cards
 */
export function hasZeroCard(hand: Card[]): boolean {
  return hand.some(card => card.value === 0);
}
