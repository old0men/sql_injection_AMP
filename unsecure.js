/**
 * Filename: unsecure.js
 * Kurzbeschreibung: Unsichere Login-Implementierung zur Demonstration von SQL-Injection.
 * Aufrufparameter: node unsecure.js
 * Autor(en): Altin Demku, Manuel Bürki, Victor Peski
 * Datum: 2025-10-29
 *
 * Beschreibung:
 * Dieses Skript zeigt, wie SQL-Injection entsteht, wenn Benutzereingaben
 * direkt in SQL-Strings eingefügt werden. Nur zu Lehrzwecken verwenden!
 */

const express = require('express');
const body_parser = require('body-parser');
const pool = require('./db');

const app = express();
const PORT = 3000;

app.use(body_parser.urlencoded({extended: true}));

/**
 * POST /login
 *
 * Verwundbare Login-Route — führt SQL mit direkter Stringverkettung aus.
 * Beispiel einer gefährlichen Query:
 *  SELECT * FROM user WHERE name = 'Admin' AND password = '1234'
 *
 * Bei bösartiger Eingabe (' OR '1'='1) kann jeder User eingeloggt werden.
 */
app.post('/login', async (req, res) => {
    const {username, password} = req.body;

    // SQL-Injection möglich! Keine Parametrisierung.
    const query = `SELECT * FROM user WHERE name = '${username}' AND password = '${password}'`;

    try {
        const [rows] = await pool.query(query);
        const result = Array.isArray(rows[0]) ? rows[0] : rows;

        if (result.length > 0) {
            const user = result[0];

            if (user.name === 'Admin') {
                const [all_data] = await pool.query(`
          SELECT user.name, data.age, data.height, data.weight
          FROM data
          JOIN user ON user.user_id = data.user_id
        `);
                res.json({role: 'admin', data: all_data});
            } else {
                const [user_data] = await pool.query(
                    `SELECT age, height, weight FROM data WHERE user_id = ?`,
                    [user.user_id]
                );
                res.json({role: 'user', user: user.name, data: user_data[0] || null});
            }
        } else {
            res.status(401).json({error: 'Login fehlgeschlagen.'});
        }
    } catch (err) {
        console.error('Fehler beim Login:', err.message);
        res.status(500).json({error: 'Interner Serverfehler. Prüfen Sie Ihre SQL-Abfrage.'});
    }
});

// Serverstart
app.listen(PORT, () => {
    console.log(`⚠️  Unsicherer Server läuft auf http://localhost:${PORT}`);
});
