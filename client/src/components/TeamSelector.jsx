import { useState } from "react";
import { useDraft } from "../context/DraftContext";

const POSITION_COLORS = {
  QB: "bg-red-500/20 text-red-400 border-red-500/30",
  WR: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  T:  "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  G:  "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  DE: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  CB: "bg-green-500/20 text-green-400 border-green-500/30",
  OLB:"bg-orange-500/20 text-orange-400 border-orange-500/30",
  S:  "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

const getPositionColor = (pos) =>
  POSITION_COLORS[pos] || "bg-gray-500/20 text-gray-400 border-gray-500/30";

export default function TeamSelector() {
  const { teams, startDraft, error } = useDraft();
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const selectedTeam = teams.find((t) => t.id === selectedId);

  const handleStart = () => {
    if (selectedId) startDraft(selectedId);
  };

  if (teams.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          {error ? (
            <>
              <p className="text-red-400 text-lg font-semibold">{error}</p>
              <p className="text-gray-500 mt-2 text-sm">Make sure the server is running</p>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <p className="text-gray-400">Loading draft data...</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-gray-400 mb-4">
          <span>🏈</span>
          <span>2026 NFL Mock Draft</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Choose Your Team
        </h1>
        <p className="text-gray-400 mt-3 text-base max-w-md mx-auto">
          You control one team. AI takes over the rest. 4 rounds, 28 picks.
        </p>
      </div>

      {/* Team Grid */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-8">
        {teams.map((team) => {
          const isSelected = selectedId === team.id;
          const isHovered = hoveredId === team.id;

          return (
            <button
              key={team.id}
              onClick={() => setSelectedId(team.id)}
              onMouseEnter={() => setHoveredId(team.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`
                relative text-left rounded-xl border p-4 transition-all duration-200 cursor-pointer
                ${isSelected
                  ? "border-white/40 bg-white/10 shadow-lg shadow-white/5"
                  : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                }
              `}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                  <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}

              {/* Pick number */}
              <div className="text-xs text-gray-500 font-medium mb-2">
                PICK #{team.pickNumber}
              </div>

              {/* Team logo + name */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{team.logo}</span>
                <div>
                  <div className="text-white font-bold text-sm leading-tight">
                    {team.name}
                  </div>
                  <div className="text-gray-500 text-xs">{team.abbreviation}</div>
                </div>
              </div>

              {/* Needs */}
              <div className="flex flex-wrap gap-1">
                {team.needs.map((need) => (
                  <span
                    key={need}
                    className={`text-xs font-bold px-2 py-0.5 rounded border ${getPositionColor(need)}`}
                  >
                    {need}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected team detail + Start button */}
      <div className="max-w-4xl mx-auto">
        {selectedTeam ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{selectedTeam.logo}</span>
                <span className="text-white font-bold">{selectedTeam.name}</span>
                <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                  Pick #{selectedTeam.pickNumber}
                </span>
              </div>
              <p className="text-gray-400 text-sm">{selectedTeam.context}</p>
            </div>
            <button
              onClick={handleStart}
              className="shrink-0 bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition-all duration-200 active:scale-95 text-sm"
            >
              Start Draft →
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-600 text-sm py-4">
            Select a team above to get started
          </div>
        )}
      </div>
    </div>
  );
}