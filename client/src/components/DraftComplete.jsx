import { useDraft } from "../context/DraftContext";

const POSITION_COLORS = {
  QB:  "text-red-400  bg-red-500/10  border-red-500/20",
  WR:  "text-blue-400 bg-blue-500/10 border-blue-500/20",
  RB:  "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  TE:  "text-teal-400 bg-teal-500/10 border-teal-500/20",
  T:   "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  G:   "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  DE:  "text-purple-400 bg-purple-500/10 border-purple-500/20",
  DT:  "text-violet-400 bg-violet-500/10 border-violet-500/20",
  OLB: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  ILB: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  CB:  "text-green-400 bg-green-500/10 border-green-500/20",
  S:   "text-pink-400 bg-pink-500/10 border-pink-500/20",
};

const getPosStyle = (pos) => POSITION_COLORS[pos] || "text-gray-400 bg-gray-500/10 border-gray-500/20";

export default function DraftComplete() {
  const {
    teams,
    userTeam,
    userPicks,
    availablePlayers,
    resetDraft,
    getTeamPicks,
  } = useDraft();

  return (
    <div className="min-h-screen px-4 py-10">

      {/* Header */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">🏆</div>
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">
          Draft Complete!
        </h1>
        <p className="text-gray-400">
          All 4 rounds finished. Here's how every team drafted.
        </p>
      </div>

      {/* Your team results — highlighted at top */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white/5 border border-white/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{userTeam?.logo}</span>
            <div>
              <div className="text-white font-black text-lg">{userTeam?.name}</div>
              <div className="text-gray-400 text-sm">Your Draft Results</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {userPicks.map((pick) => (
              <div
                key={pick.player.id}
                className={`rounded-xl border p-3 ${getPosStyle(pick.player.position)}`}
              >
                <div className="text-xs font-black mb-1 opacity-80">
                  {pick.player.position} · R{pick.round}
                </div>
                <div className="text-white font-bold text-sm leading-tight">
                  {pick.player.name}
                </div>
                <div className="text-xs opacity-60 mt-0.5">
                  {pick.player.college}
                </div>
                <div className="text-xs font-bold mt-1 opacity-80">
                  Grade: {pick.player.grade}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All teams summary */}
      <div className="max-w-4xl mx-auto mb-8">
        <h2 className="text-white font-bold text-lg mb-4">All Teams</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams
            .filter((t) => t.id !== userTeam?.id)
            .map((team) => {
              const picks = getTeamPicks(team.id);
              return (
                <div
                  key={team.id}
                  className="bg-white/3 border border-white/10 rounded-xl p-4"
                >
                  {/* Team header */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{team.logo}</span>
                    <div>
                      <div className="text-white font-bold text-sm">{team.name}</div>
                      <div className="text-gray-500 text-xs">
                        Needs: {team.needs.join(", ")}
                      </div>
                    </div>
                  </div>
                  {/* Their picks */}
                  <div className="flex flex-col gap-1.5">
                    {picks.map((pick) => (
                      <div
                        key={pick.player.id}
                        className="flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-gray-500 text-xs font-mono shrink-0">R{pick.round}</span>
                          <span className="text-white text-xs font-semibold truncate">
                            {pick.player.name}
                          </span>
                        </div>
                        <span className={`text-xs font-black shrink-0 ${getPosStyle(pick.player.position).split(" ")[0]}`}>
                          {pick.player.position}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Undrafted players */}
      {availablePlayers.length > 0 && (
        <div className="max-w-4xl mx-auto mb-10">
          <h2 className="text-white font-bold text-lg mb-3">
            Undrafted ({availablePlayers.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {availablePlayers.map((p) => (
              <div
                key={p.id}
                className="bg-white/3 border border-white/10 rounded-lg px-3 py-1.5 flex items-center gap-2"
              >
                <span className="text-gray-500 text-xs font-mono">#{p.rank}</span>
                <span className="text-gray-300 text-xs font-semibold">{p.name}</span>
                <span className={`text-xs font-black ${getPosStyle(p.position).split(" ")[0]}`}>
                  {p.position}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Draft again button */}
      <div className="text-center">
        <button
          onClick={resetDraft}
          className="bg-white text-black font-bold px-8 py-3 rounded-xl hover:bg-gray-100 transition-all duration-200 active:scale-95"
        >
          Draft Again
        </button>
      </div>
    </div>
  );
}