const express = require('express');
const pool = require('./db');

const app = express();
const PORT = 3000;

app.get('/login', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM user JOIN data ON user.user_id = data.user_id;');
    res.json(rows); // send users to frontend
  } catch (err) {
    console.error('Fehler:', err.code, err.message);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// Optional: root route


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
