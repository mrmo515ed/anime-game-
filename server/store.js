// ============================================================
//  STORE — persistence layer (JSON file, no external deps)
//  Data is saved to ./data.json (gitignored).
//  In production on a serverless host, swap this with a real DB.
// ============================================================
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

const EMPTY = {
  players: {},          // id -> { id, name, username, avatar, data, updatedAt, lastSeen }
  chat: [],             // [{ id, name, username, text, at }]
  guilds: [],           // [{ id, name, tag, desc, leader, members: [ids], createdAt }]
  boss: null,           // shared world boss state
  bossDamage: {},       // playerId -> { name, total }  (current boss cycle)
  pvp: {},              // playerId -> published combat profile
  tournament: null      // current tournament bracket
};

let db = null;
let writeTimer = null;

function load() {
  if (db) return db;
  try {
    db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    db = JSON.parse(JSON.stringify(EMPTY));
  }
  // merge safety (in case schema evolves)
  db = Object.assign(JSON.parse(JSON.stringify(EMPTY)), db);
  return db;
}

function persist() {
  clearTimeout(writeTimer);
  writeTimer = setTimeout(() => {
    try {
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(db));
    } catch (e) {
      console.error('[store] write failed', e.message);
    }
  }, 300);
}

module.exports = {
  get db() { return load(); },
  persist
};
