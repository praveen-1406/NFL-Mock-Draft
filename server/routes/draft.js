const express = require('express');
const router = express.Router();
const players = require('../data/players');
const teams = require('../data/teams');
const { getAIPick } = require('../services/gemini');

// ─────────────────────────────────────────
// GET /api/draft/init
// Returns all players and teams to the client
// Called once when the app loads
// ─────────────────────────────────────────
router.get('/init', (req, res) => {
  res.json({ players, teams });
});

// ─────────────────────────────────────────
// POST /api/draft/ai-pick
// Called when it's an AI team's turn to pick
//
// Request body:
// {
//   teamId: 3,
//   availablePlayers: [...],
//   allPicks: [...],
//   round: 2
// }
//
// Response:
// {
//   pick: { teamId, teamName, player, round, pickNumber, reasoning }
// }
// ─────────────────────────────────────────
router.post('/ai-pick', async (req, res) => {
  const { teamId, availablePlayers, allPicks, round } = req.body;

  // Validate request
  if (!teamId || !availablePlayers || !allPicks || !round) {
    return res.status(400).json({ error: 'Missing required fields: teamId, availablePlayers, allPicks, round' });
  }

  if (availablePlayers.length === 0) {
    return res.status(400).json({ error: 'No available players left' });
  }

  // Find the team
  const team = teams.find(t => t.id === teamId);
  if (!team) {
    return res.status(404).json({ error: `Team with id ${teamId} not found` });
  }

  try {
    // Ask Gemini to make a pick
    const { player, reasoning } = await getAIPick(team, availablePlayers, allPicks, round);

    const pick = {
      teamId: team.id,
      teamName: team.name,
      player,
      round,
      pickNumber: allPicks.length + 1,
      reasoning,
      isAI: true,
    };

    res.json({ pick });

  } catch (error) {
    console.error('❌ AI pick error:', error.message);
    res.status(500).json({ error: 'Failed to get AI pick. Please try again.' });
  }
});

module.exports = router;