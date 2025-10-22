const express = require('express');
const pool = require('./db');

const app = express();
const PORT = 3000;

app.get('/', (req, res) =>
    res.sendFile(__dirname + '/main.html')
);

app.get('/users', async (req, res) => {
  try {
    let input_name = 'Ben'; // Simulierter Benutzereingabe
    let query_string = 'SELECT * FROM user JOIN data ON user.user_id = data.user_id WHERE name = "'+ input_name + '";'
    const [rows] = await pool.query(query_string);
    console.log('Ergebnis:', rows);
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
