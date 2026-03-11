const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// console.log("GEMINI API KEY:",process.env.GEMINI_API_KEY)

function satisfiesNeed(playerPosition, teamNeeds) {
  return teamNeeds.includes(playerPosition);
}

/**
  Object- team              - The team that is picking
  Array - availablePlayers  - Players still on the board
  Array - allPicks          - All picks made so far (for context)
  number- round             - Current round number (1-4)
  returns {Object}                 - { player, reasoning }
 */
async function getAIPick(team, availablePlayers, allPicks, round) {
  const teamPicks = allPicks.filter(p => p.teamId === team.id);
  const teamPicksSummary =
    teamPicks.length > 0
      ? teamPicks.map(p => `${p.player.name} (${p.player.position})`).join(', ')
      : 'None yet';

  const playersListText = availablePlayers
    .map(p => `#${p.rank} ${p.name} | Position: ${p.position} | College: ${p.college} | Grade: ${p.grade}`)
    .join('\n');

  const prompt = `
You are an NFL general manager making a draft pick. Make the BEST pick for your team.

## YOUR TEAM
Team: ${team.name}
Primary Needs: ${team.needs.join(', ')}
Team Context: ${team.context}
Already Drafted: ${teamPicksSummary}
Current Round: ${round} of 4

## POSITION REFERENCE
Offense: QB, RB, WR, TE, T (Tackle), G (Guard), C (Center)
Defense: DE (Defensive End), DT (Defensive Tackle), OLB (Outside LB), ILB (Inside LB), CB, S (Safety)
Team needs use these exact abbreviations - match them directly to player positions.

## AVAILABLE PLAYERS (ranked by talent, higher grade = better)
${playersListText}

## DECISION RULES
1. If a top-3 ranked player is available AND fills a team need -> always take them
2. Balance talent (grade) vs positional need
3. Avoid drafting the same position twice unless it's a top need
4. Later rounds (3-4) -> prioritize need over pure talent

## YOUR RESPONSE
Respond with ONLY a valid JSON object. No markdown, no explanation outside the JSON.
{
  "selectedPlayerRank": <number>,
  "reasoning": "<1-2 sentences explaining your pick>"
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const rawText = response.text.trim();

    // Strip markdown code fences if Gemini wraps in ```json ... ```
    const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```$/, '').trim();

    const parsed = JSON.parse(cleaned);

    // Find the player Gemini selected by rank
    const selectedPlayer = availablePlayers.find(
      p => p.rank === parsed.selectedPlayerRank
    );

    // Fallback: if rank not found pick best available
    if (!selectedPlayer) {
      console.warn(`Gemini returned invalid rank ${parsed.selectedPlayerRank}, using fallback`);
      return fallbackPick(team, availablePlayers);
    }
    return {
      player: selectedPlayer,
      reasoning: parsed.reasoning,
    };

  } catch (error) {
    // console.log("GEMINI API KEY:",process.env.GEMINI_API_KEY)

    console.error('Gemini API error:', error.message);
    return fallbackPick(team, availablePlayers);
  }
}


// Fallback rule-based pick if Gemini fails
// Picks best available player that matches a team need,
// otherwise picks highest ranked available player
 
function fallbackPick(team, availablePlayers) {
  const needBasedPick = availablePlayers.find(p =>
    satisfiesNeed(p.position, team.needs)
  );

  const selected = needBasedPick || availablePlayers[0];

  return {
    player: selected,
    reasoning: 'Best available pick based on team needs (AI fallback).',
  };
}

module.exports = { getAIPick, satisfiesNeed };