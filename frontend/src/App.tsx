// frontend/src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home-page';
import { GamePage } from './pages/GamePage';
import { RoomList } from './pages/RoomList';
import { GameProvider, useGame } from './contexts/GameContext';
import { NotificationContainer } from './components/UI/NotificationContainer';

function AppContent() {
  const { notifications, removeNotification } = useGame();

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<RoomList />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </BrowserRouter>
      <NotificationContainer
        notifications={notifications}
        onClose={removeNotification}
      />
    </>
  );
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
