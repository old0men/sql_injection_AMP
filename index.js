// index.js
const pool = require('./db');

async function test() {
  try {
    const [rows] = await pool.query('SELECT * FROM user JOIN data ON user.user_id = data.user_id;');
    console.log('Ergebnis:', rows);
  } catch (err) {
    console.error('Fehler:', err.code, err.message);
  } finally {
    await pool.end();
  }
}

test();
