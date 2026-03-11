import { useEffect, useRef } from "react";
import { useDraft } from "../context/DraftContext";
import PlayerCard from "./PlayerCard";
import PickHistory from "./PickHistory";
import toast from "react-hot-toast";

export default function DraftBoard() {
  const {
    teams,
    availablePlayers,
    allPicks,
    userTeam,
    currentTeam,
    currentRound,
    currentPickIndex,
    isUserTurn,
    isAIPicking,
    lastPick,
    error,
    TOTAL_PICKS,
    TOTAL_TEAMS,
    userPick,
    triggerAIPick,
  } = useDraft();

  // prevents double firing
  const aiPickInProgress = useRef(false);

  useEffect(() => {
    if (
      isUserTurn ||
      isAIPicking ||
      aiPickInProgress.current ||
      availablePlayers.length === 0 ||
      currentPickIndex >= TOTAL_PICKS
    ) return;

    if (!currentTeam || currentTeam.id === userTeam?.id) return;

    aiPickInProgress.current = true;

    // delay
    const timer = setTimeout(async () => {
      await triggerAIPick(currentTeam, availablePlayers, allPicks, currentRound);
      aiPickInProgress.current = false;
    }, 1200);

    return () => {
      clearTimeout(timer);
      aiPickInProgress.current = false;
    };
  }, [currentPickIndex, isUserTurn]);

  // toast
  useEffect(() => {
    if (lastPick && lastPick.isAI) {
      toast(`${lastPick.teamName} selected ${lastPick.player.name}`, {
        icon: "🏈",
        duration: 2500,
      });
    }
  }, [lastPick]);

  // error toast
  useEffect(() => {
    if (error) toast.error(error, { duration: 3000 });
  }, [error]);

  // Progress bar percentage
  const progressPercent = Math.round((currentPickIndex / TOTAL_PICKS) * 100);

  // Pick order row — 7 teams for current round
  const currentRoundPicks = teams.map((team, idx) => {
    const pickIndex = (currentRound - 1) * TOTAL_TEAMS + idx;
    const made = allPicks.find(
      (p) => p.round === currentRound && p.teamId === team.id
    );
    const isCurrent = pickIndex === currentPickIndex;
    const isUser = team.id === userTeam?.id;

    return { team, made, isCurrent, isUser };
  });

  return (
    <div className="min-h-screen flex flex-col">

      {/* ── Top Bar ── */}
      <div className="border-b border-white/10 bg-black/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

          {/* Left: round + pick info */}
          <div className="flex items-center gap-3">
            <div className="bg-white/10 rounded-lg px-3 py-1.5 text-center">
              <div className="text-xs text-gray-400 uppercase tracking-wider">Round</div>
              <div className="text-white font-black text-lg leading-none">{currentRound}</div>
            </div>
            <div>
              <div className="text-white font-semibold text-sm">
                Pick {currentPickIndex + 1} of {TOTAL_PICKS}
              </div>
              <div className="text-gray-400 text-xs">
                {isUserTurn
                  ? "Your pick — choose a player"
                  : isAIPicking
                  ? `${currentTeam?.name} is picking...`
                  : `Up next: ${currentTeam?.name}`}
              </div>
            </div>
          </div>

          {/* Right: your team */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 hidden sm:block">Your team:</span>
            <span className="text-lg">{userTeam?.logo}</span>
            <span className="text-white font-semibold hidden sm:block">{userTeam?.name}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-white/5">
          <div
            className="h-full bg-white/40 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* ── Round Pick Order ── */}
      <div className="border-b border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {currentRoundPicks.map(({ team, made, isCurrent, isUser }) => (
              <div
                key={team.id}
                className={`
                  shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                  ${isCurrent && !made
                    ? "bg-white text-black shadow-lg"
                    : made
                    ? "bg-white/5 text-gray-500 line-through"
                    : isUser
                    ? "bg-white/10 text-white border border-white/20"
                    : "bg-white/5 text-gray-400"
                  }
                `}
              >
                <span>{team.logo}</span>
                <span className="hidden sm:inline">{team.abbreviation}</span>
                {made && <span className="text-green-400">✓</span>}
                {isCurrent && !made && isAIPicking && (
                  <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 flex gap-6">

        {/* Left: Available Players */}
        <div className="flex-1 min-w-0">

          {/* User turn banner */}
          {isUserTurn && (
            <div className="mb-4 bg-white/10 border border-white/20 rounded-xl px-4 py-3 flex items-center gap-3">
              <span className="text-xl">👇</span>
              <div>
                <div className="text-white font-bold text-sm">It's your pick!</div>
                <div className="text-gray-400 text-xs">
                  Needs: {userTeam?.needs.join(", ")}
                </div>
              </div>
            </div>
          )}

          {/* AI picking banner */}
          {isAIPicking && (
            <div className="mb-4 bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin shrink-0" />
              <div className="text-gray-400 text-sm">
                {currentTeam?.name} is on the clock...
              </div>
            </div>
          )}

          {/* Section header */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-bold">
              Available Players
              <span className="ml-2 text-gray-500 font-normal text-sm">
                ({availablePlayers.length} remaining)
              </span>
            </h2>
            {/* Needs reminder */}
            {isUserTurn && (
              <div className="flex gap-1">
                {userTeam?.needs.map((need) => (
                  <span
                    key={need}
                    className="text-xs font-bold px-2 py-0.5 rounded bg-white/10 text-white border border-white/20"
                  >
                    {need}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Player grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {availablePlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                isUserTurn={isUserTurn}
                userNeeds={userTeam?.needs || []}
                onPick={userPick}
              />
            ))}
          </div>
        </div>

        {/* Right: Pick History sidebar */}
        <div className="w-64 shrink-0 hidden lg:block">
          <PickHistory />
        </div>
      </div>
    </div>
  );
}