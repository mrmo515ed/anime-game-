// ============================================================
//  VALIDATE — Telegram WebApp initData verification (HMAC-SHA256)
// ============================================================
const crypto = require('crypto');

// Returns the user object if the initData is authentic, otherwise null.
function validateInitData(initData, botToken) {
  if (!initData || !botToken) return null;
  let params;
  try {
    params = new URLSearchParams(initData);
  } catch (e) {
    return null;
  }
  const hash = params.get('hash');
  if (!hash) return null;
  params.delete('hash');

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const secretKey = crypto.createHmac('sha256', botToken).update('WebAppData').digest();
  const calcHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  if (calcHash !== hash) return null;

  try {
    return JSON.parse(params.get('user') || 'null');
  } catch (e) {
    return null;
  }
}

module.exports = { validateInitData };
