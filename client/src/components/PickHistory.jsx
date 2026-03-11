import { useDraft } from "../context/DraftContext";

const POSITION_COLORS = {
  QB:  "text-red-400",
  WR:  "text-blue-400",
  RB:  "text-cyan-400",
  TE:  "text-teal-400",
  T:   "text-yellow-400",
  G:   "text-yellow-400",
  C:   "text-yellow-400",
  DE:  "text-purple-400",
  DT:  "text-violet-400",
  OLB: "text-orange-400",
  ILB: "text-amber-400",
  CB:  "text-green-400",
  S:   "text-pink-400",
};

const getPosColor = (pos) => POSITION_COLORS[pos] || "text-gray-400";

export default function PickHistory() {
  const { allPicks, userTeamId, TOTAL_TEAMS } = useDraft();

  if (allPicks.length === 0) {
    return (
      <div className="sticky top-24">
        <h3 className="text-white font-bold text-sm mb-3">Pick History</h3>
        <div className="text-gray-600 text-xs text-center py-8 border border-white/5 rounded-xl">
          No picks yet
        </div>
      </div>
    );
  }

  // Group picks by round
  const rounds = [1, 2, 3, 4];
  const picksByRound = rounds.map((round) => ({
    round,
    picks: allPicks.filter((p) => p.round === round),
  }));

  return (
    <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <h3 className="text-white font-bold text-sm mb-3">
        Pick History
        <span className="ml-2 text-gray-500 font-normal">
          ({allPicks.length}/{TOTAL_TEAMS * 4})
        </span>
      </h3>

      <div className="flex flex-col gap-4">
        {picksByRound.map(({ round, picks }) => {
          if (picks.length === 0) return null;

          return (
            <div key={round}>
              {/* Round header */}
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 px-1">
                Round {round}
              </div>

              {/* Picks in this round */}
              <div className="flex flex-col gap-1">
                {picks.map((pick, idx) => {
                  const isUserPick = pick.teamId === userTeamId;
                  const pickNumber = (round - 1) * TOTAL_TEAMS + idx + 1;

                  return (
                    <div
                      key={`${pick.teamId}-${round}-${idx}`}
                      className={`
                        rounded-lg px-3 py-2 border transition-all duration-150
                        ${isUserPick
                          ? "bg-white/10 border-white/20"
                          : "bg-white/3 border-white/5"
                        }
                      `}
                    >
                      {/* Pick number + team */}
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-gray-600 text-xs font-mono">
                          #{pickNumber}
                        </span>
                        <span className="text-gray-400 text-xs truncate ml-1 max-w-25">
                          {pick.teamName.split(" ").slice(-1)[0]}
                          {isUserPick && (
                            <span className="ml-1 text-white/50">★</span>
                          )}
                        </span>
                      </div>

                      {/* Player name + position */}
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-white text-xs font-semibold truncate">
                          {pick.player.name}
                        </span>
                        <span className={`text-xs font-black shrink-0 ${getPosColor(pick.player.position)}`}>
                          {pick.player.position}
                        </span>
                      </div>

                      {/* AI reasoning — collapsed, shown on hover via title */}
                      {pick.reasoning && (
                        <div
                          className="text-gray-600 text-xs mt-1 truncate"
                          title={pick.reasoning}
                        >
                          {pick.reasoning}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}