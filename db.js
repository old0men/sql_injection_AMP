/**
 * Filename: db.js
 * Kurzbeschreibung: Erstellt und exportiert einen MySQL-Connection-Pool mit .env-Konfiguration.
 * Aufrufparameter: Wird automatisch von secure.js / unsecure.js importiert.
 * Autor(en): Altin Demku, Manuel Bürki, Victor Peski
 * Datum: 2025-10-29
 *
 * Beschreibung:
 * Dieses Modul liest Datenbankzugangsdaten aus der .env-Datei
 * und stellt über mysql2/promise einen Connection-Pool bereit.
 *
 * Fehlerbehandlung:
 * - Wenn .env nicht korrekt gesetzt ist, wird eine Warnung ausgegeben.
 * - Wenn MySQL nicht erreichbar ist, schlagen Abfragen fehl.
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

// Überprüfen, ob .env korrekt geladen wurde
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_NAME) {
  console.error('⚠️  Fehlende Umgebungsvariablen! Bitte .env prüfen.');
  console.error('Erforderlich: DB_HOST, DB_USER, DB_PASS, DB_NAME');
}

// Connection Pool erstellen
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
  multipleStatements: true, // erlaubt mehrere SQLs in einer Query
});

console.log('✅ DB-Pool initialisiert für:', process.env.DB_NAME);

module.exports = pool;
