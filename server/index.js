const express = require('express');
const cors = require('cors');
const draftRoutes = require('./routes/draft');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    process.env.FRONTEND_URI,
  ],
  methods: ['GET', 'POST'],
}));

app.use(express.json());

app.use('/api/draft', draftRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'NFL Draft Server is running!',
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log('\n NFL Draft Server running!');
  console.log(`   Local: http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Init:   http://localhost:${PORT}/api/draft/init\n`);
});