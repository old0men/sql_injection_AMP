const express = require('express');
const bodyParser = require('body-parser');
const pool = require('./db');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Einfache Input Validation (leichte Maßnahme)
function validateInput(username, password) {
    if (typeof username !== 'string' || typeof password !== 'string') return false;
    if (username.length < 1 || password.length < 1) return false;
    return true;
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!validateInput(username, password)) {
        return res.status(400).json({ error: 'Ungültige Eingabe.' });
    }

    try {
        // Prepared Statement & Parametrisierung (mittel-komplexe Maßnahme)
        const [rows] = await pool.query(
            'SELECT * FROM user WHERE name = ? AND password = ?',
            [username, password]
        );

        const result = Array.isArray(rows[0]) ? rows[0] : rows;

        if (result.length > 0) {
            const user = result[0];

            if (user.name === 'Admin') {
                const [allData] = await pool.query(
                    `SELECT user.name, data.age, data.height, data.weight
           FROM data
           JOIN user ON user.user_id = data.user_id`
                );
                res.json({ role: 'admin', data: allData });
            } else {
                const [userData] = await pool.query(
                    `SELECT age, height, weight
           FROM data
           WHERE user_id = ?`,
                    [user.user_id]
                );
                res.json({ role: 'user', user: user.name, data: userData[0] || null });
            }
        } else {
            res.status(401).json({ error: 'Login fehlgeschlagen.' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
