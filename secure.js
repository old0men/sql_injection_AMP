/**
 * Filename: secure.js
 * Kurzbeschreibung: Sicheres Login über Prepared Statements und Stored Procedure (CALL login_user).
 * Aufrufparameter: node secure.js
 * Autor(en): Altin Demku, Manuel Bürki, Victor Peski
 * Datum: 2025-10-29
 *
 * Beschreibung:
 * Dieses Skript demonstriert eine sichere Login-Implementierung gegen SQL-Injection.
 * Es verwendet parametrisierte Queries (Prepared Statements) sowie eine Stored Procedure.
 * Fehlerhafte Aufrufe (fehlende DB, falsche Parameter) werden behandelt.
 */

const express = require('express');
const body_parser = require('body-parser');
const pool = require('./db');

const app = express();
const PORT = 3000;

app.use(body_parser.urlencoded({extended: true}));

/**
 * Prüft die Gültigkeit der Eingaben (Länge, Typ)
 *
 * @param {string} username - Benutzername aus POST-Body
 * @param {string} password - Passwort aus POST-Body
 * @returns {boolean} true, wenn Eingaben gültig sind
 */
function validate_input(username, password) {
    if (typeof username !== 'string' || typeof password !== 'string') return false;
    if (username.length < 1 || password.length < 1) return false;
    if (username.length > 512 || password.length > 512) return false;
    return true;
}

/**
 * POST /login
 *
 * Führt ein Login über eine gespeicherte Prozedur aus:
 * CALL login_user(?, ?)
 *
 * - nutzt Prepared Statements (parametrisierte Query)
 * - verhindert SQL-Injection
 * - ruft bei Admin alle Userdaten ab, bei normalen Usern nur persönliche Daten
 */
app.post('/login', async (req, res) => {
    const {username, password} = req.body;

    if (!validate_input(username, password)) {
        console.warn('Fehlerhafte Eingabe:', req.body);
        return res.status(400).json({error: 'Ungültige Eingabe.'});
    }

    let connection;
    try {
        // Verbindung aus Pool holen
        connection = await pool.getConnection();

        // Stored Procedure mit sicheren Parametern aufrufen
        const [result] = await connection.query('CALL login_user(?, ?)', [username, password]);
        const rows = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;

        // Überprüfen, ob ein User gefunden wurde
        if (rows.length > 0) {
            const user = rows[0];

            if (user.name === 'Admin') {
                const [all_data] = await connection.query(`
          SELECT user.name, data.age, data.height, data.weight
          FROM data
          JOIN user ON user.user_id = data.user_id
        `);
                return res.json({role: 'admin', data: all_data});
            } else {
                const [user_data] = await connection.query(
                    `SELECT age, height, weight FROM data WHERE user_id = ?`,
                    [user.user_id]
                );
                return res.json({role: 'user', user: user.name, data: user_data[0] || null});
            }
        } else {
            return res.status(401).json({error: 'Login fehlgeschlagen (Benutzer nicht gefunden).'});
        }
    } catch (err) {
        console.error('Login-Fehler:', err.message);
        return res.status(500).json({
            error: 'Interner Serverfehler. Prüfen Sie Datenbankverbindung und Stored Procedure.',
        });
    } finally {
        if (connection) connection.release();
    }
});

// Serverstart
app.listen(PORT, () => {
    console.log(`✅ Server läuft sicher auf http://localhost:${PORT}`);
});
