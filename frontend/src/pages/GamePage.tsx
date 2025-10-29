// frontend/src/pages/GamePage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameBoard } from '../components/Game/Game-board';
import { RoomLobby } from '../components/Room/RoomLobby';
import { useGame } from '../contexts/GameContext';
import { GameChat } from '../components/Chat/GameChat';
import { WinnerModal } from '../components/Game/WinnerModal';

export const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    socket,
    roomId,
    gameState,
    myHand,
    currentPlayer,
    isMyTurn,
    players,
    playCard,
    cannotPlay,
    startGame,
    leaveRoom,
  } = useGame();

  // Redirect if no room
  useEffect(() => {
    if (!roomId) {
      navigate('/');
    }
  }, [roomId, navigate]);

  const handleLeaveRoom = () => {
    leaveRoom();
    navigate('/');
  };

  const handleLeaveGame = () => {
    leaveRoom();
    navigate('/');
  };

  // Get my player ID from socket
  const myPlayerId = socket?.id || '';
  const me = players.find(p => p.id === myPlayerId);
  const isHost = me?.isHost || false;

  // Debug logging
  useEffect(() => {
    if (gameState?.phase === 'playing') {
      console.log('🎮 GamePage Debug:');
      console.log('  - Game State:', gameState);
      console.log('  - My Hand:', myHand);
      console.log('  - Is My Turn:', isMyTurn);
      console.log('  - Current Player:', currentPlayer);
      console.log('  - My Player ID:', myPlayerId);
    }
  }, [gameState, myHand, isMyTurn, currentPlayer, myPlayerId]);

  // Show lobby if game hasn't started
  if (!gameState || gameState.phase === 'waiting') {
    return (
      <RoomLobby
        roomId={roomId || ''}
        players={players}
        isHost={isHost}
        maxPlayers={6}
        onStartGame={startGame}
        onLeaveRoom={handleLeaveRoom}
      />
    );
  }

  // Show game board
  return (
    <>
      <GameBoard
        gameState={gameState}
        myHand={myHand}
        isMyTurn={isMyTurn}
        currentPlayer={currentPlayer}
        myPlayerId={myPlayerId}
        onPlayCard={playCard}
        onCannotPlay={cannotPlay}
        onLeaveGame={handleLeaveGame}
      />

      {/* In-Game Chat */}
      <GameChat />

      {/* Winner Modal */}
      {gameState.phase === 'finished' && gameState.winner && (
        <WinnerModal
          winner={gameState.winner}
          myPlayerId={myPlayerId}
        />
      )}
    </>
  );
};
