
const readline = require('readline');
const pool = require('./db');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function executeSQL(query) {
  try {
    const [rows] = await pool.query(query);
    console.log('Ergebnis:', rows);
  } catch (err) {
    console.error('Fehler:', err.code, err.message);
  }
}

function promptSQL() {
  rl.question('Gib ein SQL-Statement ein (oder "exit" zum Beenden): ', async (query) => {
    if (query.toLowerCase() === 'exit') {
      console.log('Beende das Programm.');
      rl.close();
      await pool.end();
      return;
    }

    await executeSQL(query);
    promptSQL();
  });
}

promptSQL();