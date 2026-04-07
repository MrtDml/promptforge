"""
WF12 final rebuild:
 - /hatirlatici: dogrudan WF12 static data'ya yazar (HTTP cagri yok)
 - Schedule trigger (1 dk): WF12 static data'dan vadesi dolan hatirlaticlari gonder
 - Tum diger komutlar korunur
"""
import json
import urllib.request
import urllib.error

N8N_URL        = "https://n8n.promptforgeai.dev"
N8N_API_KEY    = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYzAwMTYxMS0zYjdhLTQzNmItYTdlYi01MTJiMWJhODAyZGQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZDE5ZjI0NzktNzJhZS00YjBiLWE3YmUtMjI3NmZjZDIyM2M3IiwiaWF0IjoxNzc1NTEzMDgyfQ.i35VqeXu6ZqQLAYdS-GNh3gdnpd6iFAYjtMR4i_ttx4"
TELEGRAM_TOKEN = "8226317784:AAGj2rolmw1VyynN-g6ypIHYwfxK3rRsACg"
TELEGRAM_CHAT  = "6416910856"
ANTHROPIC_KEY  = "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"
AUTOMATION_KEY = "430de61b40c198141b89e087cfe4265cd7c7fdc68cdb4f34a6c75dca85f05e43"
API_BASE       = "https://api.promptforgeai.dev"
GCAL_CRED_ID   = "loDueOtfm0EtIDSV"
GCAL_CRED_NAME = "Google Calendar account"
WF12_ID        = "X9WOxnSUM8imj1oq"
HEADERS        = {"X-N8N-API-KEY": N8N_API_KEY, "Content-Type": "application/json"}


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
    body = ("={{ JSON.stringify({chat_id: $json.chatId, text: $json.message, parse_mode: 'HTML'}) }}")
    return tg_send(nid, name, pos, body)


def anthropic_node(nid, name, pos):
    return http_node(
        nid, name, pos, "POST",
        "https://api.anthropic.com/v1/messages",
        headers=[
            {"name": "x-api-key",        "value": ANTHROPIC_KEY},
            {"name": "anthropic-version", "value": "2023-06-01"},
        ],
        body_expr="{{ $json.anthropicBody }}",
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


def gcal_node(nid, name, pos, extra_params):
    base = {
        "resource": "event", "operation": "create",
        "calendar": {"__rl": True, "value": "primary", "mode": "list",
                     "cachedResultName": "primary"},
    }
    base.update(extra_params)
    return {"id": nid, "name": name, "type": "n8n-nodes-base.googleCalendar",
            "typeVersion": 1.1, "position": pos,
            "onError": "continueRegularOutput",
            "credentials": {"googleCalendarOAuth2Api": {
                "id": GCAL_CRED_ID, "name": GCAL_CRED_NAME}},
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


# ─────────────────────────────────────────────────────────────────────────────
#  Kod node'larinin icerikleri
# ─────────────────────────────────────────────────────────────────────────────

PARSE_CODE = r"""
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
  command = p[0].toLowerCase().replace(/@\w+$/, '');
  args    = p.slice(1).join(' ').trim();
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
      ? 'Şu konu hakkında Türkçe blog yazısı taslağı hazırla. Başlık, giriş, 3-4 bölüm ve sonuç içersin:\n\n' + args
      : 'Konu belirt: /blog [konu]';
    break;
  case '/ozet':
    commandType = 'claude';
    claudeSystem = 'Sen Türkçe metin özetleme uzmanısın.';
    claudeUser   = args ? 'Şu metni Türkçe özetle:\n\n' + args : 'Metin belirt: /ozet [metin]';
    break;
  case '/mail':
    commandType = 'claude';
    claudeSystem = 'Sen profesyonel Türkçe iş e-postası uzmanısın.';
    claudeUser   = args
      ? 'Şu konu için profesyonel e-posta taslağı yaz:\n\n' + args
      : 'Konu belirt: /mail [alıcı ve konu]';
    break;
  case '/ara':
    commandType = 'claude';
    claudeSystem = 'Sen bilgili bir Türkçe asistansın. Bugün: ' + today + '. Bilgi kesimi Ağustos 2025.';
    claudeUser   = args || 'Ne aramak istiyorsun?';
    break;
  case '__freetext':
    commandType = 'claude';
    claudeSystem = 'Sen PromptForge kişisel asistanısın. Kullanıcın adı Murat. Bugün: ' + today + '. Kısa ve öz Türkçe cevap ver.';
    claudeUser   = args;
    break;
  default:
    commandType = 'unknown';
}

return [{json: {command, args, chatId, commandType, claudeSystem, claudeUser}}];
""".strip()

PREP_CLAUDE_CODE = r"""
const item = $input.first().json;
const body = {
  model: 'claude-opus-4-6',
  max_tokens: 2000,
  messages: [{role: 'user', content: item.claudeUser || ''}],
};
if (item.claudeSystem) body.system = item.claudeSystem;
return [{json: {...item, anthropicBody: JSON.stringify(body)}}];
""".strip()

FMT_CLAUDE_CODE = r"""
const chatId = $('Parse Command').item.json.chatId;
const r = $input.first().json;
if (r.error || !r.content) return [{json: {chatId, message: '❌ AI yanıt veremedi. Tekrar dene.'}}];
return [{json: {chatId, message: r.content[0].text.substring(0, 4000)}}];
""".strip()

FMT_STATS_CODE = r"""
const chatId = $('Parse Command').item.json.chatId;
const s = $input.first().json;
if (!s.users) return [{json: {chatId, message: '❌ İstatistik alınamadı.'}}];
const plans = (s.plans||[]).map(p => '  ' + p.plan + ': <b>' + p.count + '</b>').join('\n');
const msg =
  '<b>📊 PromptForge İstatistikleri</b>\n\n' +
  '👥 Kullanıcılar: <b>' + s.users.total + '</b> (+' + s.users.newToday + ' bugün, +' + s.users.newThisWeek + ' hafta)\n' +
  '📁 Projeler: <b>' + s.projects.total + '</b> (+' + s.projects.createdToday + ' bugün)\n\n' +
  '<b>Planlar:</b>\n' + plans + '\n\n' +
  '<i>🕐 ' + new Date().toLocaleString('tr-TR',{timeZone:'Europe/Istanbul'}) + '</i>';
return [{json: {chatId, message: msg}}];
""".strip()

FMT_DURUM_CODE = r"""
const chatId = $('Parse Command').item.json.chatId;
const r = $input.first().json;
const ok = !r.error;
const msg =
  '<b>🖥️ Sistem Durumu</b>\n\n' +
  'API: ' + (ok ? '✅ Çalışıyor' : '❌ Erişilemiyor') + '\n' +
  'Frontend: ✅ Vercel\n' +
  'n8n: ✅ Çalışıyor\n\n' +
  '<i>🕐 ' + new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'}) + '</i>';
return [{json: {chatId, message: msg}}];
""".strip()

TODO_CODE = r"""
const {chatId, args} = $input.first().json;
const sd = $getWorkflowStaticData('global');
if (!sd.todos) sd.todos = [];

const p   = (args || '').trim().split(/\s+/);
const sub = (p[0] || '').toLowerCase();
const rest = p.slice(1).join(' ').trim();
let msg;

if (!sub || sub === 'listele' || sub === 'liste') {
  if (!sd.todos.length) {
    msg = '📋 <b>Todo Listesi</b>\n\nBoş!\n<code>/todo ekle Görev adı</code>';
  } else {
    const rows = sd.todos.map((t,i) => (t.done?'✅':'⬜') + ' ' + (i+1) + '. ' + t.text + (t.done?' <i>(tamam)</i>':''));
    const done = sd.todos.filter(t=>t.done).length;
    msg = '📋 <b>Todo (' + done + '/' + sd.todos.length + ')</b>\n\n' + rows.join('\n') +
          '\n\n<i>/todo ekle • /todo tamam [no] • /todo sil [no]</i>';
  }
} else if (sub==='ekle'||sub==='add') {
  if (!rest) { msg = '❌ Görev metni gerekli.'; }
  else { sd.todos.push({text:rest,done:false}); msg = '➕ Eklendi: "<b>' + rest + '</b>" (#' + sd.todos.length + ')'; }
} else if (sub==='tamam'||sub==='tamamla'||sub==='done') {
  const i=parseInt(rest)-1;
  if(isNaN(i)||i<0||i>=sd.todos.length){msg='❌ Geçersiz numara.';}
  else{sd.todos[i].done=true; msg='✅ Tamamlandı: "<b>' + sd.todos[i].text + '</b>"';}
} else if (sub==='sil'||sub==='delete') {
  const i=parseInt(rest)-1;
  if(isNaN(i)||i<0||i>=sd.todos.length){msg='❌ Geçersiz numara.';}
  else{const r=sd.todos.splice(i,1)[0]; msg='🗑️ Silindi: "<b>' + r.text + '</b>"';}
} else if (sub==='temizle') {
  const c=sd.todos.length; sd.todos=[]; msg='🗑️ ' + c + ' görev temizlendi.';
} else {
  sd.todos.push({text:args.trim(),done:false});
  msg = '➕ Eklendi: "<b>' + args.trim() + '</b>" (#' + sd.todos.length + ')';
}
return [{json: {chatId, message: msg}}];
""".strip()

# Hatirlatici: dogrudan WF12 static data'ya yazar
REMINDER_CODE = r"""
const {chatId, args} = $input.first().json;
const sd = $getWorkflowStaticData('global');
if (!sd.reminders) sd.reminders = [];

const now = Date.now();
let dueAt = null, reminderMsg = args;

const patterns = [
  [/^(\d+)\s*dk(?:ika)?\s+sonra\s+(.*)/i,    function(m){ return [now + parseInt(m[1])*60000,   m[2]]; }],
  [/^(\d+)\s*saat\s+sonra\s+(.*)/i,           function(m){ return [now + parseInt(m[1])*3600000, m[2]]; }],
  [/^yarın\s+(\d{1,2}):(\d{2})\s+(.*)/i,     function(m){ var d=new Date(); d.setDate(d.getDate()+1); d.setHours(parseInt(m[1]),parseInt(m[2]),0,0); return [d.getTime(),m[3]]; }],
  [/^(\d{1,2}):(\d{2})\s+(.*)/,              function(m){ var d=new Date(); d.setHours(parseInt(m[1]),parseInt(m[2]),0,0); if(d.getTime()<now) d.setDate(d.getDate()+1); return [d.getTime(),m[3]]; }],
];

for (var k=0; k<patterns.length; k++) {
  var match = args.match(patterns[k][0]);
  if (match) { var res=patterns[k][1](match); dueAt=res[0]; reminderMsg=res[1]; break; }
}

if (!dueAt) {
  return [{json: {chatId, message:
    '❌ Zaman formatı anlaşılamadı.\n\n<b>Örnekler:</b>\n' +
    '<code>/hatirlatici 30 dk sonra su iç</code>\n' +
    '<code>/hatirlatici 2 saat sonra ilaç al</code>\n' +
    '<code>/hatirlatici 14:30 toplantı</code>\n' +
    '<code>/hatirlatici yarın 09:00 işe git</code>'
  }}];
}

sd.reminders.push({chatId: chatId, message: reminderMsg, dueAt: dueAt});

var dueTime = new Date(dueAt).toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
var dueDate = new Date(dueAt).toLocaleDateString('tr-TR',{weekday:'short',day:'2-digit',month:'short'});
return [{json: {chatId, message:
  '⏰ <b>Hatırlatıcı Eklendi!</b>\n\n' +
  '📝 "' + reminderMsg + '"\n' +
  '🕐 ' + dueDate + ' ' + dueTime
}}];
""".strip()

# Her 1 dakikada calistirilan schedule: vadesi gecen hatirlaticlari gonder
CHECK_REMINDERS_CODE = r"""
const sd  = $getWorkflowStaticData('global');
if (!sd.reminders || sd.reminders.length === 0) return [];
const now = Date.now();
const due = sd.reminders.filter(function(r){ return r.dueAt <= now; });
sd.reminders = sd.reminders.filter(function(r){ return r.dueAt > now; });
return due.map(function(r){ return {json: {
  chatId:  r.chatId,
  message: '⏰ <b>Hatırlatıcı!</b>\n\n' + r.message,
}}; });
""".strip()

PREP_TOPLANTI_CODE = r"""
const item = $input.first().json;
const today = new Date().toLocaleString('tr-TR',{timeZone:'Europe/Istanbul',dateStyle:'full',timeStyle:'short'});
const prompt =
  'Türkiye saati: ' + today + '\n\n' +
  'Şu toplantı bilgisinden ayrıntıları çıkar. SADECE JSON döndür (başka metin yok):\n' +
  '"' + item.args + '"\n\n' +
  'Format (ISO8601 +03:00 zone ile):\n' +
  '{"title":"...","startDateTime":"2026-04-15T14:00:00+03:00","endDateTime":"2026-04-15T15:00:00+03:00","location":"","description":""}';
const body = JSON.stringify({
  model:'claude-opus-4-6', max_tokens:400,
  system:'Sadece geçerli JSON döndür, markdown veya açıklama ekleme.',
  messages:[{role:'user',content:prompt}]
});
return [{json: {chatId: item.chatId, args: item.args, anthropicBody: body}}];
""".strip()

EXTRACT_TOPLANTI_CODE = r"""
const chatId = $('Parse Command').item.json.chatId;
const r = $input.first().json;
if (r.error || !r.content) return [{json:{chatId, parseOk:'false', message:'❌ Toplantı bilgisi ayrıştırılamadı.'}}];
try {
  const raw = r.content[0].text.replace(/^```json?\n?/,'').replace(/\n?```$/,'').trim();
  const ev  = JSON.parse(raw);
  if (!ev.title || !ev.startDateTime) throw new Error('Eksik alan: title veya startDateTime');
  return [{json:{
    chatId, parseOk:'true',
    eventTitle:       ev.title,
    eventStart:       ev.startDateTime,
    eventEnd:         ev.endDateTime || ev.startDateTime,
    eventLocation:    ev.location    || '',
    eventDescription: ev.description || '',
  }}];
} catch(e) {
  return [{json:{chatId, parseOk:'false', message:'❌ Ayrıştırma hatası: ' + e.message}}];
}
""".strip()

CONFIRM_TOPLANTI_CODE = r"""
const chatId = $('Parse Command').item.json.chatId;
const orig   = $('Extract Toplanti').item.json;
const r = $input.first().json;
if (r.error) return [{json:{chatId, message:'❌ Takvim etkinliği oluşturulamadı.'}}];
const startStr = new Date(orig.eventStart).toLocaleString('tr-TR',{timeZone:'Europe/Istanbul',dateStyle:'medium',timeStyle:'short'});
const msg = '✅ <b>Toplantı Eklendi!</b>\n\n' +
  '📌 <b>' + orig.eventTitle + '</b>\n' +
  '🕐 ' + startStr +
  (orig.eventLocation ? '\n📍 ' + orig.eventLocation : '') +
  '\n\n<a href="https://calendar.google.com">Google Calendar →</a>';
return [{json:{chatId, message:msg}}];
""".strip()

HELP_TEXT = (
    r"'🤖 <b>PromptForge Asistan</b>\n\n"
    r"<b>📝 İçerik:</b>\n"
    r"/blog [konu] — Blog taslağı\n"
    r"/ozet [metin] — Metin özeti\n"
    r"/mail [konu] — E-posta taslağı\n"
    r"/ara [soru] — Araştır / Cevapla\n\n"
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

auth_headers = [{"name": "x-automation-key", "value": AUTOMATION_KEY}]


def build_nodes_and_connections():
    reply_body    = "={{ JSON.stringify({chat_id: $json.chatId, text: $json.message, parse_mode: 'HTML'}) }}"
    help_body     = "={{ JSON.stringify({chat_id: $json.chatId, text: " + HELP_TEXT + ", parse_mode: 'HTML'}) }}"
    unknown_body  = (
        "={{ JSON.stringify({chat_id: $json.chatId,"
        r" text: '❓ Bilinmeyen: <code>' + $json.command + '</code>\n/yardim → komut listesi',"
        " parse_mode: 'HTML'}) }}"
    )
    parse_err_body = "={{ JSON.stringify({chat_id: $json.chatId, text: $json.message, parse_mode: 'HTML'}) }}"

    nodes = [
        # ── Trigger 1: Telegram Webhook ──────────────────────────────────────
        {"id": "wh12", "name": "Telegram Webhook", "type": "n8n-nodes-base.webhook",
         "typeVersion": 2, "position": [240, 560], "webhookId": "telegram-bot-hook",
         "parameters": {"httpMethod": "POST", "path": "telegram-bot",
                        "responseMode": "onReceived", "responseData": ""}},
        # ── Trigger 2: Schedule 1 dk ─────────────────────────────────────────
        {"id": "sched12", "name": "Every 1 Min",
         "type": "n8n-nodes-base.scheduleTrigger", "typeVersion": 1.1,
         "position": [240, 760],
         "parameters": {"rule": {"interval": [{"field": "minutes", "minutesInterval": 1}]}}},
        # ── Parse & Switch ────────────────────────────────────────────────────
        code_node("parse12", "Parse Command",  [500, 560], PARSE_CODE),
        switch_node("sw12", "Switch Command", [760, 560], [
            ("={{ $json.commandType }}", "yardim"),      # 0
            ("={{ $json.commandType }}", "stats"),       # 1
            ("={{ $json.commandType }}", "claude"),      # 2
            ("={{ $json.commandType }}", "durum"),       # 3
            ("={{ $json.commandType }}", "todo"),        # 4
            ("={{ $json.commandType }}", "hatirlatici"), # 5
            ("={{ $json.commandType }}", "toplanti"),    # 6
        ]),
        # ── 0: /yardim ────────────────────────────────────────────────────────
        tg_send("help12", "Send Help", [1020, 260], help_body),
        # ── 1: /istatistik ────────────────────────────────────────────────────
        http_node("stats_req12", "Get Stats", [1020, 400], "GET",
                  f"{API_BASE}/api/v1/automation/stats", headers=auth_headers,
                  on_error="continueRegularOutput"),
        code_node("stats_fmt12", "Format Stats", [1280, 400], FMT_STATS_CODE),
        tg_reply( "stats_snd12", "Send Stats",   [1540, 400]),
        # ── 2: /claude ────────────────────────────────────────────────────────
        code_node( "prep_cl12", "Prep Claude",   [1020, 540], PREP_CLAUDE_CODE),
        anthropic_node("cl12",  "Claude API",    [1280, 540]),
        code_node( "fmt_cl12",  "Format Claude", [1540, 540], FMT_CLAUDE_CODE),
        tg_reply(  "snd_cl12",  "Send Claude",   [1800, 540]),
        # ── 3: /durum ─────────────────────────────────────────────────────────
        http_node("durum_req12", "Get Health", [1020, 680], "GET",
                  f"{API_BASE}/health", on_error="continueRegularOutput"),
        code_node("durum_fmt12", "Format Health", [1280, 680], FMT_DURUM_CODE),
        tg_reply( "durum_snd12", "Send Health",   [1540, 680]),
        # ── 4: /todo ──────────────────────────────────────────────────────────
        code_node("todo12",     "Todo Handler", [1020, 820], TODO_CODE),
        tg_reply( "todo_snd12", "Send Todo",    [1280, 820]),
        # ── 5: /hatirlatici (dogrudan static data) ────────────────────────────
        code_node("rem12",     "Reminder Handler", [1020, 960], REMINDER_CODE),
        tg_reply( "rem_snd12", "Send Reminder",    [1280, 960]),
        # ── 6: /toplanti ──────────────────────────────────────────────────────
        code_node(    "tp_prep12",   "Prep Toplanti",    [1020, 1100], PREP_TOPLANTI_CODE),
        anthropic_node("tp_cl12",   "Toplanti Claude",  [1280, 1100]),
        code_node(    "tp_ext12",   "Extract Toplanti", [1540, 1100], EXTRACT_TOPLANTI_CODE),
        if_node(      "tp_if12",    "Parse OK?",        [1800, 1100],
                      "={{ $json.parseOk }}", "true"),
        gcal_node(    "tp_cal12",   "Create Calendar Event", [2060, 1000], {
            "start": "={{ $json.eventStart }}",
            "end":   "={{ $json.eventEnd }}",
            "additionalFields": {
                "summary":     "={{ $json.eventTitle }}",
                "location":    "={{ $json.eventLocation }}",
                "description": "={{ $json.eventDescription }}",
            }
        }),
        code_node(  "tp_ok12",       "Confirm Toplanti",  [2320, 1000], CONFIRM_TOPLANTI_CODE),
        tg_reply(   "tp_snd_ok12",   "Send Calendar OK",  [2580, 1000]),
        tg_send(    "tp_snd_err12",  "Send Parse Error",  [2060, 1200], parse_err_body),
        # ── fallback ──────────────────────────────────────────────────────────
        tg_send("unknown12", "Unknown Cmd", [1020, 1280], unknown_body),
        # ── Schedule path: hatirlatic kontrol ─────────────────────────────────
        code_node("check_rem12", "Check Reminders", [500, 760], CHECK_REMINDERS_CODE),
        tg_reply( "fire_rem12",  "Fire Reminder",   [760, 760]),
    ]

    connections = {
        "Telegram Webhook": {"main": [[{"node": "Parse Command",   "type": "main", "index": 0}]]},
        "Every 1 Min":      {"main": [[{"node": "Check Reminders", "type": "main", "index": 0}]]},
        "Parse Command":    {"main": [[{"node": "Switch Command",  "type": "main", "index": 0}]]},
        "Switch Command":   {"main": [
            [{"node": "Send Help",       "type": "main", "index": 0}],  # 0
            [{"node": "Get Stats",       "type": "main", "index": 0}],  # 1
            [{"node": "Prep Claude",     "type": "main", "index": 0}],  # 2
            [{"node": "Get Health",      "type": "main", "index": 0}],  # 3
            [{"node": "Todo Handler",    "type": "main", "index": 0}],  # 4
            [{"node": "Reminder Handler","type": "main", "index": 0}],  # 5
            [{"node": "Prep Toplanti",   "type": "main", "index": 0}],  # 6
            [{"node": "Unknown Cmd",     "type": "main", "index": 0}],  # fallback
        ]},
        "Get Stats":    {"main": [[{"node": "Format Stats",    "type": "main", "index": 0}]]},
        "Format Stats": {"main": [[{"node": "Send Stats",      "type": "main", "index": 0}]]},
        "Prep Claude":    {"main": [[{"node": "Claude API",     "type": "main", "index": 0}]]},
        "Claude API":     {"main": [[{"node": "Format Claude",  "type": "main", "index": 0}]]},
        "Format Claude":  {"main": [[{"node": "Send Claude",    "type": "main", "index": 0}]]},
        "Get Health":    {"main": [[{"node": "Format Health",  "type": "main", "index": 0}]]},
        "Format Health": {"main": [[{"node": "Send Health",    "type": "main", "index": 0}]]},
        "Todo Handler":  {"main": [[{"node": "Send Todo",      "type": "main", "index": 0}]]},
        "Reminder Handler":{"main":[[{"node": "Send Reminder", "type": "main", "index": 0}]]},
        "Prep Toplanti":   {"main": [[{"node": "Toplanti Claude",      "type": "main", "index": 0}]]},
        "Toplanti Claude": {"main": [[{"node": "Extract Toplanti",     "type": "main", "index": 0}]]},
        "Extract Toplanti":{"main": [[{"node": "Parse OK?",            "type": "main", "index": 0}]]},
        "Parse OK?":       {"main": [
            [{"node": "Create Calendar Event","type":"main","index":0}],  # true
            [{"node": "Send Parse Error",     "type":"main","index":0}],  # false
        ]},
        "Create Calendar Event": {"main": [[{"node": "Confirm Toplanti", "type": "main", "index": 0}]]},
        "Confirm Toplanti":      {"main": [[{"node": "Send Calendar OK", "type": "main", "index": 0}]]},
        "Check Reminders":       {"main": [[{"node": "Fire Reminder",    "type": "main", "index": 0}]]},
    }
    return nodes, connections


if __name__ == "__main__":
    print("=== WF12 Final Rebuild ===")

    nodes, connections = build_nodes_and_connections()

    api("POST", f"/workflows/{WF12_ID}/deactivate")

    wf = api("GET", f"/workflows/{WF12_ID}")
    wf["nodes"]       = nodes
    wf["connections"] = connections
    payload = {k: wf[k] for k in ("name","nodes","connections","settings","staticData") if k in wf}
    result  = api("PUT", f"/workflows/{WF12_ID}", payload)

    if result and "id" in result:
        print("  Updated OK")
        if api("POST", f"/workflows/{WF12_ID}/activate"):
            print("  Activated OK")
    else:
        print("  FAILED")

    print("=== TAMAMLANDI ===")
