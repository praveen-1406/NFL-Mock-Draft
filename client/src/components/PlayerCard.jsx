const POSITION_STYLES = {
  QB:  { bg: "bg-red-500/10",    border: "border-red-500/30",    text: "text-red-400",    badge: "bg-red-500/20 text-red-300" },
  WR:  { bg: "bg-blue-500/10",   border: "border-blue-500/30",   text: "text-blue-400",   badge: "bg-blue-500/20 text-blue-300" },
  RB:  { bg: "bg-cyan-500/10",   border: "border-cyan-500/30",   text: "text-cyan-400",   badge: "bg-cyan-500/20 text-cyan-300" },
  TE:  { bg: "bg-teal-500/10",   border: "border-teal-500/30",   text: "text-teal-400",   badge: "bg-teal-500/20 text-teal-300" },
  T:   { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400", badge: "bg-yellow-500/20 text-yellow-300" },
  G:   { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400", badge: "bg-yellow-500/20 text-yellow-300" },
  C:   { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400", badge: "bg-yellow-500/20 text-yellow-300" },
  DE:  { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", badge: "bg-purple-500/20 text-purple-300" },
  DT:  { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-400", badge: "bg-violet-500/20 text-violet-300" },
  OLB: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", badge: "bg-orange-500/20 text-orange-300" },
  ILB: { bg: "bg-amber-500/10",  border: "border-amber-500/30",  text: "text-amber-400",  badge: "bg-amber-500/20 text-amber-300" },
  CB:  { bg: "bg-green-500/10",  border: "border-green-500/30",  text: "text-green-400",  badge: "bg-green-500/20 text-green-300" },
  S:   { bg: "bg-pink-500/10",   border: "border-pink-500/30",   text: "text-pink-400",   badge: "bg-pink-500/20 text-pink-300" },
};

const DEFAULT_STYLE = {
  bg: "bg-gray-500/10",
  border: "border-gray-500/30",
  text: "text-gray-400",
  badge: "bg-gray-500/20 text-gray-300",
};

const getStyle = (pos) => POSITION_STYLES[pos] || DEFAULT_STYLE;

export default function PlayerCard({ player, isUserTurn, userNeeds, onPick }) {
  const style = getStyle(player.position);

  // Highlight if this position fills a user need
  const fillsNeed = userNeeds.includes(player.position);

  return (
    <div
      className={`
        relative rounded-xl border p-3 transition-all duration-200
        ${style.bg} ${style.border}
        ${isUserTurn
          ? fillsNeed
            ? "ring-1 ring-white/20 hover:ring-white/40 hover:scale-[1.02] cursor-pointer"
            : "hover:scale-[1.01] cursor-pointer opacity-80 hover:opacity-100"
          : "opacity-60 cursor-default"
        }
      `}
      onClick={() => isUserTurn && onPick(player)}
    >
      {/* Fills need indicator */}
      {isUserTurn && fillsNeed && (
        <div className="absolute top-2 right-2">
          <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-white/20 text-white">
            NEED
          </span>
        </div>
      )}

      {/* Rank + Position */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500 font-mono font-bold">
          #{player.rank}
        </span>
        <span className={`text-xs font-black px-2 py-0.5 rounded ${style.badge}`}>
          {player.position}
        </span>
      </div>

      {/* Name */}
      <div className="text-white font-bold text-sm leading-tight mb-1">
        {player.name}
      </div>

      {/* College */}
      <div className="text-gray-500 text-xs mb-2">
        {player.college}
      </div>

      {/* Grade + Physical */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className={`text-xs font-black ${style.text}`}>
            {player.grade}
          </span>
          <span className="text-gray-600 text-xs">grade</span>
        </div>
        {player.height && player.height !== "N/A" && (
          <div className="text-gray-600 text-xs">
            {player.height} {player.weight ? `/ ${player.weight}lbs` : ""}
          </div>
        )}
      </div>

      {/* Pick button — only shows on user turn */}
      {isUserTurn && (
        <div className={`
          mt-2 pt-2 border-t ${style.border}
          text-xs font-bold text-center transition-all duration-150
          ${fillsNeed ? style.text : "text-gray-500"}
        `}>
          {fillsNeed ? "Fills your need — Click to draft" : "Click to draft"}
        </div>
      )}
    </div>
  );
}