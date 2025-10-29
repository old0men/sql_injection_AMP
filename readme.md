# SQL Injection Demo (School Project)

**Projekt:** SQL Injection Demonstration & Gegenmaßnahmen

**Autoren:** Altin Demku, Manuel Bürki, Victor Peski

**Datum:** 2025-10-29

**Kurzbeschreibung:**
Dieses Repository enthält eine Lernumgebung, die verschiedene Implementierungen eines Login‑Endpoints demonstriert: eine **absichtlich unsichere** Variante (`unsecure.js`) und eine **sichere** Variante (`secure.js`) welche Prepared Statements / Stored Procedure verwendet. Zusätzlich ist `db.js` enthalten, das die Verbindung zur MySQL‑Datenbank konfiguriert. Die SQL‑Datenbank‑Initialisierung (Schema + Testdaten + Stored Procedure) liegt als `schema.sql` bei.

---

## Voraussetzungen
- Node.js (>= 16 empfohlen)
- MySQL Server (lokal oder remote)
- `npm install` im Projektverzeichnis

Umgebungsvariablen in `.env` (Beispiel):

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=secret
DB_NAME=SQL_injection
```

---

## Dateien
- `unsecure.js` — bewusst verwundbare Implementation (String‑Concatenation SQL).
- `secure.js` — sichere Implementation, ruft Stored Procedure `login_user(in_name, in_pass)` parametrisiert auf.
- `db.js` — DB‑Pool Konfiguration (nutzt `mysql2/promise`).
- `SQL` — enthält DDL, INSERTs und die Stored Procedure.
- `attackdeffendscript.json` - JSON-Datei um die Sicherheit/Unsicherheit zu testen
- `README.md` — diese Datei.

---

## Aufsetzen der Datenbank
1. MySQL starten.
2. `SQL` ausführen (z. B. mit MySQL Workbench oder `mysql -u root -p < SQL`).
3. Prüfen, dass Stored Procedure `login_user` existiert:

```sql
SHOW PROCEDURE STATUS WHERE Name = 'login_user';
```

---

## Starten der Anwendung
1. Abhängigkeiten installieren:

```bash
npm install
```

2. `.env` anlegen (s. oben).
3. Server starten:

```bash
node secure.js
# oder für die unsichere Variante:
node unsecure.js
```

Standardport: `http://localhost:3000`

---

## Postman Tests (Kurz)
- **Admin Login (funktional):**
  - POST `http://localhost:3000/login`
  - Body (x‑www‑form‑urlencoded): `username=Admin`, `password=1234`
  - Erwartung (secure): `200` + `{ role: "admin" ... }`

- **SQLi Versuch (muss fehlschlagen im secure):**
  - POST `http://localhost:3000/login`
  - Body: `username=Admin' --`, `password=whatever`  (oder `password=' OR '1'='1`)
  - Erwartung secure: `401` / `400` — **kein** 200

---

## Autoren
- Altin Demku
- Manuel Bürki
- Victor Peski
