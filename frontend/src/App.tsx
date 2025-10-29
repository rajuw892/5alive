// frontend/src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home-page';
import { GamePage } from './pages/GamePage';
import { RoomList } from './pages/RoomList';
import { GameProvider } from './contexts/GameContext';

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<RoomList />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
