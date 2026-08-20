/* =====================================================================
   ANIME LEGENDS — Game Extras
   (1) ربط الخادم الحقيقي: حفظ/تحميل + ترتيب + دردشة + متصل + زعيم عالمي
   (2) إكمال المهمات الأسبوعية + نظام الإنجازات (كانت "قريبًا")
   كل شيء محمي: إن لم يتوفر الخادم أو initData يعمل بوضع المتصفح العادي.
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- إعداد الخادم ----------
     ضع رابط الباك-إند هنا بعد نشره، أو عبر localStorage 'alub_server'.
     مثال: window.SERVER_URL = 'https://your-backend.up.railway.app';
  */
  window.SERVER_URL = window.SERVER_URL || '';
  try {
    var saved = localStorage.getItem('alub_server');
    if (saved) window.SERVER_URL = saved;
  } catch (e) {}

  function tgInitData() {
    try {
      return (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) || '';
    } catch (e) { return ''; }
  }
  function serverReady() {
    return !!window.SERVER_URL && !!tgInitData();
  }
  function api(path, opts) {
    opts = opts || {};
    var body = Object.assign({}, opts.body || {});
    if (!body.initData) body.initData = tgInitData();
    var payload = {
      method: opts.method || 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    if (payload.method !== 'GET') payload.body = JSON.stringify(body);
    var qs = payload.method === 'GET' && body.initData ? ('?initData=' + encodeURIComponent(body.initData)) : '';
    return fetch(window.SERVER_URL + path + qs, payload).then(function (r) {
      return r.json();
    }).catch(function (e) { return { ok: false, error: e.message }; });
  }

  /* =====================================================================
     (1) مزامنة الحفظ/التحميل مع الخادم (تقدم حقيقي محفوظ على السيرفر)
     ===================================================================== */
  var saveTimer = null;
  function syncSave() {
    if (!serverReady() || !window.G) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      api('/api/save', { method: 'POST', body: { data: window.G } });
    }, 1500);
  }

  function wrapSave() {
    if (window.__alubSaveWrapped) return;
    window.__alubSaveWrapped = true;
    var orig = window.save;
    window.save = function () {
      try { orig.apply(window, arguments); } catch (e) {}
      syncSave();
    };
  }

  function pullFromServer() {
    if (!serverReady()) return;
    api('/api/init').then(function (r) {
      if (!r.ok || !r.player) return;
      if (r.player.data) {
        try {
          window.G = Object.assign(window.defaultSave(), r.player.data);
          if (window.save) window.save();
          if (window.UI && window.UI.hud) window.UI.hud();
          if (window.UI && window.UI.render) window.UI.render();
        } catch (e) {}
      } else {
        // أول تسجيل دخول: ارفع الحفظ المحلي للسيرفر
        api('/api/save', { method: 'POST', body: { data: window.G } });
      }
    });
  }

  /* =====================================================================
     (1b) الترتيب الحقيقي + عدد المتصلين
     ===================================================================== */
  function renderLeaderboard() {
    var title = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-4"/></svg> الترتيب العالمي';
    if (!serverReady()) {
      window.UI.openModal(title, '<div class="empty">الترتيب العالمي يتطلب فتح اللعبة من داخل بوت Telegram مع ربط الخادم.</div>');
      return;
    }
    var body = window.UI.openModal(title, '<div class="empty">جارٍ تحميل الترتيب…</div>');
    api('/api/leaderboard').then(function (r) {
      var list = (r.ok && r.list) || [];
      if (!list.length) {
        document.getElementById('mBody').innerHTML = '<div class="empty">لا يوجد لاعبون بعد — كن أول من يظهر هنا!</div>';
        return;
      }
      var medals = ['#FFD700', '#C0C0C0', '#CD7F32'];
      document.getElementById('mBody').innerHTML = '<div style="display:flex;flex-direction:column;gap:10px;">' +
        list.map(function (p, i) {
          var c = medals[i] || 'rgba(255,255,255,0.08)';
          var av = p.avatar
            ? '<img src="' + p.avatar + '" style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid ' + (medals[i] || '#fff') + ';">'
            : '<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#a24bff,#00f0ff);display:grid;place-items:center;font-size:16px;">👤</div>';
          return '<div class="kv" style="background:' + c + ';border-left:5px solid ' + (medals[i] || '#a24bff') + ';padding:12px;border-radius:12px;">' +
            '<span style="display:flex;align-items:center;gap:12px;">' +
            '<b style="font-size:18px;color:' + (medals[i] ? '#000' : '#fff') + ';">#' + (i + 1) + '</b>' + av +
            '<b style="font-size:14px;">' + (p.name || 'لاعب') + (p.username ? ' <small style="opacity:.5">@' + p.username + '</small>' : '') + '</b></span>' +
            '<div style="text-align:left;"><b style="display:block;">Lv.' + p.level + '</b>' +
            '<small style="color:#ffc844;">' + (p.power ? p.power.toLocaleString() : '0') + ' قوة</small></div></div>';
        }).join('') + '</div>';
    });
  }

  function onlineCount() {
    if (!serverReady()) return;
    api('/api/online').then(function (r) {
      if (r.ok) window.__alubOnline = r.count;
    });
  }

  /* =====================================================================
     (1c) الدردشة العالمية الحقيقية
     ===================================================================== */
  function renderChat() {
    var title = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg> الدردشة العالمية المباشرة';
    if (!serverReady()) {
      window.UI.openModal(title, '<div class="empty">الدردشة العالمية تتطلب فتح اللعبة من داخل بوت Telegram مع ربط الخادم.</div>');
      return;
    }
    var html = '<div id="alubChatBox" style="max-height:52vh;overflow-y:auto;display:flex;flex-direction:column;gap:8px;padding:4px;">' +
      '<div class="empty" style="padding:10px;">جارٍ التحميل…</div></div>' +
      '<div style="display:flex;gap:10px;margin-top:10px;">' +
      '<input id="alubChatIn" class="searchbar" placeholder="اكتب رسالتك…" style="flex:1;border-radius:20px;" onkeypress="if(event.key===\'Enter\')window.__alubSendChat()">' +
      '<button class="btn cyan" style="border-radius:20px;padding:0 20px;" onclick="window.__alubSendChat()">إرسال</button></div>';
    window.UI.openModal(title, html);
    window.__alubChatTimer && clearInterval(window.__alubChatTimer);
    function poll() {
      api('/api/chat').then(function (r) {
        var list = (r.ok && r.list) || [];
        var box = document.getElementById('alubChatBox');
        if (!box) return;
        box.innerHTML = list.length ? list.map(function (m) {
          var t = new Date(m.at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
          return '<div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:8px 12px;">' +
            '<b style="font-size:12px;color:#53bdeb;">' + (m.name || 'لاعب') + '</b> ' +
            '<span style="font-size:13px;">' + (m.text || '').replace(/</g, '&lt;') + '</span>' +
            '<span style="float:left;font-size:10px;opacity:.4;">' + t + '</span></div>';
        }).join('') : '<div class="empty">كن أول من يتحدث في الدردشة!</div>';
        box.scrollTop = box.scrollHeight;
      });
    }
    poll();
    window.__alubChatTimer = setInterval(poll, 3000);
  }
  window.__alubSendChat = function () {
    var inp = document.getElementById('alubChatIn');
    if (!inp || !inp.value.trim()) return;
    api('/api/chat', { method: 'POST', body: { text: inp.value } }).then(function (r) {
      if (!r.ok) { window.toast && window.toast('تعذر الإرسال: ' + (r.error || ''), 'bad'); return; }
      inp.value = '';
      var box = document.getElementById('alubChatBox');
      // سحب فوري
      api('/api/chat').then(function (rr) {
        var list = (rr.ok && rr.list) || [];
        if (box && list.length) {
          box.innerHTML = list.map(function (m) {
            var t = new Date(m.at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
            return '<div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:8px 12px;"><b style="font-size:12px;color:#53bdeb;">' + (m.name || 'لاعب') + '</b> <span style="font-size:13px;">' + (m.text || '').replace(/</g, '&lt;') + '</span><span style="float:left;font-size:10px;opacity:.4;">' + t + '</span></div>';
          }).join('');
          box.scrollTop = box.scrollHeight;
        }
      });
    });
  };

  /* =====================================================================
     (1d) الزعيم العالمي المشترك (HP على الخادم — كل اللاعبين يهاجمون معًا)
     ===================================================================== */
  function renderBoss() {
    var title = '👹 الزعيم العالمي';
    if (!serverReady()) {
      window.UI.openModal(title, '<div class="empty">الزعيم العالمي يتطلب فتح اللعبة من داخل بوت Telegram مع ربط الخادم.</div>');
      return;
    }
    window.UI.openModal(title, '<div class="empty">جارٍ تحميل الزعيم…</div>');
    api('/api/boss').then(function (r) {
      var b = r.boss;
      if (!b) { document.getElementById('mBody').innerHTML = '<div class="empty">تعذر تحميل الزعيم.</div>'; return; }
      var pct = Math.max(0, (b.hp / b.maxhp) * 100);
      var dmg = Math.max(1, Math.floor((typeof window.teamPower === 'function' ? window.teamPower() : 1000) * 3));
      document.getElementById('mBody').innerHTML =
        '<div style="text-align:center;">' +
        '<div style="font-size:80px;animation:idleF 2.4s ease-in-out infinite;">' + (b.emoji || '🐲') + '</div>' +
        '<h3 style="font-size:20px;margin:8px 0;">' + b.name + ' — المستوى ' + b.level + '</h3>' +
        '<div class="bar" style="height:18px;margin:14px 0;"><div style="width:' + pct + '%;background:linear-gradient(90deg,#ff2e5b,#ff8a00);border-radius:9px;"></div></div>' +
        '<div style="font-size:12px;opacity:.7;">' + Math.floor(b.hp).toLocaleString() + ' / ' + b.maxhp.toLocaleString() + ' · هُزم ' + b.killed + ' مرة</div>' +
        '<button class="btn red block" style="margin-top:16px;" onclick="window.__alubAttackBoss(' + dmg + ')">⚔️ اهجم (' + dmg.toLocaleString() + ' ضرر)</button>' +
        '<small style="display:block;margin-top:10px;opacity:.5;">كل اللاعبين يهاجمون نفس الزعيم معًا</small></div>';
    });
  }
  window.__alubAttackBoss = function (dmg) {
    api('/api/boss/attack', { method: 'POST', body: { damage: dmg } }).then(function (r) {
      if (!r.ok) { window.toast && window.toast('تعذر الهجوم', 'bad'); return; }
      window.toast && window.toast('ألحقت ' + r.yourDamage.toLocaleString() + ' ضرر!', 'good');
      if (r.defeated) {
        window.toast && window.toast('🎉 تم القضاء على الزعيم العالمي! ظهر زعيم جديد: ' + r.name, 'good');
        if (window.G) { window.G.stats.bossWins = (window.G.stats.bossWins || 0) + 1; if (window.save) window.save(); }
      }
      renderBoss();
    });
  };

  /* =====================================================================
     (2) إكمال المهمات الأسبوعية + نظام الإنجازات
     ===================================================================== */
  function missionValue(m) {
    if (m.key === 'plvl') return window.G.player.level;
    if (m.key === 'mythics') return (typeof window.ownedList === 'function' ? window.ownedList().filter(function (c) { return c.rarity === 'mythic' || c.rarity === 'premium'; }).length : 0);
    return (window.G.stats && window.G.stats[m.key]) || 0;
  }
  function missionProg(m, type) {
    var base = type === 'weekly' ? (window.G.missions.weekly[m.id + '_base'] || 0)
             : type === 'daily' ? (window.G.missions.daily[m.id + '_base'] || 0) : 0;
    return Math.max(0, missionValue(m) - base);
  }
  function missionRow(m, type) {
    var prog = missionProg(m, type);
    var pct = Math.min(100, (prog / m.goal) * 100);
    var claimed = !!window.G.missions.claimed[m.id];
    var done = prog >= m.goal;
    return '<div class="mission"><div class="m-tx"><b>' + m.t + '</b>' +
      '<div class="m-prog"><i style="width:' + pct + '%"></i></div>' +
      '<small style="opacity:.6;">' + prog + ' / ' + m.goal + ' · مكافأة: ' +
      (m.r.gold ? m.r.gold + '🪙 ' : '') + (m.r.gems ? m.r.gems + '💎 ' : '') + (m.r.prem ? m.r.prem + '⭐' : '') + '</small></div>' +
      '<button class="btn xs ' + (done && !claimed ? 'gold' : 'ghost') + '" ' + (done && !claimed ? '' : 'disabled') +
      ' onclick="Missions.claim(\'' + m.id + '\',\'' + type + '\');renderWeeklyAch()">' +
      (claimed ? '✓' : 'استلم') + '</button></div>';
  }
  window.renderWeeklyAch = function () {
    var content = document.getElementById('missContent');
    if (!content) return;
    var html = '<div class="sec-title">المهام الأسبوعية</div>';
    html += (window.MISSION_DEFS.weekly || []).map(function (m) { return missionRow(m, 'weekly'); }).join('');
    html += '<div class="sec-title" style="margin-top:14px;">موسمية</div>';
    html += (window.MISSION_DEFS.season || []).map(function (m) { return missionRow(m, 'season'); }).join('');
    html += '<div class="sec-title" style="margin-top:14px;">الإنجازات</div>';
    html += window.__alubAchievements.map(function (a) {
      var v = aValue(a);
      var pct = Math.min(100, (v / a.goal) * 100);
      var done = v >= a.goal;
      var claimed = !!window.G.achievements[a.id];
      return '<div class="mission"><div class="m-tx"><b>' + a.t + '</b><small style="display:block;opacity:.6;">' + a.d + '</small>' +
        '<div class="m-prog"><i style="width:' + pct + '%"></i></div>' +
        '<small style="opacity:.6;">' + v + ' / ' + a.goal + ' · ' + a.r.gems + '💎</small></div>' +
        '<button class="btn xs ' + (done && !claimed ? 'gold' : 'ghost') + '" ' + (done && !claimed ? '' : 'disabled') +
        ' onclick="window.__alubClaimAch(\'' + a.id + '\')">' + (claimed ? '✓' : 'استلم') + '</button></div>';
    }).join('');
    content.innerHTML = html;
  };
  function aValue(a) {
    if (a.key === 'plvl') return window.G.player.level;
    if (a.key === 'charsOwned') return (typeof window.ownedList === 'function' ? window.ownedList().length : 0);
    return (window.G.stats && window.G.stats[a.key]) || 0;
  }
  window.__alubClaimAch = function (id) {
    var a = window.__alubAchievements.find(function (x) { return x.id === id; });
    if (!a || window.G.achievements[id]) return;
    if (aValue(a) < a.goal) { window.toast && window.toast('لم يكتمل بعد', 'bad'); return; }
    window.G.achievements[id] = 1;
    if (a.r.gems) window.G.cur.gems += a.r.gems;
    if (a.r.gold) window.G.cur.gold += a.r.gold;
    if (a.r.prem) window.G.cur.prem += a.r.prem;
    window.save && window.save();
    window.UI.hud && window.UI.hud();
    window.toast && window.toast('🏆 إنجاز محقق: ' + a.t + ' (+' + (a.r.gems || a.r.gold || a.r.prem) + ')', 'good');
    renderWeeklyAch();
  };
  window.__alubAchievements = [
    { id: 'a_win1', t: 'الفوز الأول', d: 'اربح أول معركة', key: 'wins', goal: 1, r: { gems: 20 } },
    { id: 'a_win50', t: 'محارب مخضرم', d: 'اربح 50 معركة', key: 'wins', goal: 50, r: { gems: 200 } },
    { id: 'a_dmg1m', t: 'مدمّر', d: 'ألحق 1,000,000 ضرر', key: 'damage', goal: 1000000, r: { gems: 300 } },
    { id: 'a_chest10', t: 'صائد الكنوز', d: 'افتح 10 صناديق', key: 'chests', goal: 10, r: { gems: 150 } },
    { id: 'a_ult20', t: 'قاضٍ', d: 'استخدم 20 مهارة نهائية', key: 'ults', goal: 20, r: { gems: 120 } },
    { id: 'a_lv30', t: 'أسطورة', d: 'اوصل للمستوى 30', key: 'plvl', goal: 30, r: { gems: 500, prem: 5 } },
    { id: 'a_chars10', t: 'جامع الأبطال', d: 'اجمع 10 أبطال', key: 'charsOwned', goal: 10, r: { gems: 250 } }
  ];

  /* ---------- التثبيت بعد اكتمال تحميل اللعبة ---------- */
  function boot() {
    // تأكد من وجود حقل الإنجازات
    if (window.G && !window.G.achievements) window.G.achievements = {};
    wrapSave();
    onlineCount();

    // استبدال الدوال المزيفة بالحقيقية (عند توفر الخادم)
    if (window.ExtendedFeatures) {
      window.ExtendedFeatures.showLeaderboard = renderLeaderboard;
      window.ExtendedFeatures.showChat = renderChat;
      window.ExtendedFeatures.switchMissTab = function (type, el) {
        document.querySelectorAll('#missTabs .ext-tab-btn').forEach(function (t) { t.classList.remove('active'); });
        el.classList.add('active');
        var content = document.getElementById('missContent');
        if (!content) return;
        if (type === 'daily') this.showMissions();
        else renderWeeklyAch();
      };
    }

    // الزعيم العالمي
    if (window.UI && window.UI.go) {
      var oGo = window.UI.go;
      window.UI.go = function (s) {
        if (s === 'boss') { renderBoss(); return; }
        oGo.apply(window.UI, arguments);
      };
    }

    // سحب البيانات الحقيقية من الخادم
    pullFromServer();

    // عدد المتصلين الحقيقي (يُحدَّث دوريًا)
    setInterval(onlineCount, 30000);
  }

  if (document.readyState === 'complete') {
    setTimeout(boot, 800);
  } else {
    window.addEventListener('load', function () { setTimeout(boot, 800); });
  }
})();
