// index.js
const pool = require('./db');

async function test() {
  try {
    const [rows] = await pool.query('SELECT User_id, Name, Last_Name FROM `user` LIMIT 10;');
    console.log('Ergebnis:', rows);
  } catch (err) {
    console.error('Fehler:', err.code, err.message);
  } finally {
    await pool.end();
  }
}

test();
