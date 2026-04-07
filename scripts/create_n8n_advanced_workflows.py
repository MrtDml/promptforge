import json
import urllib.request
import urllib.error

N8N_URL           = "https://n8n.promptforgeai.dev"
N8N_API_KEY       = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYzAwMTYxMS0zYjdhLTQzNmItYTdlYi01MTJiMWJhODAyZGQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZDE5ZjI0NzktNzJhZS00YjBiLWE3YmUtMjI3NmZjZDIyM2M3IiwiaWF0IjoxNzc1NTEzMDgyfQ.i35VqeXu6ZqQLAYdS-GNh3gdnpd6iFAYjtMR4i_ttx4"
TELEGRAM_TOKEN    = "8226317784:AAGj2rolmw1VyynN-g6ypIHYwfxK3rRsACg"
TELEGRAM_CHAT_ID  = "6416910856"
ANTHROPIC_KEY     = "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"
AUTOMATION_KEY    = "430de61b40c198141b89e087cfe4265cd7c7fdc68cdb4f34a6c75dca85f05e43"
API_BASE          = "https://api.promptforgeai.dev"

HEADERS = {"X-N8N-API-KEY": N8N_API_KEY, "Content-Type": "application/json"}

# ─── Core helpers ─────────────────────────────────────────────────────────────

def api_call(method, path, data=None):
    url  = f"{N8N_URL}/api/v1{path}"
    body = json.dumps(data).encode() if data else None
    req  = urllib.request.Request(url, data=body, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f"  ERROR {e.code}: {e.read().decode()[:400]}")
        return None

def create_and_activate(wf_data):
    result = api_call("POST", "/workflows", wf_data)
    if result and "id" in result:
        wid = result["id"]
        print(f"  Created: {wf_data['name']} (id={wid})")
        if api_call("POST", f"/workflows/{wid}/activate"):
            print("  Activated OK")
        return wid
    return None

def http_post_to_telegram(msg_expr):
    """Raw JSON body for Telegram sendMessage."""
    return (
        "={{ JSON.stringify({"
        f"chat_id: '{TELEGRAM_CHAT_ID}',"
        f"text: {msg_expr},"
        "parse_mode: 'HTML'"
        "}) }}"
    )

def telegram_send_node(nid, name, pos, body_expr):
    return {
        "id": nid, "name": name,
        "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2,
        "position": pos,
        "parameters": {
            "method": "POST",
            "url": f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage",
            "sendBody": True, "contentType": "raw", "rawContentType": "application/json",
            "body": body_expr,
        },
    }

def tg_reply_node(nid, name, pos, body_expr):
    """Send to chat_id taken from $json.chatId (for command-bot branches)."""
    return {
        "id": nid, "name": name,
        "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2,
        "position": pos,
        "parameters": {
            "method": "POST",
            "url": f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage",
            "sendBody": True, "contentType": "raw", "rawContentType": "application/json",
            "body": body_expr,
        },
    }

def http_get_node(nid, name, pos, url, headers=None, on_error="stopAndError"):
    params = {"method": "GET", "url": url}
    if headers:
        params["sendHeaders"] = True
        params["headerParameters"] = {"parameters": headers}
    node = {
        "id": nid, "name": name,
        "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2,
        "position": pos,
        "parameters": params,
    }
    if on_error != "stopAndError":
        node["onError"] = on_error
    return node

def anthropic_node(nid, name, pos, content_expr, max_tokens=2000):
    body = (
        "={{ JSON.stringify({"
        "model: 'claude-opus-4-6',"
        f"max_tokens: {max_tokens},"
        f"messages: [{{role: 'user', content: {content_expr}}}]"
        "}) }}"
    )
    return {
        "id": nid, "name": name,
        "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2,
        "position": pos,
        "onError": "continueRegularOutput",
        "parameters": {
            "method": "POST",
            "url": "https://api.anthropic.com/v1/messages",
            "sendHeaders": True,
            "headerParameters": {
                "parameters": [
                    {"name": "x-api-key",           "value": ANTHROPIC_KEY},
                    {"name": "anthropic-version",    "value": "2023-06-01"},
                ]
            },
            "sendBody": True, "contentType": "raw", "rawContentType": "application/json",
            "body": body,
        },
    }

def code_node(nid, name, pos, code, mode="runOnceForAllItems"):
    return {
        "id": nid, "name": name,
        "type": "n8n-nodes-base.code", "typeVersion": 2,
        "position": pos,
        "parameters": {"jsCode": code, "mode": mode},
    }

def switch_node(nid, name, pos, rules):
    """rules = list of (field_expr, value) tuples; last output = fallback."""
    values = []
    for i, (field_expr, value) in enumerate(rules):
        values.append({
            "outputKey": str(i),
            "conditions": {
                "options": {"caseSensitive": False, "leftValue": "", "typeValidation": "strict"},
                "conditions": [{
                    "id": f"r{i}",
                    "leftValue": field_expr,
                    "rightValue": value,
                    "operator": {"type": "string", "operation": "equals"},
                }],
                "combinator": "and",
            },
            "renameOutput": False,
        })
    return {
        "id": nid, "name": name,
        "type": "n8n-nodes-base.switch", "typeVersion": 3,
        "position": pos,
        "parameters": {
            "mode": "rules",
            "rules": {"values": values},
            "fallbackOutput": "extra",
            "options": {},
        },
    }

def automation_headers():
    return [{"name": "x-automation-key", "value": AUTOMATION_KEY}]

# ════════════════════════════════════════════════════════════════════════════
# WF11: Yeni Kullanici Anlık Bildirimi
#   NestJS fires POST /webhook/new-user → n8n → Telegram instant alert
# ════════════════════════════════════════════════════════════════════════════
def wf11_new_user_webhook():
    print("\n[WF11] Yeni Kullanici Anlık Bildirimi")

    body_expr = (
        "={{ JSON.stringify({"
        f"chat_id: '{TELEGRAM_CHAT_ID}',"
        r"text: '🎉 <b>Yeni Kullanıcı!</b>\n\n'"
        r"+ '👤 <b>' + $json.name + '</b>\n'"
        r"+ '📧 ' + $json.email + '\n'"
        r"+ '🔗 Kayıt: ' + ($json.source || 'Form') + '\n'"
        r"+ '🕐 ' + new Date().toLocaleTimeString('tr-TR', {hour:'2-digit',minute:'2-digit'}),"
        "parse_mode: 'HTML'"
        "}) }}"
    )

    nodes = [
        {
            "id": "wh11", "name": "New User Webhook",
            "type": "n8n-nodes-base.webhook", "typeVersion": 2,
            "position": [240, 300],
            "webhookId": "new-user-registration",
            "parameters": {"httpMethod": "POST", "path": "new-user", "responseMode": "onReceived", "responseData": ""},
        },
        telegram_send_node("tg11", "Notify Telegram", [500, 300], body_expr),
    ]
    connections = {
        "New User Webhook": {"main": [[{"node": "Notify Telegram", "type": "main", "index": 0}]]},
    }
    return create_and_activate({
        "name": "11. Yeni Kullanici Bildirimi",
        "nodes": nodes,
        "connections": connections,
        "settings": {"executionOrder": "v1"},
    })


# ════════════════════════════════════════════════════════════════════════════
# WF12: Telegram Komut Botu
#   Telegram webhook → parse → switch → handlers
#   Commands: /yardim /istatistik /blog /durum /ozet
# ════════════════════════════════════════════════════════════════════════════
def wf12_telegram_bot():
    print("\n[WF12] Telegram Komut Botu")

    parse_code = r"""
const update = $input.first().json;
const msg = update.message || update.edited_message;

if (!msg || !msg.text || !msg.text.startsWith('/')) {
  return [];
}

const parts = msg.text.trim().split(/\s+/);
const command = parts[0].toLowerCase().replace(/@\w+$/, '');
const args = parts.slice(1).join(' ').trim();
return [{json: {command, args, chatId: String(msg.chat.id), messageId: msg.message_id}}];
""".strip()

    stats_fmt_code = r"""
const chatId = $('Parse Command').item.json.chatId;
const s = $input.first().json;
if (s.error || !s.users) {
  return [{json: {chatId, message: '❌ İstatistikler alınamadı. Lütfen tekrar deneyin.'}}];
}
const plans = (s.plans || []).map(p => `  ${p.plan}: <b>${p.count}</b>`).join('\n');
const msg =
  '<b>📊 PromptForge İstatistikleri</b>\n\n' +
  '<b>👥 Kullanıcılar</b>\n' +
  `  Toplam: <b>${s.users.total}</b>\n` +
  `  Doğrulanmış: ${s.users.verified}\n` +
  `  Bugün: +${s.users.newToday}\n` +
  `  Bu Hafta: +${s.users.newThisWeek}\n` +
  `  Bu Ay: +${s.users.newThisMonth}\n\n` +
  '<b>📁 Projeler</b>\n' +
  `  Toplam: <b>${s.projects.total}</b>\n` +
  `  Bugün: +${s.projects.createdToday}\n` +
  `  Bu Hafta: +${s.projects.createdThisWeek}\n\n` +
  '<b>💳 Plan Dağılımı</b>\n' + plans + '\n\n' +
  `<i>🕐 ${new Date().toLocaleString('tr-TR', {timeZone:'Europe/Istanbul'})}</i>`;
return [{json: {chatId, message: msg}}];
""".strip()

    blog_fmt_code = r"""
const chatId = $('Parse Command').item.json.chatId;
const r = $input.first().json;
if (r.error || !r.content) {
  return [{json: {chatId, message: '❌ Blog taslağı oluşturulamadı. Lütfen tekrar deneyin.'}}];
}
const text = r.content[0].text;
return [{json: {chatId, message: text.substring(0, 4000)}}];
""".strip()

    durum_fmt_code = r"""
const chatId = $('Parse Command').item.json.chatId;
const r = $input.first().json;
const isOk = !r.error;
const statusEmoji = isOk ? '✅' : '❌';
const statusText  = isOk ? 'Çalışıyor' : 'Erişilemiyor';
const msg =
  '<b>🖥️ Sistem Durumu</b>\n\n' +
  `API (api.promptforgeai.dev): ${statusEmoji} ${statusText}\n` +
  `Frontend (promptforgeai.dev): ✅ Vercel\n` +
  `n8n (n8n.promptforgeai.dev): ✅ Çalışıyor\n\n` +
  `<i>🕐 ${new Date().toLocaleTimeString('tr-TR', {hour:'2-digit',minute:'2-digit'})}</i>`;
return [{json: {chatId, message: msg}}];
""".strip()

    ozet_fmt_code = r"""
const chatId = $('Parse Command').item.json.chatId;
const r = $input.first().json;
if (r.error || !r.content) {
  return [{json: {chatId, message: '❌ Özet oluşturulamadı. Lütfen tekrar deneyin.'}}];
}
const text = r.content[0].text;
return [{json: {chatId, message: '<b>📝 Özet</b>\n\n' + text.substring(0, 4000)}}];
""".strip()

    help_body = (
        "={{ JSON.stringify({"
        "chat_id: $json.chatId,"
        r"text: '🤖 <b>PromptForge Asistan</b>\n\n<b>Komutlar:</b>\n\n"
        r"/istatistik — Platform istatistikleri\n"
        r"/blog [konu] — Türkçe blog taslağı oluştur\n"
        r"/ozet [metin] — Metni Türkçe özetle\n"
        r"/durum — Sistem durumu kontrolü\n"
        r"/yardim — Bu yardım mesajı\n\n"
        r"<i>Örnek: /blog Yapay Zekanın İş Dünyasına Etkisi</i>',"
        "parse_mode: 'HTML'"
        "}) }}"
    )

    unknown_body = (
        "={{ JSON.stringify({"
        "chat_id: $json.chatId,"
        r"text: '❓ Bilinmeyen komut: <code>' + $json.command + '</code>\n\n/yardim yazarak mevcut komutları görebilirsin.',"
        "parse_mode: 'HTML'"
        "}) }}"
    )

    reply_body = (
        "={{ JSON.stringify({"
        "chat_id: $json.chatId,"
        "text: $json.message,"
        "parse_mode: 'HTML'"
        "}) }}"
    )

    blog_content_expr = (
        "'Şu konu hakkında Türkçe kapsamlı bir blog yazısı taslağı hazırla. "
        "Başlık, giriş, 3-4 ana bölüm ve sonuç içersin. HTML formatlamaya gerek yok. Konu: ' + $json.args"
    )

    ozet_content_expr = (
        "'Şu metni Türkçe olarak özetle, ana noktaları vurgula:\\n\\n' + $json.args"
    )

    nodes = [
        # ── Trigger ──────────────────────────────────────────────────────
        {
            "id": "wh12", "name": "Telegram Webhook",
            "type": "n8n-nodes-base.webhook", "typeVersion": 2,
            "position": [240, 300],
            "webhookId": "telegram-bot-hook",
            "parameters": {
                "httpMethod": "POST",
                "path": "telegram-bot",
                "responseMode": "onReceived",
                "responseData": "",
            },
        },
        # ── Parse ─────────────────────────────────────────────────────────
        code_node("parse12", "Parse Command", [500, 300], parse_code),
        # ── Switch ────────────────────────────────────────────────────────
        switch_node("sw12", "Switch Command", [760, 300], [
            ("={{ $json.command }}", "/yardim"),
            ("={{ $json.command }}", "/istatistik"),
            ("={{ $json.command }}", "/blog"),
            ("={{ $json.command }}", "/durum"),
            ("={{ $json.command }}", "/ozet"),
        ]),
        # ── /yardim ──────────────────────────────────────────────────────
        tg_reply_node("help12", "Send Help", [1020, 80], help_body),
        # ── /istatistik ──────────────────────────────────────────────────
        http_get_node(
            "stats_req12", "Get Stats", [1020, 200],
            f"{API_BASE}/api/v1/automation/stats",
            headers=automation_headers(),
            on_error="continueRegularOutput",
        ),
        code_node("stats_fmt12", "Format Stats", [1280, 200], stats_fmt_code),
        tg_reply_node("stats_send12", "Send Stats", [1540, 200], reply_body),
        # ── /blog ────────────────────────────────────────────────────────
        anthropic_node("blog_req12", "Blog Claude", [1020, 320], blog_content_expr, max_tokens=3000),
        code_node("blog_fmt12", "Format Blog", [1280, 320], blog_fmt_code),
        tg_reply_node("blog_send12", "Send Blog", [1540, 320], reply_body),
        # ── /durum ───────────────────────────────────────────────────────
        http_get_node(
            "durum_req12", "Get Health", [1020, 440],
            f"{API_BASE}/health",
            on_error="continueRegularOutput",
        ),
        code_node("durum_fmt12", "Format Health", [1280, 440], durum_fmt_code),
        tg_reply_node("durum_send12", "Send Health", [1540, 440], reply_body),
        # ── /ozet ────────────────────────────────────────────────────────
        anthropic_node("ozet_req12", "Ozet Claude", [1020, 560], ozet_content_expr, max_tokens=1000),
        code_node("ozet_fmt12", "Format Ozet", [1280, 560], ozet_fmt_code),
        tg_reply_node("ozet_send12", "Send Ozet", [1540, 560], reply_body),
        # ── fallback ─────────────────────────────────────────────────────
        tg_reply_node("unknown12", "Unknown Cmd", [1020, 680], unknown_body),
    ]

    connections = {
        "Telegram Webhook": {"main": [[{"node": "Parse Command", "type": "main", "index": 0}]]},
        "Parse Command":    {"main": [[{"node": "Switch Command", "type": "main", "index": 0}]]},
        "Switch Command":   {"main": [
            [{"node": "Send Help",    "type": "main", "index": 0}],   # 0 /yardim
            [{"node": "Get Stats",   "type": "main", "index": 0}],   # 1 /istatistik
            [{"node": "Blog Claude", "type": "main", "index": 0}],   # 2 /blog
            [{"node": "Get Health",  "type": "main", "index": 0}],   # 3 /durum
            [{"node": "Ozet Claude", "type": "main", "index": 0}],   # 4 /ozet
            [{"node": "Unknown Cmd", "type": "main", "index": 0}],   # 5 fallback
        ]},
        "Get Stats":   {"main": [[{"node": "Format Stats",  "type": "main", "index": 0}]]},
        "Format Stats":{"main": [[{"node": "Send Stats",    "type": "main", "index": 0}]]},
        "Blog Claude": {"main": [[{"node": "Format Blog",   "type": "main", "index": 0}]]},
        "Format Blog": {"main": [[{"node": "Send Blog",     "type": "main", "index": 0}]]},
        "Get Health":  {"main": [[{"node": "Format Health", "type": "main", "index": 0}]]},
        "Format Health":{"main":[[{"node": "Send Health",   "type": "main", "index": 0}]]},
        "Ozet Claude": {"main": [[{"node": "Format Ozet",   "type": "main", "index": 0}]]},
        "Format Ozet": {"main": [[{"node": "Send Ozet",     "type": "main", "index": 0}]]},
    }
    return create_and_activate({
        "name": "12. Telegram Komut Botu",
        "nodes": nodes,
        "connections": connections,
        "settings": {"executionOrder": "v1"},
    })


# ════════════════════════════════════════════════════════════════════════════
# WF13: Haftalık Özet Raporu — her Pazartesi 09:00
# ════════════════════════════════════════════════════════════════════════════
def wf13_weekly_summary():
    print("\n[WF13] Haftalik Ozet Raporu")

    fmt_code = r"""
const s = $input.first().json;
if (!s.users) {
  return [{json: {message: 'Haftalik rapor alinamadi.'}}];
}
const plans = (s.plans || []).map(p => `  ${p.plan}: <b>${p.count}</b>`).join('\n');
const date = new Date().toLocaleDateString('tr-TR', {weekday:'long', day:'2-digit', month:'long', year:'numeric'});
const convRate = s.users.total > 0 ? ((s.users.total - (s.plans.find(p=>p.plan==='free')?.count||0)) / s.users.total * 100).toFixed(1) : 0;
const msg =
  `<b>📅 Haftalık Rapor — ${date}</b>\n\n` +
  '<b>👥 Kullanıcılar</b>\n' +
  `  Toplam: <b>${s.users.total}</b>\n` +
  `  Bu Hafta: +<b>${s.users.newThisWeek}</b>\n` +
  `  Bu Ay: +${s.users.newThisMonth}\n` +
  `  Doğrulanmış: ${s.users.verified}\n\n` +
  '<b>📁 Projeler</b>\n' +
  `  Toplam: <b>${s.projects.total}</b>\n` +
  `  Bu Hafta: +${s.projects.createdThisWeek}\n\n` +
  '<b>💳 Plan Dağılımı</b>\n' + plans + '\n\n' +
  `<b>📈 Ücretli Oran:</b> %${convRate}\n\n` +
  '<a href="https://promptforgeai.dev/admin">Admin Panel →</a>';
return [{json: {message: msg}}];
""".strip()

    msg_body = http_post_to_telegram("$json.message")

    nodes = [
        {
            "id": "s13", "name": "Monday 09:00",
            "type": "n8n-nodes-base.scheduleTrigger", "typeVersion": 1.1,
            "position": [240, 300],
            "parameters": {"rule": {"interval": [{"field": "cronExpression", "expression": "0 9 * * 1"}]}},
        },
        http_get_node(
            "stats13", "Get Weekly Stats", [460, 300],
            f"{API_BASE}/api/v1/automation/stats",
            headers=automation_headers(),
        ),
        code_node("fmt13", "Format Weekly Report", [680, 300], fmt_code),
        telegram_send_node("tg13", "Send Weekly Report", [900, 300], msg_body),
    ]
    connections = {
        "Monday 09:00":        {"main": [[{"node": "Get Weekly Stats",        "type": "main", "index": 0}]]},
        "Get Weekly Stats":    {"main": [[{"node": "Format Weekly Report",    "type": "main", "index": 0}]]},
        "Format Weekly Report":{"main": [[{"node": "Send Weekly Report",      "type": "main", "index": 0}]]},
    }
    return create_and_activate({
        "name": "13. Haftalik Ozet Raporu",
        "nodes": nodes,
        "connections": connections,
        "settings": {"executionOrder": "v1"},
    })


# ════════════════════════════════════════════════════════════════════════════
# WF14: Sistem Sağlık İzleyici — her 30 dakikada bir
#   3 ardışık başarısız kontrol → Telegram alarm (spam'i önler)
# ════════════════════════════════════════════════════════════════════════════
def wf14_health_monitor():
    print("\n[WF14] Sistem Saglık Izleyici")

    check_code = r"""
const sd = $getWorkflowStaticData('global');
const r  = $input.first().json;
const isOk = !r.error && !r.statusCode; // success = no error, no explicit statusCode field (body returned)

if (isOk) {
  if (sd.strikes > 0) {
    sd.strikes = 0;
    // Recovery alert
    const msg =
      '✅ <b>PromptForge API Geri Döndü!</b>\n\n' +
      'API tekrar erişilebilir durumda.\n' +
      `<i>🕐 ${new Date().toLocaleTimeString('tr-TR', {hour:'2-digit',minute:'2-digit'})}</i>`;
    return [{json: {message: msg}}];
  }
  sd.strikes = 0;
  return [];
}

sd.strikes = (sd.strikes || 0) + 1;
if (sd.strikes >= 3) {
  sd.strikes = 0;
  const errDetail = r.error ? String(r.error).substring(0, 100) : 'Bağlantı hatası';
  const msg =
    '🚨 <b>PromptForge API Erişilemiyor!</b>\n\n' +
    `3 ardışık sağlık kontrolü başarısız.\n` +
    `Hata: ${errDetail}\n\n` +
    '🔗 <a href="https://railway.app">Railway Dashboard</a>\n' +
    `<i>🕐 ${new Date().toLocaleTimeString('tr-TR', {hour:'2-digit',minute:'2-digit'})}</i>`;
  return [{json: {message: msg}}];
}
return [];
""".strip()

    alert_body = http_post_to_telegram("$json.message")

    nodes = [
        {
            "id": "s14", "name": "Every 30 Min",
            "type": "n8n-nodes-base.scheduleTrigger", "typeVersion": 1.1,
            "position": [240, 300],
            "parameters": {"rule": {"interval": [{"field": "minutes", "minutesInterval": 30}]}},
        },
        http_get_node(
            "health14", "Check API Health", [460, 300],
            f"{API_BASE}/health",
            on_error="continueRegularOutput",
        ),
        code_node("check14", "Evaluate Health", [680, 300], check_code),
        telegram_send_node("alert14", "Send Alert", [900, 300], alert_body),
    ]
    connections = {
        "Every 30 Min":   {"main": [[{"node": "Check API Health", "type": "main", "index": 0}]]},
        "Check API Health":{"main":[[{"node": "Evaluate Health",  "type": "main", "index": 0}]]},
        "Evaluate Health":{"main": [[{"node": "Send Alert",       "type": "main", "index": 0}]]},
    }
    return create_and_activate({
        "name": "14. Sistem Saglık Izleyici",
        "nodes": nodes,
        "connections": connections,
        "settings": {"executionOrder": "v1"},
    })


# ════════════════════════════════════════════════════════════════════════════
# Set Telegram webhook → n8n WF12 endpoint
# ════════════════════════════════════════════════════════════════════════════
def set_telegram_webhook():
    webhook_url = f"{N8N_URL}/webhook/telegram-bot"
    print(f"\n[Telegram] Setting webhook → {webhook_url}")
    tg_url  = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/setWebhook"
    payload = json.dumps({"url": webhook_url}).encode()
    req = urllib.request.Request(
        tg_url, data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read())
            if result.get("ok"):
                print("  Telegram webhook set OK")
            else:
                print(f"  Telegram webhook error: {result}")
    except Exception as e:
        print(f"  Telegram webhook exception: {e}")


# ════════════════════════════════════════════════════════════════════════════
# MAIN
# ════════════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    print("=== Advanced Workflows (WF11-WF14) ===")
    ids = {}
    ids["wf11"] = wf11_new_user_webhook()
    ids["wf12"] = wf12_telegram_bot()
    set_telegram_webhook()
    ids["wf13"] = wf13_weekly_summary()
    ids["wf14"] = wf14_health_monitor()

    print("\n=== TAMAMLANDI ===")
    for k, v in ids.items():
        print(f"  {k}: {'OK' if v else 'FAILED'} (id={v})")
