import json
import urllib.request
import urllib.error

N8N_URL = "https://n8n.promptforgeai.dev"
N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYzAwMTYxMS0zYjdhLTQzNmItYTdlYi01MTJiMWJhODAyZGQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZDE5ZjI0NzktNzJhZS00YjBiLWE3YmUtMjI3NmZjZDIyM2M3IiwiaWF0IjoxNzc1NTEzMDgyfQ.i35VqeXu6ZqQLAYdS-GNh3gdnpd6iFAYjtMR4i_ttx4"
AUTOMATION_KEY = "430de61b40c198141b89e087cfe4265cd7c7fdc68cdb4f34a6c75dca85f05e43"
TELEGRAM_TOKEN = "8226317784:AAGj2rolmw1VyynN-g6ypIHYwfxK3rRsACg"
TELEGRAM_CHAT_ID = "6416910856"
API_BASE = "https://api.promptforgeai.dev"
FRONTEND = "https://promptforgeai.dev"

# Existing WF IDs
WF1_ID = "9OugdrZ49OwW6x2A"
WF2_ID = "4pDqdliOv1FyWbLx"

HEADERS = {"X-N8N-API-KEY": N8N_API_KEY, "Content-Type": "application/json"}

def api_call(method, path, data=None):
    url = f"{N8N_URL}/api/v1{path}"
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f"  ERROR {e.code}: {e.read().decode()[:300]}")
        return None

def create_and_activate(wf_data):
    result = api_call("POST", "/workflows", wf_data)
    if result and "id" in result:
        wf_id = result["id"]
        print(f"  Created: {wf_data['name']} (id={wf_id})")
        act = api_call("POST", f"/workflows/{wf_id}/activate")
        if act:
            print("  Activated OK")
        return wf_id
    return None

def schedule_node(node_id, name, pos, interval_type, interval_value):
    if interval_type == "cron":
        interval = [{"field": "cronExpression", "expression": interval_value}]
    elif interval_type == "minutes":
        interval = [{"field": "minutes", "minutesInterval": interval_value}]
    else:
        interval = [{"field": "hours", "hoursInterval": interval_value}]
    return {
        "id": node_id, "name": name,
        "type": "n8n-nodes-base.scheduleTrigger", "typeVersion": 1.1,
        "position": pos,
        "parameters": {"rule": {"interval": interval}}
    }

def http_get(node_id, name, pos, url, extra_headers=None):
    headers = extra_headers or []
    return {
        "id": node_id, "name": name,
        "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2,
        "position": pos, "onError": "continueRegularOutput",
        "parameters": {
            "method": "GET", "url": url,
            "sendHeaders": bool(headers),
            "headerParameters": {"parameters": headers},
            "options": {}
        }
    }

def telegram_node(node_id, name, pos, message_expr):
    return {
        "id": node_id, "name": name,
        "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2,
        "position": pos,
        "parameters": {
            "method": "POST",
            "url": f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage",
            "sendBody": True,
            "contentType": "raw",
            "rawContentType": "application/json",
            "body": "={{ JSON.stringify({chat_id: '" + TELEGRAM_CHAT_ID + "', text: " + message_expr + ", parse_mode: 'HTML'}) }}"
        }
    }

def automation_headers():
    return [{"name": "x-automation-key", "value": AUTOMATION_KEY}]

# ════════════════════════════════════════════════════════════════════════════
# WF6: Sabah Brifing (daily 08:00 → stats + weather + currency → Telegram)
# ════════════════════════════════════════════════════════════════════════════
def wf6_morning_briefing():
    print("\n[WF6] Sabah Brifing")

    js_code = r"""
const stats   = $('Get Stats').first().json;
const usd     = $('Get USD Rate').first().json;
const eur     = $('Get EUR Rate').first().json;
const weather = $('Get Weather').first().json;

const usdRate = (usd.rates && usd.rates.TRY) ? Number(usd.rates.TRY).toFixed(2) : 'N/A';
const eurRate = (eur.rates && eur.rates.TRY) ? Number(eur.rates.TRY).toFixed(2) : 'N/A';
const temp    = (weather.current_condition) ? weather.current_condition[0].temp_C : 'N/A';
const desc    = (weather.current_condition) ? weather.current_condition[0].weatherDesc[0].value : 'N/A';
const date    = new Date().toLocaleDateString('tr-TR', {day:'2-digit', month:'long', year:'numeric'});

const u = stats.users    || {};
const p = stats.projects || {};

const msg =
  '<b>📊 PromptForge Günlük Brifing</b>\n' +
  date + ' | Istanbul: ' + temp + '°C ' + desc + '\n\n' +
  '<b>👥 Kullanicilar</b>\n' +
  '• Bugün yeni: <b>' + (u.newToday || 0) + '</b>\n' +
  '• Bu hafta: '  + (u.newThisWeek  || 0) + '\n' +
  '• Bu ay: '     + (u.newThisMonth || 0) + '\n' +
  '• Toplam: '    + (u.total        || 0) + '\n\n' +
  '<b>🚀 Projeler</b>\n' +
  '• Bugün: <b>' + (p.createdToday    || 0) + '</b>\n' +
  '• Bu hafta: ' + (p.createdThisWeek || 0) + '\n' +
  '• Toplam: '   + (p.total          || 0) + '\n\n' +
  '<b>💱 Döviz</b>\n' +
  '• USD/TRY: ' + usdRate + '\n' +
  '• EUR/TRY: ' + eurRate + '\n\n' +
  '<a href="https://promptforgeai.dev/admin">Admin Panel →</a>';

return [{json: {message: msg}}];
""".strip()

    nodes = [
        schedule_node("s6",   "Daily 08:00",    [240, 300], "cron",  "0 8 * * *"),
        http_get("h6a", "Get Stats",    [460, 300], f"{API_BASE}/api/v1/automation/stats", automation_headers()),
        http_get("h6b", "Get USD Rate", [680, 300], "https://api.frankfurter.app/latest?from=USD&to=TRY"),
        http_get("h6c", "Get EUR Rate", [900, 300], "https://api.frankfurter.app/latest?from=EUR&to=TRY"),
        http_get("h6d", "Get Weather",  [1120, 300], "https://wttr.in/Istanbul?format=j1"),
        {
            "id": "code6", "name": "Build Message",
            "type": "n8n-nodes-base.code", "typeVersion": 2,
            "position": [1340, 300],
            "parameters": {"jsCode": js_code, "mode": "runOnceForAllItems"}
        },
        telegram_node("tg6", "Send Briefing", [1560, 300], "$json.message")
    ]
    connections = {
        "Daily 08:00":   {"main": [[{"node": "Get Stats",     "type": "main", "index": 0}]]},
        "Get Stats":     {"main": [[{"node": "Get USD Rate",  "type": "main", "index": 0}]]},
        "Get USD Rate":  {"main": [[{"node": "Get EUR Rate",  "type": "main", "index": 0}]]},
        "Get EUR Rate":  {"main": [[{"node": "Get Weather",   "type": "main", "index": 0}]]},
        "Get Weather":   {"main": [[{"node": "Build Message", "type": "main", "index": 0}]]},
        "Build Message": {"main": [[{"node": "Send Briefing", "type": "main", "index": 0}]]}
    }
    return create_and_activate({"name": "6. Sabah Brifing", "nodes": nodes, "connections": connections, "settings": {"executionOrder": "v1"}})

# ════════════════════════════════════════════════════════════════════════════
# WF7: Yeni Kullanici Alami (her 5 dk polling + static data)
# ════════════════════════════════════════════════════════════════════════════
def wf7_new_user_alert():
    print("\n[WF7] Yeni Kullanici Alarmi")

    js_code = r"""
const staticData = $getWorkflowStaticData('global');
const current = $json.users ? $json.users.total : 0;
const last    = staticData.lastTotal || 0;

if (current > last && last > 0) {
  const diff = current - last;
  staticData.lastTotal = current;
  return [{json: {hasNew: true, newCount: diff, total: current}}];
}

staticData.lastTotal = current;
return [{json: {hasNew: false, total: current}}];
""".strip()

    msg_expr = (
        "'🎉 <b>Yeni kullanici kayit oldu!</b>\\n\\n'"
        " + '• Yeni kayit: <b>' + $json.newCount + '</b>\\n'"
        " + '• Toplam kullanici: ' + $json.total + '\\n\\n'"
        " + '<a href=\"https://promptforgeai.dev/admin/users\">Kullanicilari Gor →</a>'"
    )

    nodes = [
        schedule_node("s7", "Every 5 Min", [240, 300], "minutes", 5),
        http_get("h7", "Get Stats", [460, 300], f"{API_BASE}/api/v1/automation/stats", automation_headers()),
        {
            "id": "code7", "name": "Check New Users",
            "type": "n8n-nodes-base.code", "typeVersion": 2,
            "position": [680, 300],
            "parameters": {"jsCode": js_code, "mode": "runOnceForAllItems"}
        },
        {
            "id": "if7", "name": "Has New Users?",
            "type": "n8n-nodes-base.if", "typeVersion": 2,
            "position": [900, 300],
            "parameters": {
                "conditions": {
                    "options": {"caseSensitive": True, "leftValue": "", "typeValidation": "loose"},
                    "conditions": [{"id": "c7", "leftValue": "={{ $json.hasNew }}", "rightValue": True, "operator": {"type": "boolean", "operation": "equals"}}],
                    "combinator": "and"
                }
            }
        },
        telegram_node("tg7", "Send New User Alert", [1120, 200], msg_expr),
        {"id": "noop7", "name": "No New Users", "type": "n8n-nodes-base.noOp", "typeVersion": 1, "position": [1120, 420], "parameters": {}}
    ]
    connections = {
        "Every 5 Min":    {"main": [[{"node": "Get Stats",        "type": "main", "index": 0}]]},
        "Get Stats":      {"main": [[{"node": "Check New Users",  "type": "main", "index": 0}]]},
        "Check New Users":{"main": [[{"node": "Has New Users?",   "type": "main", "index": 0}]]},
        "Has New Users?": {"main": [
            [{"node": "Send New User Alert", "type": "main", "index": 0}],
            [{"node": "No New Users",        "type": "main", "index": 0}]
        ]}
    }
    return create_and_activate({"name": "7. Yeni Kullanici Alarmi", "nodes": nodes, "connections": connections, "settings": {"executionOrder": "v1"}})

# ════════════════════════════════════════════════════════════════════════════
# WF8: Doviz Kuru Alarmi (saatlik, %1+ degisimde Telegram)
# ════════════════════════════════════════════════════════════════════════════
def wf8_currency_alarm():
    print("\n[WF8] Doviz Kuru Alarmi")

    js_code = r"""
const staticData = $getWorkflowStaticData('global');
const usd = $('Get USD').first().json;
const eur = $('Get EUR').first().json;

const usdNow = usd.rates ? Number(usd.rates.TRY) : 0;
const eurNow = eur.rates ? Number(eur.rates.TRY) : 0;

const usdLast = staticData.usdLast || usdNow;
const eurLast = staticData.eurLast || eurNow;

const usdChange = usdLast > 0 ? Math.abs((usdNow - usdLast) / usdLast * 100) : 0;
const eurChange = eurLast > 0 ? Math.abs((eurNow - eurLast) / eurLast * 100) : 0;

staticData.usdLast = usdNow;
staticData.eurLast = eurNow;

const triggered = usdChange >= 1 || eurChange >= 1;
const usdDir = usdNow > usdLast ? '📈' : '📉';
const eurDir = eurNow > eurLast ? '📈' : '📉';

return [{json: {
  triggered,
  usdNow: usdNow.toFixed(2),
  eurNow: eurNow.toFixed(2),
  usdChange: usdChange.toFixed(2),
  eurChange: eurChange.toFixed(2),
  usdDir, eurDir
}}];
""".strip()

    msg_expr = (
        "'⚠️ <b>Döviz Kuru Degisimi!</b>\\n\\n'"
        " + $json.usdDir + ' USD/TRY: <b>' + $json.usdNow + '</b> (%' + $json.usdChange + ' degisim)\\n'"
        " + $json.eurDir + ' EUR/TRY: <b>' + $json.eurNow + '</b> (%' + $json.eurChange + ' degisim)'"
    )

    nodes = [
        schedule_node("s8", "Every Hour", [240, 300], "hours", 1),
        http_get("h8a", "Get USD", [460, 300], "https://api.frankfurter.app/latest?from=USD&to=TRY"),
        http_get("h8b", "Get EUR", [680, 300], "https://api.frankfurter.app/latest?from=EUR&to=TRY"),
        {
            "id": "code8", "name": "Check Change",
            "type": "n8n-nodes-base.code", "typeVersion": 2,
            "position": [900, 300],
            "parameters": {"jsCode": js_code, "mode": "runOnceForAllItems"}
        },
        {
            "id": "if8", "name": "Rate Changed?",
            "type": "n8n-nodes-base.if", "typeVersion": 2,
            "position": [1120, 300],
            "parameters": {
                "conditions": {
                    "options": {"caseSensitive": True, "leftValue": "", "typeValidation": "loose"},
                    "conditions": [{"id": "c8", "leftValue": "={{ $json.triggered }}", "rightValue": True, "operator": {"type": "boolean", "operation": "equals"}}],
                    "combinator": "and"
                }
            }
        },
        telegram_node("tg8", "Send Currency Alert", [1340, 200], msg_expr),
        {"id": "noop8", "name": "No Change", "type": "n8n-nodes-base.noOp", "typeVersion": 1, "position": [1340, 420], "parameters": {}}
    ]
    connections = {
        "Every Hour":   {"main": [[{"node": "Get USD",        "type": "main", "index": 0}]]},
        "Get USD":      {"main": [[{"node": "Get EUR",        "type": "main", "index": 0}]]},
        "Get EUR":      {"main": [[{"node": "Check Change",   "type": "main", "index": 0}]]},
        "Check Change": {"main": [[{"node": "Rate Changed?",  "type": "main", "index": 0}]]},
        "Rate Changed?":{"main": [
            [{"node": "Send Currency Alert", "type": "main", "index": 0}],
            [{"node": "No Change",           "type": "main", "index": 0}]
        ]}
    }
    return create_and_activate({"name": "8. Doviz Kuru Alarmi", "nodes": nodes, "connections": connections, "settings": {"executionOrder": "v1"}})

# ════════════════════════════════════════════════════════════════════════════
# WF1 UPDATE: Health Check'e Telegram ekle
# ════════════════════════════════════════════════════════════════════════════
def update_wf1_add_telegram():
    print("\n[WF1 UPDATE] Health Check'e Telegram alarmi ekleniyor")
    wf = api_call("GET", f"/workflows/{WF1_ID}")
    if not wf:
        print("  Could not fetch WF1")
        return

    tg_node = telegram_node(
        "tg1_alarm", "Telegram Alarm", [1180, 420],
        "'🚨 <b>PromptForge API DOWN!</b>\\n\\napi.promptforgeai.dev yanit vermiyor.\\nRailway dashboard\\'unu kontrol et!'"
    )

    wf["nodes"].append(tg_node)
    wf["connections"]["Send Alert Email"] = {
        "main": [[{"node": "Telegram Alarm", "type": "main", "index": 0}]]
    }

    payload = {k: wf[k] for k in ["name","nodes","connections","settings","staticData"] if k in wf}
    result = api_call("PUT", f"/workflows/{WF1_ID}", payload)
    if result:
        print("  WF1 updated OK")

# ════════════════════════════════════════════════════════════════════════════
# WF2 UPDATE: KPI Report'a Telegram ekle
# ════════════════════════════════════════════════════════════════════════════
def update_wf2_add_telegram():
    print("\n[WF2 UPDATE] KPI Report'a Telegram ekleniyor")
    wf = api_call("GET", f"/workflows/{WF2_ID}")
    if not wf:
        print("  Could not fetch WF2")
        return

    js_code = r"""
const d = $json;
const u = d.users    || {};
const p = d.projects || {};
const plans = (d.plans || []).map(x => '  ' + x.plan + ': ' + x.count).join('\n');
const date = new Date().toLocaleDateString('tr-TR', {day:'2-digit', month:'long', year:'numeric'});

const msg =
  '<b>📊 PromptForge KPI Raporu</b>\n' + date + '\n\n' +
  '<b>👥 Kullanicilar</b>\n' +
  '• Bugun yeni: <b>' + (u.newToday || 0) + '</b>\n' +
  '• Bu hafta: '  + (u.newThisWeek  || 0) + '\n' +
  '• Bu ay: '     + (u.newThisMonth || 0) + '\n' +
  '• Toplam: '    + (u.total        || 0) + '\n\n' +
  '<b>🚀 Projeler</b>\n' +
  '• Bugun: <b>' + (p.createdToday    || 0) + '</b>\n' +
  '• Bu hafta: ' + (p.createdThisWeek || 0) + '\n' +
  '• Toplam: '   + (p.total          || 0) + '\n\n' +
  '<b>📦 Plan Dagilimi</b>\n' + plans + '\n\n' +
  '<a href="https://promptforgeai.dev/admin">Admin Panel →</a>';

return [{json: {message: msg}}];
""".strip()

    code_node = {
        "id": "code2", "name": "Format KPI Message",
        "type": "n8n-nodes-base.code", "typeVersion": 2,
        "position": [960, 300],
        "parameters": {"jsCode": js_code, "mode": "runOnceForAllItems"}
    }
    tg_node = telegram_node("tg2", "Send KPI Telegram", [1180, 300], "$json.message")

    wf["nodes"].append(code_node)
    wf["nodes"].append(tg_node)
    wf["connections"]["Send KPI Email"] = {
        "main": [[{"node": "Format KPI Message", "type": "main", "index": 0}]]
    }
    wf["connections"]["Format KPI Message"] = {
        "main": [[{"node": "Send KPI Telegram", "type": "main", "index": 0}]]
    }

    payload = {k: wf[k] for k in ["name","nodes","connections","settings","staticData"] if k in wf}
    result = api_call("PUT", f"/workflows/{WF2_ID}", payload)
    if result:
        print("  WF2 updated OK")

# ════════════════════════════════════════════════════════════════════════════
# MAIN
# ════════════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    print("=== PromptForge Telegram Workflow Creator ===")

    update_wf1_add_telegram()
    update_wf2_add_telegram()

    ids = {}
    ids["wf6"] = "ZX0sYOzh9SWCcZHB"  # already created
    ids["wf7"] = "SI1x5718X4UZMLTr"  # already created
    ids["wf8"] = "uL9RhHtwfafydpHq"  # already created
    print("\n[WF6/7/8] Already created, skipping")

    print("\n=== TAMAMLANDI ===")
    for k, v in ids.items():
        status = "OK" if v else "FAILED"
        print(f"  {k}: {status} (id={v})")
