"""
Bu script:
  1. WF9  (Toplanti Hatirlatici)   - Tamamen yeniden tasarlanir
  2. WF12 (Telegram Komut Botu)    - Tum yeni komutlar eklenir
  3. WF15 (Hatirlatici Yoneticisi) - Yeni olusturulur
"""
import json
import urllib.request
import urllib.error

# ─── Sabitler ─────────────────────────────────────────────────────────────────
N8N_URL        = "https://n8n.promptforgeai.dev"
N8N_API_KEY    = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYzAwMTYxMS0zYjdhLTQzNmItYTdlYi01MTJiMWJhODAyZGQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZDE5ZjI0NzktNzJhZS00YjBiLWE3YmUtMjI3NmZjZDIyM2M3IiwiaWF0IjoxNzc1NTEzMDgyfQ.i35VqeXu6ZqQLAYdS-GNh3gdnpd6iFAYjtMR4i_ttx4"
TELEGRAM_TOKEN = "8226317784:AAGj2rolmw1VyynN-g6ypIHYwfxK3rRsACg"
TELEGRAM_CHAT  = "6416910856"
ANTHROPIC_KEY  = "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"
AUTOMATION_KEY = "430de61b40c198141b89e087cfe4265cd7c7fdc68cdb4f34a6c75dca85f05e43"
API_BASE       = "https://api.promptforgeai.dev"
GCAL_CRED_ID   = "loDueOtfm0EtIDSV"
GCAL_CRED_NAME = "Google Calendar account"

WF9_ID  = "rzVPquDDp3lVCaRz"
WF12_ID = "X9WOxnSUM8imj1oq"

HEADERS = {"X-N8N-API-KEY": N8N_API_KEY, "Content-Type": "application/json"}

# ─── Yardimci fonksiyonlar ────────────────────────────────────────────────────
def api(method, path, data=None):
    url  = f"{N8N_URL}/api/v1{path}"
    body = json.dumps(data).encode() if data else None
    req  = urllib.request.Request(url, data=body, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        print(f"  HTTP {e.code}: {e.read().decode()[:300]}")
        return None

def update_wf(wf_id, new_nodes, new_connections):
    wf = api("GET", f"/workflows/{wf_id}")
    if not wf:
        print(f"  Cannot fetch {wf_id}")
        return False
    wf["nodes"]       = new_nodes
    wf["connections"] = new_connections
    payload = {k: wf[k] for k in ("name","nodes","connections","settings","staticData") if k in wf}
    result  = api("PUT", f"/workflows/{wf_id}", payload)
    return bool(result and "id" in result)

def create_and_activate(wf_data):
    result = api("POST", "/workflows", wf_data)
    if result and "id" in result:
        wid = result["id"]
        print(f"  Created: {wf_data['name']} (id={wid})")
        if api("POST", f"/workflows/{wid}/activate"):
            print("  Activated OK")
        return wid
    return None

# ── Node builder helpers ──────────────────────────────────────────────────────
def code_node(nid, name, pos, code, mode="runOnceForAllItems"):
    return {"id": nid, "name": name, "type": "n8n-nodes-base.code",
            "typeVersion": 2, "position": pos,
            "parameters": {"jsCode": code, "mode": mode}}

def http_node(nid, name, pos, method, url, headers=None, body_expr=None, on_error="stopAndError"):
    params = {"method": method, "url": url}
    if headers:
        params["sendHeaders"] = True
        params["headerParameters"] = {"parameters": headers}
    if body_expr:
        params["sendBody"] = True
        params["contentType"] = "raw"
        params["rawContentType"] = "application/json"
        params["body"] = body_expr
    node = {"id": nid, "name": name, "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4.2, "position": pos, "parameters": params}
    if on_error != "stopAndError":
        node["onError"] = on_error
    return node

def tg_send(nid, name, pos, body_expr):
    return http_node(nid, name, pos, "POST",
                     f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage",
                     body_expr=body_expr)

def tg_reply(nid, name, pos):
    """Send to $json.chatId with $json.message."""
    body = (
        "={{ JSON.stringify({"
        "chat_id: $json.chatId,"
        "text: $json.message,"
        "parse_mode: 'HTML'"
        "}) }}"
    )
    return tg_send(nid, name, pos, body)

def tg_fixed(nid, name, pos, msg_expr):
    """Send fixed message to TELEGRAM_CHAT."""
    body = (
        "={{ JSON.stringify({"
        f"chat_id: '{TELEGRAM_CHAT}',"
        f"text: {msg_expr},"
        "parse_mode: 'HTML'"
        "}) }}"
    )
    return tg_send(nid, name, pos, body)

def anthropic_node(nid, name, pos, body_field="$json.anthropicBody"):
    """Anthropic HTTP node — body is already JSON string in body_field."""
    return http_node(
        nid, name, pos, "POST",
        "https://api.anthropic.com/v1/messages",
        headers=[
            {"name": "x-api-key",        "value": ANTHROPIC_KEY},
            {"name": "anthropic-version", "value": "2023-06-01"},
        ],
        body_expr=f"={{{{ {body_field} }}}}",
        on_error="continueRegularOutput",
    )

def switch_node(nid, name, pos, rules):
    values = []
    for i, (lv, rv) in enumerate(rules):
        values.append({
            "outputKey": str(i),
            "conditions": {
                "options": {"caseSensitive": False},
                "conditions": [{"id": f"r{i}", "leftValue": lv, "rightValue": rv,
                                 "operator": {"type": "string", "operation": "equals"}}],
                "combinator": "and",
            },
            "renameOutput": False,
        })
    return {"id": nid, "name": name, "type": "n8n-nodes-base.switch",
            "typeVersion": 3, "position": pos,
            "parameters": {"mode": "rules", "rules": {"values": values},
                           "fallbackOutput": "extra", "options": {}}}

def gcal_node(nid, name, pos, operation, extra_params):
    base = {
        "resource": "event",
        "operation": operation,
        "calendar": {"__rl": True, "value": "primary", "mode": "list", "cachedResultName": "primary"},
    }
    base.update(extra_params)
    return {"id": nid, "name": name, "type": "n8n-nodes-base.googleCalendar",
            "typeVersion": 1.1, "position": pos,
            "onError": "continueRegularOutput",
            "credentials": {"googleCalendarOAuth2Api": {"id": GCAL_CRED_ID, "name": GCAL_CRED_NAME}},
            "parameters": base}

def if_node(nid, name, pos, lv, rv, op="equals"):
    return {"id": nid, "name": name, "type": "n8n-nodes-base.if",
            "typeVersion": 2, "position": pos,
            "parameters": {
                "conditions": {
                    "options": {"caseSensitive": False},
                    "conditions": [{"id": "c0", "leftValue": lv, "rightValue": rv,
                                    "operator": {"type": "string", "operation": op}}],
                    "combinator": "and",
                },
                "options": {},
            }}

# ══════════════════════════════════════════════════════════════════════════════
# WF9: AKILLI TOPLANTI HATIRLATICISI (tamamen yeniden tasarim)
#   Her 15 dakikada bir: etkinlik yoksa sessiz, varsa:
#   - 60-75 dk once: "1 saat sonra toplanti var"
#   - 0-15 dk once: "X dakika kaldi!"
#   Ayni etkinlik icin duplicate bildirim gitmez (staticData ile takip)
# ══════════════════════════════════════════════════════════════════════════════
def rebuild_wf9():
    print("\n[WF9] Akilli Toplanti Hatirlaticisi yeniden tasarlaniyor...")

    smart_code = r"""
const sd = $getWorkflowStaticData('global');
if (!sd.notified) sd.notified = {};

const now = Date.now();

// Temizlik: 2 günden eski kayıtları sil
for (const k of Object.keys(sd.notified)) {
  if (sd.notified[k] < now - 172800000) delete sd.notified[k];
}

const toNotify = [];

for (const item of $input.all()) {
  const e = item.json;
  // Sadece başlık ve kesin zamanı olan etkinlikler
  if (!e.summary || !e.start || !e.start.dateTime) continue;

  const startMs   = new Date(e.start.dateTime).getTime();
  const minsUntil = (startMs - now) / 60000;

  // Henüz başlamamış ve 75 dakika içindekiler
  if (minsUntil < 0 || minsUntil > 75) continue;

  const eventId = e.id || (e.summary + e.start.dateTime);
  const slot    = Math.floor(startMs / 900000); // 15 dk slot

  let type = null;
  if (minsUntil > 45)                    type = '1h';
  else if (minsUntil > 0 && minsUntil <= 45) type = '15m';
  if (!type) continue;

  const key = `${eventId}_${type}_${slot}`;
  if (sd.notified[key]) continue;
  sd.notified[key] = now;

  const startTime = new Date(e.start.dateTime)
    .toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit', timeZone:'Europe/Istanbul'});
  const startDate = new Date(e.start.dateTime)
    .toLocaleDateString('tr-TR', {weekday:'long', day:'2-digit', month:'long', timeZone:'Europe/Istanbul'});

  let msg;
  if (type === '1h') {
    msg = `📅 <b>1 Saat Sonra Toplantı!</b>\n\n<b>${e.summary}</b>\n🕐 ${startDate}, ${startTime}`
        + (e.location ? `\n📍 ${e.location}` : '')
        + (e.description ? `\n📝 ${e.description.substring(0,80)}` : '');
  } else {
    const minsLeft = Math.round(minsUntil);
    msg = `🔔 <b>${minsLeft} Dakika Kaldı!</b>\n\n<b>${e.summary}</b>\n🕐 ${startTime}`
        + (e.location ? `\n📍 ${e.location}` : '');
  }
  toNotify.push({json: {message: msg}});
}

return toNotify;
""".strip()

    nodes = [
        {"id": "s9n", "name": "Every 15 Min",
         "type": "n8n-nodes-base.scheduleTrigger", "typeVersion": 1.1,
         "position": [240, 300],
         "parameters": {"rule": {"interval": [{"field": "minutes", "minutesInterval": 15}]}}},
        gcal_node("cal9n", "Get Upcoming Events", [480, 300], "getAll", {
            "returnAll": False, "limit": 10,
            "options": {
                "timeMin": "={{ new Date().toISOString() }}",
                "timeMax": "={{ new Date(Date.now() + 75*60*1000).toISOString() }}",
                "singleEvents": True, "orderBy": "startTime",
            }
        }),
        code_node("filter9n", "Smart Filter & Notify", [720, 300], smart_code),
        tg_fixed("tg9n", "Send Meeting Alert", [960, 300], "$json.message"),
    ]
    connections = {
        "Every 15 Min":            {"main": [[{"node": "Get Upcoming Events",       "type": "main", "index": 0}]]},
        "Get Upcoming Events":     {"main": [[{"node": "Smart Filter & Notify",     "type": "main", "index": 0}]]},
        "Smart Filter & Notify":   {"main": [[{"node": "Send Meeting Alert",        "type": "main", "index": 0}]]},
    }

    # Deactivate → update → reactivate
    api("POST", f"/workflows/{WF9_ID}/deactivate")
    ok = update_wf(WF9_ID, nodes, connections)
    if ok:
        print("  WF9 updated OK")
        if api("POST", f"/workflows/{WF9_ID}/activate"):
            print("  WF9 reactivated OK")
    else:
        print("  WF9 update FAILED")
    return ok


# ══════════════════════════════════════════════════════════════════════════════
# WF15: HATIRLATICI YONETICISI
#   Trigger 1: POST /add-reminder  → static data'ya hatirlatici ekle
#   Trigger 2: Schedule her 1 dk  → vadesi dolan hatirlatıcıları gonder
# ══════════════════════════════════════════════════════════════════════════════
def create_wf15():
    print("\n[WF15] Hatirlatici Yoneticisi olusturuluyor...")

    add_code = r"""
const sd = $getWorkflowStaticData('global');
if (!sd.reminders) sd.reminders = [];
const raw  = $input.first().json;
const data = raw.body !== undefined ? raw.body : raw;
const id   = String(Date.now());
sd.reminders.push({
  id,
  chatId:  String(data.chatId  || '""" + TELEGRAM_CHAT + r"""'),
  message: String(data.message || data.msg || ''),
  dueAt:   Number(data.dueAt),
});
return [{json: {ok: true, id}}];
""".strip()

    check_code = r"""
const sd  = $getWorkflowStaticData('global');
if (!sd.reminders || sd.reminders.length === 0) return [];
const now = Date.now();
const due = sd.reminders.filter(r => r.dueAt <= now);
sd.reminders = sd.reminders.filter(r => r.dueAt > now);
return due.map(r => ({json: {
  chatId:  r.chatId,
  message: '⏰ <b>Hatırlatıcı!</b>\n\n' + r.message,
}}));
""".strip()

    nodes = [
        # Trigger 1: webhook add
        {"id": "wh15", "name": "Add Reminder Webhook",
         "type": "n8n-nodes-base.webhook", "typeVersion": 2,
         "position": [240, 200],
         "parameters": {"httpMethod": "POST", "path": "add-reminder",
                        "responseMode": "onReceived", "responseData": ""}},
        code_node("add15", "Add to Static Data", [480, 200], add_code),
        # Trigger 2: schedule check
        {"id": "s15", "name": "Every 1 Min",
         "type": "n8n-nodes-base.scheduleTrigger", "typeVersion": 1.1,
         "position": [240, 420],
         "parameters": {"rule": {"interval": [{"field": "minutes", "minutesInterval": 1}]}}},
        code_node("check15", "Check Due Reminders", [480, 420], check_code),
        tg_reply("tg15", "Send Reminder", [720, 420]),
    ]
    connections = {
        "Add Reminder Webhook": {"main": [[{"node": "Add to Static Data",    "type": "main", "index": 0}]]},
        "Every 1 Min":          {"main": [[{"node": "Check Due Reminders",   "type": "main", "index": 0}]]},
        "Check Due Reminders":  {"main": [[{"node": "Send Reminder",         "type": "main", "index": 0}]]},
    }
    return create_and_activate({
        "name": "15. Hatirlatici Yoneticisi",
        "nodes": nodes, "connections": connections,
        "settings": {"executionOrder": "v1"},
    })


# ══════════════════════════════════════════════════════════════════════════════
# WF12: TELEGRAM KOMUT BOTU — TAM YENIDEN YAZIM
#  Komutlar: /yardim /istatistik /blog /durum /ozet /mail /ara /todo /hatirlatici /toplanti
#  Serbest metin → Claude asistan
# ══════════════════════════════════════════════════════════════════════════════
def rebuild_wf12():
    print("\n[WF12] Telegram Komut Botu tum komutlarla yeniden yaziliyor...")

    # ── Parse Command ────────────────────────────────────────────────────────
    parse_code = r"""
const raw    = $input.first().json;
const update = raw.body !== undefined ? raw.body : raw;
const msg    = update.message || update.edited_message;
if (!msg) return [];

const text = (msg.text || '').trim();
if (!text) return [];
const chatId = String(msg.chat.id);

const isCmd = text.startsWith('/');
let command, args;
if (isCmd) {
  const p = text.split(/\s+/);
  command  = p[0].toLowerCase().replace(/@\w+$/, '');
  args     = p.slice(1).join(' ').trim();
} else {
  command = '__freetext';
  args    = text;
}

const today = new Date().toLocaleString('tr-TR', {timeZone:'Europe/Istanbul'});
let commandType = 'unknown', claudeSystem = null, claudeUser = null;

switch (command) {
  case '/yardim': case '/help':
    commandType = 'yardim'; break;
  case '/istatistik': case '/stats':
    commandType = 'stats'; break;
  case '/durum':
    commandType = 'durum'; break;
  case '/todo':
    commandType = 'todo'; break;
  case '/hatirlatici':
    commandType = 'hatirlatici'; break;
  case '/toplanti':
    commandType = 'toplanti'; break;
  case '/blog':
    commandType = 'claude';
    claudeSystem = 'Sen uzman bir Türkçe içerik yazarısın.';
    claudeUser   = args
      ? `Şu konu hakkında Türkçe blog yazısı taslağı hazırla. Başlık, giriş, 3-4 bölüm ve sonuç içersin:\n\n${args}`
      : 'Konu: /blog [konu] şeklinde yaz. Örnek: /blog Yapay Zekanın Geleceği';
    break;
  case '/ozet':
    commandType = 'claude';
    claudeSystem = 'Sen Türkçe metin özetleme uzmanısın.';
    claudeUser   = args ? `Şu metni Türkçe özetle:\n\n${args}` : 'Özetlenecek metni ver: /ozet [metin]';
    break;
  case '/mail':
    commandType = 'claude';
    claudeSystem = 'Sen profesyonel Türkçe iş e-postası uzmanısın. Resmi ve kısa e-postalar yazarsın.';
    claudeUser   = args ? `Şu konu için profesyonel e-posta taslağı yaz:\n\n${args}` : 'Konu ver: /mail [alıcı ve konu]';
    break;
  case '/ara':
    commandType = 'claude';
    claudeSystem = `Sen bilgili bir Türkçe asistansın. Bugün: ${today}. Bilgi kesimi Ağustos 2025.`;
    claudeUser   = args || 'Ne aramak istiyorsun?';
    break;
  case '__freetext':
    commandType = 'claude';
    claudeSystem = `Sen PromptForge kişisel asistanısın. Kullanıcın adı Murat. Bugün: ${today}. Kısa ve öz Türkçe cevap ver.`;
    claudeUser   = args;
    break;
  default:
    commandType = 'unknown';
}

return [{json: {command, args, chatId, commandType, claudeSystem, claudeUser}}];
""".strip()

    # ── Claude hazırlık ──────────────────────────────────────────────────────
    prep_claude_code = r"""
const {claudeSystem, claudeUser} = $input.first().json;
const body = {
  model: 'claude-opus-4-6',
  max_tokens: 2000,
  messages: [{role: 'user', content: claudeUser || ''}],
};
if (claudeSystem) body.system = claudeSystem;
return [{json: {...$input.first().json, anthropicBody: JSON.stringify(body)}}];
""".strip()

    # ── Format Claude çıktısı ────────────────────────────────────────────────
    fmt_claude_code = r"""
const chatId = $('Parse Command').item.json.chatId;
const r = $input.first().json;
if (r.error || !r.content) return [{json: {chatId, message: '❌ AI yanıt veremedi. Tekrar dene.'}}];
return [{json: {chatId, message: r.content[0].text.substring(0, 4000)}}];
""".strip()

    # ── Format stats ─────────────────────────────────────────────────────────
    fmt_stats_code = r"""
const chatId = $('Parse Command').item.json.chatId;
const s = $input.first().json;
if (!s.users) return [{json: {chatId, message: '❌ İstatistik alınamadı.'}}];
const plans = (s.plans||[]).map(p => `  ${p.plan}: <b>${p.count}</b>`).join('\n');
const msg =
  '<b>📊 PromptForge İstatistikleri</b>\n\n' +
  `👥 Kullanıcılar: <b>${s.users.total}</b> (+${s.users.newToday} bugün, +${s.users.newThisWeek} hafta)\n` +
  `📁 Projeler: <b>${s.projects.total}</b> (+${s.projects.createdToday} bugün)\n\n` +
  `<b>Planlar:</b>\n${plans}\n\n` +
  `<i>🕐 ${new Date().toLocaleString('tr-TR',{timeZone:'Europe/Istanbul'})}</i>`;
return [{json: {chatId, message: msg}}];
""".strip()

    # ── Format durum ─────────────────────────────────────────────────────────
    fmt_durum_code = r"""
const chatId = $('Parse Command').item.json.chatId;
const r = $input.first().json;
const ok  = !r.error;
const msg =
  '<b>🖥️ Sistem Durumu</b>\n\n' +
  `API: ${ok ? '✅ Çalışıyor' : '❌ Erişilemiyor'}\n` +
  `Frontend: ✅ Vercel\n` +
  `n8n: ✅ Çalışıyor\n\n` +
  `<i>🕐 ${new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'})}</i>`;
return [{json: {chatId, message: msg}}];
""".strip()

    # ── Todo handler ─────────────────────────────────────────────────────────
    todo_code = r"""
const {chatId, args} = $input.first().json;
const sd = $getWorkflowStaticData('global');
if (!sd.todos) sd.todos = [];

const p   = (args || '').trim().split(/\s+/);
const sub = (p[0] || '').toLowerCase();
const rest = p.slice(1).join(' ').trim();
let msg;

if (!sub || sub === 'listele' || sub === 'liste') {
  if (!sd.todos.length) {
    msg = '📋 <b>Todo Listesi</b>\n\nBoş! Eklemek için:\n<code>/todo ekle Görev adı</code>';
  } else {
    const rows = sd.todos.map((t,i)=>`${t.done?'✅':'⬜'} ${i+1}. ${t.text}${t.done?' <i>(tamam)</i>':''}`);
    const done = sd.todos.filter(t=>t.done).length;
    msg = `📋 <b>Todo (${done}/${sd.todos.length})</b>\n\n${rows.join('\n')}\n\n<i>/todo ekle • /todo tamam [no] • /todo sil [no]</i>`;
  }
} else if (sub==='ekle'||sub==='add') {
  if (!rest) { msg='❌ Görev metni gerekli.'; }
  else { sd.todos.push({text:rest,done:false}); msg=`➕ Eklendi: "<b>${rest}</b>" (#${sd.todos.length})`; }
} else if (sub==='tamam'||sub==='tamamla'||sub==='done') {
  const i=parseInt(rest)-1;
  if(isNaN(i)||i<0||i>=sd.todos.length){msg='❌ Geçersiz numara.';}
  else{sd.todos[i].done=true;msg=`✅ Tamamlandı: "<b>${sd.todos[i].text}</b>"`;}
} else if (sub==='sil'||sub==='delete') {
  const i=parseInt(rest)-1;
  if(isNaN(i)||i<0||i>=sd.todos.length){msg='❌ Geçersiz numara.';}
  else{const r=sd.todos.splice(i,1)[0];msg=`🗑️ Silindi: "<b>${r.text}</b>"`;}
} else if (sub==='temizle') {
  const c=sd.todos.length; sd.todos=[]; msg=`🗑️ ${c} görev temizlendi.`;
} else {
  // Sub komutu yoksa doğrudan ekle
  sd.todos.push({text:args.trim(),done:false});
  msg=`➕ Eklendi: "<b>${args.trim()}</b>" (#${sd.todos.length})`;
}
return [{json: {chatId, message: msg}}];
""".strip()

    # ── Hatirlatici parse ─────────────────────────────────────────────────────
    reminder_parse_code = r"""
const {chatId, args} = $input.first().json;
const now = Date.now();
let dueAt = null, reminderMsg = args;

const patterns = [
  [/^(\d+)\s*dk(?:ika)?\s+sonra\s+(.*)/i,   m => [now + parseInt(m[1])*60000,      m[2]]],
  [/^(\d+)\s*saat\s+sonra\s+(.*)/i,          m => [now + parseInt(m[1])*3600000,    m[2]]],
  [/^yarın\s+(\d{1,2}):(\d{2})\s+(.*)/i,    m => { const d=new Date(); d.setDate(d.getDate()+1); d.setHours(+m[1],+m[2],0,0); return [d.getTime(), m[3]]; }],
  [/^(\d{1,2}):(\d{2})\s+(.*)/,             m => { const d=new Date(); d.setHours(+m[1],+m[2],0,0); if(d.getTime()<now) d.setDate(d.getDate()+1); return [d.getTime(), m[3]]; }],
];

for (const [re, fn] of patterns) {
  const m = args.match(re);
  if (m) { [dueAt, reminderMsg] = fn(m); break; }
}

if (!dueAt) {
  return [{json: {chatId, message:
    '❌ Zaman formatı anlaşılamadı.\n\n<b>Örnekler:</b>\n' +
    '<code>/hatirlatici 30 dk sonra su iç</code>\n' +
    '<code>/hatirlatici 2 saat sonra ilaç al</code>\n' +
    '<code>/hatirlatici 14:30 toplantı</code>\n' +
    '<code>/hatirlatici yarın 09:00 işe git</code>',
    skipNext: true}}];
}

const dueTime = new Date(dueAt).toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
const dueDate = new Date(dueAt).toLocaleDateString('tr-TR',{weekday:'short',day:'2-digit',month:'short'});
return [{json: {chatId, dueAt, reminderMsg,
  confirmMsg: `⏰ <b>Hatırlatıcı Eklendi!</b>\n\n📝 "${reminderMsg}"\n🕐 ${dueDate} ${dueStr=dueTime}`,
  skipNext: false}}];
""".strip()

    # IF node'u atlama kodu
    reminder_if_code = r"""
const item = $input.first().json;
if (item.skipNext) {
  return [{json: {chatId: item.chatId, message: item.message, skipCalendar: true}}];
}
// Mevcut WF15 webhook'unu cag
return [{json: item}];
""".strip()

    # ── Hatirlatici WF15 cagris body ──────────────────────────────────────────
    remind_webhook_body = (
        "={{ JSON.stringify({"
        "chatId: $json.chatId,"
        "message: $json.reminderMsg,"
        "dueAt: $json.dueAt"
        "}) }}"
    )

    remind_confirm_code = r"""
const chatId = $('Parse Command').item.json.chatId;
const orig   = $('Reminder Parse').item.json;
return [{json: {chatId, message: orig.confirmMsg || '⏰ Hatırlatıcı eklendi!'}}];
""".strip()

    # ── Toplanti ─────────────────────────────────────────────────────────────
    prep_toplanti_code = r"""
const {chatId, args} = $input.first().json;
const today = new Date().toLocaleString('tr-TR',{timeZone:'Europe/Istanbul',dateStyle:'full',timeStyle:'short'});
const prompt = `Türkiye saati: ${today}\n\nŞu toplantı bilgisinden ayrıntıları çıkar. SADECE JSON döndür:\n"${args}"\n\nFormat (ISO8601 +03:00):\n{"title":"...","startDateTime":"2026-04-15T14:00:00+03:00","endDateTime":"2026-04-15T15:00:00+03:00","location":"","description":""}`;
const body = JSON.stringify({model:'claude-opus-4-6',max_tokens:400,
  system:'Sadece geçerli JSON döndür, markdown veya açıklama ekleme.',
  messages:[{role:'user',content:prompt}]});
return [{json: {chatId, args, anthropicBody: body}}];
""".strip()

    extract_toplanti_code = r"""
const chatId = $('Parse Command').item.json.chatId;
const r = $input.first().json;
if (r.error || !r.content) return [{json:{chatId, parseOk:false, message:'❌ Toplantı bilgisi ayrıştırılamadı.'}}];
try {
  const raw     = r.content[0].text.replace(/^```json?\n?/,'').replace(/\n?```$/,'').trim();
  const ev      = JSON.parse(raw);
  if (!ev.title || !ev.startDateTime) throw new Error('Eksik alan');
  return [{json:{chatId, parseOk:true,
    eventTitle: ev.title, eventStart: ev.startDateTime,
    eventEnd:   ev.endDateTime || ev.startDateTime,
    eventLocation: ev.location||'', eventDescription: ev.description||''}}];
} catch(e) {
  return [{json:{chatId, parseOk:false, message:`❌ Ayrıştırma hatası: ${e.message}`}}];
}
""".strip()

    confirm_toplanti_code = r"""
const chatId = $('Parse Command').item.json.chatId;
const orig   = $('Extract Toplanti').item.json;
const r = $input.first().json;
if (r.error) return [{json:{chatId, message:`❌ Takvim etkinliği oluşturulamadı: ${JSON.stringify(r.error).substring(0,100)}`}}];
const startStr = new Date(orig.eventStart).toLocaleString('tr-TR',{timeZone:'Europe/Istanbul',dateStyle:'medium',timeStyle:'short'});
const msg = `✅ <b>Toplantı Eklendi!</b>\n\n📌 <b>${orig.eventTitle}</b>\n🕐 ${startStr}`
  + (orig.eventLocation ? `\n📍 ${orig.eventLocation}` : '')
  + '\n\n<a href="https://calendar.google.com">Google Calendar →</a>';
return [{json:{chatId, message:msg}}];
""".strip()

    # ── Sabit mesajlar ───────────────────────────────────────────────────────
    HELP_TEXT = (
        r"'🤖 <b>PromptForge Asistan</b>\n\n"
        r"<b>📝 İçerik:</b>\n"
        r"/blog [konu] — Blog taslağı\n"
        r"/ozet [metin] — Metin özeti\n"
        r"/mail [konu] — E-posta taslağı\n"
        r"/ara [soru] — Claude ile ara\n\n"
        r"<b>📋 Görevler:</b>\n"
        r"/todo — Todo listesi\n"
        r"/hatirlatici [süre] [mesaj] — Hatırlatıcı\n\n"
        r"<b>📅 Takvim:</b>\n"
        r"/toplanti [bilgi] — Etkinlik ekle\n\n"
        r"<b>📊 Sistem:</b>\n"
        r"/istatistik — Platform verileri\n"
        r"/durum — Sistem sağlığı\n"
        r"/yardim — Bu mesaj\n\n"
        r"<i>Komut olmadan yaz → AI asistan olarak cevaplar</i>'"
    )

    help_body = (
        "={{ JSON.stringify({"
        "chat_id: $json.chatId,"
        f"text: {HELP_TEXT},"
        "parse_mode: 'HTML'"
        "}) }}"
    )
    unknown_body = (
        "={{ JSON.stringify({"
        "chat_id: $json.chatId,"
        r"text: '❓ Bilinmeyen: <code>' + $json.command + '</code>\n/yardim → komut listesi',"
        "parse_mode: 'HTML'"
        "}) }}"
    )
    parse_error_body = (
        "={{ JSON.stringify({"
        "chat_id: $json.chatId,"
        "text: $json.message,"
        "parse_mode: 'HTML'"
        "}) }}"
    )

    # ── Automation headers ───────────────────────────────────────────────────
    auth_headers = [{"name": "x-automation-key", "value": AUTOMATION_KEY}]

    # ── Nodes ────────────────────────────────────────────────────────────────
    nodes = [
        # Webhook trigger
        {"id": "wh12", "name": "Telegram Webhook", "type": "n8n-nodes-base.webhook",
         "typeVersion": 2, "position": [240, 500], "webhookId": "telegram-bot-hook",
         "parameters": {"httpMethod": "POST", "path": "telegram-bot",
                        "responseMode": "onReceived", "responseData": ""}},
        # Parse
        code_node("parse12", "Parse Command", [500, 500], parse_code),
        # Switch (8 kurallar + fallback)
        switch_node("sw12", "Switch Command", [760, 500], [
            ("={{ $json.commandType }}", "yardim"),       # 0
            ("={{ $json.commandType }}", "stats"),        # 1
            ("={{ $json.commandType }}", "claude"),       # 2
            ("={{ $json.commandType }}", "durum"),        # 3
            ("={{ $json.commandType }}", "todo"),         # 4
            ("={{ $json.commandType }}", "hatirlatici"),  # 5
            ("={{ $json.commandType }}", "toplanti"),     # 6
        ]),

        # 0 ── /yardim ────────────────────────────────────────────────────────
        tg_send("help12", "Send Help", [1020, 200], help_body),

        # 1 ── /istatistik ────────────────────────────────────────────────────
        http_node("stats_req12", "Get Stats", [1020, 340], "GET",
                  f"{API_BASE}/api/v1/automation/stats", headers=auth_headers,
                  on_error="continueRegularOutput"),
        code_node("stats_fmt12", "Format Stats",  [1280, 340], fmt_stats_code),
        tg_reply( "stats_snd12", "Send Stats",    [1540, 340]),

        # 2 ── /claude (blog, ozet, mail, ara, freetext) ──────────────────────
        code_node( "prep_cl12",  "Prep Claude",   [1020, 480], prep_claude_code),
        anthropic_node("cl12",   "Claude API",    [1280, 480]),
        code_node( "fmt_cl12",   "Format Claude", [1540, 480], fmt_claude_code),
        tg_reply(  "snd_cl12",   "Send Claude",   [1800, 480]),

        # 3 ── /durum ─────────────────────────────────────────────────────────
        http_node("durum_req12", "Get Health", [1020, 620], "GET",
                  f"{API_BASE}/health", on_error="continueRegularOutput"),
        code_node("durum_fmt12", "Format Health", [1280, 620], fmt_durum_code),
        tg_reply( "durum_snd12", "Send Health",   [1540, 620]),

        # 4 ── /todo ──────────────────────────────────────────────────────────
        code_node("todo12",      "Todo Handler",  [1020, 760], todo_code),
        tg_reply( "todo_snd12",  "Send Todo",     [1280, 760]),

        # 5 ── /hatirlatici ────────────────────────────────────────────────────
        code_node( "rem_parse12","Reminder Parse", [1020, 900], reminder_parse_code),
        if_node(   "rem_if12",   "Has Due Time?",  [1280, 900],
                   "={{ $json.skipNext }}", "true"),
        # true (hata) → doğrudan gönder
        tg_reply(  "rem_err12",  "Send Reminder Error", [1540, 820]),
        # false (başarı) → WF15 webhook → confirm gönder
        http_node( "rem_add12",  "Add to WF15", [1540, 980], "POST",
                   f"{N8N_URL}/webhook/add-reminder",
                   body_expr=remind_webhook_body),
        code_node( "rem_conf12", "Reminder Confirm", [1800, 980], remind_confirm_code),
        tg_reply(  "rem_snd12",  "Send Reminder OK",  [2060, 980]),

        # 6 ── /toplanti ──────────────────────────────────────────────────────
        code_node(  "tp_prep12",   "Prep Toplanti",    [1020, 1120], prep_toplanti_code),
        http_node(  "tp_cl12",     "Toplanti Claude",  [1280, 1120], "POST",
                    "https://api.anthropic.com/v1/messages",
                    headers=[{"name":"x-api-key","value":ANTHROPIC_KEY},
                              {"name":"anthropic-version","value":"2023-06-01"}],
                    body_expr="{{ $json.anthropicBody }}",
                    on_error="continueRegularOutput"),
        code_node(  "tp_ext12",    "Extract Toplanti", [1540, 1120], extract_toplanti_code),
        if_node(    "tp_if12",     "Parse OK?",        [1800, 1120],
                    "={{ $json.parseOk }}", "true"),
        # true → Calendar Create → Confirm → Send
        gcal_node(  "tp_cal12",    "Create Calendar Event", [2060, 1040], "create", {
            "start": "={{ $json.eventStart }}",
            "end":   "={{ $json.eventEnd }}",
            "additionalFields": {
                "summary":     "={{ $json.eventTitle }}",
                "location":    "={{ $json.eventLocation }}",
                "description": "={{ $json.eventDescription }}",
            }
        }),
        code_node(  "tp_ok12",     "Confirm Toplanti", [2320, 1040], confirm_toplanti_code),
        tg_reply(   "tp_snd_ok12", "Send Calendar OK", [2580, 1040]),
        # false → send parse error
        tg_send(    "tp_snd_err12","Send Parse Error",  [2060, 1200], parse_error_body),

        # fallback ─────────────────────────────────────────────────────────────
        tg_send("unknown12", "Unknown Cmd", [1020, 1300], unknown_body),
    ]

    connections = {
        "Telegram Webhook": {"main": [[{"node": "Parse Command",     "type": "main", "index": 0}]]},
        "Parse Command":    {"main": [[{"node": "Switch Command",    "type": "main", "index": 0}]]},
        "Switch Command":   {"main": [
            [{"node": "Send Help",          "type": "main", "index": 0}],   # 0 yardim
            [{"node": "Get Stats",          "type": "main", "index": 0}],   # 1 stats
            [{"node": "Prep Claude",        "type": "main", "index": 0}],   # 2 claude
            [{"node": "Get Health",         "type": "main", "index": 0}],   # 3 durum
            [{"node": "Todo Handler",       "type": "main", "index": 0}],   # 4 todo
            [{"node": "Reminder Parse",     "type": "main", "index": 0}],   # 5 hatirlatici
            [{"node": "Prep Toplanti",      "type": "main", "index": 0}],   # 6 toplanti
            [{"node": "Unknown Cmd",        "type": "main", "index": 0}],   # fallback
        ]},
        # stats
        "Get Stats":    {"main": [[{"node": "Format Stats",    "type": "main", "index": 0}]]},
        "Format Stats": {"main": [[{"node": "Send Stats",      "type": "main", "index": 0}]]},
        # claude
        "Prep Claude":    {"main": [[{"node": "Claude API",     "type": "main", "index": 0}]]},
        "Claude API":     {"main": [[{"node": "Format Claude",  "type": "main", "index": 0}]]},
        "Format Claude":  {"main": [[{"node": "Send Claude",    "type": "main", "index": 0}]]},
        # durum
        "Get Health":    {"main": [[{"node": "Format Health",  "type": "main", "index": 0}]]},
        "Format Health": {"main": [[{"node": "Send Health",    "type": "main", "index": 0}]]},
        # todo
        "Todo Handler":  {"main": [[{"node": "Send Todo",      "type": "main", "index": 0}]]},
        # hatirlatici
        "Reminder Parse": {"main": [[{"node": "Has Due Time?", "type": "main", "index": 0}]]},
        "Has Due Time?":  {"main": [
            [{"node": "Send Reminder Error", "type": "main", "index": 0}],  # true branch (hata)
            [{"node": "Add to WF15",         "type": "main", "index": 0}],  # false branch (başarı)
        ]},
        "Add to WF15":       {"main": [[{"node": "Reminder Confirm",   "type": "main", "index": 0}]]},
        "Reminder Confirm":  {"main": [[{"node": "Send Reminder OK",   "type": "main", "index": 0}]]},
        # toplanti
        "Prep Toplanti":    {"main": [[{"node": "Toplanti Claude",   "type": "main", "index": 0}]]},
        "Toplanti Claude":  {"main": [[{"node": "Extract Toplanti",  "type": "main", "index": 0}]]},
        "Extract Toplanti": {"main": [[{"node": "Parse OK?",         "type": "main", "index": 0}]]},
        "Parse OK?":        {"main": [
            [{"node": "Create Calendar Event", "type": "main", "index": 0}],  # true
            [{"node": "Send Parse Error",      "type": "main", "index": 0}],  # false
        ]},
        "Create Calendar Event": {"main": [[{"node": "Confirm Toplanti",  "type": "main", "index": 0}]]},
        "Confirm Toplanti":      {"main": [[{"node": "Send Calendar OK",   "type": "main", "index": 0}]]},
    }

    # Deactivate → update → reactivate
    api("POST", f"/workflows/{WF12_ID}/deactivate")
    ok = update_wf(WF12_ID, nodes, connections)
    if ok:
        print("  WF12 updated OK")
        if api("POST", f"/workflows/{WF12_ID}/activate"):
            print("  WF12 reactivated OK")
    else:
        print("  WF12 update FAILED")
    return ok


# ════════════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    print("=== Bot & WF9 Guncellemesi ===")
    rebuild_wf9()
    wf15_id = create_wf15()
    print(f"  WF15 id: {wf15_id}")
    rebuild_wf12()
    print("\n=== TAMAMLANDI ===")
