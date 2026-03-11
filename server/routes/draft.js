const express = require('express');
const router = express.Router();
const players = require('../data/players');
const teams = require('../data/teams');
const { getAIPick } = require('../services/gemini');

// GET /api/draft/init
router.get('/init', (req, res) => {
  res.json({ players, teams });
});

// POST /api/draft/ai-pick
router.post('/ai-pick', async (req, res) => {
  const { teamId, availablePlayers, allPicks, round } = req.body;

  if (!teamId || !availablePlayers || !allPicks || !round) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (availablePlayers.length === 0) {
    return res.status(400).json({ error: 'No available players left' });
  }

  const team = teams.find(t => t.id === teamId);
  if (!team) {
    return res.status(404).json({ error: `Team with id ${teamId} not found` });
  }

  try {
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
    console.error('AI pick error:', error.message);
    res.status(500).json({ error: 'Failed to get AI pick.' });
  }
});

module.exports = router;