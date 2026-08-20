(function() {
  console.log('Anime Legends UI & Systems Polish Loaded');

  // --- 1. Global UI & Animation Improvements ---
  window.logActivity = function(text) {
    if(!window.G) return;
    if(!window.G.activityHistory) window.G.activityHistory = [];
    const d = new Date();
    const time = d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
    window.G.activityHistory.unshift({time: time, text: text});
    if(window.G.activityHistory.length > 20) window.G.activityHistory.pop();
    if(window.save) window.save();
  };

  const extStyle = document.createElement('style');
  extStyle.textContent = `
    /* Smooth fading and transitions */
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .screen.active { animation: fadeInUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); }
    
    /* Button Polish */
    .btn {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.3);
      border-radius: 8px;
    }
    .btn::after {
      content: '';
      position: absolute;
      top: 0; left: -100%;
      width: 50%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: 0.5s;
      z-index: 1;
    }
    .btn:hover::after { left: 100%; }
    .btn:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 6px 20px rgba(0,0,0,0.5); }
    .btn:active { transform: translateY(1px) scale(0.98); }
    
    /* Glassmorphism & Depth */
    .sheet, .mini-card, .char-card, .shop-item, .kv, .warnbox, .arena-card, .chat-box {
      background: rgba(15, 15, 30, 0.65) !important;
      backdrop-filter: blur(12px) saturate(150%);
      -webkit-backdrop-filter: blur(12px) saturate(150%);
      border: 1px solid rgba(255,255,255,0.08) !important;
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
      border-radius: 12px;
    }
    
    /* HUD & Navigation */
    #hud {
      background: linear-gradient(180deg, rgba(5,3,15,0.95) 0%, rgba(5,3,15,0.7) 60%, transparent 100%) !important;
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255,255,255,0.05);
      padding-bottom: 15px !important;
    }
    #nav {
      background: rgba(5,3,15,0.9) !important;
      backdrop-filter: blur(15px);
      border-top: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 -5px 20px rgba(0,0,0,0.5);
    }
    .nav-i { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
    .nav-i:hover { transform: translateY(-3px); color: var(--neon-cyan); }
    .nav-i.on { transform: translateY(-5px) scale(1.1); color: var(--neon-cyan); filter: drop-shadow(0 0 5px var(--neon-cyan)); }
    
    /* Typography and Colors */
    body { font-family: 'Cairo', sans-serif; }
    h1, h2, h3, h4, .sec-title, .title { font-family: 'Orbitron', 'Cairo', sans-serif; letter-spacing: 0.5px; }
    .sec-title { border-bottom: 2px solid transparent; border-image: linear-gradient(90deg, var(--neon-cyan), transparent) 1; padding-bottom: 5px; margin-bottom: 15px; }
    
    /* Combat Animations */
    .anim-atk-fwd { animation: atkFwd 0.4s ease-in forwards; }
    @keyframes atkFwd { 0% { transform: translateX(0) scale(1); } 50% { transform: translateX(-60px) scale(1.15); z-index: 10; filter: drop-shadow(0 0 10px var(--neon-cyan)); } 100% { transform: translateX(0) scale(1); } }
    .anim-atk-fwd-foe { animation: atkFwdFoe 0.4s ease-in forwards; }
    @keyframes atkFwdFoe { 0% { transform: translateX(0) scale(1) scaleX(-1); } 50% { transform: translateX(60px) scale(1.15) scaleX(-1); z-index: 10; filter: drop-shadow(0 0 10px var(--neon-pink)); } 100% { transform: translateX(0) scale(1) scaleX(-1); } }
    .anim-hit { animation: getHit 0.4s ease-in-out; filter: brightness(2) sepia(1) hue-rotate(300deg); }
    @keyframes getHit { 0% { transform: translateX(0); } 20% { transform: translateX(15px); } 40% { transform: translateX(-15px); } 60% { transform: translateX(10px); } 80% { transform: translateX(-10px); } 100% { transform: translateX(0); } }
    .anim-skill { animation: useSkill 0.8s ease-in-out; }
    @keyframes useSkill { 0% { transform: scale(1); filter: brightness(1); } 50% { transform: scale(1.2) translateY(-20px); filter: brightness(2) drop-shadow(0 0 20px gold); } 100% { transform: scale(1); filter: brightness(1); } }
    
    /* Extended Components */
    
    /* WhatsApp-style Chat */
    .chat-box { height: calc(100vh - 200px); overflow-y: auto; padding: 15px; scroll-behavior: smooth; background: url('https://i.imgur.com/KzX5ZzK.png') center/cover; }
    .chat-msg { margin-bottom: 12px; font-size: 13.5px; line-height: 1.4; display: flex; align-items: flex-end; gap: 8px; animation: fadeInUp 0.3s ease-out; position: relative; user-select: none; }
    .chat-msg img { width: 34px; height: 34px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); object-fit: cover; flex-shrink: 0; }
    .chat-msg .content { background: rgba(30, 40, 50, 0.95); padding: 8px 12px; border-radius: 14px; border-bottom-right-radius: 4px; max-width: 75%; position: relative; box-shadow: 0 2px 5px rgba(0,0,0,0.3); backdrop-filter: blur(10px); color: #e9eefc; }
    .chat-msg b { font-size: 11.5px; display: block; margin-bottom: 3px; color: var(--neon-cyan); opacity: 0.9; }
    .chat-msg .time { font-size: 9px; opacity: 0.5; float: right; margin-left: 10px; margin-top: 5px; }
    
    
    .chat-msg.me .content { border-bottom-right-radius: 14px; border-bottom-left-radius: 4px; background: linear-gradient(135deg, rgba(0, 150, 136, 0.9), rgba(0, 120, 108, 0.9)); color: #fff; border: 1px solid rgba(0, 240, 255, 0.1); }
    .chat-msg.me b { display: none; }
    
    .chat-msg.sys { justify-content: center; }
    .chat-msg.sys .content { background: rgba(0,0,0,0.5); font-size: 11px; padding: 5px 12px; border-radius: 20px; color: var(--neon-gold); text-align: center; max-width: 90%; }
    
    /* Chat Reactions */
    .chat-reactions { position: absolute; bottom: -12px; right: 10px; display: flex; gap: 4px; background: rgba(0,0,0,0.6); padding: 2px 6px; border-radius: 12px; font-size: 12px; border: 1px solid rgba(255,255,255,0.1); }
    .chat-msg.me .chat-reactions { right: auto; left: 10px; }
    
    /* Context Menu for Chat */
    .chat-ctx { position: absolute; bottom: 100%; left: 50%; transform: translate(-50%, -10px); background: rgba(15, 20, 30, 0.95); backdrop-filter: blur(15px); border: 1px solid var(--glass-br); border-radius: 12px; display: flex; gap: 10px; padding: 8px 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 100; animation: fadeIn 0.2s; white-space: nowrap; }
    .chat-ctx::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 6px solid transparent; border-top-color: rgba(15, 20, 30, 0.95); }
    .chat-ctx-btn { font-size: 20px; cursor: pointer; transition: 0.2s; background: none; border: none; color: #fff; display: flex; flex-direction: column; align-items: center; gap: 4px; opacity: 0.8; }
    .chat-ctx-btn span { font-size: 9px; }
    .chat-ctx-btn:hover { opacity: 1; transform: scale(1.1); color: var(--neon-cyan); }
    .chat-ctx-emojis { display: flex; gap: 8px; border-right: 1px solid rgba(255,255,255,0.1); padding-right: 10px; margin-right: 10px; }
    
    /* Replying to */
    .reply-badge { background: rgba(0,0,0,0.3); border-left: 3px solid var(--neon-cyan); padding: 4px 8px; border-radius: 6px; font-size: 10px; margin-bottom: 5px; opacity: 0.8; }
    .reply-badge b { color: var(--neon-cyan); display: inline !important; font-size: 10px !important; margin-right: 4px; }
    
    #replyPreview { display: none; background: rgba(0, 50, 60, 0.9); border-left: 4px solid var(--neon-cyan); padding: 8px 12px; font-size: 11px; position: relative; margin: 0 15px 5px; border-radius: 8px; }
    #replyPreview span { opacity: 0.8; }

    
    
    
    
    .chat-msg.me { flex-direction: row-reverse; }
    
    
    
    
    .arena-card { cursor: pointer; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; padding-bottom: 0; min-height: 120px; }
    .arena-card:hover, .arena-card:active { transform: scale(0.96); border-color: var(--neon-cyan); box-shadow: 0 0 15px rgba(0,240,255,0.3); }
    .arena-card img { position: absolute; top:0; left:0; width: 100%; height: 100%; object-fit: cover; opacity: 0.6; transition: 0.4s; z-index: 0; }
    .arena-card:hover img { opacity: 0.9; transform: scale(1.1); }
    .arena-card .name { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(0deg, rgba(0,0,0,0.9) 0%, transparent 100%); padding: 20px 10px 10px; font-weight: 900; font-size: 15px; text-shadow: 0 2px 4px #000; z-index: 1; }
    .arena-card .stat { position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.8); padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; border: 1px solid var(--neon-cyan); z-index: 1; backdrop-filter: blur(5px); }
    
    .ext-tab-btn { flex: 1; text-align: center; padding: 12px; background: rgba(255,255,255,0.02); border-bottom: 2px solid rgba(255,255,255,0.1); cursor: pointer; font-weight: bold; font-size: 13px; transition: 0.3s; border-radius: 8px 8px 0 0; }
    .ext-tab-btn:hover { background: rgba(255,255,255,0.05); }
    .ext-tab-btn.active { background: rgba(0,240,255,0.1); border-bottom-color: var(--neon-cyan); color: var(--neon-cyan); text-shadow: 0 0 5px rgba(0,240,255,0.5); }
    
    .shop-ext-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; }
    .shop-ext-item { background: rgba(15,15,30,0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 15px; text-align: center; transition: 0.3s; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
    .shop-ext-item:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.5); border-color: rgba(255,255,255,0.3); }
    .shop-ext-item .price { display: flex; justify-content: center; align-items: center; gap: 6px; font-weight: 900; font-size: 16px; margin: 12px 0; }
  `;
  document.head.appendChild(extStyle);

  // --- 2. Intercept Screen Navigation for Unimplemented/Empty Pages ---
  if(window.UI && window.UI.go) {
    const origGo = window.UI.go;
    window.UI.go = function(s) {
      if (s === 'guild' || s === 'guilds') { window.ExtendedFeatures.open('guildx'); return; }
      if (s === 'tourney' || s === 'tournament') { window.ExtendedFeatures.open('tourney'); return; }

      if (s === 'premium' || s === 'vip') { window.ExtendedFeatures.open('shopx'); return; }
      if (s === 'pvp') { window.ExtendedFeatures.open('pvpx'); return; }
      if (s === 'settings') { window.ExtendedFeatures.open('settingsx'); return; }
      
      origGo.call(window.UI, s);
    };
  }
  
  if(window.navigate) {
    const origNav = window.navigate;
    window.navigate = function(s) {
      if (s === 'guild' || s === 'guilds') { window.ExtendedFeatures.open('guildx'); return; }
      if (s === 'tourney' || s === 'tournament') { window.ExtendedFeatures.open('tourney'); return; }

      if (s === 'premium' || s === 'vip') { window.ExtendedFeatures.open('shopx'); return; }
      if (s === 'pvp') { window.ExtendedFeatures.open('pvpx'); return; }
      if (s === 'settings') { window.ExtendedFeatures.open('settingsx'); return; }
      origNav(s);
    }
  }

  // --- 3. Hook into game events for Dynamic Animations and Activity Logging ---
  setTimeout(function() {
    // Hook grantChar for activity logging
    if (typeof window.grantChar === 'function') {
      const origGrantChar = window.grantChar;
      window.grantChar = function(id, silent) {
        const res = origGrantChar.apply(this, arguments);
        try {
          if (typeof CMAP !== 'undefined' && CMAP[id]) {
            if (res) {
              window.logActivity(`حصلت على البطل الجديد: ${CMAP[id].name} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`);
            } else {
              window.logActivity(`حصلت على نسخة مكررة من ${CMAP[id].name}`);
            }
          }
        } catch(e) {}
        return res;
      };
    }

    if(window.Battle) {
      const origAttack = window.Battle.attack;
      window.Battle.attack = function(isSkill) {
        if(!this.st || this.st.over) return;
        const s = this.st;
        const myTurn = (s.turn === 'player');
        
        const pEl = document.getElementById('bChar1');
        const fEl = document.getElementById('bChar2');
        
        if (myTurn && pEl) {
          pEl.classList.add(isSkill ? 'anim-skill' : 'anim-atk-fwd');
          setTimeout(() => pEl.classList.remove(isSkill ? 'anim-skill' : 'anim-atk-fwd'), isSkill ? 800 : 400);
          if(fEl) {
             setTimeout(() => fEl.classList.add('anim-hit'), isSkill ? 400 : 150);
             setTimeout(() => fEl.classList.remove('anim-hit'), isSkill ? 800 : 550);
          }
        } else if (!myTurn && fEl) {
          fEl.classList.add(isSkill ? 'anim-skill' : 'anim-atk-fwd-foe');
          setTimeout(() => fEl.classList.remove(isSkill ? 'anim-skill' : 'anim-atk-fwd-foe'), isSkill ? 800 : 400);
          if(pEl) {
             setTimeout(() => pEl.classList.add('anim-hit'), isSkill ? 400 : 150);
             setTimeout(() => pEl.classList.remove('anim-hit'), isSkill ? 800 : 550);
          }
        }
        
        if(origAttack) origAttack.apply(this, arguments);
      };
      
      const origFinish = window.Battle.finish;
      window.Battle.finish = function(win) {
         if (win) {
            window.logActivity(`انتصرت في المعركة! <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/><path d="M8.5 6.5L21 19v3h-3L6.5 10.5"/><path d="M11 5L5 11"/><path d="M8 8L4 4"/><path d="M5 3L3 5"/></svg>`);
         } else {
            window.logActivity(`هُزمت في المعركة <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="m14.5 9.5-9 9a2.12 2.12 0 1 0 3 3l9-9"/><path d="m16 16 4.5 4.5"/><path d="m20.5 3.5-4.5 4.5"/><path d="m8 8-4.5-4.5"/><path d="m3.5 20.5 4.5-4.5"/><path d="m11.5 5.5 3 3"/><path d="m15.5 8.5 3-3"/><path d="m18.5 12.5-3-3"/></svg>`);
         }
         if (origFinish) return origFinish.apply(this, arguments);
      };
    }

    // Extended UI Menu injection
    if(window.UX && UX.moreMenu) {
      UX.moreMenu = function() {
        const items = [
          ['pvpx', '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><path d=\'M14.5 17.5L3 6V3h3l11.5 11.5\'/><path d=\'M13 19l6-6\'/><path d=\'M16 16l4 4\'/><path d=\'M19 21l2-2\'/><path d=\'M8.5 6.5L21 19v3h-3L6.5 10.5\'/><path d=\'M11 5L5 11\'/><path d=\'M8 8L4 4\'/><path d=\'M5 3L3 5\'/></svg>', 'القتال أونلاين'],
          ['arena', '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'1.2em\' height=\'1.2em\' style=\'vertical-align:text-bottom\'><path d=\'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2.5 9h19 M2.5 15h19 M12 2v20\'/></svg>', 'ساحات القتال'],
          ['chat', '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><path d=\'m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z\'/></svg>', 'الدردشة العالمية'],
          ['guildx', '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><path d=\'M22 20v-6h-2v6h-4v-4H8v4H4v-6H2v6h20zM4 14V4h2v10H4zM18 14V4h2v10h-2zM9 10h6v6H9v-6z\'/></svg>', 'نظام النقابات'],
          ['tourney', '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><path d=\'M6 9H4.5a2.5 2.5 0 0 1 0-5H6\'/><path d=\'M18 9h1.5a2.5 2.5 0 0 0 0-5H18\'/><path d=\'M4 22h16\'/><path d=\'M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22\'/><path d=\'M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22\'/><path d=\'M18 2H6v7a6 6 0 0 0 12 0V2Z\'/></svg>', 'البطولات والمواسم'],
          ['leaderboard', '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><circle cx=\'12\' cy=\'8\' r=\'7\'/><polyline points=\'8.21 13.89 7 23 12 20 17 23 15.79 13.88\'/></svg>', 'لوحة المتصدرين'],
          ['missionsx', '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'1.2em\' height=\'1.2em\' style=\'vertical-align:text-bottom\'><path d=\'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z\'/></svg>', 'المهام والإنجازات'],
          ['shopx', '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'1.2em\' height=\'1.2em\' style=\'vertical-align:text-bottom\'><path d=\'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z\'/></svg>', 'المتجر الشامل'],
          ['settingsx', '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><path d=\'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z\'/><circle cx=\'12\' cy=\'12\' r=\'3\'/></svg>', 'إعدادات اللعبة'],
          ['profile', '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><circle cx=\'12\' cy=\'8\' r=\'5\'/><path d=\'M20 21a8 8 0 0 0-16 0\'/></svg>', 'الملف الشخصي']
        ];
        
        window.UI.openModal('⋯ الأنظمة المتطورة', 
          `<div class="menu-grid">${items.map(i=>`
            <div class="menu-tile" onclick="UI.closeModal(); ExtendedFeatures.open('${i[0]}')">
              <span class="ic">${i[1]}</span><span class="lb">${i[2]}</span></div>`).join('')}
          </div>`
        );
      };
    }
  }, 1000);

  // --- 4. Extended Features Complete Implementations ---
  
  window.UI.openPage = function(title, html) {
    if(window.UI.closeModal) window.UI.closeModal();
    let scr = document.getElementById('scr-extended-page');
    if (!scr) {
      scr = document.createElement('div');
      scr.className = 'screen';
      scr.id = 'scr-extended-page';
      document.getElementById('screens').appendChild(scr);
    }
    
    scr.innerHTML = `
      <div class="scr-head">
        <div class="back-btn" onclick="UI.go('home')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em"><path d="M15 18l-6-6 6-6"/></svg>
        </div>
        <h2 style="font-size:18px; margin:0;">${title}</h2>
      </div>
      <div class="scr-body scroll" style="padding-top: 15px;">${html}</div>
    `;
    
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    scr.classList.add('active');
    
    document.querySelectorAll('#nav .nav-i').forEach(el => el.classList.remove('on'));
    const hud = document.getElementById('hud');
    if (hud) hud.classList.remove('hidden');
    const nav = document.getElementById('nav');
    if (nav) nav.classList.remove('hidden');
  };

  window.ExtendedFeatures = {
    open: function(type) {
      if (type === 'chat') this.showChat();
      else if (type === 'theme') this.showThemes();
      else if (type === 'pvpx') this.showPvP();
      else if (type === 'arena' || type === 'arenas') this.showArenas();
      else if (type === 'guildx') this.showGuilds();
      else if (type === 'tourney') this.showTournaments();
      else if (type === 'leaderboard') this.showLeaderboard();
      else if (type === 'profile') this.showProfile();
      else if (type === 'shopx') this.showAdvancedShop();
      else if (type === 'missionsx') this.showMissions();
      else if (type === 'settingsx') this.showSettings();
    },
    
    
    showChat: function() {
      const html = `
        <div class="chat-box" id="chatBox">
          <div class="chat-msg sys"><div class="content">مرحباً بك في الدردشة العالمية المباشرة 🌍</div></div>
          
          <div class="chat-msg" oncontextmenu="ExtendedFeatures.chatCtx(this, event, 'Naruto Uzumaki', 'لقد هزمت الزعيم للتو!')">
            <img src="https://ui-avatars.com/api/?name=Naruto&background=ff5500&color=fff">
            <div class="content">
              <b>Naruto Uzumaki</b>
              لقد هزمت الزعيم للتو! من يتحداني في حلبة البطولة؟
              <span class="time">10:42 AM</span>
            </div>
            <div class="chat-reactions" style="display:none"></div>
          </div>
          
          <div class="chat-msg" oncontextmenu="ExtendedFeatures.chatCtx(this, event, 'Sasuke Uchiha', 'سأهزمك قريباً.')">
            <img src="https://ui-avatars.com/api/?name=Sasuke&background=0033cc&color=fff">
            <div class="content">
              <b>Sasuke Uchiha</b>
              سأهزمك قريباً. قوتي في تزايد مستمر.
              <span class="time">10:45 AM</span>
            </div>
            <div class="chat-reactions" style="display:none"></div>
          </div>
        </div>
        
        <div id="replyPreview">
          <b>الرد على: <span id="replyName"></span></b><br>
          <span id="replyText"></span>
          <div onclick="ExtendedFeatures.cancelReply()" style="position:absolute; left:10px; top:10px; cursor:pointer; color:var(--neon-pink);">✕</div>
        </div>
        
        <div style="display:flex; gap:10px; padding:10px 15px; background:rgba(10,10,20,0.95); border-top:1px solid rgba(255,255,255,0.05);">
          <input type="text" id="chatIn" class="searchbar" placeholder="المراسلة..." style="flex:1; border-radius:25px; padding:0 20px; height:45px;" onkeypress="if(event.key==='Enter') ExtendedFeatures.sendChat()">
          <button class="btn cyan" style="border-radius:50%; width:45px; height:45px; padding:0; display:grid; place-items:center;" onclick="ExtendedFeatures.sendChat()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.4em" height="1.4em" style="margin-left:-2px;"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </div>
      `;
      window.UI.openPage('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg> دردشة اللاعبين', html);
      setTimeout(() => {
        const box = document.getElementById('chatBox');
        if(box) box.scrollTop = box.scrollHeight;
        
        // Setup Swipe to Reply
        let touchstartX = 0;
        let touchendX = 0;
        box.addEventListener('touchstart', e => { touchstartX = e.changedTouches[0].screenX; }, {passive: true});
        box.addEventListener('touchend', e => {
          touchendX = e.changedTouches[0].screenX;
          if (touchendX < touchstartX - 50) { // Swiped left
             const msgEl = e.target.closest('.chat-msg');
             if(msgEl && !msgEl.classList.contains('sys')) {
                const b = msgEl.querySelector('b');
                const name = b ? b.innerText : 'أنت';
                // get text excluding time and name
                const textNodes = Array.from(msgEl.querySelector('.content').childNodes).filter(n => n.nodeType === 3);
                const txt = textNodes.map(n => n.textContent).join('').trim();
                ExtendedFeatures.prepareReply(name, txt);
             }
          }
        }, {passive: true});
      }, 100);
    },
    
    chatCtx: function(el, ev, name, txt) {
       ev.preventDefault();
       document.querySelectorAll('.chat-ctx').forEach(e=>e.remove());
       
       const isMe = el.classList.contains('me');
       const ctx = document.createElement('div');
       ctx.className = 'chat-ctx';
       
       // Emojis
       const emojis = ['❤️','🔥','👍','😂','😮'];
       const emojiHtml = emojis.map(em => `<div style="cursor:pointer; font-size:22px; transition:0.2s;" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='none'" onclick="ExtendedFeatures.addReaction(this.parentElement.parentElement.parentElement, '${em}')">${em}</div>`).join('');
       
       let actionsHtml = `
         <button class="chat-ctx-btn" onclick="ExtendedFeatures.prepareReply('${name}', '${txt.replace(/'/g,"\\'")}')"><span>رد</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg></button>
         <button class="chat-ctx-btn" onclick="ExtendedFeatures.copyMsg('${txt.replace(/'/g,"\\'")}')"><span>نسخ</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
       `;
       
       if (isMe) {
          actionsHtml += `
            <button class="chat-ctx-btn" onclick="ExtendedFeatures.editMsg(this.parentElement.parentElement, '${txt.replace(/'/g,"\\'")}')"><span>تعديل</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></button>
            <button class="chat-ctx-btn" style="color:var(--neon-pink);" onclick="this.parentElement.parentElement.remove(); document.querySelectorAll('.chat-ctx').forEach(e=>e.remove()); toast('تم الحذف', 'info')"><span>حذف</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
          `;
       }
       
       ctx.innerHTML = `<div class="chat-ctx-emojis">${emojiHtml}</div>${actionsHtml}`;
       el.appendChild(ctx);
       
       // Close when clicking outside
       setTimeout(() => {
         document.addEventListener('click', function closeCtx() {
           ctx.remove();
           document.removeEventListener('click', closeCtx);
         });
       }, 50);
    },
    
    addReaction: function(msgEl, emoji) {
       const reacEl = msgEl.querySelector('.chat-reactions');
       if(reacEl) {
         reacEl.style.display = 'flex';
         reacEl.innerHTML += `<span>${emoji}</span>`;
       }
    },
    
    prepareReply: function(name, text) {
       document.getElementById('replyName').innerText = name;
       document.getElementById('replyText').innerText = text.substring(0, 40) + (text.length > 40 ? '...' : '');
       document.getElementById('replyPreview').style.display = 'block';
       document.getElementById('chatIn').focus();
    },
    
    cancelReply: function() {
       document.getElementById('replyPreview').style.display = 'none';
       document.getElementById('replyName').innerText = '';
       document.getElementById('replyText').innerText = '';
    },
    
    copyMsg: function(txt) {
       navigator.clipboard.writeText(txt);
       toast('تم النسخ', 'good');
    },
    
    editMsg: function(msgEl, oldTxt) {
       const newTxt = prompt("تعديل الرسالة:", oldTxt);
       if(newTxt && newTxt.trim() !== "") {
          const contentEl = msgEl.querySelector('.content');
          const time = msgEl.querySelector('.time').outerHTML;
          contentEl.innerHTML = newTxt + ' ' + time + ' <small style="opacity:0.5; font-size:8px;">(معدلة)</small>';
       }
    },
    
    sendChat: function() {
      const inp = document.getElementById('chatIn');
      if(!inp || !inp.value.trim()) return;
      const box = document.getElementById('chatBox');
      const val = inp.value.replace(/</g, "&lt;");
      
      const isReply = document.getElementById('replyPreview').style.display === 'block';
      let replyHtml = '';
      if (isReply) {
         const rName = document.getElementById('replyName').innerText;
         const rText = document.getElementById('replyText').innerText;
         replyHtml = `<div class="reply-badge"><b>${rName}</b> ${rText}</div>`;
         this.cancelReply();
      }
      
      const d = new Date();
      const timeStr = d.getHours() + ':' + (d.getMinutes()<10?'0':'') + d.getMinutes();
      
      const el = document.createElement('div');
      el.className = 'chat-msg me';
      el.innerHTML = `<div class="content">${replyHtml}${val}<span class="time">${timeStr}</span></div><div class="chat-reactions" style="display:none"></div>`;
      el.oncontextmenu = (ev) => this.chatCtx(el, ev, 'أنت', val);
      
      box.appendChild(el);
      inp.value = '';
      box.scrollTop = box.scrollHeight;
    },
showThemes: function() {
      const themes = [
        {id:'', n:'الافتراضي (سايبربانك)', c:'var(--neon-purple)', desc:'ألوان السايبربانك الأصلية (بنفسجي وسماوي)'},
        {id:'red', n:'لهيب الجحيم', c:'#ff3333', desc:'مظهر قتالي يعكس القوة والغضب المطلق'},
        {id:'blue', n:'صقيع الجليد', c:'#33aaff', desc:'هدوء وبرودة الأعصاب في ساحة المعركة'},
        {id:'green', n:'طاقة الطبيعة', c:'#33ff33', desc:'تناغم مع العناصر الطبيعية والتجدد'},
        {id:'gold', n:'المحارب الملكي', c:'#ffd700', desc:'الفخامة والندرة المطلقة (حصري VIP)'}
      ];
      const html = `
        <p style="opacity:0.8; font-size:13px; text-align:center; margin-bottom:15px;">قم بتخصيص واجهة اللعبة لتناسب أسلوبك الخاص. يتم حفظ المظهر تلقائياً.</p>
        <div style="display:flex; flex-direction:column; gap:12px;">
          ${themes.map(t=>`
            <div class="kv" style="border-left: 5px solid ${t.c}; cursor:pointer; padding: 12px 15px;" onclick="ExtendedFeatures.setTheme('${t.id}')">
              <span><b style="color:${t.c}; font-size:16px;">●</b> <b style="font-size:15px;">${t.n}</b><br><small style="opacity:0.7; font-size:12px;">${t.desc}</small></span>
              <button class="btn sm ghost" style="border:1px solid ${t.c}; color:${t.c}">تطبيق</button>
            </div>
          `).join('')}
        </div>
      `;
      window.UI.openPage('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M4.93 19.07l1.41-1.41 M17.66 6.34l1.41-1.41 M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg> تخصيص المظهر والثيمات', html);
    },
    setTheme: function(id) {
      if(id) document.body.setAttribute('data-theme', id);
      else document.body.removeAttribute('data-theme');
      window.toast && toast('تم تطبيق المظهر بنجاح <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>', 'good');
      if (window.tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
      window.UI.closeModal();
    },

    showPvP: function() {
      const html = `
        <div style="text-align:center; padding: 15px;">
          <div style="font-size:70px; margin-bottom:10px; text-shadow: 0 0 30px var(--neon-cyan); animation: pulse 2s infinite;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/><path d="M8.5 6.5L21 19v3h-3L6.5 10.5"/><path d="M11 5L5 11"/><path d="M8 8L4 4"/><path d="M5 3L3 5"/></svg></div>
          <h2 style="margin:0 0 5px 0;">القتال التنافسي Online PvP</h2>
          <p style="opacity:0.8; font-size:13px; margin-bottom:20px; line-height:1.6;">تحدى لاعبين حقيقيين من حول العالم في معارك استراتيجية مباشرة. ارفع تصنيفك واكسب مكافآت موسمية نادرة.</p>
          
          <div class="grid2">
            <div class="mini-card" style="text-align:center; background:rgba(0,240,255,0.1); border-color:var(--neon-cyan);">
              <div style="color:var(--neon-cyan); font-size:12px; font-weight:bold;">الترتيب العالمي</div>
              <div style="font-size:26px; font-weight:900; margin-top:5px;">#1,240</div>
            </div>
            <div class="mini-card" style="text-align:center; background:rgba(255,215,0,0.1); border-color:gold;">
              <div style="color:gold; font-size:12px; font-weight:bold;">نقاط التصنيف (MMR)</div>
              <div style="font-size:26px; font-weight:900; margin-top:5px;">1,520 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg></div>
            </div>
          </div>
          
          <div style="margin-top:20px; background:rgba(0,0,0,0.5); padding:15px; border-radius:12px; border:1px solid rgba(255,255,255,0.1);">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-weight:bold;">
              <span>معدل الانتصارات (الموسم 4)</span>
              <span style="color:var(--neon-green);">68%</span>
            </div>
            <div class="bar-bg" style="height:12px; border-radius:6px; background:#222;"><div class="bar-fg" style="height:100%; width:68%; background:linear-gradient(90deg, #00ff00, #00ffaa); border-radius:6px; box-shadow:0 0 10px rgba(0,255,0,0.5);"></div></div>
          </div>
          
          <button class="btn block gold" style="margin-top:25px; height:55px; font-size:18px; font-weight:bold;" id="findMatchBtn" onclick="ExtendedFeatures.findMatch()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg> ابدأ البحث عن خصم
          </button>
        </div>
        <style>@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }</style>
      `;
      window.UI.openPage('القتال عبر الإنترنت', html);
    },
    findMatch: function() {
      const btn = document.getElementById('findMatchBtn');
      if(!btn) return;
      btn.innerHTML = '<span style="animation: pulse 1s infinite block;">جاري البحث في الخوادم العالمية... ⏳</span>';
      btn.classList.add('cyan');
      btn.classList.remove('gold');
      btn.disabled = true;
      setTimeout(() => {
        window.UI.closeModal();
        if(window.Battle && window.Battle.startPvP) {
           window.Battle.startPvP();
        } else {
           window.toast && toast('تم العثور على خصم! (بدء المعركة التنافسية)', 'good');
           if(window.navigate) navigate('battle');
        }
      }, 3000);
    },

    showArenas: function() {
      const arenas = [
        {id:'a1', n:'ساحة البركان المشتعل', stat:'مكافأة عنصر النار +15%', img:'https://i.imgur.com/2U5xV5x.jpg', color:'#ff3300'},
        {id:'a2', n:'الغابة المظلمة', stat:'فرصة المراوغة +10%', img:'https://i.imgur.com/8QjQ9uH.jpg', color:'#00ff00'},
        {id:'a3', n:'وادي النهاية الأسطوري', stat:'طاقة البداية +20%', img:'https://i.imgur.com/4q6Q8Ww.jpg', color:'#0088ff'},
        {id:'a4', n:'حلبة البطولة الكبرى', stat:'الذهب ونقاط XP مضاعفة', img:'https://i.imgur.com/Qk9q1Ew.jpg', color:'#ffd700'},
        {id:'a5', n:'المدينة السيبرانية', stat:'سرعة الهجوم +15%', img:'https://i.imgur.com/FmJ4xYy.jpg', color:'#ff00ff'}
      ];
      const html = `
        <p style="text-align:center; opacity:0.8; font-size:13px; margin-bottom:15px; line-height:1.5;">اختر ساحة المعركة المفضلة لديك. كل ساحة تمنح تأثيرات بيئية استراتيجية تؤثر على مجرى القتال وتمنح أفضليات لعناصر معينة.</p>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px;">
          ${arenas.map(a=>`
            <div class="arena-card" onclick="ExtendedFeatures.setArena('${a.img}')" style="border-bottom: 3px solid ${a.color}">
              <img src="${a.img}">
              <div class="stat" style="color:${a.color}; border-color:${a.color}">${a.stat}</div>
              <div class="name">${a.n}</div>
            </div>
          `).join('')}
        </div>
      `;
      window.UI.openPage('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2.5 9h19 M2.5 15h19 M12 2v20"/></svg> ساحات المعارك', html);
    },
    setArena: function(url) {
       document.documentElement.style.setProperty('--bg-img', `url(${url})`);
       const bg = document.getElementById('bg');
       if(bg) bg.style.backgroundImage = `url(${url})`;
       window.toast && toast('تم تعيين الساحة وتفعيل التأثير البيئي بنجاح!', 'good');
       window.UI.closeModal();
    },

    showGuilds: function() {
      const html = `
        <div class="guild-header" style="background:linear-gradient(135deg, rgba(255,0,85,0.3), rgba(0,240,255,0.3)); border-bottom: 2px solid var(--neon-cyan);">
          <div class="guild-logo" style="font-size:70px; filter:drop-shadow(0 0 15px var(--neon-cyan));"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>
          <h2 style="margin:5px 0; font-size:24px; text-shadow:0 2px 5px rgba(0,0,0,0.8);">نقابة التنين الأسود</h2>
          <div class="tag" style="background:rgba(0,0,0,0.6); padding:4px 12px; font-size:13px; font-weight:bold;">المستوى 8 • 45/50 عضو</div>
        </div>
        
        <div class="flex-tabs" style="margin-bottom:15px; border-radius:8px; overflow:hidden;" id="guildTabs">
          <div class="ext-tab-btn active" onclick="ExtendedFeatures.switchTab(this, 'guildTabs', 'guildInfo')">المعلومات <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div>
          <div class="ext-tab-btn" onclick="ExtendedFeatures.switchTab(this, 'guildTabs', 'guildMembers')">الأعضاء <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M20 21a8 8 0 0 0-16 0 M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg></div>
          <div class="ext-tab-btn" onclick="ExtendedFeatures.switchTab(this, 'guildTabs', 'guildWar')">الحروب <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/><path d="M8.5 6.5L21 19v3h-3L6.5 10.5"/><path d="M11 5L5 11"/><path d="M8 8L4 4"/><path d="M5 3L3 5"/></svg></div>
        </div>
        
        <div id="guildInfo" class="tab-content">
          <div class="kv" style="padding:15px;"><span>رئيس النقابة (Master)</span><b style="color:var(--neon-pink); font-size:16px;">MasterZ <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg></b></div>
          <div class="kv" style="padding:15px;"><span>نقاط النقابة (Guild Points)</span><b style="color:var(--neon-gold); font-size:16px;">1,452,000 ⭐</b></div>
          <div class="kv" style="padding:15px;"><span>الترتيب العالمي للنقابة</span><b style="color:var(--neon-cyan); font-size:16px;">#12 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg></b></div>
          
          <div style="background:rgba(0,0,0,0.4); padding:15px; border-radius:10px; margin-top:15px;">
            <b style="display:block; margin-bottom:10px; color:var(--neon-cyan);">مزايا النقابة النشطة:</b>
            <div style="font-size:13px; line-height:1.8;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> زيادة الذهب من المعارك بنسبة +15%<br>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> زيادة خبرة الأبطال (XP) بنسبة +10%<br>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> متجر نقابة خاص بمستويات مخفضة
            </div>
          </div>
          
          <div style="margin-top:20px; display:flex; gap:12px;">
            <button class="btn block cyan" style="font-weight:bold;" onclick="toast('جاري فتح دردشة النقابة المباشرة...', 'good'); UI.closeModal(); ExtendedFeatures.showChat();"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg> دردشة النقابة</button>
            <button class="btn block gold" style="font-weight:bold;" onclick="toast('التسجيل في حرب النقابات يبدأ غداً!', 'info')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/><path d="M8.5 6.5L21 19v3h-3L6.5 10.5"/><path d="M11 5L5 11"/><path d="M8 8L4 4"/><path d="M5 3L3 5"/></svg> حروب النقابات</button>
          </div>
        </div>
        <div id="guildMembers" class="tab-content hidden" style="text-align:center; padding:30px;">قائمة الأعضاء (45/50)<br><br><button class="btn ghost" onclick="toast('جاري جلب القائمة...', 'info')">تحديث القائمة</button></div>
        <div id="guildWar" class="tab-content hidden" style="text-align:center; padding:30px; color:var(--neon-pink);">لا توجد حروب نشطة حالياً.<br>الحرب القادمة ضد <b>[نقابة الذئاب]</b> تبدأ خلال 24 ساعة.</div>
      `;
      window.UI.openPage('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M22 20v-6h-2v6h-4v-4H8v4H4v-6H2v6h20zM4 14V4h2v10H4zM18 14V4h2v10h-2zM9 10h6v6H9v-6z"/></svg> نظام النقابات المتقدم', html);
    },
    switchTab: function(el, group, contentId) {
       document.querySelectorAll(`#${group} .ext-tab-btn`).forEach(t=>t.classList.remove('active'));
       el.classList.add('active');
       // Hide all content siblings
       const contents = document.querySelectorAll('.tab-content');
       contents.forEach(c => {
         if(c.parentElement === document.getElementById(contentId).parentElement) c.classList.add('hidden');
       });
       document.getElementById(contentId).classList.remove('hidden');
    },

    showTournaments: function() {
      const html = `
        <div class="hero-banner" style="background:linear-gradient(115deg,#1c0024,#4d0a3a); border: 1px solid var(--neon-pink); margin-bottom:15px; padding:25px 15px; border-radius:12px;">
          <div>
            <h2 style="color:#fff; text-shadow:0 0 15px var(--neon-pink); margin:0 0 5px 0;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg> بطولة الخريف الأسطورية</h2>
            <p style="color:#f0f0f0; margin:0; font-size:14px; opacity:0.9;">المنافسة العالمية الكبرى - الموسم 4</p>
          </div>
        </div>
        
        <div class="kv" style="padding:15px;"><span>حالة التسجيل</span><b style="color:var(--neon-green); font-size:15px; animation: pulse 1.5s infinite;">مفتوح <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2.5 9h19 M2.5 15h19 M12 2v20"/></svg></b></div>
        <div class="kv" style="padding:15px;"><span>المشاركون المسجلون</span><b style="font-size:15px;">1,204 / 2,000 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg></b></div>
        
        <div class="sec-title" style="margin-top:20px;">الجوائز الكبرى</div>
        <div class="kv" style="background:rgba(255,215,0,0.1); border-left:4px solid gold; padding:15px;">
           <span>المركز الأول (البطل)</span><b style="color:var(--neon-gold); font-size:14px;">100,000 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> + مقاتل أسطوري حصري</b>
        </div>
        <div class="kv" style="background:rgba(192,192,192,0.1); border-left:4px solid silver; padding:12px 15px; margin-top:8px;">
           <span>المركز 2 إلى 10</span><b style="color:silver; font-size:13px;">10,000 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> + صندوق إيبيك</b>
        </div>
        
        <div style="margin-top:20px; padding:15px; background:rgba(0,240,255,0.1); border:1px solid rgba(0,240,255,0.3); border-radius:8px; text-align:center; box-shadow: 0 0 15px rgba(0,240,255,0.1) inset;">
          <div style="font-size:13px; margin-bottom:5px;">تبدأ التصفيات الأولية خلال:</div>
          <div style="font-size:24px; font-weight:900; font-family:'Orbitron', sans-serif; color:var(--neon-cyan); letter-spacing:2px;">24:12:05</div>
        </div>
        
        <button class="btn block gold" style="margin-top:20px; height:50px; font-size:16px; font-weight:bold; box-shadow:0 0 20px rgba(255,215,0,0.4);" onclick="this.disabled=true; this.innerText='تم التسجيل بنجاح <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'; this.classList.replace('gold','green'); toast('تم تأكيد تسجيلك في البطولة! حظاً موفقاً.', 'good');">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2M8.5 6.5L21 19v3h-3L6.5 10.5M11 5L5 11M8 8L4 4M5 3L3 5"/></svg> تأكيد التسجيل (مجاني)
        </button>
      `;
      window.UI.openPage('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg> البطولات والمواسم العالمية', html);
    },

    showLeaderboard: function() {
      const html = `
        <div class="flex-tabs" style="margin-bottom:15px; border-radius:8px; overflow:hidden;" id="lbTabs">
          <div class="ext-tab-btn active" onclick="ExtendedFeatures.switchLbTab(this)">عالمي <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
          <div class="ext-tab-btn" onclick="ExtendedFeatures.switchLbTab(this)">محلي <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div>
          <div class="ext-tab-btn" onclick="ExtendedFeatures.switchLbTab(this)">الأصدقاء <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M20 21a8 8 0 0 0-16 0 M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg></div>
        </div>
        <div style="display:flex; flex-direction:column; gap:10px;" id="lbList">
          <div class="kv" style="background:rgba(255,215,0,0.15); border-left:5px solid gold; padding:15px; box-shadow:0 0 15px rgba(255,215,0,0.2);">
            <span style="display:flex; align-items:center; gap:12px;">
              <b style="color:gold; font-size:20px; font-style:italic;">#1</b> 
              <img src="https://ui-avatars.com/api/?name=ShadowKing&background=000&color=fff" style="width:36px; height:36px; border-radius:50%; border:2px solid gold;">
              <b style="font-size:16px;">ShadowKing</b>
            </span>
            <div style="text-align:right;">
              <b style="display:block; font-size:14px;">Lv.99</b>
              <small style="color:gold; font-weight:bold; font-size:12px;">9,450 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg> MMR</small>
            </div>
          </div>
          <div class="kv" style="background:rgba(192,192,192,0.15); border-left:5px solid silver; padding:15px;">
            <span style="display:flex; align-items:center; gap:12px;">
              <b style="color:silver; font-size:18px; font-style:italic;">#2</b> 
              <img src="https://ui-avatars.com/api/?name=Dracula&background=222&color=fff" style="width:34px; height:34px; border-radius:50%; border:2px solid silver;">
              <b style="font-size:15px;">Dracula</b>
            </span>
            <div style="text-align:right;">
              <b style="display:block; font-size:14px;">Lv.97</b>
              <small style="color:silver; font-weight:bold; font-size:12px;">9,120 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg> MMR</small>
            </div>
          </div>
          <div class="kv" style="background:rgba(205,127,50,0.15); border-left:5px solid #cd7f32; padding:15px;">
            <span style="display:flex; align-items:center; gap:12px;">
              <b style="color:#cd7f32; font-size:18px; font-style:italic;">#3</b> 
              <img src="https://ui-avatars.com/api/?name=MageLord&background=444&color=fff" style="width:34px; height:34px; border-radius:50%; border:2px solid #cd7f32;">
              <b style="font-size:15px;">MageLord</b>
            </span>
            <div style="text-align:right;">
              <b style="display:block; font-size:14px;">Lv.95</b>
              <small style="color:#cd7f32; font-weight:bold; font-size:12px;">8,890 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg> MMR</small>
            </div>
          </div>
          <div class="kv" style="padding:15px; background:rgba(0,0,0,0.4);">
            <span style="display:flex; align-items:center; gap:12px;">
              <b style="font-size:16px; opacity:0.6;">#4</b> 
              <div style="width:32px; height:32px; border-radius:50%; background:#333; display:grid; place-items:center; font-size:18px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M20 21a8 8 0 0 0-16 0 M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg></div>
              <b style="font-size:14px;">HeroX</b>
            </span>
            <div style="text-align:right;"><b style="display:block;">Lv.90</b><small style="color:var(--neon-gold)">8,500 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg> MMR</small></div>
          </div>
          
          <div style="text-align:center; padding:10px; opacity:0.5;">... الآلاف من اللاعبين ...</div>
          
          <div class="kv" style="border:1px solid var(--neon-cyan); padding:15px; background:rgba(0,240,255,0.08); box-shadow:0 0 15px rgba(0,240,255,0.15) inset;">
            <span style="display:flex; align-items:center; gap:12px;">
              <b style="font-size:18px; color:var(--neon-cyan);">#1240</b> 
              <div style="width:36px; height:36px; border-radius:50%; background:#111; display:grid; place-items:center; font-size:20px; border:1px solid var(--neon-cyan);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg></div>
              <b style="font-size:16px; color:var(--neon-cyan);">أنت (حسابك)</b>
            </span>
            <div style="text-align:right;"><b style="display:block; font-size:14px;">Lv.${window.G && G.player ? G.player.level : 1}</b><small style="color:var(--neon-gold); font-weight:bold;">1,520 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg> MMR</small></div>
          </div>
        </div>
      `;
      window.UI.openPage('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg> لوحة الصدارة والتصنيف العالمي', html);
    },
    switchLbTab: function(el) {
       document.querySelectorAll('#lbTabs .ext-tab-btn').forEach(t=>t.classList.remove('active'));
       el.classList.add('active');
       const list = document.getElementById('lbList');
       list.style.opacity = '0';
       list.style.transform = 'translateY(10px)';
       list.style.transition = '0.3s';
       setTimeout(()=> { 
         list.style.opacity = '1'; 
         list.style.transform = 'translateY(0)';
       }, 150);
    },

    showProfile: function() {
      if(window.UI && window.UI.profile) {
        window.navigate('profile');
        window.UI.closeModal();
        return;
      }
      
      const p = window.G && window.G.player ? window.G.player : {name:'Player', level:1, avatar:'<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><circle cx=\'12\' cy=\'8\' r=\'5\'/><path d=\'M20 21a8 8 0 0 0-16 0\'/></svg>'};
      const stats = window.G && window.G.stats ? window.G.stats : {wins:0, losses:0, damage:0, ults:0};
      
      const winRate = (stats.wins + stats.losses) > 0 ? ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(1) : '0.0';
      
      const html = `
        <div style="text-align:center; padding: 25px; background:var(--bg-1); border-radius:12px; border:1px solid rgba(0,240,255,0.2); margin-bottom:15px; position:relative; overflow:hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <div style="position:absolute; top:-50%; left:-50%; width:200%; height:200%; background:radial-gradient(circle, rgba(0,240,255,0.15) 0%, transparent 60%); z-index:0; animation: spin 20s linear infinite;"></div>
          <div style="font-size:80px; margin-bottom:10px; position:relative; z-index:1; filter:drop-shadow(0 0 20px rgba(255,255,255,0.4));">${p.avatar}</div>
          <h2 style="margin:0 0 5px 0; position:relative; z-index:1; font-size:28px;">${p.name}</h2>
          <button class="btn ghost sm" style="position:relative; z-index:1; margin-bottom:10px; font-size:11px; padding:4px 10px; border:1px solid var(--neon-cyan); color:var(--neon-cyan)" onclick="ExtendedFeatures.editProfile()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M14.5 9.5l-9 9a2.12 2.12 0 1 0 3 3l9-9 M16 16l4.5 4.5 M20.5 3.5l-4.5 4.5 M8 8l-4.5-4.5 M3.5 20.5l4.5-4.5 M11.5 5.5l3 3 M15.5 8.5l3-3 M18.5 12.5l-3-3"/></svg> تعديل الملف</button>
          
          <div style="display:flex; justify-content:center; gap:10px; position:relative; z-index:1;">
            <div style="background:linear-gradient(90deg, #b9f2ff, #7ee8fa); color:#004d61; padding:4px 12px; border-radius:20px; font-weight:bold; font-size:12px; box-shadow:0 0 10px rgba(126,232,250,0.5);">Diamond II</div>
            <div style="background:var(--neon-purple); color:#fff; padding:4px 12px; border-radius:20px; font-weight:bold; font-size:12px;">مستوى ${p.level}</div>
          </div>
        </div>
        <style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>
        
        <div class="sec-title" style="font-size:16px;">إحصائيات القتال والمزامنة السحابية</div>
        <div class="grid2" style="margin-bottom:20px;">
          <div class="mini-card" style="text-align:center; background:rgba(0,255,0,0.05); border:1px solid rgba(0,255,0,0.1); padding:15px;">
            <div style="color:var(--neon-green); font-size:12px; margin-bottom:5px; font-weight:bold;">الانتصارات</div>
            <b style="font-size:24px;">${stats.wins} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/><path d="M8.5 6.5L21 19v3h-3L6.5 10.5"/><path d="M11 5L5 11"/><path d="M8 8L4 4"/><path d="M5 3L3 5"/></svg></b>
          </div>
          <div class="mini-card" style="text-align:center; background:rgba(255,0,0,0.05); border:1px solid rgba(255,0,0,0.1); padding:15px;">
            <div style="color:var(--neon-pink); font-size:12px; margin-bottom:5px; font-weight:bold;">الهزائم</div>
            <b style="font-size:24px;">${stats.losses} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="m14.5 9.5-9 9a2.12 2.12 0 1 0 3 3l9-9"/><path d="m16 16 4.5 4.5"/><path d="m20.5 3.5-4.5 4.5"/><path d="m8 8-4.5-4.5"/><path d="m3.5 20.5 4.5-4.5"/><path d="m11.5 5.5 3 3"/><path d="m15.5 8.5 3-3"/><path d="m18.5 12.5-3-3"/></svg></b>
          </div>
          <div class="mini-card" style="text-align:center; background:rgba(0,240,255,0.05); border:1px solid rgba(0,240,255,0.1); padding:15px;">
            <div style="color:var(--neon-cyan); font-size:12px; margin-bottom:5px; font-weight:bold;">معدل الفوز</div>
            <b style="font-size:24px;">${winRate}% <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></b>
          </div>
          <div class="mini-card" style="text-align:center; background:rgba(255,215,0,0.05); border:1px solid rgba(255,215,0,0.1); padding:15px;">
            <div style="color:var(--neon-gold); font-size:12px; margin-bottom:5px; font-weight:bold;">أعلى ضرر (Hit)</div>
            <b style="font-size:24px;">${stats.damage > 999 ? (stats.damage/1000).toFixed(1)+'k' : stats.damage} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/><path d="M8.5 6.5L21 19v3h-3L6.5 10.5"/><path d="M11 5L5 11"/><path d="M8 8L4 4"/><path d="M5 3L3 5"/></svg></b>
          </div>
        </div>
        
        <div class="sec-title" style="font-size:16px; margin-top:20px;">سجل النشاطات (Activity History)</div>
        <div style="max-height: 150px; overflow-y: auto; background: rgba(0,0,0,0.4); padding: 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 20px;">
           ${(window.G && window.G.activityHistory && window.G.activityHistory.length > 0) ? 
             window.G.activityHistory.map(h => `<div style="font-size:12px; margin-bottom:6px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:6px;"><span style="color:var(--neon-cyan)">[${h.time}]</span> ${h.text}</div>`).join('') : 
             '<div style="text-align:center; opacity:0.5; font-size:12px; padding:20px;">لا يوجد سجل نشاطات بعد.</div>'}
        </div>
        
        <div class="kv" style="padding:15px;"><span>معرف الحساب الموحد (ID)</span><b style="font-family:monospace; color:var(--neon-cyan); font-size:14px; background:rgba(0,0,0,0.5); padding:4px 8px; border-radius:4px;">AL-${(window.tg && window.tg.initDataUnsafe && window.tg.initDataUnsafe.user) ? window.tg.initDataUnsafe.user.id : Math.floor(Math.random()*90000)+10000}</b></div>
        <div class="kv" style="padding:15px; margin-top:8px;"><span>حالة المزامنة (Cloud Sync)</span><b style="color:var(--neon-green); font-size:14px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> متصل ومحفوظ</b></div>
        
        <div style="display:flex; gap:12px; margin-top:25px;">
          <button class="btn block cyan" style="font-weight:bold;" onclick="toast('تم نسخ المعرف بنجاح للحافظة', 'good')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> نسخ الـ ID للمشاركة</button>
          <button class="btn block" style="background:var(--bg-2); font-weight:bold;" onclick="UI.closeModal(); ExtendedFeatures.showSettings()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg> إعدادات الحساب</button>
        </div>
      `;
      window.UI.openPage('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg> الملف الشخصي الشامل', html);
    },
    editProfile: function() {
       const p = window.G.player;
       const html = `
         <div style="padding:15px; text-align:center;">
            <p>تعديل اسم اللاعب والأفاتار.</p>
            <input type="text" id="editName" class="searchbar" value="${p.name}" style="width:100%; margin-bottom:15px; font-size:16px; padding:10px; border-radius:8px;">
            <div style="display:flex; justify-content:center; gap:15px; font-size:40px; margin-bottom:20px;" id="avatarSelect">
               <span style="cursor:pointer; opacity: ${p.avatar==='<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><circle cx=\'12\' cy=\'8\' r=\'5\'/><path d=\'M20 21a8 8 0 0 0-16 0\'/></svg>'?'1':'0.4'}; transition:0.3s;" onclick="ExtendedFeatures.selectAvatar('<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><circle cx=\'12\' cy=\'8\' r=\'5\'/><path d=\'M20 21a8 8 0 0 0-16 0\'/></svg>', this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg></span>
               <span style="cursor:pointer; opacity: ${p.avatar==='<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'1.2em\' height=\'1.2em\' style=\'vertical-align:text-bottom\'><path d=\'M13 2L3 14h9l-1 8 10-12h-9l1-8z\'/></svg>'?'1':'0.4'}; transition:0.3s;" onclick="ExtendedFeatures.selectAvatar('<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'1.2em\' height=\'1.2em\' style=\'vertical-align:text-bottom\'><path d=\'M13 2L3 14h9l-1 8 10-12h-9l1-8z\'/></svg>', this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></span>
               <span style="cursor:pointer; opacity: ${p.avatar==='<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><path d=\'m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14\'/></svg>'?'1':'0.4'}; transition:0.3s;" onclick="ExtendedFeatures.selectAvatar('<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><path d=\'m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14\'/></svg>', this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg></span>
               <span style="cursor:pointer; opacity: ${p.avatar==='<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><path d=\'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z\'/></svg>'?'1':'0.4'}; transition:0.3s;" onclick="ExtendedFeatures.selectAvatar('<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><path d=\'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z\'/></svg>', this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg></span>
               <span style="cursor:pointer; opacity: ${p.avatar==='<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><path d=\'M13 2L3 14h9l-1 8 10-12h-9l1-8z\'/></svg>'?'1':'0.4'}; transition:0.3s;" onclick="ExtendedFeatures.selectAvatar('<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><path d=\'M13 2L3 14h9l-1 8 10-12h-9l1-8z\'/></svg>', this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></span>
            </div>
            <button class="btn block cyan" onclick="ExtendedFeatures.saveProfile()">حفظ التعديلات</button>
         </div>
       `;
       window.ExtendedFeatures.tempAvatar = p.avatar;
       window.UI.openModal('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M14.5 9.5l-9 9a2.12 2.12 0 1 0 3 3l9-9 M16 16l4.5 4.5 M20.5 3.5l-4.5 4.5 M8 8l-4.5-4.5 M3.5 20.5l4.5-4.5 M11.5 5.5l3 3 M15.5 8.5l3-3 M18.5 12.5l-3-3"/></svg> تعديل الملف', html);
    },
    selectAvatar: function(ico, el) {
       window.ExtendedFeatures.tempAvatar = ico;
       Array.from(document.getElementById('avatarSelect').children).forEach(c => c.style.opacity = '0.4');
       el.style.opacity = '1';
    },
    saveProfile: function() {
       const n = document.getElementById('editName').value.trim();
       if(n) window.G.player.name = n;
       if(window.ExtendedFeatures.tempAvatar) window.G.player.avatar = window.ExtendedFeatures.tempAvatar;
       if(window.logActivity) window.logActivity('تم تحديث الملف الشخصي');
       if(window.save) window.save();
       if(window.UI.hud) window.UI.hud();
       window.toast && window.toast('تم حفظ التعديلات بنجاح', 'good');
       this.showProfile();
    },
    
    showMissions: function() {
       const html = `
         <div class="flex-tabs" style="margin-bottom:15px; border-radius:8px; overflow:hidden;" id="missTabs">
            <div class="ext-tab-btn active" onclick="ExtendedFeatures.switchMissTab('daily', this)">يومية ⏳</div>
            <div class="ext-tab-btn" onclick="ExtendedFeatures.switchMissTab('weekly', this)">أسبوعية <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></div>
            <div class="ext-tab-btn" onclick="ExtendedFeatures.switchMissTab('achieve', this)">إنجازات <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg></div>
         </div>
         
         <div id="missContent" style="display:flex; flex-direction:column; gap:12px;">
            <!-- Daily content -->
            <div style="background:rgba(15,15,30,0.7); border:1px solid rgba(255,255,255,0.1); padding:15px; border-radius:10px; position:relative; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.3);">
               <div style="position:absolute; bottom:0; left:0; height:4px; background:var(--neon-green); width:100%; box-shadow:0 0 10px var(--neon-green);"></div>
               <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                 <b style="font-size:15px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/><path d="M8.5 6.5L21 19v3h-3L6.5 10.5"/><path d="M11 5L5 11"/><path d="M8 8L4 4"/><path d="M5 3L3 5"/></svg> العب 5 مباريات PvP</b>
                 <span style="background:rgba(0,255,0,0.2); color:var(--neon-green); font-size:12px; padding:2px 8px; border-radius:4px; font-weight:bold;">5/5 (مكتمل)</span>
               </div>
               <div style="display:flex; justify-content:space-between; align-items:center;">
                 <span style="font-size:13px; color:gold; font-weight:bold;">المكافأة: 500 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><circle cx="12" cy="12" r="8"/><path d="M12 8v8"/></svg> + 10 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg></span>
                 <button class="btn gold" style="font-weight:bold; box-shadow:0 0 15px rgba(255,215,0,0.4);" onclick="this.disabled=true; this.innerHTML='تم الاستلام <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'; this.classList.replace('gold','ghost'); this.style.boxShadow='none'; toast('تم استلام المكافأة بنجاح!', 'good')">استلام المكافأة</button>
               </div>
            </div>
            
            <div style="background:rgba(15,15,30,0.7); border:1px solid rgba(255,255,255,0.1); padding:15px; border-radius:10px; position:relative; overflow:hidden;">
               <div style="position:absolute; bottom:0; left:0; height:4px; background:var(--neon-cyan); width:40%;"></div>
               <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                 <b style="font-size:15px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/><path d="M8.5 6.5L21 19v3h-3L6.5 10.5"/><path d="M11 5L5 11"/><path d="M8 8L4 4"/><path d="M5 3L3 5"/></svg> اهزم 10 أعداء</b>
                 <span style="background:rgba(0,240,255,0.1); color:var(--neon-cyan); font-size:12px; padding:2px 8px; border-radius:4px; font-weight:bold;">4/10</span>
               </div>
               <div style="display:flex; justify-content:space-between; align-items:center;">
                 <span style="font-size:13px; color:gold; font-weight:bold;">المكافأة: 1000 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><circle cx="12" cy="12" r="8"/><path d="M12 8v8"/></svg></span>
                 <button class="btn ghost" disabled style="opacity:0.6;">قيد التنفيذ</button>
               </div>
            </div>
            
            <div style="background:rgba(15,15,30,0.7); border:1px solid rgba(255,255,255,0.1); padding:15px; border-radius:10px; position:relative; overflow:hidden;">
               <div style="position:absolute; bottom:0; left:0; height:4px; background:var(--neon-cyan); width:0%;"></div>
               <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                 <b style="font-size:15px;">⬆ قم بترقية شخصية إلى مستوى 10</b>
                 <span style="background:rgba(255,255,255,0.1); color:#ccc; font-size:12px; padding:2px 8px; border-radius:4px; font-weight:bold;">0/1</span>
               </div>
               <div style="display:flex; justify-content:space-between; align-items:center;">
                 <span style="font-size:13px; color:gold; font-weight:bold;">المكافأة: 20 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> + صندوق عادي</span>
                 <button class="btn ghost" disabled style="opacity:0.6;">لم يبدأ</button>
               </div>
            </div>
         </div>
       `;
       window.UI.openPage('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> نظام المهام والإنجازات', html);
    },
    switchMissTab: function(type, el) {
       document.querySelectorAll('#missTabs .ext-tab-btn').forEach(t=>t.classList.remove('active'));
       el.classList.add('active');
       const content = document.getElementById('missContent');
       if(!content) return;
       content.style.opacity = '0';
       setTimeout(()=>{
          if(type === 'daily') this.showMissions(); // Reset to default
          else if(type === 'weekly') {
             content.innerHTML = `<div style="text-align:center; padding:30px; opacity:0.7;">المهام الأسبوعية تتطلب مستوى حساب 10.</div>`;
          } else {
             content.innerHTML = `<div style="text-align:center; padding:30px; opacity:0.7;">سيتم فتح نظام الإنجازات الشامل قريباً.</div>`;
          }
          content.style.opacity = '1';
       }, 200);
    },

    showSettings: function() {
       const html = `
         <div style="display:flex; flex-direction:column; gap:12px;">
            <div class="sec-title">إعدادات الصوت</div>
            <div class="kv" style="padding:15px;">
              <span><b>الموسيقى (BGM)</b></span>
              <div style="display:flex; gap:10px;">
                <button class="btn sm cyan" onclick="toast('تم التفعيل', 'good')">تشغيل</button>
                <button class="btn sm ghost" onclick="toast('تم الإيقاف', 'info')">إيقاف</button>
              </div>
            </div>
            <div class="kv" style="padding:15px;">
              <span><b>المؤثرات (SFX)</b></span>
              <div style="display:flex; gap:10px;">
                <button class="btn sm cyan" onclick="toast('تم التفعيل', 'good')">تشغيل</button>
                <button class="btn sm ghost" onclick="toast('تم الإيقاف', 'info')">إيقاف</button>
              </div>
            </div>
            
            <div class="sec-title" style="margin-top:10px;">إعدادات اللعبة</div>
            <div class="kv" style="padding:15px; cursor:pointer;" onclick="ExtendedFeatures.showThemes()">
              <span><b>تخصيص المظهر (الثيمات) <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M4.93 19.07l1.41-1.41 M17.66 6.34l1.41-1.41 M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg></b><br><small style="opacity:0.7;">تغيير ألوان اللعبة</small></span>
              <span style="font-size:20px;">></span>
            </div>
            <div class="kv" style="padding:15px;">
              <span><b>الرسومات (Graphics)</b></span>
              <select class="searchbar" style="width:100px; padding:5px; border-radius:4px;">
                 <option>عالية (HD)</option>
                 <option>متوسطة</option>
                 <option>منخفضة</option>
              </select>
            </div>
            <div class="kv" style="padding:15px;">
              <span><b>الاهتزاز (Haptic)</b></span>
              <button class="btn sm cyan" onclick="this.classList.toggle('cyan'); this.classList.toggle('ghost'); toast('تم تغيير الإعداد', 'good')">مفعل</button>
            </div>
            
            <div class="sec-title" style="margin-top:10px;">الحساب والأمان</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
               <button class="btn block" style="background:rgba(255,255,255,0.1);" onclick="toast('بياناتك محفوظة سحابياً بأمان.', 'good')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg> مزامنة البيانات</button>
               <button class="btn block" style="background:rgba(255,255,255,0.1);" onclick="toast('تم النسخ', 'good')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> ربط الحساب</button>
               <button class="btn block red" style="grid-column:span 2; margin-top:10px;" onclick="if(confirm('هل أنت متأكد من حذف الحساب نهائياً؟')) toast('تم طلب الحذف', 'info')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> حذف الحساب</button>
            </div>
         </div>
       `;
       window.UI.openPage('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg> إعدادات اللعبة الشاملة', html);
    }
  };

})();

// Appending more navigation intercepts for missing buttons in game.html
if(window.UI && window.UI.go) {
  const oldGo = window.UI.go;
  window.UI.go = function(s) {
    const map = {
      'guild': 'guildx', 'guilds': 'guildx', 'guild2': 'guildx',
      'tourney': 'tourney', 'tournament': 'tourney', 'cups': 'tourney', 'tour2': 'tourney',

      'premium': 'shopx', 'vip': 'shopx', 'store': 'shopx', 'wallet': 'shopx',
      'pvp': 'pvpx', 'rooms': 'pvpx',
      'settings': 'settingsx', 'backend': 'settingsx',
      'leaderboard': 'leaderboard', 'ranking': 'leaderboard', 'social': 'leaderboard',
      'chat': 'chat', 'notifs': 'chat'
    };
    if (map[s]) { window.ExtendedFeatures.open(map[s]); return; }
    oldGo.call(window.UI, s);
  };
}

if(window.navigate) {
  const oldNav = window.navigate;
  window.navigate = function(s) {
    const map = {
      'guild': 'guildx', 'guilds': 'guildx', 'guild2': 'guildx',
      'tourney': 'tourney', 'tournament': 'tourney', 'cups': 'tourney', 'tour2': 'tourney',

      'premium': 'shopx', 'vip': 'shopx', 'store': 'shopx', 'wallet': 'shopx',
      'pvp': 'pvpx', 'rooms': 'pvpx',
      'settings': 'settingsx', 'backend': 'settingsx',
      'leaderboard': 'leaderboard', 'ranking': 'leaderboard', 'social': 'leaderboard',
      'chat': 'chat', 'notifs': 'chat'
    };
    if (map[s]) { window.ExtendedFeatures.open(map[s]); return; }
    oldNav(s);
  }
}

const finalPolish = document.createElement('style');
finalPolish.textContent = `
  /* Master Background Enhancement */
  body::before {
    content: '';
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    background: radial-gradient(circle at 50% 0%, rgba(0,240,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 50% 100%, rgba(255,0,85,0.1) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
  }
  
  /* Scrollbar Polish */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
  ::-webkit-scrollbar-thumb { background: rgba(0,240,255,0.3); border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(0,240,255,0.5); }
  
  /* Beautiful Headers */
  .scr-head {
    background: linear-gradient(180deg, rgba(5,3,15,0.9) 0%, rgba(5,3,15,0.6) 80%, transparent 100%) !important;
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255,255,255,0.05);
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  }
  
  /* Better Cards */
  .char-card {
    transition: transform 0.3s, box-shadow 0.3s;
  }
  .char-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,240,255,0.2);
  }
  .char-card .img {
    filter: drop-shadow(0 0 10px rgba(255,255,255,0.2));
  }
  
  /* Toast Polish */
  #toast {
    background: rgba(15,15,30,0.9) !important;
    backdrop-filter: blur(15px);
    border-radius: 20px !important;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
    font-family: 'Cairo', sans-serif !important;
    font-weight: bold;
  }
  #toast.good { border: 1px solid var(--neon-green) !important; color: var(--neon-green) !important; text-shadow: 0 0 10px rgba(0,255,0,0.3); }
  #toast.bad, #toast.err { border: 1px solid var(--neon-pink) !important; color: var(--neon-pink) !important; text-shadow: 0 0 10px rgba(255,0,85,0.3); }
  #toast.info { border: 1px solid var(--neon-cyan) !important; color: var(--neon-cyan) !important; text-shadow: 0 0 10px rgba(0,240,255,0.3); }
`;
document.head.appendChild(finalPolish);

if(window.UI && window.UI.go) {
  const finalGo = window.UI.go;
  window.UI.go = function(s) {
    if (s === 'story') {
       window.ExtendedFeatures.open('arenas'); // or arena
       return;
    }
    if (s === 'boss') {
       window.toast && toast('الزعيم العالمي قادم قريباً!', 'info');
       return;
    }
    finalGo.call(window.UI, s);
  };
}

// Final fallback for any other buttons
document.addEventListener('click', function(e) {
  if (e.target && e.target.classList && e.target.classList.contains('btn') && e.target.innerText.includes('قريباً')) {
    window.toast && toast('سيتم إطلاق هذا النظام قريباً!', 'info');
  }
});

// Async Load & Telegram Cloud Storage Override
const origLoad = window.load;
const Cloud = (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.isVersionAtLeast && window.Telegram.WebApp.isVersionAtLeast("6.9")) ? window.Telegram.WebApp.CloudStorage : null;

let saveTimeout;
window.save = function() {
  try {
    localStorage.setItem('alub_save', JSON.stringify(window.G));
  } catch(e) {}
  
  if (Cloud) {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
       Cloud.setItem('alub_save', JSON.stringify(window.G), (err, success) => {
         if (err) console.error('Cloud save failed', err);
       });
    }, 1500);
  }
};

window.asyncLoad = function(callback) {
  if (Cloud) {
     Cloud.getItem('alub_save', (err, val) => {
       if (!err && val) {
          try {
            window.G = Object.assign(window.defaultSave(), JSON.parse(val));
            window.G.player = Object.assign(window.defaultSave().player, window.G.player);
            window.G.cur = Object.assign(window.defaultSave().cur, window.G.cur);
            window.G.stats = Object.assign(window.defaultSave().stats, window.G.stats);
            window.G.settings = Object.assign(window.defaultSave().settings, window.G.settings);
            window.G.missions = Object.assign(window.defaultSave().missions, window.G.missions);
            if(window.G.player.level === undefined) window.G.player.level = 1;
            window.checkMissionReset();
            callback();
            return;
          } catch(e) {}
       }
       loadLocal(callback);
     });
  } else {
     loadLocal(callback);
  }
};

function loadLocal(callback) {
   try {
     const raw = localStorage.getItem('alub_save');
     if(raw) {
        window.G = Object.assign(window.defaultSave(), JSON.parse(raw));
        window.G.player = Object.assign(window.defaultSave().player, window.G.player);
        window.G.cur = Object.assign(window.defaultSave().cur, window.G.cur);
        window.G.stats = Object.assign(window.defaultSave().stats, window.G.stats);
        window.G.settings = Object.assign(window.defaultSave().settings, window.G.settings);
        window.G.missions = Object.assign(window.defaultSave().missions, window.G.missions);
     } else {
        window.G = window.defaultSave();
        // NO STARTERS! Zero accounts
     }
   } catch(e){
     window.G = window.defaultSave();
   }
   window.checkMissionReset();
   callback();
}

if (window.UI) {
  const origInit = window.UI.init;
  window.UI.init = function() {
     window.asyncLoad(() => {
        window.Missions.ensureBase();
        window.UI.buildScreens();
        window.UI.hud();
        window.UI.go('splash');
        if(window.starfield) window.starfield();
     });
  };
}


// Economy Balancing
if (window.defaultSave) {
  const origDefault = window.defaultSave;
  window.defaultSave = function() {
    const d = origDefault();
    d.cur = {gold: 500, gems: 50, prem: 0, dust: 10, stone: 0};
    d.team = [];
    d.chars = {};
    return d;
  };
}

// Adjust Mission Rewards
if (window.MISSION_POOL) {
  window.MISSION_POOL.forEach(m => {
    if(m.r) {
      if(m.r.gold) m.r.gold = Math.max(50, Math.floor(m.r.gold * 0.2)); // Reduce by 80%
      if(m.r.gems) m.r.gems = Math.max(2, Math.floor(m.r.gems * 0.3));  // Reduce by 70%
      if(m.r.prem) m.r.prem = Math.max(1, Math.floor(m.r.prem * 0.5));
    }
  });
}

// Adjust Box costs
if (window.CHESTS) {
  window.CHESTS.forEach(b => {
    if(b.id === 'common') { b.cost = {gold: 800}; }
    if(b.id === 'rare') { b.cost = {gold: 3000}; }
  });
}


// Enhanced UI - Vertical Bars for Home and Updated HUD Icons
if (window.UI) {
  const origHud = window.UI.hud;
  window.UI.hud = function() {
    if(origHud) origHud.call(window.UI);
    // Update bottom nav
    const nav = document.getElementById('nav');
    if(nav && !nav.dataset.enhanced) {
      nav.dataset.enhanced = '1';
      nav.innerHTML = `
        <div class="nav-i on" data-s="home" onclick="UI.go('home')"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></span><span class="lb">الرئيسية</span></div>
        <div class="nav-i" data-s="characters" onclick="UI.go('characters')"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></span><span class="lb">الأبطال</span></div>
        <div class="nav-i" data-s="battle-select" onclick="UI.go('battle-select')"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg></span><span class="lb">قتال</span></div>
        <div class="nav-i" data-s="shop" onclick="UI.go('shop')"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/></svg></span><span class="lb">المتجر</span></div>
        <div class="nav-i" data-s="missions" onclick="UI.go('missions')"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></span><span class="lb">المهام</span></div>
      `;
    }
  };


}
// Shop & Ads Improvements
if (window.ExtendedFeatures) {
  window.ExtendedFeatures.showAdvancedShop = function() {
       const html = `
         <div style="display:flex; gap:8px; margin-bottom:20px; overflow-x:auto; padding-bottom:5px; scrollbar-width:none;" id="shopExtTabs">
            <div class="ext-tab-btn active" style="min-width:100px; padding:10px; font-size:12px; border-radius:12px; white-space:nowrap;" onclick="ExtendedFeatures.switchShopTab('vip', this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg> Premium</div>
            <div class="ext-tab-btn" style="min-width:100px; padding:10px; font-size:12px; border-radius:12px; white-space:nowrap;" onclick="ExtendedFeatures.switchShopTab('currency', this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> العملات</div>
            <div class="ext-tab-btn" style="min-width:100px; padding:10px; font-size:12px; border-radius:12px; white-space:nowrap;" onclick="ExtendedFeatures.switchShopTab('ads', this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><polygon points="5 3 19 12 5 21 5 3"/></svg> إعلانات مجانية</div>
            <div class="ext-tab-btn" style="min-width:100px; padding:10px; font-size:12px; border-radius:12px; white-space:nowrap;" onclick="ExtendedFeatures.switchShopTab('chests', this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8 M4 6h16v6H4z M12 22V6 M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg> صناديق</div>
         </div>
         
         <div id="shopExtContent">
            <!-- Default Content: VIP -->
            <div class="hero-banner" style="background:linear-gradient(135deg, #FFD700 0%, #FF8C00 100%); margin-bottom:15px; color:#000; padding:25px 20px; border-radius:16px; box-shadow:0 10px 30px rgba(255,215,0,0.4); position:relative; overflow:hidden;">
              <div style="position:absolute; top:-20px; right:-20px; font-size:100px; opacity:0.1;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg></div>
              <div style="position:relative; z-index:2;">
                <h3 style="color:#000; text-shadow:none; margin:0 0 5px 0; font-size:24px; font-weight:900; letter-spacing:1px;">اشتراك Premium</h3>
                <p style="color:rgba(0,0,0,0.8); margin:0; font-weight:bold; font-size:14px; line-height:1.4;">افتح جميع الميزات، طاقة غير محدودة، ومكافآت يومية مضاعفة.</p>
              </div>
            </div>
            
            <div class="kv" style="border:2px solid gold; background:rgba(255,215,0,0.1); padding:20px; margin-bottom:12px; border-radius:12px; box-shadow:0 4px 15px rgba(255,215,0,0.15); display:flex; align-items:center; justify-content:space-between;">
               <div><b style="font-size:17px; color:gold;">اشتراك شهري (الذهبي)</b><br><small style="color:#ccc; font-size:12px;">توفير 30% · تجديد تلقائي</small></div>
               <button class="btn gold sm" style="font-size:14px; font-weight:900; box-shadow:0 0 10px rgba(255,215,0,0.5);" onclick="ExtendedFeatures.payWithStars(150, 'VIP')">150 ⭐</button>
            </div>
            <div class="kv" style="border:1px solid rgba(255,255,255,0.1); padding:20px; border-radius:12px; display:flex; align-items:center; justify-content:space-between; background:rgba(255,255,255,0.03);">
               <div><b style="font-size:16px;">الاشتراك الأسبوعي</b><br><small style="color:#aaa; font-size:12px;">تجربة لمدة 7 أيام</small></div>
               <button class="btn ghost sm" style="font-size:14px; border-color:gold; color:gold;" onclick="ExtendedFeatures.payWithStars(50, 'VIP')">50 ⭐</button>
            </div>
         </div>
       `;
       window.UI.openPage('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8 M4 6h16v6H4z M12 22V6 M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg> المتجر الشامل (Stars & Ads)', html);
  };
  
  window.ExtendedFeatures.switchShopTab = function(tabId, btnElement) {
       document.querySelectorAll('.ext-tab-btn').forEach(btn => btn.classList.remove('active'));
       btnElement.classList.add('active');
       const content = document.getElementById('shopExtContent');
       
       if (tabId === 'vip') {
          this.showAdvancedShop(); // Recalls default
       } else if (tabId === 'chests') {
          content.innerHTML = `
            <div class="shop-ext-grid" style="grid-template-columns: 1fr 1fr; gap:15px;">
               <div class="shop-ext-item" style="border-color:silver; background:rgba(192,192,192,0.05); border-radius:16px;">
                 <div style="font-size:55px; margin-bottom:15px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg></div>
                 <b style="font-size:16px;">الصندوق العادي</b>
                 <p style="font-size:12px; opacity:0.7; margin:5px 0;">فرصة ضئيلة لأبطال نادرين</p>
                 <div class="price" style="color:var(--neon-gold); font-size:18px;">800 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><circle cx="12" cy="12" r="8"/><path d="M12 8v8"/></svg></div>
                 <button class="btn block" style="background:linear-gradient(135deg, silver, gray); color:#000; font-weight:900; margin-top:10px; border-radius:12px;" onclick="window.buyBox && window.buyBox('common')">شراء وفتح</button>
               </div>
               <div class="shop-ext-item" style="border-color:var(--neon-cyan); background:rgba(0,240,255,0.05); border-radius:16px; box-shadow:0 0 15px rgba(0,240,255,0.1);">
                 <div style="font-size:55px; margin-bottom:15px; filter:drop-shadow(0 0 15px var(--neon-cyan))"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8 M4 6h16v6H4z M12 22V6 M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg></div>
                 <b style="font-size:16px; color:var(--neon-cyan);">الصندوق النادر</b>
                 <p style="font-size:12px; opacity:0.7; margin:5px 0;">فرصة عالية لأسلحة قوية</p>
                 <div class="price" style="color:var(--neon-gold); font-size:18px;">3000 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><circle cx="12" cy="12" r="8"/><path d="M12 8v8"/></svg></div>
                 <button class="btn block cyan" style="font-weight:900; margin-top:10px; border-radius:12px;" onclick="window.buyBox && window.buyBox('rare')">شراء وفتح</button>
               </div>
            </div>
          `;
       } else if (tabId === 'currency') {
          content.innerHTML = `
            <div class="shop-ext-grid" style="grid-template-columns: 1fr 1fr; gap:12px;">
               <div class="shop-ext-item" style="border-radius:16px;">
                  <div style="font-size:40px; margin-bottom:10px; color:var(--neon-pink);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg></div>
                  <b style="font-size:15px;">100 جوهرة</b>
                  <div class="price" style="color:gold;">10 ⭐</div>
                  <button class="btn block cyan sm" style="margin-top:10px; border-radius:12px; font-weight:bold;" onclick="ExtendedFeatures.payWithStars(10, 'Gems')">شراء</button>
               </div>
               <div class="shop-ext-item" style="border-radius:16px;">
                  <div style="font-size:40px; margin-bottom:10px; color:var(--neon-pink);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg></div>
                  <b style="font-size:15px;">500 جوهرة</b>
                  <div class="price" style="color:gold;">45 ⭐</div>
                  <button class="btn block cyan sm" style="margin-top:10px; border-radius:12px; font-weight:bold;" onclick="ExtendedFeatures.payWithStars(45, 'Gems500')">شراء</button>
               </div>
               <div class="shop-ext-item" style="border-radius:16px;">
                  <div style="font-size:40px; margin-bottom:10px; color:var(--neon-gold);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><circle cx="12" cy="12" r="8"/><path d="M12 8v8"/></svg></div>
                  <b style="font-size:15px;">10,000 ذهب</b>
                  <div class="price" style="color:var(--neon-pink);">50 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg></div>
                  <button class="btn block gold sm" style="margin-top:10px; border-radius:12px; font-weight:bold;" onclick="window.buyGold && window.buyGold('g1')">شراء</button>
               </div>
               <div class="shop-ext-item" style="border-radius:16px;">
                  <div style="font-size:40px; margin-bottom:10px; color:var(--neon-gold);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><circle cx="12" cy="12" r="8"/><path d="M12 8v8"/></svg><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><circle cx="12" cy="12" r="8"/><path d="M12 8v8"/></svg></div>
                  <b style="font-size:15px;">50,000 ذهب</b>
                  <div class="price" style="color:var(--neon-pink);">200 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg></div>
                  <button class="btn block gold sm" style="margin-top:10px; border-radius:12px; font-weight:bold;" onclick="window.buyGold && window.buyGold('g2')">شراء</button>
               </div>
            </div>
          `;
       } else if (tabId === 'ads') {
          content.innerHTML = `
            <div class="hero-banner" style="background:linear-gradient(135deg, rgba(0,240,255,0.15), rgba(255,0,85,0.15)); border:1px solid rgba(0,240,255,0.4); border-radius:16px; padding:25px; text-align:center; margin-bottom:20px; box-shadow:0 10px 25px rgba(0,0,0,0.4);">
              <h2 style="font-size:45px; margin:0 0 10px 0; color:var(--neon-cyan); filter:drop-shadow(0 0 10px var(--neon-cyan));"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><polygon points="5 3 19 12 5 21 5 3"/></svg></h2>
              <h3 style="font-size:22px; margin-bottom:5px;">شاهد إعلان واحصل على مكافآت!</h3>
              <p style="opacity:0.8; font-size:14px; margin-bottom:20px;">دعمك لنا يضمن استمرار وتطوير اللعبة.</p>
              <button class="btn lg cyan block" id="adWatchBtn" style="border-radius:16px; font-weight:900; font-size:18px; box-shadow:0 0 20px rgba(0,240,255,0.5);" onclick="ExtendedFeatures.watchAd(this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> مشاهدة الآن</button>
            </div>
            
            <div class="sec-title" style="font-size:16px;">احتمالات الجوائز:</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; opacity:0.9;">
               <div style="background:rgba(255,255,255,0.05); padding:15px 10px; border-radius:12px; text-align:center; font-size:13px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><circle cx="12" cy="12" r="8"/><path d="M12 8v8"/></svg> 100-500 ذهب (70%)</div>
               <div style="background:rgba(255,255,255,0.05); padding:15px 10px; border-radius:12px; text-align:center; font-size:13px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> 5-15 جوهرة (25%)</div>
               <div style="background:rgba(255,255,255,0.05); padding:15px 10px; border-radius:12px; text-align:center; grid-column:span 2; border:1px solid rgba(255,0,85,0.4); font-size:14px; font-weight:bold; color:var(--neon-pink);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8 M4 6h16v6H4z M12 22V6 M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg> تذكرة استدعاء بطل مجانية (5%)</div>
            </div>
          `;
       }
  };
  
  window.ExtendedFeatures.payWithStars = function(amount, type) {
     if(window.Telegram && window.Telegram.WebApp) {
        // Mocking Telegram Stars payment request
        // In real app, you would fetch invoice link from your bot backend
        window.Telegram.WebApp.showConfirm(`هل تود شراء هذه الباقة مقابل ${amount} ⭐ Telegram Stars؟`, (ok) => {
           if(ok) {
              window.toast && toast('جاري معالجة الدفع عبر تليجرام...', 'info');
              setTimeout(() => {
                 window.toast && toast('تم الدفع بنجاح! ⭐', 'good');
                 if(type === 'VIP') {
                    window.G.player.vip = true;
                    window.G.cur.prem += 30;
                 } else if (type === 'Gems') {
                    window.G.cur.gems += 100;
                 } else if (type === 'Gems500') {
                    window.G.cur.gems += 500;
                 }
                 window.save && window.save();
                 window.UI.render();
                 window.UI.closeModal();
              }, 2000);
           }
        });
     } else {
        window.toast && toast('الدفع متاح فقط داخل Telegram WebApp', 'err');
     }
  };
  
  window.ExtendedFeatures.watchAd = function(btn) {
     if(btn.disabled) return;
     btn.disabled = true;
     btn.innerHTML = 'جاري التحميل... ⏳';

     if (window.Adsgram) {
        try {
           const ad = window.Adsgram.init({ blockId: "int-41268" });
           ad.show().then(function() {
              window.UI.closeModal();
              
              // Rewards Logic
              const rand = Math.random();
              let gold = 0, gems = 0, text = '';
              if(rand < 0.05) {
                 gems = 50; text = 'مبروك! لقد ربحت 50 جوهرة نادرة! <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';
              } else if(rand < 0.30) {
                 gems = 10; text = 'ممتاز! حصلت على 10 جواهر <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';
              } else {
                 gold = 300; text = 'حصلت على 300 ذهب <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><circle cx="12" cy="12" r="8"/><path d="M12 8v8"/></svg>';
              }
              
              if(gold > 0) window.G.cur.gold += gold;
              if(gems > 0) window.G.cur.gems += gems;
              
              if (window.save) window.save();
              if (window.UI.hud) window.UI.hud();
              
              try { if (window.tg && window.tg.HapticFeedback) window.tg.HapticFeedback.notificationOccurred('success'); } catch(e){}
              try { if (window.tg && window.tg.sendData) window.tg.sendData(JSON.stringify({action:'ad_watched'})); } catch(e){}
              
              if (window.toast) window.toast(text, 'good');
              if (window.logActivity) window.logActivity('شاهدت إعلاناً وحصلت على مكافأة');
           }).catch(function() {
              btn.disabled = false;
              btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> مشاهدة الآن';
              if (window.toast) window.toast('تم إلغاء الإعلان أو حدث خطأ.', 'err');
           });
        } catch (e) {
           btn.disabled = false;
           btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> مشاهدة الآن';
           if (window.toast) window.toast('تعذر تشغيل الإعلان.', 'err');
        }
     } else {
        btn.disabled = false;
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> مشاهدة الآن';
        if (window.toast) window.toast('نظام الإعلانات غير متاح حالياً.', 'err');
     }
  };

  window.ExtendedFeatures.finishAd = function() {
     // Replaced by real Adsgram
  };
}

// Admin UI Improvements
if (window.AdminUI) {
  const origMount = window.AdminUI.mount;
  window.AdminUI.mount = function() {
     origMount.call(this);
     const style = document.createElement('style');
     style.textContent = `
       #admFab {
         bottom: 100px !important;
         right: 20px !important;
         background: linear-gradient(135deg, #FF0055, #FFB020) !important;
         box-shadow: 0 0 20px rgba(255,0,85,0.6) !important;
         border: 2px solid white !important;
       }
       .adm-top {
         background: linear-gradient(90deg, #1A0000, #33001A) !important;
         border-bottom: 2px solid #FF0055 !important;
       }
       .adm-tile {
         background: rgba(255,0,85,0.1) !important;
         border: 1px solid rgba(255,0,85,0.3) !important;
         border-radius: 12px !important;
         box-shadow: 0 4px 10px rgba(0,0,0,0.5) !important;
         transition: 0.3s !important;
       }
       .adm-tile:hover {
         transform: translateY(-3px) scale(1.05) !important;
         background: rgba(255,0,85,0.2) !important;
         border-color: #FF0055 !important;
         box-shadow: 0 10px 20px rgba(255,0,85,0.4) !important;
       }
       .adm-tile .ic {
         font-size: 30px !important;
       }
     `;
     document.head.appendChild(style);
  };
}


// Profile Page Enhancement
if (window.UI) {
  const origProfile = window.UI.profile;
  window.UI.profile = function() {
    origProfile.call(this);
    const prBody = document.getElementById('prBody');
    if(!prBody) return;
    
    const need = window.G.player.level * 120;
    const winRate = window.G.stats.wins + window.G.stats.losses ? Math.round(window.G.stats.wins/(window.G.stats.wins+window.G.stats.losses)*100) : 0;
    
    // Check if player is logged in via TG
    const isTG = window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user;
    const tgUsername = isTG ? '@' + (window.Telegram.WebApp.initDataUnsafe.user.username || window.Telegram.WebApp.initDataUnsafe.user.first_name) : 'زائر مؤقت';
    
    let html = `
      <div class="glass" style="padding:20px;text-align:center;margin:8px 0; border-radius:20px; background:linear-gradient(180deg, rgba(255,255,255,0.05), rgba(0,0,0,0.5)); border:1px solid rgba(0,240,255,0.2);">
        <div style="position:relative; display:inline-block;">
           <div style="font-size:65px; text-shadow:0 0 20px rgba(0,240,255,0.5);">${window.G.player.avatar || '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'1.2em\' height=\'1.2em\' style=\'vertical-align:text-bottom\'><path d=\'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z\'/></svg>'}</div>
           ${window.G.player.vip ? '<div style="position:absolute; bottom:-5px; right:-10px; font-size:25px; filter:drop-shadow(0 0 10px gold);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg></div>' : ''}
        </div>
        <div class="font-o" style="font-size:24px; margin-top:10px; color:var(--neon-cyan);">${window.G.player.name}</div>
        <div style="font-size:13px; color:#aaa; margin-bottom:15px;">${tgUsername} ${isTG ? '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'1.2em\' height=\'1.2em\' style=\'vertical-align:text-bottom\'><path d=\'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z\'/></svg>' : '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'1.2em\' height=\'1.2em\' style=\'vertical-align:text-bottom\'><path d=\'M13 2L3 14h9l-1 8 10-12h-9l1-8z\'/></svg>'}</div>
        
        <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:5px;">
           <span style="color:#00f0ff;">Lv. ${window.G.player.level}</span>
           <span style="color:#ff2e97;">${window.G.player.exp} / ${need} XP</span>
        </div>
        <div class="bar" style="height:12px; border-radius:10px; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.1);">
           <div style="width:${Math.min(100, window.G.player.exp/need*100)}%; background:linear-gradient(90deg, var(--neon-cyan), var(--neon-purple)); border-radius:10px; box-shadow:0 0 10px var(--neon-cyan);"></div>
        </div>
        
        <div style="margin-top:20px; display:flex; gap:10px; justify-content:center;">
           <button class="btn sm cyan" style="flex:1; border-radius:15px;" onclick="window.UI.loginModal()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M14.5 9.5l-9 9a2.12 2.12 0 1 0 3 3l9-9 M16 16l4.5 4.5 M20.5 3.5l-4.5 4.5 M8 8l-4.5-4.5 M3.5 20.5l4.5-4.5 M11.5 5.5l3 3 M15.5 8.5l3-3 M18.5 12.5l-3-3"/></svg> تعديل</button>
           <button class="btn sm gold" style="flex:1; border-radius:15px;" onclick="window.ExtendedFeatures.showAdvancedShop()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v12 M9 9h6 M9 15h6"/></svg> محفظتي</button>
        </div>
      </div>
      
      <div class="sec-title" style="margin-top:20px; color:var(--neon-pink);"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> السجل القتالي</div>
      <div class="grid3" style="gap:10px;">
        <div class="mini-card" style="background:rgba(51,255,158,0.1); border-color:var(--neon-green);">
           <b style="color:var(--neon-green); font-size:18px;">${window.G.stats.wins}</b><small>انتصار</small>
        </div>
        <div class="mini-card" style="background:rgba(255,46,91,0.1); border-color:var(--neon-pink);">
           <b style="color:var(--neon-pink); font-size:18px;">${window.G.stats.losses}</b><small>هزيمة</small>
        </div>
        <div class="mini-card" style="background:rgba(0,240,255,0.1); border-color:var(--neon-cyan);">
           <b style="color:var(--neon-cyan); font-size:18px;">${winRate}%</b><small>نسبة الفوز</small>
        </div>
      </div>
      
      <div class="grid2" style="margin-top:10px; gap:10px;">
        <div class="mini-card" style="padding:15px;">
           <b style="font-size:20px; color:var(--neon-gold);">${window.fmt(window.teamPower())}</b><br><small>قوة الفريق</small>
        </div>
        <div class="mini-card" style="padding:15px;">
           <b style="font-size:20px; color:#b45cff;">${window.ownedList().length}</b><br><small>أبطال مملوكة</small>
        </div>
      </div>
      
      <div class="sec-title" style="margin-top:20px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> سجل الإنجازات</div>
      <div style="background:rgba(255,255,255,0.03); border-radius:15px; padding:15px; border:1px solid rgba(255,255,255,0.05);">
         <div class="kv"><span>مراحل القصة المُنجزة</span> <b>${window.G.stage > 0 ? window.G.stage-1 : 0} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></b></div>
         <div class="kv"><span>إجمالي الضرر المُحدث</span> <b>${window.fmt(window.G.stats.damage)} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/><path d="M8.5 6.5L21 19v3h-3L6.5 10.5"/><path d="M11 5L5 11"/><path d="M8 8L4 4"/><path d="M5 3L3 5"/></svg></b></div>
         <div class="kv"><span>استخدام المهارات القاضية</span> <b>${window.G.stats.ults} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></b></div>
         <div class="kv" style="border:none; padding-bottom:0;"><span>الصناديق المفتوحة</span> <b>${window.G.stats.chests} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg></b></div>
      </div>
      
      <button class="btn block" style="margin-top:20px; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2);" onclick="window.UI.prevSettings='profile';window.UI.go('settings')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg> إعدادات الحساب واللعبة</button>
      <div style="height:30px;"></div>
    `;
    prBody.innerHTML = html;
  };
}

// Completely disable seedStarters so accounts are always fresh
window.seedStarters = function() {
  // Do nothing. Start from absolute zero.
  if(!window.G.team) window.G.team = [];
  if(!window.G.chars) window.G.chars = {};
  window.save && window.save();
};

if (window.CHESTS) {
  window.CHESTS.forEach(b => {
    if(b.id === 'common') { b.cost = {gold: 500}; }
  });
}

console.log('Final Polish v4 Applied');
if (window.UI) {
  const origHome = window.UI.home;
  window.UI.home = function() {
    const dailyReady = window.G.lastDaily !== window.todayKey();
    const teamPower = typeof window.teamPower === 'function' ? window.teamPower() : 0;
    const stage = window.G.stage || 1;
    const owned = typeof window.ownedList === 'function' ? window.ownedList().length : 0;
    const totalChars = typeof window.CHARACTERS !== 'undefined' ? window.CHARACTERS.length : '?';
    
    // Group definitions
    const groups = [
      {
        title: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/><path d="M8.5 6.5L21 19v3h-3L6.5 10.5"/><path d="M11 5L5 11"/><path d="M8 8L4 4"/><path d="M5 3L3 5"/></svg> قتال ومغامرات',
        color: '#ff2e5b',
        items: [
          { id: 'battle-select', icon: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><path d=\'M14.5 17.5L3 6V3h3l11.5 11.5\'/><path d=\'M13 19l6-6\'/><path d=\'M16 16l4 4\'/><path d=\'M19 21l2-2\'/><path d=\'M8.5 6.5L21 19v3h-3L6.5 10.5\'/><path d=\'M11 5L5 11\'/><path d=\'M8 8L4 4\'/><path d=\'M5 3L3 5\'/></svg>', label: 'القصة', col: '#ff2e5b' },
          { id: 'pvp', icon: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><path d=\'M14.5 17.5L3 6V3h3l11.5 11.5\'/><path d=\'M13 19l6-6\'/><path d=\'M16 16l4 4\'/><path d=\'M19 21l2-2\'/><path d=\'M8.5 6.5L21 19v3h-3L6.5 10.5\'/><path d=\'M11 5L5 11\'/><path d=\'M8 8L4 4\'/><path d=\'M5 3L3 5\'/></svg>', label: 'أونلاين PvP', col: '#ff4b4b' },
          { id: 'tournament', icon: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><path d=\'M6 9H4.5a2.5 2.5 0 0 1 0-5H6\'/><path d=\'M18 9h1.5a2.5 2.5 0 0 0 0-5H18\'/><path d=\'M4 22h16\'/><path d=\'M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22\'/><path d=\'M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22\'/><path d=\'M18 2H6v7a6 6 0 0 0 12 0V2Z\'/></svg>', label: 'البطولات', col: '#ffb020' }
        ]
      },
      {
        title: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg> الأبطال والعتاد',
        color: '#a24bff',
        items: [
          { id: 'characters', icon: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><circle cx=\'12\' cy=\'8\' r=\'5\'/><path d=\'M20 21a8 8 0 0 0-16 0\'/></svg>', label: 'الأبطال', col: '#a24bff' },
          { id: 'weapons', icon: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><path d=\'m14.5 9.5-9 9a2.12 2.12 0 1 0 3 3l9-9\'/><path d=\'m16 16 4.5 4.5\'/><path d=\'m20.5 3.5-4.5 4.5\'/><path d=\'m8 8-4.5-4.5\'/><path d=\'m3.5 20.5 4.5-4.5\'/><path d=\'m11.5 5.5 3 3\'/><path d=\'m15.5 8.5 3-3\'/><path d=\'m18.5 12.5-3-3\'/></svg>', label: 'الأسلحة', col: '#38b6ff' },
          { id: 'skills', icon: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><path d=\'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z\'/></svg>', label: 'المهارات', col: '#ff8a00' },
          { id: 'inventory', icon: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><path d=\'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\'/></svg>', label: 'الحقيبة', col: '#33ff9e' }
        ]
      },
      {
        title: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8 M4 6h16v6H4z M12 22V6 M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg> المتجر والهدايا',
        color: '#ffc844',
        items: [
          { id: 'shop', icon: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><path d=\'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z\'/><path d=\'M3 6h18\'/><path d=\'M16 10a4 4 0 0 1-8 0\'/></svg>', label: 'المتجر', col: '#ffc844' },
          { id: 'ads', icon: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><polygon points=\'5 3 19 12 5 21 5 3\'/></svg>', label: 'إعلانات', col: '#00f0ff' },
          { id: 'missions', icon: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><circle cx=\'12\' cy=\'12\' r=\'10\'/><circle cx=\'12\' cy=\'12\' r=\'6\'/><circle cx=\'12\' cy=\'12\' r=\'2\'/></svg>', label: 'المهام', col: '#ff2e97', badge: dailyReady }
        ]
      },
      {
        title: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M22 20v-6h-2v6h-4v-4H8v4H4v-6H2v6h20zM4 14V4h2v10H4zM18 14V4h2v10h-2zM9 10h6v6H9v-6z"/></svg> مجتمع اللعبة',
        color: '#00ffc8',
        items: [
          { id: 'guild', icon: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><path d=\'M22 20v-6h-2v6h-4v-4H8v4H4v-6H2v6h20zM4 14V4h2v10H4zM18 14V4h2v10h-2zM9 10h6v6H9v-6z\'/></svg>', label: 'النقابة', col: '#b45cff' },
          { id: 'leaderboard', icon: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><circle cx=\'12\' cy=\'8\' r=\'7\'/><polyline points=\'8.21 13.89 7 23 12 20 17 23 15.79 13.88\'/></svg>', label: 'الترتيب', col: '#ffc844' },
          { id: 'chat', icon: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><path d=\'m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z\'/></svg>', label: 'الدردشة', col: '#33ff9e' }
        ]
      }
    ];

    let html = `
      <style>
        .home-hero {
          background: linear-gradient(135deg, rgba(30,30,45,0.9), rgba(15,15,25,0.9)), url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" opacity="0.05"><path d="M0 0l50 50-50 50z" fill="%23fff"/></svg>');
          background-size: cover;
          border-radius: 20px; padding: 25px 20px;
          border: 1px solid rgba(255,215,0,0.2);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,215,0,0.05);
          position: relative; overflow: hidden;
          margin-bottom: 25px;
        }
        .home-hero::before {
          content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
          background: radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 60%);
          animation: pulseGlow 4s infinite alternate;
        }
        @keyframes pulseGlow { 0% { transform: scale(0.9); opacity: 0.5; } 100% { transform: scale(1.1); opacity: 1; } }
        
        .home-hgroup { margin-bottom: 25px; }
        .hgroup-title { font-size: 16px; font-weight: bold; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        
        /* Horizontal scroll container */
        .horiz-scroll {
          display: flex; gap: 12px; overflow-x: auto; padding-bottom: 12px;
          scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;
        }
        .horiz-scroll::-webkit-scrollbar { height: 6px; }
        .horiz-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        
        .lux-tile {
          flex: 0 0 110px; height: 110px; scroll-snap-align: start;
          background: rgba(20,20,35,0.8);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 16px;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; position: relative;
          box-shadow: 0 6px 15px rgba(0,0,0,0.3);
          transition: 0.3s;
        }
        .lux-tile:active { transform: scale(0.95); }
        .lux-tile .ic { font-size: 32px; margin-bottom: 8px; filter: drop-shadow(0 2px 5px rgba(0,0,0,0.5)); }
        .lux-tile .lb { font-size: 13px; font-weight: bold; color: #fff; }
        .lux-tile .badge { position: absolute; top: 5px; right: 5px; background: #ff2e5b; font-size: 10px; padding: 2px 6px; border-radius: 10px; }
        
        /* Auto scrolling for team/stats */
        .auto-scroll-wrap {
          display: flex; gap: 10px; overflow: hidden; white-space: nowrap; position: relative;
          padding: 10px 0;
        }
        .auto-scroll-content {
          display: flex; gap: 10px;
          animation: autoScrollX 20s linear infinite;
        }
        @keyframes autoScrollX { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      </style>
      
      <div class="home-hero">
        <div style="position:relative; z-index:1; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h3 style="margin:0 0 5px 0; font-size:24px; text-shadow:0 2px 5px rgba(0,0,0,0.8);">${window.G.player.name}</h3>
            <p style="margin:0; color:#ccc; font-size:14px;">قوة الفريق: <b style="color:gold;">${window.fmt(teamPower)}</b></p>
          </div>
          <div style="text-align:left;">
            <div class="pill" style="background:rgba(255,215,0,0.2); border-color:gold; color:gold; margin-bottom:5px;">المرحلة ${stage}</div>
            <div class="pill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg> ${window.G.trophies}</div>
          </div>
        </div>
      </div>
      
      <div id="homeGroups">
    `;
    
    groups.forEach(g => {
      html += `
        <div class="home-hgroup">
          <div class="hgroup-title" style="color:${g.color}">${g.title}</div>
          <div class="horiz-scroll">
            ${g.items.map(m => `
              <div class="lux-tile" style="box-shadow: 0 4px 15px ${m.col}20;" onclick="window.sfx&&window.sfx('click'); window.UI.go('${m.id}')">
                ${m.badge ? '<span class="badge">جديد</span>' : ''}
                <span class="ic">${m.icon}</span>
                <span class="lb">${m.label}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });
    
    // Team Auto-Scroll
    let teamHtml = window.G.team.length ? window.G.team.map(id => window.UI.charCard(id)).join('') : '<div style="color:#aaa;">لا يوجد أبطال في الفريق</div>';
    
    html += `
      <div class="home-hgroup">
        <div class="hgroup-title" style="color:#fff;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="m14.5 9.5-9 9a2.12 2.12 0 1 0 3 3l9-9"/><path d="m16 16 4.5 4.5"/><path d="m20.5 3.5-4.5 4.5"/><path d="m8 8-4.5-4.5"/><path d="m3.5 20.5 4.5-4.5"/><path d="m11.5 5.5 3 3"/><path d="m15.5 8.5 3-3"/><path d="m18.5 12.5-3-3"/></svg> تشكيلة الفريق الأساسية</div>
        <div class="horiz-scroll" style="padding-bottom:10px;">
          ${teamHtml}
        </div>
      </div>
      <div class="home-hgroup">
        <div class="hgroup-title" style="color:#aaa;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> إحصائيات سريعة</div>
        <div class="grid3">
          <div class="mini-card" style="background:rgba(0,0,0,0.3);"><b>${window.G.stats.wins}</b><small>انتصارات</small></div>
          <div class="mini-card" style="background:rgba(0,0,0,0.3);"><b>${window.G.stats.losses}</b><small>هزائم</small></div>
          <div class="mini-card" style="background:rgba(0,0,0,0.3);"><b>${window.fmt(window.G.stats.damage)}</b><small>ضرر</small></div>
        </div>
      </div>
      <div style="height:30px;"></div>
    </div>`; // End of #homeGroups

    const homeBody = document.getElementById('homeBody');
    if(homeBody) homeBody.innerHTML = html;
  };
}
if (window.ExtendedFeatures) {
  window.ExtendedFeatures.showPvP = function() {
    const html = `
      <style>
        .pvp-hero { text-align:center; padding: 20px; background: radial-gradient(circle, rgba(255,46,91,0.2), transparent); border-radius: 12px; margin-bottom: 20px; border: 1px solid rgba(255,46,91,0.3); }
        .pvp-btn { font-size: 16px; padding: 15px; width: 100%; border-radius: 12px; margin-bottom: 10px; border: none; cursor: pointer; color: white; font-weight: bold; }
        .pvp-btn.find { background: linear-gradient(90deg, #ff2e5b, #a24bff); box-shadow: 0 5px 15px rgba(255,46,91,0.4); }
        .pvp-btn.search { background: rgba(0,240,255,0.1); border: 1px solid var(--neon-cyan); color: var(--neon-cyan); }
        
        .pvp-input-box { display: none; background: rgba(0,0,0,0.4); padding: 15px; border-radius: 12px; margin-bottom: 15px; }
        .pvp-input-box.on { display: block; animation: fadeIn .3s; }
        
        #pvpQueue { display: none; text-align: center; padding: 20px; }
        #pvpQueue.on { display: block; }
        .spinner { font-size: 50px; animation: spin 2s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      </style>
      
      <div class="pvp-hero">
        <div style="font-size:60px; margin-bottom:10px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M14.5 17.5L3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/><path d="M8.5 6.5L21 19v3h-3L6.5 10.5"/><path d="M11 5L5 11"/><path d="M8 8L4 4"/><path d="M5 3L3 5"/></svg></div>
        <h2>أونلاين PvP المباشر</h2>
        <p style="opacity:0.8; font-size:13px;">العب ضد لاعبين آخرين من Telegram، ابحث عن صديق أو العب مع خصم عشوائي.</p>
        <div style="display:flex; justify-content:center; gap:10px; margin-top:10px;">
          <div class="pill">تصنيفك: ${(window.G.pvp && window.G.pvp.rank) || 1000} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg></div>
          <div class="pill" style="border-color:var(--neon-green); color:var(--neon-green)">متصل الآن: 342</div>
        </div>
      </div>
      
      <div id="pvpMain">
        <button class="pvp-btn find" onclick="ExtendedFeatures.findRandomMatch()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg> بحث عن خصم عشوائي</button>
        <button class="pvp-btn search" onclick="document.getElementById('pvpCustomBox').classList.toggle('on')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> إرسال تحدي لصديق (اسم المستخدم)</button>
        
        <div class="pvp-input-box" id="pvpCustomBox">
          <input type="text" id="pvpFriendName" class="searchbar" placeholder="مثال: @username" style="width:100%; border-radius:8px; padding:10px; margin-bottom:10px; text-align:center;">
          <button class="btn block cyan" onclick="ExtendedFeatures.sendChallenge()">إرسال التحدي <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8 M4 6h16v6H4z M12 22V6 M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg></button>
        </div>
      </div>
      
      <div id="pvpQueue">
        <div class="spinner"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg></div>
        <div style="margin-top:15px; font-size:18px; color:var(--neon-cyan);" id="pvpQueueTxt">جاري انتظار قبول الخصم...</div>
        <button class="btn ghost mt-2" onclick="ExtendedFeatures.cancelPvP()">إلغاء</button>
      </div>
    `;
    window.UI.openPage('القتال التنافسي أونلاين', html);rsion
  };
  
  window.ExtendedFeatures.pvpTimer = null;
  
  window.ExtendedFeatures.findRandomMatch = function() {
    if(window.PVP && window.PVP.start) {
      window.UI.closeModal();
      window.PVP.start();
    } else {
      window.toast && toast('خطأ في نظام الـ PvP.', 'err');
    }
  };
  
  window.ExtendedFeatures.sendChallenge = function() {
    const val = document.getElementById('pvpFriendName').value.trim();
    if(!val) { window.toast && toast('أدخل اسم المستخدم أولاً!', 'bad'); return; }
    
    document.getElementById('pvpMain').style.display = 'none';
    document.getElementById('pvpQueue').classList.add('on');
    document.getElementById('pvpQueueTxt').innerText = 'تم الإرسال لـ ' + val + '... ننتظر القبول ⏳';
    
    // Simulate accepting after random time
    this.pvpTimer = setTimeout(() => {
      document.getElementById('pvpQueueTxt').innerText = 'تم القبول! جاري الدخول للنزال... <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>';
      document.getElementById('pvpQueueTxt').style.color = 'var(--neon-green)';
      
      setTimeout(() => {
        window.UI.closeModal();
        if(window.PVP && window.PVP.find) {
          const foe = window.PVP.find();
          foe.name = val; // Override name with friend's name
          foe.mode = 'friendly';
          if(window.ARENA_PVP && window.ARENA_PVP.start) {
            window.ARENA_PVP.start(foe, 'friendly');
          }
        }
      }, 1500);
    }, Math.random() * 3000 + 2000);
  };
  
  window.ExtendedFeatures.cancelPvP = function() {
    clearTimeout(this.pvpTimer);
    document.getElementById('pvpQueue').classList.remove('on');
    document.getElementById('pvpMain').style.display = 'block';
  };
}
if (window.ExtendedFeatures) {
  window.ExtendedFeatures.showChat = function() {
    const html = `
      <style>
        .wa-chat { display: flex; flex-direction: column; height: 60vh; background: #0b1016; border-radius: 12px; overflow: hidden; }
        .wa-head { background: #1f2c34; padding: 10px 15px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .wa-head img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
        .wa-head .info { flex: 1; }
        .wa-head .title { font-weight: bold; font-size: 16px; color: #e9edef; }
        .wa-head .sub { font-size: 12px; color: #8696a0; }
        .wa-body { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; background: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png') center/cover; }
        
        .wa-msg { display: flex; flex-direction: column; max-width: 80%; position: relative; animation: fadeIn .3s ease-out; }
        .wa-msg.in { align-self: flex-start; }
        .wa-msg.out { align-self: flex-end; }
        .wa-bubble { padding: 8px 12px; border-radius: 12px; font-size: 14px; line-height: 1.4; position: relative; word-wrap: break-word; user-select: none; }
        .wa-msg.in .wa-bubble { background: #202c33; color: #e9edef; border-top-left-radius: 0; }
        .wa-msg.out .wa-bubble { background: #005c4b; color: #e9edef; border-top-right-radius: 0; }
        .wa-name { font-size: 12px; font-weight: bold; color: #53bdeb; margin-bottom: 4px; }
        .wa-time { font-size: 10px; color: rgba(255,255,255,0.5); text-align: right; margin-top: 4px; }
        
        .wa-foot { background: #202c33; padding: 10px; display: flex; align-items: center; gap: 10px; }
        .wa-input { flex: 1; background: #2a3942; color: #e9edef; border: none; padding: 10px 15px; border-radius: 20px; font-size: 14px; outline: none; }
        .wa-send { background: #00a884; color: white; border: none; border-radius: 50%; width: 40px; height: 40px; display: grid; place-items: center; font-size: 18px; cursor: pointer; }
        
        /* Message Actions */
        .msg-actions { display: none; position: absolute; top: -30px; right: 0; background: rgba(32,44,51,0.9); border-radius: 8px; padding: 5px; gap: 5px; box-shadow: 0 4px 10px rgba(0,0,0,0.5); z-index: 10; }
        .wa-msg.out .msg-actions { right: 0; left: auto; }
        .wa-msg.in .msg-actions { left: 0; right: auto; }
        .msg-action-btn { background: none; border: none; color: #8696a0; font-size: 16px; cursor: pointer; padding: 2px 5px; border-radius: 4px; }
        .msg-action-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .wa-msg.active .msg-actions { display: flex; }
        
        /* Reaction */
        .reaction-badge { position: absolute; bottom: -8px; right: 10px; background: #202c33; border: 1px solid #005c4b; border-radius: 12px; padding: 2px 5px; font-size: 12px; }
        
        /* Swipe Reply Hint */
        .reply-box { display: none; background: #2a3942; border-left: 4px solid #00a884; padding: 8px; margin-bottom: 5px; border-radius: 8px; font-size: 12px; color: #8696a0; }
        .reply-box.on { display: block; }
        .reply-name { color: #00a884; font-weight: bold; margin-bottom: 2px; }
        
        .wa-reply-quote { background: rgba(0,0,0,0.2); border-left: 4px solid #00a884; padding: 5px; margin-bottom: 5px; border-radius: 5px; font-size: 11px; opacity: 0.8; }
      </style>
      
      <div class="wa-chat">
        <div class="wa-head">
          <div style="font-size:32px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
          <div class="info">
            <div class="title">الدردشة العالمية المباشرة</div>
            <div class="sub">متصل الآن, 1.4k لاعبين</div>
          </div>
        </div>
        
        <div class="wa-body" id="waBody">
          <!-- Initial Msgs -->
          <div class="wa-msg in">
            <div class="wa-bubble">
              <div class="wa-name">النظام</div>
              مرحباً بك في الدردشة، اسحب الرسالة يميناً للرد، أو اضغط مطولاً عليها للتفاعل والتعديل.
              <div class="wa-time">10:00</div>
            </div>
          </div>
          <div class="wa-msg in">
            <div class="wa-bubble" oncontextmenu="ExtendedFeatures.msgActions(this, event)">
              <div class="wa-name">Sasuke Uchiha</div>
              من يتحداني الآن؟ أنا جاهز!
              <div class="wa-time">10:02</div>
            </div>
          </div>
        </div>
        
        <div style="padding:0 10px;">
          <div class="reply-box" id="replyPreview">
            <div style="display:flex; justify-content:space-between;">
              <span class="reply-name" id="replyName">اسم المستخدم</span>
              <span onclick="ExtendedFeatures.cancelReply()" style="cursor:pointer;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M14.5 9.5l-9 9a2.12 2.12 0 1 0 3 3l9-9 M16 16l4.5 4.5 M20.5 3.5l-4.5 4.5 M8 8l-4.5-4.5 M3.5 20.5l4.5-4.5 M11.5 5.5l3 3 M15.5 8.5l3-3 M18.5 12.5l-3-3"/></svg></span>
            </div>
            <div id="replyText" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">النص</div>
          </div>
        </div>
        
        <div class="wa-foot">
          <input type="text" id="waInput" class="wa-input" placeholder="اكتب رسالة..." onkeypress="if(event.key==='Enter') ExtendedFeatures.sendWA()">
          <button class="wa-send" onclick="ExtendedFeatures.sendWA()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></button>
        </div>
      </div>
    `;
    window.UI.openPage('دردشة اللاعبين', html);   
    // Add touch swipe logic for reply
    setTimeout(() => {
      let touchStartX = 0;
      const body = document.getElementById('waBody');
      body.addEventListener('touchstart', e => {
        const msg = e.target.closest('.wa-bubble');
        if(msg) touchStartX = e.changedTouches[0].screenX;
      });
      body.addEventListener('touchend', e => {
        const msg = e.target.closest('.wa-bubble');
        if(!msg) return;
        const touchEndX = e.changedTouches[0].screenX;
        if(touchEndX - touchStartX > 50) {
          // Swiped right -> Reply
          const name = msg.querySelector('.wa-name') ? msg.querySelector('.wa-name').innerText : (msg.parentElement.classList.contains('out') ? 'أنت' : 'لاعب');
          const txt = msg.innerText.replace(name, '').replace(/[0-9:]+$/, '').trim();
          ExtendedFeatures.startReply(name, txt);
        }
      });
      body.scrollTop = body.scrollHeight;
    }, 200);
  };
  
  window.ExtendedFeatures.replyTo = null;
  window.ExtendedFeatures.startReply = function(name, text) {
    this.replyTo = {name, text};
    document.getElementById('replyName').innerText = name;
    document.getElementById('replyText').innerText = text;
    document.getElementById('replyPreview').classList.add('on');
    document.getElementById('waInput').focus();
  };
  window.ExtendedFeatures.cancelReply = function() {
    this.replyTo = null;
    document.getElementById('replyPreview').classList.remove('on');
  };
  
  window.ExtendedFeatures.msgActions = function(el, e) {
    e.preventDefault();
    document.querySelectorAll('.wa-msg').forEach(m => m.classList.remove('active'));
    const p = el.parentElement;
    p.classList.add('active');
    
    if(!p.querySelector('.msg-actions')) {
      const isOut = p.classList.contains('out');
      const acts = document.createElement('div');
      acts.className = 'msg-actions';
      acts.innerHTML = `
        <button class="msg-action-btn" onclick="ExtendedFeatures.reactMsg(this, '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'1.2em\' height=\'1.2em\' style=\'vertical-align:text-bottom\'><path d=\'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z\'/></svg>')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></button>
        <button class="msg-action-btn" onclick="ExtendedFeatures.reactMsg(this, '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' width=\'1em\' height=\'1em\' style=\'vertical-align:text-bottom\'><path d=\'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z\'/></svg>')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg></button>
        <button class="msg-action-btn" onclick="ExtendedFeatures.reactMsg(this, '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'1.2em\' height=\'1.2em\' style=\'vertical-align:text-bottom\'><path d=\'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z\'/></svg>')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg></button>
        <button class="msg-action-btn" onclick="ExtendedFeatures.copyMsg(this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></button>
        ${isOut ? '<button class="msg-action-btn" onclick="ExtendedFeatures.delMsg(this)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>' : ''}
        <button class="msg-action-btn" onclick="this.parentElement.parentElement.classList.remove('active')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M14.5 9.5l-9 9a2.12 2.12 0 1 0 3 3l9-9 M16 16l4.5 4.5 M20.5 3.5l-4.5 4.5 M8 8l-4.5-4.5 M3.5 20.5l4.5-4.5 M11.5 5.5l3 3 M15.5 8.5l3-3 M18.5 12.5l-3-3"/></svg></button>
      `;
      p.appendChild(acts);
    }
  };
  
  window.ExtendedFeatures.reactMsg = function(btn, emoji) {
    const p = btn.closest('.wa-msg');
    let bnd = p.querySelector('.reaction-badge');
    if(!bnd) {
      bnd = document.createElement('div');
      bnd.className = 'reaction-badge';
      p.querySelector('.wa-bubble').appendChild(bnd);
    }
    bnd.innerText = emoji;
    p.classList.remove('active');
  };
  window.ExtendedFeatures.copyMsg = function(btn) {
    const txt = btn.closest('.wa-msg').querySelector('.wa-bubble').innerText.replace(/[0-9:]+$/, '').trim();
    if(navigator.clipboard) navigator.clipboard.writeText(txt);
    window.toast && toast('تم النسخ', 'good');
    btn.closest('.wa-msg').classList.remove('active');
  };
  window.ExtendedFeatures.delMsg = function(btn) {
    btn.closest('.wa-msg').remove();
  };
  
  window.ExtendedFeatures.sendWA = function() {
    const inp = document.getElementById('waInput');
    const val = inp.value.trim().replace(/</g, "<");
    if(!val) return;
    
    const time = new Date().toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit', hour12:false});
    const box = document.getElementById('waBody');
    
    let replyHtml = '';
    if(this.replyTo) {
      replyHtml = `<div class="wa-reply-quote"><b>${this.replyTo.name}</b><br>${this.replyTo.text}</div>`;
      this.cancelReply();
    }
    
    const el = document.createElement('div');
    el.className = 'wa-msg out';
    el.innerHTML = `
      <div class="wa-bubble" oncontextmenu="ExtendedFeatures.msgActions(this, event)">
        ${replyHtml}
        ${val}
        <div class="wa-time">${time} <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div>
      </div>
    `;
    box.appendChild(el);
    inp.value = '';
    box.scrollTop = box.scrollHeight;
  };
}
if (window.AdminUI) {
  const origMount = window.AdminUI.mount;
  window.AdminUI.mount = function() {
    origMount.call(this);
    
    // Check if we already injected
    if(document.getElementById('devCompleteAdmin')) return;
    
    const style = document.createElement('style');
    style.textContent = `
      .adm-tile.dev { background: linear-gradient(45deg, #1A0000, #33001A) !important; border: 1px solid #FF0055 !important; }
      .adm-tile.dev .ic { font-size:30px; animation: pulse 2s infinite; }
    `;
    document.head.appendChild(style);
    
    // Inject into admin dashboard
    const oldDash = window.AdminUI.dashboard || function(){};
    window.AdminUI.dashboard = function() {
      oldDash.call(window.AdminUI);
      setTimeout(() => {
        const body = document.getElementById('admBody_dash');
        if(body && !document.getElementById('devCompleteAdmin')) {
          const btn = document.createElement('div');
          btn.id = 'devCompleteAdmin';
          btn.className = 'adm-tile dev';
          btn.onclick = () => window.UI.go('adm-dev');
          btn.innerHTML = '<span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></span><span class="lb">المطور الشامل</span>';
          const grid = body.querySelector('.adm-grid');
          if(grid) grid.appendChild(btn);
        }
      }, 100);
    };
    
    // Create new admin screen
    const scr = document.getElementById('screens');
    if(scr && !document.getElementById('adm-dev')) {
      const d = document.createElement('div');
      d.className = 'screen'; d.id = 'adm-dev';
      d.innerHTML = `
        <div class="adm-top"><div class="back-btn" onclick="UI.go('adm-dash')">›</div><h2>المطور الشامل</h2></div>
        <div class="scr-body">
          <div class="warnbox" style="margin:10px;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> هذا القسم مخصص لإدارة قواعد البيانات المركزية وتعديل النواقص في الأبطال والأسلحة والمهام.</div>
          
          <div class="sec-title">إدارة قواعد البيانات الأساسية</div>
          <button class="btn block gold" onclick="ExtendedFeatures.editDB('CHARACTERS')">تعديل الأبطال <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg></button>
          <button class="btn block cyan mt-2" onclick="ExtendedFeatures.editDB('WEAPONS')">تعديل الأسلحة <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="m14.5 9.5-9 9a2.12 2.12 0 1 0 3 3l9-9"/><path d="m16 16 4.5 4.5"/><path d="m20.5 3.5-4.5 4.5"/><path d="m8 8-4.5-4.5"/><path d="m3.5 20.5 4.5-4.5"/><path d="m11.5 5.5 3 3"/><path d="m15.5 8.5 3-3"/><path d="m18.5 12.5-3-3"/></svg></button>
          <button class="btn block mt-2" style="background:#ff2e97" onclick="ExtendedFeatures.editDB('MISSIONS')">تعديل المهام <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg></button>
          
          <div class="sec-title">صلاحيات النظام</div>
          <button class="btn block mt-2" style="background:#b45cff" onclick="ExtendedFeatures.manageUsers()">إدارة مستخدمي النظام المتقدمة <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M20 21a8 8 0 0 0-16 0 M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg></button>
          
          <div id="devDbArea" style="margin-top:20px; display:none;">
            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
              <h3 id="devDbTitle" style="margin:0;">-</h3>
              <button class="btn sm" onclick="ExtendedFeatures.saveDB()">حفظ</button>
            </div>
            <textarea id="devDbJson" style="width:100%; height:300px; background:#000; color:#33ff9e; font-family:monospace; padding:10px; border-radius:8px; border:1px solid #33ff9e;"></textarea>
          </div>
        </div>
      `;
      scr.appendChild(d);
    }
    
    const origRender = window.AdminUI.render;
    window.AdminUI.render = function(s) {
      if(s === 'adm-dev') {
        document.getElementById('devDbArea').style.display = 'none';
        return;
      }
      return origRender ? origRender.apply(this, arguments) : null;
    }
  };
  
  window.ExtendedFeatures.editDB = function(type) {
    document.getElementById('devDbArea').style.display = 'block';
    document.getElementById('devDbTitle').innerText = 'تعديل ' + type;
    window.ExtendedFeatures.curDbType = type;
    
    let data = window[type];
    document.getElementById('devDbJson').value = JSON.stringify(data, null, 2);
  };
  
  window.ExtendedFeatures.saveDB = function() {
    try {
      const type = window.ExtendedFeatures.curDbType;
      const json = JSON.parse(document.getElementById('devDbJson').value);
      window[type] = json;
      window.toast && toast('تم تحديث ' + type + ' بنجاح <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>', 'good');
    } catch(e) {
      window.toast && toast('خطأ في صيغة الـ JSON <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M14.5 9.5l-9 9a2.12 2.12 0 1 0 3 3l9-9 M16 16l4.5 4.5 M20.5 3.5l-4.5 4.5 M8 8l-4.5-4.5 M3.5 20.5l4.5-4.5 M11.5 5.5l3 3 M15.5 8.5l3-3 M18.5 12.5l-3-3"/></svg>', 'err');
    }
  };
  
  window.ExtendedFeatures.manageUsers = function() {
    window.toast && toast('جارٍ تحميل وحدة المستخدمين المتطورة...', 'info');
    setTimeout(() => { if(window.CONSOLE) window.CONSOLE.go('players'); }, 1000);
  };
}
// --- Final Performance and UI Polish ---
(function() {
  const perfStyle = document.createElement('style');
  perfStyle.textContent = `
    /* Hardware acceleration for animations */
    .screen.active { transform: translateZ(0); will-change: transform, opacity; }
    .btn, .lux-tile, .menu-tile { will-change: transform; }
    
    /* Global scrollbar improvements */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
    ::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
    
    /* General body performance */
    body { text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; }
  `;
  document.head.appendChild(perfStyle);

  // Success Notification on load
  setTimeout(() => {
    if (window.toast) {
      window.toast('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em" style="vertical-align:text-bottom"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> تم تحديث الأنظمة بنجاح (PvP، الدردشة، الإدارة، الأداء)', 'good');
    }
  }, 1500);
})();
window.SVG = {
  star: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'1.2em\' height=\'1.2em\' style=\'vertical-align:text-bottom\'><path d=\'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z\'/></svg>',
  fire: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'1.2em\' height=\'1.2em\' style=\'vertical-align:text-bottom\'><path d=\'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z\'/></svg>',
  moon: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'1.2em\' height=\'1.2em\' style=\'vertical-align:text-bottom\'><path d=\'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6\'/></svg>',
  clock: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'1.2em\' height=\'1.2em\' style=\'vertical-align:text-bottom\'><path d=\'M12 22A10 10 0 1 0 12 2a10 10 0 0 0 0 20z M12 6v6l4 2\'/></svg>',
  gem: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'1.2em\' height=\'1.2em\' style=\'vertical-align:text-bottom\'><path d=\'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0\'/></svg>',
  gift: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'1.2em\' height=\'1.2em\' style=\'vertical-align:text-bottom\'><path d=\'M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8 M4 6h16v6H4z M12 22V6 M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z\'/></svg>',
  user: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'1.2em\' height=\'1.2em\' style=\'vertical-align:text-bottom\'><path d=\'M20 21a8 8 0 0 0-16 0 M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z\'/></svg>',
  coin: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'1.2em\' height=\'1.2em\' style=\'vertical-align:text-bottom\'><path d=\'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v12 M9 9h6 M9 15h6\'/></svg>',
  book: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'1.2em\' height=\'1.2em\' style=\'vertical-align:text-bottom\'><path d=\'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z\'/></svg>',
  sword: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'1.2em\' height=\'1.2em\' style=\'vertical-align:text-bottom\'><path d=\'M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2M8.5 6.5L21 19v3h-3L6.5 10.5M11 5L5 11M8 8L4 4M5 3L3 5\'/></svg>',
  moon: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'1.2em\' height=\'1.2em\' style=\'vertical-align:text-bottom\'><path d=\'M12 22A10 10 0 1 0 12 2a10 10 0 0 0 0 20z M12 6v6l4 2\'/></svg>',
  home: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'24\' height=\'24\'><path d=\'m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\'/><polyline points=\'9 22 9 12 15 12 15 22\'/></svg>',
  chars: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'24\' height=\'24\'><path d=\'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\'/><circle cx=\'9\' cy=\'7\' r=\'4\'/><path d=\'M22 21v-2a4 4 0 0 0-3-3.87\'/><path d=\'M16 3.13a4 4 0 0 1 0 7.75\'/></svg>',
  battle: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'24\' height=\'24\'><path d=\'M14.5 17.5L3 6V3h3l11.5 11.5\'/><path d=\'M13 19l6-6\'/><path d=\'M16 16l4 4\'/><path d=\'M19 21l2-2\'/><path d=\'M8.5 6.5L21 19v3h-3L6.5 10.5\'/><path d=\'M11 5L5 11\'/><path d=\'M8 8L4 4\'/><path d=\'M5 3L3 5\'/></svg>',
  shop: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'24\' height=\'24\'><path d=\'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z\'/><path d=\'M3 6h18\'/><path d=\'M16 10a4 4 0 0 1-8 0\'/></svg>',
  missions: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'24\' height=\'24\'><polygon points=\'12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2\'/></svg>',
  weapons: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'24\' height=\'24\'><path d=\'m14.5 9.5-9 9a2.12 2.12 0 1 0 3 3l9-9\'/><path d=\'m16 16 4.5 4.5\'/><path d=\'m20.5 3.5-4.5 4.5\'/><path d=\'m8 8-4.5-4.5\'/><path d=\'m3.5 20.5 4.5-4.5\'/><path d=\'m11.5 5.5 3 3\'/><path d=\'m15.5 8.5 3-3\'/><path d=\'m18.5 12.5-3-3\'/></svg>',
  skills: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'24\' height=\'24\'><path d=\'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z\'/></svg>',
  inventory: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'24\' height=\'24\'><path d=\'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\'/><polyline points=\'3.27 6.96 12 12.01 20.73 6.96\'/><line x1=\'12\' y1=\'22.08\' x2=\'12\' y2=\'12\'/></svg>',
  pvp: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'24\' height=\'24\'><circle cx=\'12\' cy=\'12\' r=\'10\'/><path d=\'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20\'/><path d=\'M2 12h20\'/></svg>',
  tournament: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'24\' height=\'24\'><path d=\'M6 9H4.5a2.5 2.5 0 0 1 0-5H6\'/><path d=\'M18 9h1.5a2.5 2.5 0 0 0 0-5H18\'/><path d=\'M4 22h16\'/><path d=\'M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22\'/><path d=\'M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22\'/><path d=\'M18 2H6v7a6 6 0 0 0 12 0V2Z\'/></svg>',
  ads: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'24\' height=\'24\'><polygon points=\'5 3 19 12 5 21 5 3\'/></svg>',
  guild: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'24\' height=\'24\'><path d=\'M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z\'/></svg>',
  leaderboard: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'24\' height=\'24\'><path d=\'M18 20V10\'/><path d=\'M12 20V4\'/><path d=\'M6 20v-4\'/></svg>',
  chat: '<svg viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' width=\'24\' height=\'24\'><path d=\'m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z\'/></svg>'
};

if (window.UI) {
  const origHud = window.UI.hud;
  window.UI.hud = function() {
    if(origHud) origHud.call(window.UI);
    const nav = document.getElementById('nav');
    if(nav && nav.dataset.enhanced !== '2') {
      nav.dataset.enhanced = '2';
      nav.innerHTML = `
        <style>
          .nav-i .ic svg { width: 24px; height: 24px; display: block; margin: 0 auto; margin-bottom: 2px; stroke-width: 1.5; }
        </style>
        <div class="nav-i on" data-s="home" onclick="UI.go('home')"><span class="ic">${window.SVG.home}</span><span class="lb">الرئيسية</span></div>
        <div class="nav-i" data-s="characters" onclick="UI.go('characters')"><span class="ic">${window.SVG.chars}</span><span class="lb">الأبطال</span></div>
        <div class="nav-i" data-s="battle-select" onclick="UI.go('battle-select')"><span class="ic">${window.SVG.battle}</span><span class="lb">قتال</span></div>
        <div class="nav-i" data-s="shop" onclick="UI.go('shop')"><span class="ic">${window.SVG.shop}</span><span class="lb">المتجر</span></div>
        <div class="nav-i" data-s="missions" onclick="UI.go('missions')"><span class="ic">${window.SVG.missions}</span><span class="lb">المهام</span></div>
      `;
    }
  };

  

window.UI.home = function() {
    const dailyReady = window.G.lastDaily !== window.todayKey();
    const teamPower = typeof window.teamPower === 'function' ? window.teamPower() : 0;
    const stage = window.G.stage || 1;
    const player = window.G.player || { name: 'Player' };
    
    let html = `
    <style>
      /* Base & Utilities */
      .home-wrapper {
        padding-bottom: 80px;
        color: #fff;
        overflow-x: hidden;
      }
      .sec-title {
        font-size: 18px; font-weight: 800; margin-bottom: 16px; 
        display: flex; align-items: center; gap: 10px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.5);
      }
      .sec-title .ic svg { width: 24px; height: 24px; stroke-width: 2; }
      
      .home-section {
        padding: 24px 16px;
        margin-bottom: 8px;
        border-radius: 24px;
        position: relative;
        overflow: hidden;
      }
      .home-section::before {
        content: ''; position: absolute; top:0; left:0; right:0; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      }

      /* 1. Hero Carousel */
      .hero-carousel {
        position: relative; width: 100%; height: 220px; 
        border-radius: 24px; overflow: hidden;
        margin: 16px 0;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        display: flex; scroll-snap-type: x mandatory;
        overflow-x: auto; scroll-behavior: smooth;
        direction: ltr; /* Force LTR for predictable scrolling math */
      }
      .hero-carousel::-webkit-scrollbar { display: none; }
      .hero-slide {
        flex: 0 0 100%; height: 100%; scroll-snap-align: center;
        position: relative;
        display: flex; flex-direction: column; justify-content: flex-end;
        padding: 24px; direction: rtl; /* Reset direction */
      }
      .hero-slide::after {
        content: ''; position: absolute; top:0; left:0; right:0; bottom:0;
        background: linear-gradient(0deg, rgba(10,10,20,0.9) 0%, transparent 60%);
        z-index: 1;
      }
      .hero-slide-content { position: relative; z-index: 2; }
      .hero-slide-content h2 { margin: 0 0 8px 0; font-size: 24px; font-weight: 900; color: #fff; text-shadow: 0 2px 10px rgba(0,0,0,0.8); }
      .hero-slide-content p { margin: 0 0 12px 0; font-size: 13px; color: #ddd; max-width: 80%; }
      .hero-dots {
        position: absolute; bottom: 12px; left: 0; right: 0;
        display: flex; justify-content: center; gap: 6px; z-index: 3; pointer-events: none;
      }
      .hero-dot { width: 8px; height: 8px; border-radius: 4px; background: rgba(255,255,255,0.3); transition: 0.3s; }
      .hero-dot.active { width: 24px; background: #ff2e5b; }

      /* Player Mini Profile overlay on hero */
      .hero-profile {
        position: absolute; top: 16px; left: 16px; right: 16px; z-index: 2;
        display: flex; justify-content: space-between; align-items: center;
      }
      .hero-profile .name-badge { background: rgba(0,0,0,0.5); padding: 4px 12px; border-radius: 20px; backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.1); font-size:13px; font-weight:bold; }
      .hero-profile .power-badge { background: rgba(255,215,0,0.2); color: gold; padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(255,215,0,0.3); font-size:13px; font-weight:bold; }

      /* 2. Shortcuts Ribbon */
      .shortcuts-ribbon {
        display: flex; gap: 12px; overflow-x: auto; padding: 0 16px 20px 16px;
        scroll-snap-type: x mandatory; margin: 0 -16px; direction: ltr; /* Force LTR for flex direction predictability */
      }
      .shortcuts-ribbon::-webkit-scrollbar { display: none; }
      .shortcut-btn {
        flex: 0 0 75px; height: 75px; scroll-snap-align: start;
        background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
        border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center;
        transition: 0.3s; backdrop-filter: blur(10px); direction: rtl;
      }
      .shortcut-btn:active { transform: scale(0.9); background: rgba(255,255,255,0.1); }
      .shortcut-btn .ic { color: var(--c); margin-bottom: 6px; }
      .shortcut-btn .ic svg { width: 28px; height: 28px; }
      .shortcut-btn .lb { font-size: 11px; font-weight: 700; color: #ccc; }

      /* 3. Current Events */
      .event-cards { display: flex; flex-direction: column; gap: 12px; }
      .event-card {
        background: linear-gradient(135deg, rgba(255,46,91,0.2), rgba(20,20,30,0.8));
        border: 1px solid rgba(255,46,91,0.3); border-radius: 16px;
        padding: 16px; display: flex; align-items: center; justify-content: space-between;
        box-shadow: 0 8px 20px rgba(0,0,0,0.3);
      }
      .event-card-info h4 { margin: 0 0 6px 0; font-size: 16px; color: #fff; }
      .event-card-info .timer { font-size: 12px; color: #ff2e5b; font-weight: bold; display: flex; align-items:center; gap:4px; }
      
      /* 4. Featured Characters */
      .featured-chars {
        display: flex; gap: 16px; overflow-x: auto; padding-bottom: 16px; scroll-snap-type: x mandatory; margin: 0 -16px; padding: 0 16px 16px 16px; direction: ltr;
      }
      .featured-chars::-webkit-scrollbar { display: none; }
      .feat-char-card {
        flex: 0 0 140px; height: 180px; scroll-snap-align: start; direction: rtl;
        border-radius: 20px; position: relative; overflow: hidden;
        border: 1px solid rgba(162,75,255,0.3);
        box-shadow: 0 8px 20px rgba(162,75,255,0.15);
      }
      .feat-char-bg {
        position: absolute; top:0; left:0; width:100%; height:100%;
        background: linear-gradient(180deg, transparent, rgba(10,10,20,0.95)), url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" opacity="0.1"><path d="M0 0l50 50-50 50z" fill="%23fff"/></svg>');
        background-size: cover;
      }
      .feat-char-content { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; padding: 16px; text-align: center; }
      .feat-char-content .emo { font-size: 48px; margin-bottom: 10px; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.5)); }
      .feat-char-content .emo svg { width: 48px; height: 48px; }
      .feat-char-content h4 { margin: 0 0 4px 0; font-size: 15px; font-weight: 800; color: #fff; }
      .feat-char-content .stars { color: gold; font-size: 12px; letter-spacing: 2px; }

      /* 5. Special Offers */
      .offer-card {
        background: linear-gradient(135deg, rgba(255,200,68,0.1), rgba(0,0,0,0.6));
        border: 1px dashed rgba(255,200,68,0.5); border-radius: 20px;
        padding: 20px; position: relative; overflow: hidden;
        display: flex; justify-content: space-between; align-items: center;
      }
      .offer-badge {
        position: absolute; top: -10px; right: -10px; background: #ff2e5b; color: #fff;
        font-weight: 900; font-size: 14px; padding: 20px 20px 8px 20px; transform: rotate(45deg);
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
      }
      
      /* 6. Game Modes */
      .modes-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
      .mode-card {
        height: 100px; border-radius: 20px; position: relative; overflow: hidden;
        display: flex; align-items: center; padding: 20px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.05);
      }
      .mode-card::before {
        content: ''; position: absolute; right: -20px; top: -20px; width: 100px; height: 100px;
        background: radial-gradient(circle, var(--c) 0%, transparent 70%); opacity: 0.3;
      }
      .mode-card .ic { font-size: 40px; color: var(--c); margin-left: 20px; z-index:2; }
      .mode-card .ic svg { width: 48px; height: 48px; }
      .mode-info { z-index:2; flex:1; }
      .mode-info h4 { margin: 0 0 4px 0; font-size: 20px; font-weight: 900; }
      .mode-info p { margin: 0; font-size: 13px; color: #aaa; }
      
      /* 7. Daily Missions */
      .mission-item {
        background: rgba(0,0,0,0.4); border-radius: 16px; padding: 12px 16px;
        display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;
        border: 1px solid rgba(255,46,151,0.2);
      }
      .mission-prog { background: rgba(255,255,255,0.1); height: 6px; border-radius: 3px; width: 100px; overflow: hidden; margin-top: 6px; }
      .mission-prog-fill { background: #ff2e97; height: 100%; border-radius: 3px; }
      
      /* 8. Chests & Rewards */
      .chests-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .chest-card {
        background: rgba(255,215,0,0.05); border: 1px solid rgba(255,215,0,0.2);
        border-radius: 16px; padding: 20px; text-align: center;
      }
      .chest-card .ic { font-size: 40px; filter: drop-shadow(0 4px 10px rgba(255,215,0,0.4)); margin-bottom: 10px; }
      .chest-card .ic svg { width: 40px; height: 40px; }
      
      /* 9. Top Heroes */
      .top-heroes { display: flex; gap: 12px; }
      .top-hero-card {
        flex: 1; background: rgba(0,0,0,0.5); border-radius: 16px; padding: 12px; text-align: center;
        border: 1px solid rgba(56,182,255,0.2);
      }
      .top-hero-card .rank { background: #38b6ff; color: #000; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 10px; display: inline-block; margin-bottom: 8px; }
      .top-hero-card .emo svg { width: 32px; height: 32px; }
      
      /* 10. Quick Shop */
      .quick-shop { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
      .qshop-item { background: rgba(255,138,0,0.1); border-radius: 12px; padding: 12px; text-align: center; border: 1px solid rgba(255,138,0,0.2); }
      .qshop-item .price { color: gold; font-weight: bold; font-size: 12px; margin-top: 6px; }
      .qshop-item svg { width: 24px; height: 24px; }
      
      /* 11. News */
      .news-item { padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; gap: 12px; align-items: center; }
      .news-item:last-child { border-bottom: none; }
      .news-date { font-size: 11px; color: #33ff9e; font-weight: bold; background: rgba(51,255,158,0.1); padding: 4px 8px; border-radius: 8px; white-space:nowrap; }
    </style>
    
    <div class="home-wrapper">
      
      <!-- 1. Hero Carousel -->
      <div class="hero-carousel" id="homeCarousel" onscroll="handleCarouselScroll(this)">
        
        <!-- Slide 1 -->
        <div class="hero-slide" style="background: linear-gradient(45deg, #1a0b2e, #4a154b);">
          <div class="hero-profile">
            <div class="power-badge">${window.SVG.star || '⭐'} ${window.fmt(teamPower)}</div>
            <div class="name-badge">${player.name}</div>
          </div>
          <div class="hero-slide-content">
            <h2>مغامرة جديدة تنتظرك!</h2>
            <p>اكتشف عوالم الأنمي وواجه أقوى الزعماء في المرحلة ${stage}</p>
            <button class="btn gold" style="padding: 8px 20px; font-size:14px;" onclick="UI.go('battle-select')">العب الآن</button>
          </div>
        </div>
        
        <!-- Slide 2 -->
        <div class="hero-slide" style="background: linear-gradient(45deg, #2e0b16, #4b1515);">
          <div class="hero-profile">
            <div class="power-badge">${window.SVG.star || '⭐'} ${window.fmt(teamPower)}</div>
            <div class="name-badge">${player.name}</div>
          </div>
          <div class="hero-slide-content">
            <h2>تحديات حماية الأصناف النباتية</h2>
            <p>أثبت قوتك في ساحة المعركة ضد لاعبين آخرين</p>
            <button class="btn cyan" style="padding: 8px 20px; font-size:14px;" onclick="UI.go('pvp')">دخول الحلبة</button>
          </div>
        </div>
        
        <!-- Slide 3 -->
        <div class="hero-slide" style="background: linear-gradient(45deg, #0b2e1b, #154b38);">
          <div class="hero-profile">
            <div class="power-badge">${window.SVG.star || '⭐'} ${window.fmt(teamPower)}</div>
            <div class="name-badge">${player.name}</div>
          </div>
          <div class="hero-slide-content">
            <h2>عروض المتجر المذهلة</h2>
            <p>احصل على أفضل الأبطال والأسلحة بأسعار مخفضة لفترة محدودة</p>
            <button class="btn green" style="padding: 8px 20px; font-size:14px;" onclick="UI.go('shop')">زيارة المتجر</button>
          </div>
        </div>
        
      </div>
      <div class="hero-dots" id="homeCarouselDots">
        <span class="hero-dot active"></span>
        <span class="hero-dot"></span>
        <span class="hero-dot"></span>
      </div>

      <!-- 2. Shortcuts Ribbon -->
      <div class="shortcuts-ribbon" id="shortcutsRibbon">
        ${[
          {id:'chat', ic: window.SVG.chat, lb: 'الدردشة', c: '#ff2e97'},
          {id:'leaderboard', ic: window.SVG.leaderboard, lb: 'الترتيب', c: '#ffc844'},
          {id:'guild', ic: window.SVG.guild, lb: 'النقابة', c: '#b45cff'},
          {id:'inventory', ic: window.SVG.inventory, lb: 'الحقيبة', c: '#33ff9e'},
          {id:'skills', ic: window.SVG.skills, lb: 'المهارات', c: '#ff8a00'},
          {id:'weapons', ic: window.SVG.weapons, lb: 'الأسلحة', c: '#38b6ff'},
          {id:'characters', ic: window.SVG.chars, lb: 'الأبطال', c: '#a24bff'}
        ].map(s => `
          <div class="shortcut-btn" style="--c:${s.c}" onclick="UI.go('${s.id}')">
            <span class="ic">${s.ic}</span>
            <span class="lb">${s.lb}</span>
          </div>
        `).join('')}
      </div>

      <!-- 3. Current Events -->
      <div class="home-section" style="background: rgba(255,46,91,0.05);">
        <div class="sec-title" style="color: #ff2e5b;"><span class="ic">${window.SVG.fire || '🔥'}</span> الأحداث الحالية</div>
        <div class="event-cards">
          <div class="event-card" onclick="UI.go('tourney')">
            <button class="btn sm" style="background: rgba(255,46,91,0.2); border: 1px solid #ff2e5b; color: #ff2e5b;">مشاركة</button>
            <div class="event-card-info" style="text-align:right;">
              <h4>بطولة زعماء الأنمي</h4>
              <div class="timer">${window.SVG.moon || '⏳'} ينتهي بعد: 12:45:30</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Featured Characters -->
      <div class="home-section" style="background: rgba(162,75,255,0.05);">
        <div class="sec-title" style="color: #a24bff;"><span class="ic">${window.SVG.star || '✨'}</span> أبطال مميزون للرول</div>
        <div class="featured-chars" id="featuredCharsRibbon">
          ${(window.CHARACTERS || []).slice().reverse().slice(0, 5).map(c => `
            <div class="feat-char-card" onclick="UI.go('characters')">
              <div class="feat-char-bg" style="background-color: ${window.E_COLORS ? window.E_COLORS[c.element] : '#222'};"></div>
              <div class="feat-char-content">
                <div class="emo">${c.emoji || '🥷'}</div>
                <h4>${c.name}</h4>
                <div class="stars">★★★★★</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 5. Special Offers -->
      <div class="home-section" style="background: rgba(255,200,68,0.05);">
        <div class="sec-title" style="color: #ffc844;"><span class="ic">${window.SVG.shop || '💎'}</span> العروض الخاصة</div>
        <div class="offer-card" onclick="UI.go('shop')">
          <button class="btn gold" style="min-width: 70px;">شراء</button>
          <div style="text-align:right;">
            <h4 style="margin:0 0 8px 0; font-size:18px; color: #ffc844;">باقة الأسطورة</h4>
            <p style="margin:0; font-size:13px; color:#ddd;">احصل على بطل أسطوري عشوائي مع 5000 جوهرة!</p>
          </div>
          <div class="offer-badge">-50%</div>
        </div>
      </div>

      <!-- 6. Game Modes -->
      <div class="home-section" style="background: rgba(0,255,200,0.05);">
        <div class="sec-title" style="color: #00ffc8;"><span class="ic">${window.SVG.battle || '⚔️'}</span> أنماط اللعب</div>
        <div class="modes-grid">
          <div class="mode-card" style="--c:#ff2e5b; background: linear-gradient(90deg, rgba(255,46,91,0.1), rgba(0,0,0,0.5));" onclick="UI.go('battle-select')">
            <span class="ic">${window.SVG.battle || '💥'}</span>
            <div class="mode-info" style="text-align:right; margin-right:16px;">
              <h4 style="color:#ff2e5b;">القصة الرئيسية</h4>
              <p>تابع القصة واهزم الزعماء وتطور</p>
            </div>
          </div>
          <div class="mode-card" style="--c:#ff4b4b; background: linear-gradient(90deg, rgba(255,75,75,0.1), rgba(0,0,0,0.5));" onclick="UI.go('pvp')">
            <span class="ic">${window.SVG.pvp || '⚔️'}</span>
            <div class="mode-info" style="text-align:right; margin-right:16px;">
              <h4 style="color:#ff4b4b;">أرينا PvP</h4>
              <p>تحدى لاعبين آخرين حول العالم</p>
            </div>
          </div>
          <div class="mode-card" style="--c:#ffb020; background: linear-gradient(90deg, rgba(255,176,32,0.1), rgba(0,0,0,0.5));" onclick="UI.go('tourney')">
            <span class="ic">${window.SVG.tournament || '🏆'}</span>
            <div class="mode-info" style="text-align:right; margin-right:16px;">
              <h4 style="color:#ffb020;">البطولات</h4>
              <p>شارك في البطولات الأسبوعية الكبرى</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 7. Daily Missions -->
      <div class="home-section" style="background: rgba(255,46,151,0.05);">
        <div class="sec-title" style="color: #ff2e97;"><span class="ic">${window.SVG.missions || '🎯'}</span> المهام اليومية</div>
        <div class="mission-item" onclick="UI.go('missions')">
          <div style="color:gold; font-weight:bold; font-size:13px;">+50 ${window.SVG.gem || '💎'}</div>
          <div style="text-align:right;">
            <div style="font-size:14px; font-weight:bold;">العب 3 مباريات أرينا</div>
            <div class="mission-prog" style="margin-left:auto;"><div class="mission-prog-fill" style="width:66%;"></div></div>
          </div>
        </div>
        <div class="mission-item" onclick="UI.go('missions')">
          <div style="color:gold; font-weight:bold; font-size:13px;">+200 ${window.SVG.coin || '🪙'}</div>
          <div style="text-align:right;">
            <div style="font-size:14px; font-weight:bold;">طور بطلاً لمرة واحدة</div>
            <div class="mission-prog" style="margin-left:auto;"><div class="mission-prog-fill" style="width:0%;"></div></div>
          </div>
        </div>
        <button class="btn block" style="margin-top:12px; background: rgba(255,46,151,0.1); border: 1px solid rgba(255,46,151,0.3); color: #ff2e97;" onclick="UI.go('missions')">عرض كل المهام</button>
      </div>

      <!-- 8. Chests & Rewards -->
      <div class="home-section" style="background: rgba(255,215,0,0.05);">
        <div class="sec-title" style="color: #ffd700;"><span class="ic">${window.SVG.gift || '🎁'}</span> الصناديق والمكافآت</div>
        <div class="chests-grid">
          <div class="chest-card" onclick="UI.go('shop')">
            <div class="ic">${window.SVG.gift || '🎁'}</div>
            <div style="font-size:13px; font-weight:bold;">صندوق عادي</div>
            <div style="color:#33ff9e; font-size:11px; margin-top:4px;">متاح الآن!</div>
          </div>
          <div class="chest-card" onclick="UI.go('shop')">
            <div class="ic">${window.SVG.gift || '🎁'}</div>
            <div style="font-size:13px; font-weight:bold;">صندوق أسطوري</div>
            <div style="color:#aaa; font-size:11px; margin-top:4px;">احصل على مفتاح</div>
          </div>
        </div>
      </div>

      <!-- 9. Most Used Heroes -->
      <div class="home-section" style="background: rgba(56,182,255,0.05);">
        <div class="sec-title" style="color: #38b6ff;"><span class="ic">${window.SVG.user || '👤'}</span> فريقك الأقوى</div>
        <div class="top-heroes">
          ${window.G.team.length ? window.G.team.slice(0,3).map((id, i) => {
            const c = (window.CHARACTERS||[]).find(x => x.id === id) || {name: 'مجهول', emoji: window.SVG.user};
            return `
              <div class="top-hero-card" onclick="UI.go('characters')">
                <div class="rank">#${i+1}</div>
                <div class="emo" style="font-size:32px; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));">${c.emoji}</div>
                <div style="font-size:12px; font-weight:bold; margin-top:6px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${c.name}</div>
              </div>
            `;
          }).join('') : '<div style="color:#aaa; text-align:center; width:100%;">لا يوجد فريق محدد</div>'}
        </div>
      </div>

      <!-- 10. Quick Shop -->
      <div class="home-section" style="background: rgba(255,138,0,0.05);">
        <div class="sec-title" style="color: #ff8a00;"><span class="ic">${window.SVG.coin || '🪙'}</span> المتجر السريع</div>
        <div class="quick-shop">
          <div class="qshop-item" onclick="UI.go('shop')">
            <div style="font-size:24px; color:#ffc844;">${window.SVG.gem || '💎'}</div>
            <div style="font-size:11px; font-weight:bold; margin-top:4px;">100 جوهرة</div>
            <div class="price">$0.99</div>
          </div>
          <div class="qshop-item" onclick="UI.go('shop')">
            <div style="font-size:24px; color:gold;">${window.SVG.coin || '🪙'}</div>
            <div style="font-size:11px; font-weight:bold; margin-top:4px;">5000 عملة</div>
            <div class="price">$1.99</div>
          </div>
          <div class="qshop-item" onclick="UI.go('shop')">
            <div style="font-size:24px; color:#ff2e5b;">${window.SVG.gift || '🎁'}</div>
            <div style="font-size:11px; font-weight:bold; margin-top:4px;">حزمة المبتدئين</div>
            <div class="price">$4.99</div>
          </div>
        </div>
      </div>

      <!-- 11. Latest News -->
      <div class="home-section" style="background: rgba(51,255,158,0.05);">
        <div class="sec-title" style="color: #33ff9e;"><span class="ic">${window.SVG.book || '📰'}</span> آخر التحديثات</div>
        <div class="news-item">
          <span style="font-size:13px; text-align:right; flex:1;">إطلاق بطولة الشتاء الكبرى مع جوائز مضاعفة!</span>
          <span class="news-date">اليوم</span>
        </div>
        <div class="news-item">
          <span style="font-size:13px; text-align:right; flex:1;">تمت إضافة 3 أبطال جدد إلى المتجر.</span>
          <span class="news-date" style="background: rgba(255,255,255,0.1); color:#aaa;">أمس</span>
        </div>
        <div class="news-item">
          <span style="font-size:13px; text-align:right; flex:1;">تحديث التوازن للأبطال والأسلحة النادرة.</span>
          <span class="news-date" style="background: rgba(255,255,255,0.1); color:#aaa;">منذ 3 أيام</span>
        </div>
      </div>

    </div>
    `;

    const homeBody = document.getElementById('homeBody');
    if(homeBody) {
      homeBody.innerHTML = html;
      setTimeout(window.initHomeAnimations, 100);
    }
};

window.handleCarouselScroll = function(el) {
  const scrollLeft = el.scrollLeft;
  const width = el.offsetWidth;
  // Because direction is LTR, scrollLeft goes from 0 to max positive.
  const index = Math.round(scrollLeft / width);
  const dots = document.querySelectorAll('#homeCarouselDots .hero-dot');
  if(dots && dots.length > index) {
    dots.forEach(d => d.classList.remove('active'));
    dots[index].classList.add('active');
  }
};

window.initHomeAnimations = function() {
  if (window.homeAnimIntervals) {
    window.homeAnimIntervals.forEach(clearInterval);
  }
  window.homeAnimIntervals = [];

  // 1. Hero Carousel Auto-scroll
  const carousel = document.getElementById('homeCarousel');
  if (carousel) {
    let slideIdx = 0;
    const maxSlides = 3; 
    let carouselInt = setInterval(() => {
      slideIdx = (slideIdx + 1) % maxSlides;
      carousel.scrollTo({ left: slideIdx * carousel.offsetWidth, behavior: 'smooth' });
    }, 5000);
    window.homeAnimIntervals.push(carouselInt);
    
    const pause = () => clearInterval(carouselInt);
    const resume = () => {
      clearInterval(carouselInt);
      carouselInt = setInterval(() => {
        const currentIdx = Math.round(carousel.scrollLeft / carousel.offsetWidth);
        slideIdx = (currentIdx + 1) % maxSlides;
        carousel.scrollTo({ left: slideIdx * carousel.offsetWidth, behavior: 'smooth' });
      }, 5000);
      window.homeAnimIntervals.push(carouselInt);
    };
    carousel.addEventListener('touchstart', pause);
    carousel.addEventListener('touchend', resume);
  }

  // 2. Featured Characters Auto-scroll
  const featChars = document.getElementById('featuredCharsRibbon');
  if (featChars) {
    let scrollDir = 1;
    let charInt = setInterval(() => {
      if(featChars.scrollLeft >= (featChars.scrollWidth - featChars.offsetWidth - 10)) {
        scrollDir = -1;
      } else if(featChars.scrollLeft <= 10) {
        scrollDir = 1;
      }
      featChars.scrollTo({ left: featChars.scrollLeft + (150 * scrollDir), behavior: 'smooth' });
    }, 3000);
    window.homeAnimIntervals.push(charInt);

    const pauseC = () => clearInterval(charInt);
    const resumeC = () => {
      clearInterval(charInt);
      charInt = setInterval(() => {
        if(featChars.scrollLeft >= (featChars.scrollWidth - featChars.offsetWidth - 10)) {
          scrollDir = -1;
        } else if(featChars.scrollLeft <= 10) {
          scrollDir = 1;
        }
        featChars.scrollTo({ left: featChars.scrollLeft + (150 * scrollDir), behavior: 'smooth' });
      }, 3000);
      window.homeAnimIntervals.push(charInt);
    };
    featChars.addEventListener('touchstart', pauseC);
    featChars.addEventListener('touchend', resumeC);
  }
};
}

(function initGlobalBackButton() {
  const gBackBtn = document.createElement('div');
  gBackBtn.id = 'globalBackButton';
  gBackBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="1.2em" height="1.2em"><path d="M9 18l6-6-6-6"/></svg>';
  gBackBtn.style.cssText = 'position:fixed; top:15px; right:15px; z-index:999999; width:38px; height:38px; border-radius:12px; background:rgba(0,0,0,0.5); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.2); display:none; place-items:center; cursor:pointer; color:#fff; font-size:22px; transition:all 0.2s; box-shadow:0 4px 15px rgba(0,0,0,0.5);';
  
  gBackBtn.onclick = function() {
     const m = document.getElementById('modal');
     if(m && m.style.display === 'flex') {
        if(window.UI && window.UI.closeModal) window.UI.closeModal();
     } else {
        if(window.UI && window.UI.go) window.UI.go('home');
        else if(window.navigate) window.navigate('home');
     }
  };
  gBackBtn.onmousedown = () => gBackBtn.style.transform = 'scale(0.85)';
  gBackBtn.onmouseup = () => gBackBtn.style.transform = 'scale(1)';
  document.body.appendChild(gBackBtn);

  function checkBackBtnVisibility() {
     const m = document.getElementById('modal');
     const isModalOpen = m && m.style.display === 'flex';
     let activeScreen = 'home';
     const activeEl = document.querySelector('.screen.active');
     if(activeEl) activeScreen = activeEl.id;

     const mainPages = ['home', 'splash', 'battle-select', 'characters', 'shop', 'missions', 'battle'];
     if(isModalOpen || !mainPages.includes(activeScreen)) {
        gBackBtn.style.display = 'grid';
     } else {
        gBackBtn.style.display = 'none';
     }
  }

  // Hook directly into DOM changes or UI methods
  if(window.UI) {
     const oGo = window.UI.go;
     window.UI.go = function() {
       if(oGo) oGo.apply(this, arguments);
       setTimeout(checkBackBtnVisibility, 50);
     };
     const oOpen = window.UI.openModal;
     window.UI.openModal = function() {
       if(oOpen) oOpen.apply(this, arguments);
       setTimeout(checkBackBtnVisibility, 50);
     };
     const oClose = window.UI.closeModal;
     window.UI.closeModal = function() {
       if(oClose) oClose.apply(this, arguments);
       setTimeout(checkBackBtnVisibility, 50);
     };
  }
  const oNav = window.navigate;
  if(oNav) {
     window.navigate = function() {
       oNav.apply(this, arguments);
       setTimeout(checkBackBtnVisibility, 50);
     };
  }
  
  setInterval(checkBackBtnVisibility, 500);
})();


// Starter Character Logic
window.addEventListener('load', () => {
    setTimeout(() => {
        if (window.G && window.G.chars && Object.keys(window.G.chars).length === 0) {
            showStarterSelection();
        }
    }, 1500);
});

function showStarterSelection() {
    const starters = ['goku', 'naruto', 'luffy', 'ichigo', 'gojo', 'tanjiro', 'levi', 'eren', 'sukuna', 'kakashi'];
    let html = '<div style="text-align:center; padding:10px;"><h2 style="color:var(--neon-cyan); margin-bottom:15px; font-family:\'Orbitron\', sans-serif;">اختر بطلك الأول</h2>';
    html += '<p style="opacity:0.8; font-size:13px; margin-bottom:20px;">هذه الشخصيات الأسطورية متاحة لك. اختر واحداً لتبدأ رحلتك!</p>';
    html += '<div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(100px, 1fr)); gap:10px;">';
    
    starters.forEach(id => {
        if(window.CMAP && CMAP[id]) {
            const def = CMAP[id];
            const emo = def.photo ? `<img src="${def.photo}" style="width:100%; height:100%; object-fit:cover; position:absolute; inset:0; z-index:1; border-radius:12px;">` : `<div class="aura"></div><span class="emo" style="font-size:35px; z-index:2; position:relative;">${def.emoji}</span>`;
            html += `
                <div onclick="selectStarter('${id}')" style="cursor:pointer; background:rgba(0,0,0,0.5); border:1px solid var(--neon-${def.rarity==='mythic'?'pink':'cyan'}); border-radius:12px; padding:10px; position:relative; overflow:hidden; aspect-ratio:1/1.2; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                    ${emo}
                    <div style="position:absolute; bottom:0; left:0; right:0; background:rgba(0,0,0,0.7); padding:5px; z-index:3; font-size:11px; font-weight:bold;">${def.name}</div>
                </div>
            `;
        }
    });
    
    html += '</div></div>';
    
    // Create fullscreen overlay
    const overlay = document.createElement('div');
    overlay.id = 'starterOverlay';
    overlay.style.cssText = 'position:fixed; inset:0; z-index:99999; background:var(--bg-0); overflow-y:auto; padding:20px;';
    overlay.innerHTML = html;
    document.body.appendChild(overlay);
}

window.selectStarter = function(id) {
    if(window.grantChar) {
        grantChar(id, false); // Grant the selected starter
        
        // As a bonus for first time, also grant the other 9? 
        // "جاهزة ومفتوحة للاستخدام مباشرة" -> yes, let's just grant all 10 to be safe!
        const starters = ['goku', 'naruto', 'luffy', 'ichigo', 'gojo', 'tanjiro', 'levi', 'eren', 'sukuna', 'kakashi'];
        starters.forEach(s => {
            if(s !== id && !window.G.chars[s]) {
                grantChar(s, true); // silent grant
            }
        });
        
        window.G.team = [id]; // Set as first in team
        save();
        document.getElementById('starterOverlay').remove();
        if(window.UI && window.UI.home) UI.home();
        if(window.toast) toast('تم إضافة 10 شخصيات أساسية إلى حسابك!', 'good');
    }
};


// Override AI Character Generator to just take nameAr, nameEn, photo and auto-generate!
if (window.AdminUI) {
    const originalAiGenerate = AdminUI.aiGenerateModal;
    AdminUI.aiGenerateModal = function(type) {
        if(type === 'char') {
            const html = `
              <div style="padding:10px; text-align:right;">
                 <p style="opacity:0.8; font-size:12px; margin-bottom:15px;">أدخل البيانات الأساسية، وسيقوم النظام بتجهيز المهارات والتطورات والأسلحة تلقائياً بلمسة زر.</p>
                 <label style="display:block; margin-bottom:10px;">
                    <b>الاسم بالعربي:</b>
                    <input type="text" id="aiCharNameAr" class="searchbar" placeholder="مثال: غوكو" style="width:100%; margin-top:5px; padding:10px; border-radius:12px;">
                 </label>
                 <label style="display:block; margin-bottom:10px;">
                    <b>الاسم بالإنجليزي:</b>
                    <input type="text" id="aiCharNameEn" class="searchbar" placeholder="مثال: Goku" style="width:100%; margin-top:5px; padding:10px; border-radius:12px;">
                 </label>
                 <label style="display:block; margin-bottom:15px;">
                    <b>رابط الصورة (مستحسن بخلفية شفافة):</b>
                    <input type="text" id="aiCharImg" class="searchbar" placeholder="https://..." style="width:100%; margin-top:5px; padding:10px; border-radius:12px;">
                 </label>
                 <button class="btn block cyan" onclick="ExtendedFeatures.processAutoChar()">إنشاء الشخصية وتجهيزها</button>
                 <button class="btn block ghost" style="margin-top:8px" onclick="UI.closeModal()">إلغاء</button>
              </div>
            `;
            UI.openModal('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="1em" height="1em" style="vertical-align:text-bottom"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> إنشاء شخصية سريع', html);
        } else {
            if(originalAiGenerate) originalAiGenerate.call(AdminUI, type);
        }
    };
}

window.ExtendedFeatures.processAutoChar = function() {
    const ar = document.getElementById('aiCharNameAr').value.trim();
    const en = document.getElementById('aiCharNameEn').value.trim();
    const img = document.getElementById('aiCharImg').value.trim();
    
    if(!ar || !en || !img) {
        toast('يرجى ملء جميع الحقول', 'bad');
        return;
    }
    
    const id = en.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    const newChar = {
        id: id,
        name: ar,
        en: en,
        anime: 'Auto-Generated',
        emoji: '🌟',
        rarity: 'mythic',
        element: 'energy',
        desc: 'شخصية أسطورية تمت إضافتها حديثاً وتتميز بقدرات فريدة في المعارك.',
        base: { hp: 5500, atk: 850, def: 420, spd: 320, energy: 100 },
        weapon: 'w_fist',
        skills: [
            {n: 'هجوم سريع', d: 'ضربة سريعة للخصم', ic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>', m: 1.1, c: 0, t: 'attack'},
            {n: 'هجوم قوي', d: 'ضربة مدمرة بالطاقة', ic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2v20 M2 12h20 M4.93 4.93l14.14 14.14 M4.93 19.07L19.07 4.93"/></svg>', m: 1.8, c: 3, t: 'attack'},
            {n: 'طاقة إضافية', d: 'يزيد قوة الهجوم', ic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>', m: 0, c: 4, t: 'buff', fx:{atk:0.3, turns:3}},
            {n: 'الضربة القاضية', d: 'حركة نهائية تقضي على الخصم', ic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2M8.5 6.5L21 19v3h-3L6.5 10.5M11 5L5 11M8 8L4 4M5 3L3 5"/></svg>', m: 3.5, c: 0, t: 'ultimate'}
        ],
        forms: [
            {n: 'أساسي', emo: '🌟', mult: 1, lv: 1, photo: img},
            {n: 'التطور الأول', emo: '🔥', mult: 1.4, lv: 20, photo: img},
            {n: 'التطور النهائي', emo: '⚡', mult: 2.0, lv: 50, photo: img}
        ],
        media: {
            card: img,
            full: img,
            battle: img
        }
    };
    
    if (window.CHARACTERS) {
         const existingIdx = window.CHARACTERS.findIndex(c => c.id === id);
         if (existingIdx >= 0) {
             window.CHARACTERS[existingIdx] = newChar;
         } else {
             window.CHARACTERS.push(newChar);
         }
    }
    
    if (window.ADMIN && ADMIN.db) {
        ADMIN.db.chars = ADMIN.db.chars || [];
        const existingAdmIdx = ADMIN.db.chars.findIndex(c => c.id === id);
        if (existingAdmIdx >= 0) {
            ADMIN.db.chars[existingAdmIdx] = newChar;
        } else {
            ADMIN.db.chars.push(newChar);
        }
        ADMIN.save();
    }
    
    if (window.CMAP) {
        window.CMAP[id] = newChar;
    }
    
    window.UI.closeModal();
    toast('تم إضافة الشخصية وتجهيز كافة مهاراتها وتطويراتها تلقائياً!', 'good');
    if (window.AdminUI && AdminUI.chars) AdminUI.chars();
};
