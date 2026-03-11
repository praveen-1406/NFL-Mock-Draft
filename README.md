# 🏈 NFL Mock Draft Simulator

An AI-powered NFL Mock Draft Simulator where you pick for your chosen team and Google Gemini AI controls the remaining 6 teams across 4 rounds.

> Built for the EssentiallySports.

---

## Loom Walkthrough

 [Watch the walkthrough here](#) 

---

## How It Works

- Choose 1 of 7 real 2026 NFL Draft teams to control
- AI (Google Gemini) controls the other 6 teams
- 4 rounds × 7 teams = 28 total picks from a pool of 30 prospects
- Pick order is the same every round: Pick 1 → 7, repeated 4 times
- AI picks automatically within ~1-2 seconds per turn
- 2 players remain undrafted at the end

---

## 🚀 Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 19, Vite 7, Tailwind CSS v4   |
| Backend    | Node.js, Express 5                  |
| AI         | Google Gemini 2.0 Flash, Gemini 2.5 Flash             |
| HTTP       | Axios (with interceptors)           |
| Alerts     | react-hot-toast                     |

---

## 📁 Project Structure

```
nfl-mock-draft/
├── README.md
├── .gitignore
├── package.json                      # Root - runs both servers (dev only)
│
├── server/                           # Express backend → deploy on Render
│   ├── index.js                      # Express app, CORS, middleware, routes
│   ├── jsconfig.json                 # Tells VS Code this is plain CommonJS JS
│   ├── package.json                  # express, @google/genai, cors, dotenv
│   ├── .env.example                  # Environment variable template
│   │
│   ├── data/
│   │   ├── players.js                # Top 30 prospects from ES Big Board
│   │   └── teams.js                  # 7 NFL teams with needs and context
│   │
│   ├── routes/
│   │   └── draft.js                  # GET /api/draft/init, POST /api/draft/ai-pick
│   │
│   └── services/
│       └── gemini.js                 # Gemini AI pick logic + fallback
│
└── client/                           # React frontend → deploy on Vercel
    ├── index.html
    ├── vite.config.js                # Vite config + /api proxy to backend
    ├── package.json                  # react, tailwindcss, axios, react-hot-toast
    ├── .env.example                  # VITE_API_URL template
    │
    └── src/
        ├── main.jsx                  # React root entry point
        ├── index.css                 # Tailwind v4 + @theme dark config
        ├── App.jsx                   # Root component, phase-based screen switching
        │
        ├── api/
        │   └── axios.js              # Axios instance with baseURL + interceptors
        │
        ├── context/
        │   └── DraftContext.jsx      # Global state - all draft logic lives here
        │                             # Exports: useDraft(), DraftProvider, PHASE
        │
        └── components/
            ├── TeamSelector.jsx      # Screen 1 - pick your team
            ├── DraftBoard.jsx        # Screen 2 - main draft game loop
            ├── PlayerCard.jsx        # Individual player display + pick button
            ├── PickHistory.jsx       # Sidebar showing all picks by round
            └── DraftComplete.jsx     # Screen 3 - final results for all teams
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- Free Google Gemini API key → [Get it here](https://aistudio.google.com/app/apikey)

---

### 1. Clone the repo

```bash
git clone https://github.com/praveen-1406/NFL-Mock-Draft.git
cd NFL-Mock-Draft
```

---

### 2. Setup the server

```bash
cd server
npm install
cp .env     <- Use API Key of Gemini
```

Open `server/.env` and fill in:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
FRONTEND_URI=http://localhost:3000
```

Start the server:
```bash
npm run dev
# Running on http://localhost:5000
```

Test it:
```
http://localhost:5000/api/health       → { status: "OK" }
http://localhost:5000/api/draft/init   → players + teams JSON
```

---

### 3. Setup the client

Open a new terminal tab:
```bash
cd client
npm install
cp .env.example .env
```

`client/.env`:
```env
# Leave empty in development — Vite proxy handles it
VITE_API_URL=
```

Start the client:
```bash
npm run dev
# Running on http://localhost:3000
```

---

### 4. Open the app

Visit **http://vercel**

---

## 🌐 API Endpoints

| Method | Endpoint             | Description                          |
|--------|----------------------|--------------------------------------|
| GET    | `/api/health`        | Server health check                  |
| GET    | `/api/draft/init`    | Returns all 30 players + 7 teams     |
| POST   | `/api/draft/ai-pick` | Gemini picks for an AI team          |

### POST `/api/draft/ai-pick` body:
```json
{
  "teamId": 3,
  "availablePlayers": [...],
  "allPicks": [...],
  "round": 2
}
```

### Response:
```json
{
  "pick": {
    "teamId": 3,
    "teamName": "Arizona Cardinals",
    "player": { "name": "Fernando Mendoza", "position": "QB", ... },
    "round": 2,
    "pickNumber": 10,
    "reasoning": "Mendoza fills the Cardinals' top need at QB...",
    "isAI": true
  }
}
```

---

## Architecture Decisions

### State Management
All draft state lives in a single `DraftContext`. For this scope (1 game, 28 picks, no DB), a context + useState approach is clean and explainable. With more time I'd use `useReducer` for more predictable state transitions.

### AI Orchestration
The `DraftBoard` component uses a `useEffect` that watches `currentPickIndex`. When it's an AI team's turn, it fires `triggerAIPick()` after a 1.2s delay (so users can see who is picking). An `aiPickInProgress` ref prevents double-firing in React StrictMode.

### AI Pick Logic
Each Gemini call receives:
- The picking team's name, needs, and context
- A summary of what they've already drafted
- The full ranked list of available players with grades
- The current round number

Gemini responds with a JSON object containing `selectedPlayerRank` and `reasoning`. If Gemini fails or returns an invalid rank, a rule-based fallback picks the best available player that matches the team's needs.

### Error Handling
- Gemini API failure → fallback pick runs automatically
- Server down → client shows error state with message
- Invalid Gemini response → fallback activates, draft continues

### No Database
All state lives in React. The full draft state is sent with each AI pick request — stateless API design means no session management needed.

---

## 🌐 Deployment

| Part     | Platform | Build command     | Start command  |
|----------|----------|-------------------|----------------|
| Backend  | Render   | `npm install`     | `npm start`    |
| Frontend | Vercel   | `npm run build`   | _(static)_     |

After deploying backend, set in Vercel:
```
VITE_API_URL=https://your-server.render.com
```

After deploying frontend, update in Render:
```
FRONTEND_URI=https://your-app.vercel.app
```

---

## What I'd Improve With More Time

- **Trade logic** — teams can trade picks with each other
- **Full 7-round draft** — currently 4 rounds as per spec
- **Draft grades** — grade each team's picks at the end
- **Animations** — draft ticker like the real NFL broadcast
- **Mobile layout** — responsive pick history drawer on small screens
- **Persistent results** — save draft history to localStorage or a DB
- **Better AI prompting** — multi-turn conversation for more contextual picks

---

## 📄 License

MIT