import { createContext, useContext, useState, useCallback } from "react";
import api from "../api/axios";

const DraftContext = createContext(null);

// Draft phases
export const PHASE = {
  SETUP: "setup",       // User is selecting their team
  DRAFTING: "drafting", // Draft is in progress
  COMPLETE: "complete", // All 4 rounds done
};

export function DraftProvider({ children }) {
  // ─────────────────────────────────────────
  // Core State
  // ─────────────────────────────────────────
  const [phase, setPhase] = useState(PHASE.SETUP);
  const [teams, setTeams] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [allPicks, setAllPicks] = useState([]);
  const [userTeamId, setUserTeamId] = useState(null);
  const [currentPickIndex, setCurrentPickIndex] = useState(0); // 0–27 (28 total picks)
  const [isAIPicking, setIsAIPicking] = useState(false);
  const [lastPick, setLastPick] = useState(null); // Most recent pick for display
  const [error, setError] = useState(null);

  // ─────────────────────────────────────────
  // Derived values
  // ─────────────────────────────────────────

  // Total picks = 4 rounds x 7 teams = 28
  const TOTAL_PICKS = 28;
  const TOTAL_TEAMS = 7;

  // Current round (1-4)
  const currentRound = Math.floor(currentPickIndex / TOTAL_TEAMS) + 1;

  // Which team picks at currentPickIndex — guard against empty teams array
  const currentTeamIndex = currentPickIndex % TOTAL_TEAMS;
  const currentTeam = teams.length > 0 ? (teams[currentTeamIndex] ?? null) : null;

  // Is it the user's turn?
  const isUserTurn =
    currentTeam !== null &&
    userTeamId !== null &&
    currentTeam.id === userTeamId &&
    phase === PHASE.DRAFTING;

  // User's team object
  const userTeam = teams.find((t) => t.id === userTeamId) ?? null;

  // Picks made by the user's team
  const userPicks = allPicks.filter((p) => p.teamId === userTeamId);

  // Get picks for any specific team
  const getTeamPicks = (teamId) => allPicks.filter((p) => p.teamId === teamId);

  // ─────────────────────────────────────────
  // Initialize: load players + teams from API
  // ─────────────────────────────────────────
  const initDraft = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get("/api/draft/init");
      setTeams(res.data.teams);
      setAllPlayers(res.data.players);
      setAvailablePlayers(res.data.players);
    } catch (err) {
      setError("Failed to load draft data. Is the server running?");
      console.error(err);
    }
  }, []);

  // ─────────────────────────────────────────
  // Start Draft: user has selected their team
  // ─────────────────────────────────────────
  const startDraft = useCallback((teamId) => {
    setUserTeamId(teamId);
    setAllPicks([]);
    setCurrentPickIndex(0);
    setLastPick(null);
    setPhase(PHASE.DRAFTING);
  }, []);

  // ─────────────────────────────────────────
  // Record a pick (used for both user + AI)
  // ─────────────────────────────────────────
  const recordPick = useCallback((pick) => {
    // Remove picked player from available pool
    setAvailablePlayers((prev) =>
      prev.filter((p) => p.id !== pick.player.id)
    );

    // Add to pick history
    setAllPicks((prev) => [...prev, pick]);

    // Store as last pick for display
    setLastPick(pick);

    // Advance pick index
    const nextIndex = currentPickIndex + 1;
    setCurrentPickIndex(nextIndex);

    // Check if draft is complete
    if (nextIndex >= TOTAL_PICKS) {
      setPhase(PHASE.COMPLETE);
    }
  }, [currentPickIndex]);

  // ─────────────────────────────────────────
  // User makes a pick
  // ─────────────────────────────────────────
  const userPick = useCallback((player) => {
    if (!isUserTurn) return;

    const pick = {
      teamId: userTeamId,
      teamName: userTeam.name,
      player,
      round: currentRound,
      pickNumber: currentPickIndex + 1,
      reasoning: null,
      isAI: false,
    };

    recordPick(pick);
  }, [isUserTurn, userTeamId, userTeam, currentRound, currentPickIndex, recordPick]);

  // ─────────────────────────────────────────
  // AI makes a pick (calls backend)
  // ─────────────────────────────────────────
  const triggerAIPick = useCallback(async (team, players, picks, round) => {
    setIsAIPicking(true);
    setError(null);

    try {
      const res = await api.post("/api/draft/ai-pick", {
        teamId: team.id,
        availablePlayers: players,
        allPicks: picks,
        round,
      });

      recordPick(res.data.pick);
    } catch (err) {
      console.error("AI pick failed:", err);
      setError(`AI pick failed for ${team.name}. Retrying...`);

      // Fallback: pick best available player for the team
      const fallbackPlayer =
        players.find((p) => team.needs.includes(p.position)) || players[0];

      const fallbackPick = {
        teamId: team.id,
        teamName: team.name,
        player: fallbackPlayer,
        round,
        pickNumber: picks.length + 1,
        reasoning: "Best available (fallback pick).",
        isAI: true,
      };

      recordPick(fallbackPick);
    } finally {
      setIsAIPicking(false);
    }
  }, [recordPick]);

  // ─────────────────────────────────────────
  // Reset everything back to setup
  // ─────────────────────────────────────────
  const resetDraft = useCallback(() => {
    setPhase(PHASE.SETUP);
    setUserTeamId(null);
    setAllPicks([]);
    setCurrentPickIndex(0);
    setLastPick(null);
    setIsAIPicking(false);
    setError(null);
    setAvailablePlayers(allPlayers); // restore full player pool
  }, [allPlayers]);

  // ─────────────────────────────────────────
  // Context value
  // ─────────────────────────────────────────
  const value = {
    // State
    phase,
    teams,
    allPlayers,
    availablePlayers,
    allPicks,
    userTeamId,
    userTeam,
    userPicks,
    currentPickIndex,
    currentRound,
    currentTeam,
    isUserTurn,
    isAIPicking,
    lastPick,
    error,

    // Constants
    TOTAL_PICKS,
    TOTAL_TEAMS,

    // Actions
    initDraft,
    startDraft,
    userPick,
    triggerAIPick,
    resetDraft,
    getTeamPicks,
  };

  return (
    <DraftContext.Provider value={value}>
      {children}
    </DraftContext.Provider>
  );
}

// Custom hook for easy access
export function useDraft() {
  const context = useContext(DraftContext);
  if (!context) {
    throw new Error("useDraft must be used inside <DraftProvider>");
  }
  return context;
}