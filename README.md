# 🎴 5 ALIVE - Multiplayer Card Game

A complete, production-ready multiplayer card game with **real-time voice chat**, **text chat**, **beautiful animations**, and **sound effects**.

![5 Alive Game](https://img.shields.io/badge/Status-Complete-success)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)
![React](https://img.shields.io/badge/React-19-purple)
![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-green)
![Agora](https://img.shields.io/badge/Agora-Voice%20Chat-orange)

## 🎮 What is 5 Alive?

5 Alive is a fast-paced multiplayer card game where players must keep the running total under 21 or lose a life. Play strategic wild cards, communicate with voice and text chat, and be the last player standing to win!

### 🎯 Game Rules

- Each player starts with **5 lives** and **10 cards**
- Take turns playing cards to keep the **running total under 21**
- If you can't play without going over 21, you **lose a life**
- Play **wild cards** for special effects (Bomb, Reverse, Skip, etc.)
- When a player plays their last card, **all other players lose a life**
- **Last player with lives remaining wins!**

## ✨ Features

### 🎮 Complete Game Mechanics
- ✅ Full card game implementation (all wild cards working)
- ✅ 5 lives per player with visual indicators
- ✅ Turn-based gameplay with direction changes
- ✅ Running total system (must stay ≤ 21)
- ✅ Player elimination system
- ✅ Winner detection and celebration

### 🌐 Multiplayer
- ✅ Create and join rooms
- ✅ Public room browser
- ✅ Password-protected rooms
- ✅ Real-time synchronization
- ✅ 2-6 players per game
- ✅ Host migration

### 🎤 Communication
- ✅ **Agora Voice Chat** - Talk to other players in real-time
- ✅ **Text Chat** - Send messages during the game
- ✅ **Quick Messages** - Predefined reactions
- ✅ **Emoji Support** - 16 emojis to express yourself
- ✅ **System Notifications** - Game events in chat

### 🎨 UI/UX
- ✅ Beautiful animated cards
- ✅ Poker table design
- ✅ Smooth transitions and hover effects
- ✅ Winner celebration screen with confetti
- ✅ Responsive layout
- ✅ Real-time player indicators
- ✅ Connection status displays

### 🔊 Audio
- ✅ Comprehensive sound effects system
- ✅ Card play sounds
- ✅ Wild card effects
- ✅ Life lost sounds
- ✅ Victory/defeat music
- ✅ Volume control
- ✅ Mute toggle

## 🚀 Quick Start

### Prerequisites
- Node.js 20.12+ (20.19+ recommended)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd 5alive
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Configure Environment Variables**

Backend `.env`:
```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
VITE_AGORA_APP_ID=a017a84c07a846eda3bb5b0466e88f73
```

Frontend `.env`:
```env
VITE_SOCKET_URL=http://localhost:3000
VITE_AGORA_APP_ID=a017a84c07a846eda3bb5b0466e88f73
```

### Running the Game

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server starts on: `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend starts on: `http://localhost:5173`

### Start Playing!

1. Open `http://localhost:5173` in your browser
2. Click **"Create Room"**
3. Open another browser tab (or incognito window)
4. Click **"Browse Rooms"** and join
5. Host clicks **"Start Game"**
6. Enjoy! 🎉

## 📂 Project Structure

```
5alive/
├── backend/
│   ├── src/
│   │   ├── index.ts              # Server entry point
│   │   ├── socket/
│   │   │   └── gameSocket.ts     # Socket.io event handlers
│   │   ├── services/
│   │   │   ├── gameLogic.service.ts    # Game rules
│   │   │   └── roomManager.services.ts # Room management
│   │   ├── utils/
│   │   │   └── cardDeck.util.ts  # Card utilities
│   │   └── types/
│   │       └── game.types.ts     # TypeScript types
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx               # Main app component
│   │   ├── contexts/
│   │   │   └── GameContext.tsx   # Global game state
│   │   ├── components/
│   │   │   ├── Game/
│   │   │   │   ├── Game-board.tsx       # Main game board
│   │   │   │   └── WinnerModal.tsx      # Victory screen
│   │   │   ├── Room/
│   │   │   │   └── RoomLobby.tsx        # Pre-game lobby
│   │   │   ├── UI/
│   │   │   │   └── Card.tsx             # Card component
│   │   │   ├── Voice/
│   │   │   │   └── VoiceChat.tsx        # Agora voice
│   │   │   └── Chat/
│   │   │       └── GameChat.tsx         # Text chat
│   │   ├── pages/
│   │   │   ├── Home-page.tsx     # Landing page
│   │   │   ├── RoomList.tsx      # Room browser
│   │   │   └── GamePage.tsx      # Game container
│   │   ├── hooks/
│   │   │   └── useSoundEffects.ts # Sound system
│   │   └── types/
│   │       └── game.types.ts     # TypeScript types
│   ├── package.json
│   └── .env
│
├── GAME_FEATURES.md              # Detailed feature list
└── README.md                     # This file
```

## 🎮 How to Play

### Creating a Room
1. Click **"Create Room"**
2. Enter your username
3. Select max players (2-6)
4. Optional: Set a password
5. Click **"Create Room"**
6. Share the room code with friends

### Joining a Room
**Option 1: Browse Rooms**
1. Click **"Browse Rooms"**
2. See all active rooms
3. Click **"Join Room"** on any available room

**Option 2: Join with Code**
1. Click **"Join with Code"**
2. Enter your username
3. Enter the room code
4. Click **"Join Room"**

### In the Lobby
- **Host**: Click "Start Game" when ready (needs 2+ players)
- **Players**: Wait for host to start
- **Everyone**: Voice chat is available in lobby
- Copy room code to share with friends

### During the Game
- **Your Turn**: Click a card once to select, twice to play
- **Can't Play**: Click "Can't Play" button to lose a life
- **Voice Chat**: Use mic button (bottom right) to mute/unmute
- **Text Chat**: Click chat icon (bottom left) to send messages
- **Quick Reactions**: Use emoji and quick message buttons

### Wild Cards
- **Bomb** 💣 - Others must discard a 0 or lose a life
- **Reverse** ↩️ - Change turn direction
- **Skip** ⏭️ - Skip next player
- **Pass Me By** ⏩ - Pass your turn
- **Draw 1/2** 📥 - Others draw 1 or 2 cards
- **=21** 🎯 - Set total to 21
- **=10** 🔟 - Set total to 10
- **=0** ⭕ - Reset total to 0
- **Hand-in-Redeal** 🔄 - Reshuffle all hands

### Winning
- Be the last player with lives remaining
- Or have the most lives when another player is eliminated

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **Socket.io Client** - Real-time communication
- **Agora RTC SDK** - Voice chat
- **Vite** - Build tool
- **React Router** - Navigation

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Socket.io** - WebSocket server
- **tsx** - TypeScript execution

## 🎨 Key Features Showcase

### Voice Chat
- **Agora-powered** - Crystal clear audio
- **Visual indicators** - See who's talking
- **Easy controls** - One-click mute/unmute
- **Auto-join** - Connects when game starts
- **Low latency** - Real-time communication

### Text Chat
- **Real-time messages** - Instant delivery
- **Quick reactions** - One-tap responses
- **Emoji support** - 16 emojis available
- **System messages** - Game events in chat
- **Scrollable history** - Never miss a message

### Sound Effects
- **Procedurally generated** - Web Audio API
- **12+ sound effects** - For every action
- **Volume control** - Adjust to preference
- **Mute option** - Disable if needed
- **No external files** - All generated in-browser

### Animations
- **Smooth transitions** - 60 FPS performance
- **Hover effects** - Interactive feedback
- **Winner celebration** - Confetti and particles
- **Card animations** - Flip, shine, and glow
- **Loading states** - Professional polish

## 🐛 Troubleshooting

### Voice Chat Not Working?
1. **Check permissions**: Allow microphone access in browser
2. **Verify App ID**: Check `VITE_AGORA_APP_ID` in `.env`
3. **Try refreshing**: Reload the page
4. **Check console**: Look for Agora errors in browser console

### Can't Connect to Server?
1. **Backend running?**: Check Terminal 1 for `🚀 Server running`
2. **Port 3000 free?**: Make sure nothing else is using port 3000
3. **CORS settings**: Verify `CORS_ORIGIN` in backend `.env`
4. **Firewall**: Check if firewall is blocking connections

### Room Not Showing in Browser?
1. **Click Refresh**: Use the refresh button in Room List
2. **Check backend**: Look for room creation logs
3. **Socket connected**: Verify connection status indicator

### Cards Not Playing?
1. **Your turn?**: Check if border is glowing around you
2. **Valid play?**: Card must not take total over 21
3. **Click twice**: Select card first, then click again to play

## 🔒 Security Notes

- Currently uses **guest mode** (no authentication required)
- Agora uses **App ID only** (for testing/development)
- **Production deployment** should add:
  - User authentication
  - Agora token server
  - Rate limiting
  - Input validation
  - HTTPS/WSS

## 📝 Future Enhancements

Possible additions for future versions:
- 🎵 Background music
- 📊 Statistics and leaderboard
- 👤 User accounts
- 🏆 Achievements
- 📱 Mobile app
- 🎨 Custom card designs
- 🌍 Multiple languages
- 🤖 AI opponents
- 🎪 Tournament mode

## 📄 License

This project is for educational and entertainment purposes.

## 🤝 Contributing

Want to contribute? Great!
1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

Having issues? Check:
1. This README
2. `GAME_FEATURES.md` for detailed features
3. Browser console for errors
4. Backend logs in terminal

## 🎉 Credits

Built with ❤️ using:
- React, TypeScript, Socket.io
- Agora RTC SDK
- Framer Motion
- Tailwind CSS

---

**Ready to play? Open http://localhost:5173 and start a game! 🎴🎮**

Enjoy 5 ALIVE - The Ultimate Multiplayer Card Game Experience!
