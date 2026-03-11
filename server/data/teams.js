// Top 7 picks in the 2026 NFL Draft
// Source: EssentiallySports AI Full Stack Engineer Assignment PDF
const teams = [
  {
    id: 1,
    pickNumber: 1,
    name: "Las Vegas Raiders",
    abbreviation: "LV",
    color: "#A5ACAF",
    secondaryColor: "#000000",
    needs: ["QB", "CB", "T"],
    context: "No long-term QB after Geno Smith trade failed. Secondary leaks. Offensive line needs rebuilding.",
    logo: "⚡"
  },
  {
    id: 2,
    pickNumber: 2,
    name: "New York Jets",
    abbreviation: "NYJ",
    color: "#125740",
    secondaryColor: "#FFFFFF",
    needs: ["T", "WR", "QB"],
    context: "Full roster reset after trade deadline teardown. Offensive line is the foundation to rebuild.",
    logo: "✈️"
  },
  {
    id: 3,
    pickNumber: 3,
    name: "Arizona Cardinals",
    abbreviation: "ARI",
    color: "#97233F",
    secondaryColor: "#FFB612",
    needs: ["QB", "T", "WR"],
    context: "Kyler Murray's future uncertain after 3-14 season. Offense needs major upgrades.",
    logo: "🔴"
  },
  {
    id: 4,
    pickNumber: 4,
    name: "Tennessee Titans",
    abbreviation: "TEN",
    color: "#0C2340",
    secondaryColor: "#4B92DB",
    needs: ["T", "WR", "DE"],
    context: "Must protect and support 2025 #1 pick Cam Ward. Need weapons and pass rush.",
    logo: "⚔️"
  },
  {
    id: 5,
    pickNumber: 5,
    name: "New York Giants",
    abbreviation: "NYG",
    color: "#0B2265",
    secondaryColor: "#A71930",
    needs: ["WR", "DE", "T"],
    context: "Need playmakers around QB Jaxon Dart. Pass rush was inconsistent.",
    logo: "🗽"
  },
  {
    id: 6,
    pickNumber: 6,
    name: "Cleveland Browns",
    abbreviation: "CLE",
    color: "#311D00",
    secondaryColor: "#FF3C00",
    needs: ["DE", "WR", "CB"],
    context: "Fewest receiving yards in the NFL in 2025. Need pass rush help.",
    logo: "🟤"
  },
  {
    id: 7,
    pickNumber: 7,
    name: "Washington Commanders",
    abbreviation: "WSH",
    color: "#5A1414",
    secondaryColor: "#FFB612",
    needs: ["DE", "CB", "OLB"],
    context: "Oldest roster in NFL. Defense needs youth and speed everywhere.",
    logo: "🏛️"
  }
];

module.exports = teams;