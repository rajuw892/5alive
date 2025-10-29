// backend/src/utils/cardDeck.util.ts
import { v4 as uuidv4 } from 'uuid';
import { Card, WildType } from '../types/game.types';

/**
 * Creates a complete 5 Alive deck based on official rules
 * 
 * Number Cards:
 * 1x 7, 2x 6, 4x 5, 8x 4, 8x 3, 8x 2, 8x 1, 8x 0
 * 
 * Wild Cards:
 * 1x Bomb, 1x Hand in and Redeal, 3x =0, 2x =10, 2x Draw 1, 
 * 2x Draw 2, 2x Reverse, 6x Skip, 5x =21, 4x Pass Me By
 */
export function createDeck(): Card[] {
  const deck: Card[] = [];

  // Number cards
  const numberCards = [
    { value: 7, count: 1 },
    { value: 6, count: 2 },
    { value: 5, count: 4 },
    { value: 4, count: 8 },
    { value: 3, count: 8 },
    { value: 2, count: 8 },
    { value: 1, count: 8 },
    { value: 0, count: 8 },
  ];

  for (const { value, count } of numberCards) {
    for (let i = 0; i < count; i++) {
      deck.push({
        id: uuidv4(),
        type: 'number',
        value,
        displayValue: value.toString(),
      });
    }
  }

  // Wild cards with their effects
  const wildCards: Array<{ wildType: WildType; value: number; count: number }> = [
    { wildType: 'bomb', value: 0, count: 1 },
    { wildType: 'hand-in-redeal', value: 0, count: 1 },
    { wildType: 'equals-zero', value: 0, count: 3 },
    { wildType: 'equals-ten', value: 10, count: 2 },
    { wildType: 'draw-one', value: 0, count: 2 },
    { wildType: 'draw-two', value: 0, count: 2 },
    { wildType: 'reverse', value: 0, count: 2 },
    { wildType: 'skip', value: 0, count: 6 },
    { wildType: 'equals-21', value: 21, count: 5 },
    { wildType: 'pass-me-by', value: 0, count: 4 },
  ];

  for (const { wildType, value, count } of wildCards) {
    for (let i = 0; i < count; i++) {
      deck.push({
        id: uuidv4(),
        type: 'wild',
        value,
        wildType,
        displayValue: getWildCardDisplay(wildType),
      });
    }
  }

  return deck;
}

/**
 * Shuffles a deck using Fisher-Yates algorithm
 */
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Deals cards to players
 */
export function dealCards(
  deck: Card[],
  playerCount: number,
  cardsPerPlayer: number
): { hands: Card[][]; remainingDeck: Card[] } {
  const hands: Card[][] = Array.from({ length: playerCount }, () => []);
  let currentDeck = [...deck];

  for (let i = 0; i < cardsPerPlayer; i++) {
    for (let j = 0; j < playerCount; j++) {
      if (currentDeck.length > 0) {
        hands[j].push(currentDeck.pop()!);
      }
    }
  }

  return {
    hands,
    remainingDeck: currentDeck,
  };
}

/**
 * Gets display name for wild cards
 */
function getWildCardDisplay(wildType: WildType): string {
  const displays: Record<WildType, string> = {
    'bomb': '💣 BOMB',
    'hand-in-redeal': '🔄 Re-Deal',
    'equals-zero': '=0',
    'equals-ten': '=10',
    'equals-21': '=21',
    'draw-one': '📥 +1',
    'draw-two': '📥 +2',
    'reverse': '↩️ Reverse',
    'skip': '⏭️ Skip',
    'pass-me-by': '⏩ Pass',
  };
  return displays[wildType];
}

/**
 * Validates if a card can be played given the current total
 */
export function canPlayCard(card: Card, currentTotal: number): boolean {
  // Wild cards can always be played
  if (card.type === 'wild') {
    return true;
  }

  // Number cards can be played if they don't exceed 21
  return currentTotal + card.value <= 21;
}

/**
 * Calculates the new total after playing a card
 */
export function calculateNewTotal(card: Card, currentTotal: number): number {
  if (card.type === 'number') {
    return currentTotal + card.value;
  }

  // Wild card effects
  switch (card.wildType) {
    case 'equals-zero':
      return 0;
    case 'equals-ten':
      return 10;
    case 'equals-21':
      return 21;
    case 'bomb':
    case 'hand-in-redeal':
      return 0;
    default:
      // Other wild cards don't change the total
      return currentTotal;
  }
}

/**
 * Gets the value a player would need to check against 21
 */
export function getEffectiveValue(card: Card, currentTotal: number): number {
  if (card.type === 'wild') {
    return calculateNewTotal(card, currentTotal);
  }
  return currentTotal + card.value;
}

/**
 * Checks if a player has any playable cards
 */
export function hasPlayableCard(hand: Card[], currentTotal: number): boolean {
  return hand.some(card => canPlayCard(card, currentTotal));
}

/**
 * Finds all cards with value 0 in a hand (for BOMB response)
 */
export function findZeroCards(hand: Card[]): Card[] {
  return hand.filter(card => card.type === 'number' && card.value === 0);
}

/**
 * Draws cards from deck and returns updated deck and drawn cards
 */
export function drawCardsFromDeck(
  deck: Card[],
  count: number
): { drawnCards: Card[]; remainingDeck: Card[] } {
  const deckCopy = [...deck];
  const drawnCards: Card[] = [];

  for (let i = 0; i < count && deckCopy.length > 0; i++) {
    const card = deckCopy.pop();
    if (card) {
      drawnCards.push(card);
    }
  }

  return {
    drawnCards,
    remainingDeck: deckCopy,
  };
}

/**
 * Collects all cards from players, discard pile, shuffles and redeals
 */
export function redealAllHands(
  playerHands: Card[][],
  discardPile: Card[],
  deck: Card[],
  cardsPerPlayer: number
): { hands: Card[][]; remainingDeck: Card[]; newDiscardPile: Card[] } {
  // Collect all cards
  const allCards: Card[] = [];

  // Add all player hands
  playerHands.forEach(hand => {
    allCards.push(...hand);
  });

  // Add discard pile
  allCards.push(...discardPile);

  // Add remaining deck
  allCards.push(...deck);

  // Shuffle all cards
  const shuffledDeck = shuffleDeck(allCards);

  // Deal new hands
  const { hands, remainingDeck } = dealCards(
    shuffledDeck,
    playerHands.length,
    cardsPerPlayer
  );

  return {
    hands,
    remainingDeck,
    newDiscardPile: [], // Empty discard pile after redeal
  };
}
