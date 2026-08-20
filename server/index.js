// ============================================================
//  ANIME LEGENDS — Backend Server + Telegram Bot
//  Dependency-free Node server (Node >= 18)
//
//  Endpoints:
//    GET  /health, GET /                -> status
//    POST /api/init                     -> auth + get/create player profile
//    POST /api/save                     -> sync player save data (server-side)
//    GET  /api/leaderboard              -> global ranking
//    GET  /api/online                   -> players online in last 5 min
//    GET  /api/chat  / POST /api/chat   -> global chat
//    GET  /api/guilds / POST /api/guilds-> guilds
//    GET  /api/boss  / POST /api/boss/attack -> shared world boss
//    POST /api/stars                    -> create Telegram Stars invoice link
//    POST /webhook                      -> bot updates (start / menu button)
//    GET  /api/admin/stats              -> admin stats (root only)
// ============================================================
// Load .env manually (no external deps)
const fs = require('fs');
const path = require('path');
(function loadEnv() {
  const envFile = path.join(__dirname, '..', '.env');
  try {
    const txt = fs.readFileSync(envFile, 'utf8');
    for (const line of txt.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && process.env[m[1]] === undefined) {
        let v = m[2];
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
        process.env[m[1]] = v;
      }
    }
  } catch (e) { /* no .env — rely on real env vars */ }
})();

const http = require('http');
const crypto = require('crypto');
const store = require('./store');
const tg = require('./tgapi');
const { validateInitData } = require('./validate');

const PORT = process.env.PORT || 8787;
const ROOT_IDS = (process.env.ROOT_ADMIN_IDS || '')
  .split(',').map(s => s.trim()).filter(Boolean);
const APP_URL = process.env.APP_URL || '';
const ONLINE_WINDOW = 5 * 60 * 1000; // 5 minutes
const MAX_CHAT = 100;

// ---------- helpers ----------
function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', c => { data += c; if (data.length > 5e6) reject(new Error('too large')); });
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch (e) { reject(new Error('bad json')); }
    });
    req.on('error', reject);
  });
}

function json(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(body);
}

function auth(req, body) {
  const user = validateInitData(body && body.initData, tg.token);
  return user || null;
}

function getPlayer(user) {
  const id = String(user.id);
  let p = store.db.players[id];
  if (!p) {
    p = {
      id,
      name: [user.first_name, user.last_name].filter(Boolean).join(' ').trim() || ('لاعب ' + id),
      username: user.username || '',
      avatar: user.photo_url || '',
      data: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      lastSeen: Date.now()
    };
    store.db.players[id] = p;
  }
  p.lastSeen = Date.now();
  p.name = [user.first_name, user.last_name].filter(Boolean).join(' ').trim() || p.name;
  p.username = user.username || p.username || '';
  return p;
}

// ---------- world boss ----------
const BOSS_DEFS = [
  { id: 'broly', name: 'برولي الأسطوري', emoji: '🐲', hp: 100000000, atk: 5000 },
  { id: 'sukuna', name: 'سوكونا ملك اللعنات', emoji: '👹', hp: 250000000, atk: 9000 },
  { id: 'madara', name: 'مادارا أوتشيها', emoji: '🌋', hp: 500000000, atk: 15000 }
];

function bossState() {
  if (!store.db.boss) {
    store.db.boss = { level: 1, def: BOSS_DEFS[0], hp: BOSS_DEFS[0].hp, maxhp: BOSS_DEFS[0].hp, killed: 0, lastKill: 0 };
    store.persist();
  }
  return store.db.boss;
}

function bossDefeat() {
  const b = bossState();
  b.level += 1;
  b.def = BOSS_DEFS[(b.level - 1) % BOSS_DEFS.length];
  b.def.hp = Math.floor(b.def.hp * Math.pow(1.25, b.level - 1)); // scale up
  b.hp = b.def.hp; b.maxhp = b.def.hp;
  b.killed += 1; b.lastKill = Date.now();
  store.persist();
}

// ---------- router ----------
const routes = { GET: {}, POST: {} };
function route(method, path, handler) { routes[method][path] = handler; }

route('GET', '/', (req) => json(req.res, 200, { ok: true, app: 'Anime Legends Backend', time: Date.now() }));
route('GET', '/health', (req) => json(req.res, 200, { ok: true, bot: !!tg.token, players: Object.keys(store.db.players).length }));

route('POST', '/api/init', (req, body, q) => {
  const user = auth(req, body);
  if (!user) return json(req.res, 401, { ok: false, error: 'unauthorized' });
  const p = getPlayer(user);
  return json(req.res, 200, { ok: true, player: { id: p.id, name: p.name, username: p.username, avatar: p.avatar, data: p.data } });
});

route('POST', '/api/save', (req, body) => {
  const user = auth(req, body);
  if (!user) return json(req.res, 401, { ok: false, error: 'unauthorized' });
  const p = getPlayer(user);
  if (body.data) {
    p.data = body.data;
    p.updatedAt = Date.now();
    store.persist();
  }
  return json(req.res, 200, { ok: true });
});

route('GET', '/api/leaderboard', (req, body, q) => {
  const list = Object.values(store.db.players)
    .filter(p => p.data)
    .map(p => ({
      id: p.id, name: p.name, username: p.username, avatar: p.avatar,
      level: p.data.player && p.data.player.level || 1,
      power: p.data.teamPower || 0,
      trophies: p.data.trophies || 0
    }))
    .sort((a, b) => (b.power - a.power) || (b.trophies - a.trophies))
    .slice(0, 100);
  return json(req.res, 200, { ok: true, list });
});

route('GET', '/api/online', (req) => {
  const now = Date.now();
  const count = Object.values(store.db.players).filter(p => now - p.lastSeen < ONLINE_WINDOW).length;
  return json(req.res, 200, { ok: true, count });
});

route('GET', '/api/chat', (req) => {
  return json(req.res, 200, { ok: true, list: store.db.chat.slice(-MAX_CHAT) });
});

route('POST', '/api/chat', (req, body) => {
  const user = auth(req, body);
  if (!user) return json(req.res, 401, { ok: false, error: 'unauthorized' });
  const p = getPlayer(user);
  const text = String(body.text || '').trim().slice(0, 500);
  if (!text) return json(req.res, 400, { ok: false, error: 'empty' });
  const msg = { id: crypto.randomUUID(), name: p.name, username: p.username, avatar: p.avatar, text, at: Date.now() };
  store.db.chat.push(msg);
  if (store.db.chat.length > MAX_CHAT * 5) store.db.chat = store.db.chat.slice(-MAX_CHAT * 2);
  store.persist();
  return json(req.res, 200, { ok: true, msg });
});

route('GET', '/api/guilds', (req) => json(req.res, 200, { ok: true, list: store.db.guilds }));

route('POST', '/api/guilds', (req, body) => {
  const user = auth(req, body);
  if (!user) return json(req.res, 401, { ok: false, error: 'unauthorized' });
  const p = getPlayer(user);
  const action = body.action || 'create';
  if (action === 'create') {
    const name = String(body.name || '').trim().slice(0, 24);
    if (!name) return json(req.res, 400, { ok: false, error: 'name required' });
    if (store.db.guilds.some(g => g.name === name)) return json(req.res, 400, { ok: false, error: 'exists' });
    const guild = { id: crypto.randomUUID(), name, tag: String(body.tag || '').toUpperCase().slice(0, 4), desc: String(body.desc || '').slice(0, 120), leader: p.id, members: [p.id], createdAt: Date.now() };
    store.db.guilds.push(guild);
    store.persist();
    return json(req.res, 200, { ok: true, guild });
  }
  if (action === 'join') {
    const guild = store.db.guilds.find(g => g.id === body.guildId);
    if (!guild) return json(req.res, 404, { ok: false, error: 'not found' });
    if (!guild.members.includes(p.id)) { guild.members.push(p.id); store.persist(); }
    return json(req.res, 200, { ok: true, guild });
  }
  if (action === 'leave') {
    const guild = store.db.guilds.find(g => g.id === body.guildId);
    if (guild) { guild.members = guild.members.filter(m => m !== p.id); store.persist(); }
    return json(req.res, 200, { ok: true });
  }
  return json(req.res, 400, { ok: false, error: 'bad action' });
});

route('GET', '/api/boss', (req) => {
  const b = bossState();
  return json(req.res, 200, { ok: true, boss: { level: b.level, name: b.def.name, emoji: b.def.emoji, hp: b.hp, maxhp: b.maxhp, killed: b.killed } });
});

route('POST', '/api/boss/attack', (req, body) => {
  const user = auth(req, body);
  if (!user) return json(req.res, 401, { ok: false, error: 'unauthorized' });
  const p = getPlayer(user);
  const damage = Math.max(1, Math.floor(Number(body.damage) || 0));
  const b = bossState();
  b.hp = Math.max(0, b.hp - damage);
  // track damage for ranking
  const dmg = store.db.bossDamage;
  if (!dmg[p.id]) dmg[p.id] = { name: p.name, avatar: p.avatar, total: 0 };
  dmg[p.id].total += damage;
  const defeated = b.hp <= 0;
  if (defeated) { bossDefeat(); store.db.bossDamage = {}; }
  store.persist();
  return json(req.res, 200, { ok: true, hp: b.hp, maxhp: b.maxhp, defeated, level: b.level, name: b.def.name, emoji: b.def.emoji, yourDamage: damage });
});

route('GET', '/api/boss/top', (req) => {
  const list = Object.values(store.db.bossDamage)
    .sort((a, b) => b.total - a.total).slice(0, 20);
  return json(req.res, 200, { ok: true, list });
});

/* ---------- PvP matchmaking pool ---------- */
route('POST', '/api/pvp/publish', (req, body) => {
  const user = auth(req, body);
  if (!user) return json(req.res, 401, { ok: false, error: 'unauthorized' });
  const p = getPlayer(user);
  store.db.pvp[p.id] = Object.assign({
    id: p.id, name: p.name, username: p.username, avatar: p.avatar, at: Date.now()
  }, body.profile || {});
  // prune stale entries
  const now = Date.now();
  for (const k in store.db.pvp) if (now - (store.db.pvp[k].at || 0) > 86400000) delete store.db.pvp[k];
  store.persist();
  return json(req.res, 200, { ok: true });
});

route('GET', '/api/pvp/find', (req, body, q) => {
  const uid = q.get('uid');
  const list = Object.values(store.db.pvp).filter(x => String(x.id) !== String(uid));
  return json(req.res, 200, { ok: true, list });
});

/* ---------- Tournament (weekly bracket) ---------- */
function tournamentState() {
  if (!store.db.tournament) {
    store.db.tournament = { id: 'w' + new Date().getFullYear() + '-W' + weekNumber(), name: 'بطولة زعماء الأنمي', participants: [], status: 'open', startedAt: Date.now() };
    store.persist();
  }
  return store.db.tournament;
}
function weekNumber() {
  const d = new Date(); const on = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d - on) / 86400000) + on.getDay() + 1) / 7);
}

route('GET', '/api/tournament', (req) => json(req.res, 200, { ok: true, t: tournamentState() }));

route('POST', '/api/tournament/join', (req, body) => {
  const user = auth(req, body);
  if (!user) return json(req.res, 401, { ok: false, error: 'unauthorized' });
  const p = getPlayer(user);
  const t = tournamentState();
  if (t.status !== 'open') return json(req.res, 400, { ok: false, error: 'closed' });
  if (!t.participants.some(x => x.id === p.id)) {
    t.participants.push({ id: p.id, name: p.name, avatar: p.avatar, power: Number(body.power) || 0, wins: 0 });
    store.persist();
  }
  return json(req.res, 200, { ok: true, t });
});

route('POST', '/api/stars', async (req, body) => {
  const user = auth(req, body);
  if (!user) return json(req.res, 401, { ok: false, error: 'unauthorized' });
  const amount = Math.min(5000, Math.max(1, Number(body.amount) || 1));
  try {
    const link = await tg.createInvoiceLink({
      title: 'Anime Legends — Premium',
      description: 'دعم اللعبة وفتح ميزات Premium',
      payload: 'alub_stars_' + String(user.id) + '_' + amount,
      currency: 'XTR',
      prices: [{ label: 'Anime Legends', amount }]
    });
    return json(req.res, 200, { ok: true, link });
  } catch (e) {
    return json(req.res, 500, { ok: false, error: e.message });
  }
});

route('GET', '/api/admin/stats', (req, body, q) => {
  const uid = q.get('uid');
  if (!ROOT_IDS.includes(String(uid))) return json(req.res, 403, { ok: false, error: 'forbidden' });
  const players = Object.values(store.db.players);
  return json(req.res, 200, {
    ok: true,
    total: players.length,
    withData: players.filter(p => p.data).length,
    online: players.filter(p => Date.now() - p.lastSeen < ONLINE_WINDOW).length,
    chatMsgs: store.db.chat.length,
    guilds: store.db.guilds.length
  });
});

// ---------- bot webhook ----------
route('POST', '/webhook', async (req, body) => {
  const msg = body.message;
  if (msg && msg.text) {
    const text = msg.text.trim();
    const chatId = msg.chat.id;
    try {
      if (text === '/start' || text === '/start@' || /^\/start/.test(text)) {
        const keyboard = APP_URL ? {
          inline_keyboard: [[{ text: '⚔️ ابدأ اللعب الآن', web_app: { url: APP_URL } }]]
        } : undefined;
        await tg.sendMessage(chatId,
          'مرحبًا بك في *Anime Legends: Ultimate Battle* ⚔️\n\n' +
          'اجمع الأبطال، طوّر مهاراتك، واسحق خصومك في معارك ملحمية.\n\n' +
          'اضغط الزر بالأسفل لفتح اللعبة 👇',
          { parse_mode: 'Markdown', reply_markup: keyboard });
      } else {
        await tg.sendMessage(chatId, 'استخدم /start لفتح اللعبة ⚔️');
      }
    } catch (e) {
      console.error('[webhook]', e.message);
    }
  }
  return json(req.res, 200, { ok: true });
});

// ---------- server ----------
const server = http.createServer(async (req, res) => {
  req.res = res;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname;
  const handler = routes[req.method] && routes[req.method][path];

  if (!handler) return json(res, 404, { ok: false, error: 'not found' });

  try {
    let body = {};
    if (req.method === 'POST') body = await readBody(req);
    const result = handler(req, body, url.searchParams);
    if (result && typeof result.then === 'function') await result;
  } catch (e) {
    console.error('[server]', e);
    if (!res.writableEnded) json(res, 500, { ok: false, error: e.message });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[anime-legends] server running on port ${PORT}`);
  console.log(`[anime-legends] bot configured: ${!!tg.token}`);
  console.log(`[anime-legends] admins: ${ROOT_IDS.join(', ') || '(none)'}`);
});

// Graceful shutdown so the JSON store flushes
process.on('SIGINT', () => { store.persist(); process.exit(0); });
process.on('SIGTERM', () => { store.persist(); process.exit(0); });
