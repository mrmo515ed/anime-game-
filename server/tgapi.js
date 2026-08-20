// ============================================================
//  TGAPI — minimal Telegram Bot API client (fetch, no deps)
// ============================================================
const BOT_TOKEN = process.env.BOT_TOKEN || '';
const BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function api(method, payload) {
  if (!BOT_TOKEN) throw new Error('BOT_TOKEN is not set');
  const res = await fetch(`${BASE}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload || {})
  });
  const json = await res.json();
  if (!json.ok) throw new Error(`Telegram API ${method} error: ${json.description}`);
  return json.result;
}

module.exports = {
  api,
  get token() { return BOT_TOKEN; },
  setWebhook: (url) => api('setWebhook', { url, allowed_updates: ['message', 'pre_checkout_query'] }),
  sendMessage: (chat_id, text, extra) => api('sendMessage', Object.assign({ chat_id, text }, extra)),
  answerWebAppQuery: (id, result) => api('answerWebAppQuery', { web_app_query_id: id, result }),
  createInvoiceLink: (payload) => api('createInvoiceLink', payload)
};
