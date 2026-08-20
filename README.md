# ⚔️ Anime Legends: Ultimate Battle

لعبة RPG أنمي — WebApp تيليجرام + بوت + باك-إند حقيقي.

## بنية المشروع

| المسار | الوصف |
|---|---|
| `index.html` | الصفحة الرئيسية (تفتح اللعبة) |
| `game.html` | اللعبة كاملة (75 بطل، 53 سلاح، قتال، إدارة، متجر…) |
| `game-extra.js` | ربط الخادم + المهمات الأسبوعية + الإنجازات + الزعيم العالمي + PvP/نقابات/بطولات |
| `game-cinema.js` | طبقة سينمائية للقتال (زوم بَنش، توقّف لحظي، خطوط سرعة، أشرطة سينمائية) |
| `server/` | الباك-إند (Node، بدون أي مكتبات خارجية) |
| `.env` | إعدادات سرّية (مستثنى من Git) |
| `netlify.toml` | نشر الموقع الاستاتيكي |

---

## 1) تشغيل محليًا

### الموقع (اللعبة)
```bash
python3 -m http.server 8080
# افتح http://localhost:8080
```

### الباك-إند
```bash
cp .env.example .env   # ثم ضع BOT_TOKEN الجديد
node server/index.js   # يعمل على المنفذ 8787
```

اختبار سريع:
```bash
curl http://localhost:8787/health
curl http://localhost:8787/api/boss
```

---

## 2) النشر

### أ) الموقع الاستاتيكي — Netlify / GitHub Pages
ارفع `index.html` و `game.html` و `game-extra.js` (و `netlify.toml` لـ Netlify). لا يحتاج بناء.

### ب) الباك-إند — Railway / Render / Fly.io
ارفع مجلد `server/` + `package.json` + `.env` (المتغيرات من لوحة الاستضافة، وليس كملف مرفوع).

متغيرات البيئة:
```
BOT_TOKEN=التوكن_الجديد
ROOT_ADMIN_IDS=6748280553
APP_URL=https://your-site.netlify.app
PORT=8787
```

### ج) ربط البوت
بعد تشغيل الباك-إند، اضبط الـ webhook يدويًا (مرة واحدة):
```
https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://your-backend.example.com/webhook
```
أو أرسل لبوته `/setmenu` من BotFather واختر **Open App** واربطه برابط موقعك.

### د) ربط اللعبة بالباك-إند
في ملف `game-extra.js` غيّر السطر:
```js
window.SERVER_URL = '';   // ضع رابط الباك-إند هنا
```
إلى:
```js
window.SERVER_URL = 'https://your-backend.example.com';
```

> عند فتح اللعبة من داخل البوت، ستتزامن بيانات اللاعب تلقائيًا، ويعمل الترتيب العالمي والدردشة والزعيم العالمي بشكل حقيقي بين اللاعبين.

---

## 3) الأمان ⚠️

- **لا تشارك `BOT_TOKEN` أبدًا.** إذا انكشف، ألغِه فورًا من **@BotFather** → *API Token* → *Revoke*.
- ملف `.env` مستثنى من Git. لا ترفعه لأي مستودع.
- التحقق من بيانات المستخدم يتم بـ HMAC-SHA256 (توكن البوت) في `server/validate.js`.

---

## 4) ما هو "حقيقي" الآن

| الميزة | الحالة |
|---|---|
| حفظ/تحميل التقدم على السيرفر | ✅ |
| الترتيب العالمي (بين اللاعبين) | ✅ |
| الدردشة العالمية | ✅ |
| عدد المتصلين الحقيقي | ✅ |
| الزعيم العالمي المشترك (HP واحد للجميع) | ✅ |
| ترتيب أعلى ضرر على الزعيم | ✅ |
| PvP (نشر ملفك + بحث عن خصوم) | ✅ |
| النقابات (إنشاء/انضمام على السيرفر) | ✅ |
| البطولات الأسبوعية (تسجيل حقيقي) | ✅ |
| المهمات الأسبوعية + الموسمية | ✅ |
| نظام الإنجازات | ✅ |
| الدفع بـ Telegram Stars (فاتورة حقيقية) | ✅ endpoint جاهز |
| طبقة سينمائية للقتال | ✅ (زوم/توقّف لحظي/خطوط سرعة/أشرطة) |
| إدارة كاملة (أبطال/أسلحة/متجر/…) | ✅ محليًا (على جهازك) |

### Endpoints المتوفرة
```
GET  /health, /api/leaderboard, /api/online, /api/chat, /api/guilds
GET  /api/boss, /api/boss/top, /api/pvp/find, /api/tournament
POST /api/init, /api/save, /api/chat, /api/guilds, /api/boss/attack
POST /api/pvp/publish, /api/tournament/join, /api/stars, /webhook
GET  /api/admin/stats (بـ uid أدمن)
```

## 5) ما زال يحتاج عمل

- **القتال "رباعي الأبعاد" الحقيقي**: القتال 2D مع طبقة سينمائية قوية. لا يوجد 3D/4D فعلي (WebGL).
- **PvP / بطولات فورية (realtime)**: حاليًا عبر الخادم لكن الدورات تتم محليًا — تحتاج WebSocket للإحياء الكامل.
- **الإدارة عن بُعد الكاملة**: endpoint `admin/stats` جاهز؛ توسيع التعديل على بيانات اللاعبين سهل.
- **تنظيف الكود المكرر**: `UI.home` معرّف عدة مرات (ترقيع فوق ترقيع) — يعمل لكن يحتاج إعادة هيكلة.
