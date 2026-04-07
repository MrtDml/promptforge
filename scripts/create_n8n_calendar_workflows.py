import json
import urllib.request
import urllib.error

N8N_URL = "https://n8n.promptforgeai.dev"
N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYzAwMTYxMS0zYjdhLTQzNmItYTdlYi01MTJiMWJhODAyZGQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZDE5ZjI0NzktNzJhZS00YjBiLWE3YmUtMjI3NmZjZDIyM2M3IiwiaWF0IjoxNzc1NTEzMDgyfQ.i35VqeXu6ZqQLAYdS-GNh3gdnpd6iFAYjtMR4i_ttx4"
TELEGRAM_TOKEN = "8226317784:AAGj2rolmw1VyynN-g6ypIHYwfxK3rRsACg"
TELEGRAM_CHAT_ID = "6416910856"
GCAL_CREDENTIAL_ID = "loDueOtfm0EtIDSV"
GCAL_CREDENTIAL_NAME = "Google Calendar account"

HEADERS = {"X-N8N-API-KEY": N8N_API_KEY, "Content-Type": "application/json"}

def api_call(method, path, data=None):
    url = f"{N8N_URL}/api/v1{path}"
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f"  ERROR {e.code}: {e.read().decode()[:400]}")
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

def gcal_node(node_id, name, pos, time_min_expr, time_max_expr, limit=10):
    return {
        "id": node_id, "name": name,
        "type": "n8n-nodes-base.googleCalendar", "typeVersion": 1.1,
        "position": pos,
        "onError": "continueRegularOutput",
        "credentials": {
            "googleCalendarOAuth2Api": {
                "id": GCAL_CREDENTIAL_ID,
                "name": GCAL_CREDENTIAL_NAME
            }
        },
        "parameters": {
            "resource": "event",
            "operation": "getAll",
            "calendar": {
                "__rl": True,
                "value": "primary",
                "mode": "list",
                "cachedResultName": "primary"
            },
            "returnAll": False,
            "limit": limit,
            "options": {
                "timeMin": time_min_expr,
                "timeMax": time_max_expr,
                "singleEvents": True,
                "orderBy": "startTime"
            }
        }
    }

# ════════════════════════════════════════════════════════════════════════════
# WF9: Toplanti Hatirlatici (every 5 min → events in 15 min → Telegram)
# ════════════════════════════════════════════════════════════════════════════
def wf9_meeting_reminder():
    print("\n[WF9] Toplanti Hatirlatici")

    msg_expr = (
        "'🔔 <b>Toplantı Hatırlatıcısı!</b>\\n\\n'"
        " + '📅 <b>' + $json.summary + '</b>\\n'"
        " + '🕐 ' + (($json.start && $json.start.dateTime) ? new Date($json.start.dateTime).toLocaleTimeString('tr-TR', {hour:'2-digit',minute:'2-digit'}) : 'Tüm gün') + '\\n'"
        " + ($json.location ? '📍 ' + $json.location + '\\n' : '')"
        " + ($json.description ? '📝 ' + $json.description.substring(0,100) : '')"
    )

    nodes = [
        schedule_node("s9", "Every 5 Min", [240, 300], "minutes", 5),
        gcal_node(
            "cal9", "Get Upcoming Events", [460, 300],
            time_min_expr="{{ new Date().toISOString() }}",
            time_max_expr="{{ new Date(Date.now() + 20*60*1000).toISOString() }}",
            limit=5
        ),
        telegram_node("tg9", "Send Meeting Reminder", [680, 300], msg_expr)
    ]
    connections = {
        "Every 5 Min":         {"main": [[{"node": "Get Upcoming Events",    "type": "main", "index": 0}]]},
        "Get Upcoming Events": {"main": [[{"node": "Send Meeting Reminder",  "type": "main", "index": 0}]]}
    }
    return create_and_activate({
        "name": "9. Toplanti Hatirlatici",
        "nodes": nodes,
        "connections": connections,
        "settings": {"executionOrder": "v1"}
    })

# ════════════════════════════════════════════════════════════════════════════
# WF10: Gunluk Takvim (daily 08:05 → today's events → Telegram)
# ════════════════════════════════════════════════════════════════════════════
def wf10_daily_schedule():
    print("\n[WF10] Gunluk Takvim")

    js_code = r"""
const items = $input.all();

if (!items || items.length === 0 || !items[0].json.summary) {
  return [{json: {message: '<b>📅 Bugünkü Takvim</b>\n\nBugün takvimde etkinlik yok.'}}];
}

const events = items.map(item => {
  const e = item.json;
  const startRaw = e.start && (e.start.dateTime || e.start.date);
  let startStr = 'Tüm gün';
  if (e.start && e.start.dateTime) {
    startStr = new Date(e.start.dateTime).toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'});
  }
  const loc = e.location ? ' | 📍' + e.location : '';
  return '• ' + startStr + ' — <b>' + (e.summary || 'Başlıksız') + '</b>' + loc;
}).join('\n');

const date = new Date().toLocaleDateString('tr-TR', {day:'2-digit', month:'long'});
const msg = '<b>📅 ' + date + ' Takvim</b>\n\n' + events + '\n\n<a href="https://calendar.google.com">Google Calendar →</a>';
return [{json: {message: msg}}];
""".strip()

    nodes = [
        schedule_node("s10", "Daily 08:05", [240, 300], "cron", "5 8 * * *"),
        gcal_node(
            "cal10", "Get Today Events", [460, 300],
            time_min_expr="{{ new Date(new Date().setHours(0,0,0,0)).toISOString() }}",
            time_max_expr="{{ new Date(new Date().setHours(23,59,59,999)).toISOString() }}",
            limit=15
        ),
        {
            "id": "code10", "name": "Format Schedule",
            "type": "n8n-nodes-base.code", "typeVersion": 2,
            "position": [680, 300],
            "parameters": {"jsCode": js_code, "mode": "runOnceForAllItems"}
        },
        telegram_node("tg10", "Send Daily Schedule", [900, 300], "$json.message")
    ]
    connections = {
        "Daily 08:05":    {"main": [[{"node": "Get Today Events",   "type": "main", "index": 0}]]},
        "Get Today Events":{"main": [[{"node": "Format Schedule",   "type": "main", "index": 0}]]},
        "Format Schedule": {"main": [[{"node": "Send Daily Schedule","type": "main", "index": 0}]]}
    }
    return create_and_activate({
        "name": "10. Gunluk Takvim",
        "nodes": nodes,
        "connections": connections,
        "settings": {"executionOrder": "v1"}
    })

# ════════════════════════════════════════════════════════════════════════════
# MAIN
# ════════════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    print("=== Google Calendar Workflows ===")
    ids = {}
    ids["wf9"]  = wf9_meeting_reminder()
    ids["wf10"] = wf10_daily_schedule()
    print("\n=== TAMAMLANDI ===")
    for k, v in ids.items():
        print(f"  {k}: {'OK' if v else 'FAILED'} (id={v})")
