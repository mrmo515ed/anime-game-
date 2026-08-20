(function() {
  const Cloud = window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.isVersionAtLeast && window.Telegram.WebApp.isVersionAtLeast("6.9") ? window.Telegram.WebApp.CloudStorage : null;
  let saveTimeout;
  
  // Override save
  const origSave = window.save;
  window.save = function() {
    try {
      localStorage.setItem('animePlayer', JSON.stringify(window.G));
    } catch(e) {}
    
    if (Cloud) {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
         Cloud.setItem('animePlayer', JSON.stringify(window.G), (err, success) => {
           if (err) console.error('Cloud save failed', err);
         });
      }, 2000);
    }
  };
  
  // Override load
  window.load = function(callback) {
    // 1. Sync load from local first so UI can start immediately
    try {
      const raw = localStorage.getItem('animePlayer');
      if(raw) {
         window.G = Object.assign(window.defaultSave(), JSON.parse(raw));
         window.G.player = Object.assign(window.defaultSave().player, window.G.player || {});
         window.G.cur = Object.assign(window.defaultSave().cur, window.G.cur || {});
         window.G.stats = Object.assign(window.defaultSave().stats, window.G.stats || {});
         window.G.settings = Object.assign(window.defaultSave().settings, window.G.settings || {});
         window.G.missions = Object.assign(window.defaultSave().missions, window.G.missions || {});
      } else {
         window.G = window.defaultSave();
      }
    } catch(e) {
      window.G = window.defaultSave();
    }
    
    if (window.checkMissionReset) window.checkMissionReset();
    
    // 2. Async check cloud
    if (Cloud) {
       Cloud.getItem('animePlayer', (err, val) => {
         if (!err && val) {
            try {
              window.G = Object.assign(window.defaultSave(), JSON.parse(val));
              // Merge nested
              window.G.player = Object.assign(window.defaultSave().player, window.G.player || {});
              window.G.cur = Object.assign(window.defaultSave().cur, window.G.cur || {});
              window.G.stats = Object.assign(window.defaultSave().stats, window.G.stats || {});
              window.G.settings = Object.assign(window.defaultSave().settings, window.G.settings || {});
              window.G.missions = Object.assign(window.defaultSave().missions, window.G.missions || {});
              
              if(window.G.player.level === undefined) window.G.player.level = 1;
              if (window.checkMissionReset) window.checkMissionReset();
              
              // If we fetched new cloud data, update UI
              if(window.UI && window.UI.hud) window.UI.hud();
              
            } catch(e) {}
         }
         if(callback) callback();
       });
    } else {
       if(callback) callback();
    }
  };
})();
