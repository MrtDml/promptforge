import json
import urllib.request
import urllib.error

N8N_URL = "https://n8n.promptforgeai.dev"
N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYzAwMTYxMS0zYjdhLTQzNmItYTdlYi01MTJiMWJhODAyZGQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZDE5ZjI0NzktNzJhZS00YjBiLWE3YmUtMjI3NmZjZDIyM2M3IiwiaWF0IjoxNzc1NTEzMDgyfQ.i35VqeXu6ZqQLAYdS-GNh3gdnpd6iFAYjtMR4i_ttx4"
AUTOMATION_KEY = "430de61b40c198141b89e087cfe4265cd7c7fdc68cdb4f34a6c75dca85f05e43"
RESEND_KEY = "re_VudWtETG_7SYZS6zdpL5WnuDTCVkMgGr5"
ADMIN_EMAIL = "muratdumlu.email@gmail.com"
API_BASE = "https://api.promptforgeai.dev"
FRONTEND = "https://promptforgeai.dev"
FROM_EMAIL = "PromptForge <noreply@promptforgeai.dev>"

HEADERS = {
    "X-N8N-API-KEY": N8N_API_KEY,
    "Content-Type": "application/json"
}

def api_call(method, path, data=None):
    url = f"{N8N_URL}/api/v1{path}"
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        err = e.read().decode()
        print(f"  ERROR {e.code}: {err[:300]}")
        return None

def create_workflow(wf_data):
    result = api_call("POST", "/workflows", wf_data)
    if result and "id" in result:
        wf_id = result["id"]
        print(f"  Created: {wf_data['name']} (id={wf_id})")
        # Activate
        act = api_call("POST", f"/workflows/{wf_id}/activate")
        if act:
            print("  Activated OK")
        return wf_id
    return None

# ─── Resend email node helper ────────────────────────────────────────────────

def resend_node(node_id, name, pos, subject_expr, html_expr, to_expr=None):
    to = to_expr or f'["{ADMIN_EMAIL}"]'
    body_expr = (
        f'={{{{ JSON.stringify({{from:"{FROM_EMAIL}",'
        f'to:{to},'
        f'subject:{subject_expr},'
        f'html:{html_expr}}}) }}}}'
    )
    return {
        "id": node_id,
        "name": name,
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": pos,
        "parameters": {
            "method": "POST",
            "url": "https://api.resend.com/emails",
            "sendHeaders": True,
            "headerParameters": {"parameters": [
                {"name": "Authorization", "value": f"Bearer {RESEND_KEY}"}
            ]},
            "sendBody": True,
            "contentType": "raw",
            "rawContentType": "application/json",
            "body": body_expr
        }
    }

def http_get_node(node_id, name, pos, url, extra_headers=None):
    headers = extra_headers or []
    return {
        "id": node_id,
        "name": name,
        "type": "n8n-nodes-base.httpRequest",
        "typeVersion": 4.2,
        "position": pos,
        "onError": "continueRegularOutput",
        "parameters": {
            "method": "GET",
            "url": url,
            "sendHeaders": True if headers else False,
            "headerParameters": {"parameters": headers},
            "options": {}
        }
    }

def automation_headers():
    return [{"name": "x-automation-key", "value": AUTOMATION_KEY}]

def split_node(node_id, name, pos, field):
    return {
        "id": node_id,
        "name": name,
        "type": "n8n-nodes-base.splitOut",
        "typeVersion": 1,
        "position": pos,
        "parameters": {"fieldToSplitOut": field, "options": {}}
    }

def schedule_node(node_id, name, pos, interval_type, interval_value):
    if interval_type == "cron":
        interval = [{"field": "cronExpression", "expression": interval_value}]
    elif interval_type == "minutes":
        interval = [{"field": "minutes", "minutesInterval": interval_value}]
    elif interval_type == "hours":
        interval = [{"field": "hours", "hoursInterval": interval_value}]
    else:
        interval = [{"field": interval_type}]
    return {
        "id": node_id,
        "name": name,
        "type": "n8n-nodes-base.scheduleTrigger",
        "typeVersion": 1.1,
        "position": pos,
        "parameters": {"rule": {"interval": interval}}
    }

# ════════════════════════════════════════════════════════════════════════════
# WORKFLOW 1: Health Check & Alarm
# ════════════════════════════════════════════════════════════════════════════
def wf1_health_check():
    print("\n[WF1] Health Check & Alarm")
    nodes = [
        schedule_node("s1", "Every 5 Minutes", [240, 300], "minutes", 5),
        http_get_node("h1", "Check API Health", [480, 300], f"{API_BASE}/health"),
        {
            "id": "if1",
            "name": "Is API OK?",
            "type": "n8n-nodes-base.if",
            "typeVersion": 2,
            "position": [720, 300],
            "parameters": {
                "conditions": {
                    "options": {"caseSensitive": True, "leftValue": "", "typeValidation": "loose"},
                    "conditions": [{
                        "id": "c1",
                        "leftValue": "={{ $json.status }}",
                        "rightValue": "ok",
                        "operator": {"type": "string", "operation": "equals"}
                    }],
                    "combinator": "and"
                }
            }
        },
        {"id": "noop1", "name": "All Good", "type": "n8n-nodes-base.noOp", "typeVersion": 1, "position": [960, 180], "parameters": {}},
        resend_node(
            "alert1", "Send Alert Email", [960, 420],
            subject_expr='"🚨 PromptForge API is DOWN!"',
            html_expr='"<h2 style=\\"color:#dc2626\\">🚨 API Down Alert</h2><p>The PromptForge API at <b>api.promptforgeai.dev</b> is not responding.</p><p>Please check <a href=\\"https://railway.app\\">Railway dashboard</a> immediately.</p>"'
        )
    ]
    connections = {
        "Every 5 Minutes": {"main": [[{"node": "Check API Health", "type": "main", "index": 0}]]},
        "Check API Health": {"main": [[{"node": "Is API OK?", "type": "main", "index": 0}]]},
        "Is API OK?": {"main": [
            [{"node": "All Good", "type": "main", "index": 0}],
            [{"node": "Send Alert Email", "type": "main", "index": 0}]
        ]}
    }
    return create_workflow({"name": "1. Health Check & Alarm", "nodes": nodes, "connections": connections, "settings": {"executionOrder": "v1"}})

# ════════════════════════════════════════════════════════════════════════════
# WORKFLOW 2: Daily KPI Report
# ════════════════════════════════════════════════════════════════════════════
def wf2_kpi_report():
    print("\n[WF2] Daily KPI Report")

    html_expr = (
        '"<div style=\\"font-family:sans-serif;max-width:600px\\">"'
        '+"<h2 style=\\"color:#4f46e5\\">📊 PromptForge Günlük Rapor</h2>"'
        '+"<p style=\\"color:#666\\">"+new Date().toLocaleDateString(\'tr-TR\')+"</p>"'
        '+"<table style=\\"width:100%;border-collapse:collapse\\">"'
        '+"<tr style=\\"background:#f3f4f6\\"><th style=\\"padding:8px;text-align:left\\">Metrik</th><th style=\\"padding:8px;text-align:right\\">Değer</th></tr>"'
        '+"<tr><td style=\\"padding:8px;border-top:1px solid #e5e7eb\\">Bugün yeni kayıt</td><td style=\\"padding:8px;border-top:1px solid #e5e7eb;text-align:right;font-weight:bold\\">"+$json.users.newToday+"</td></tr>"'
        '+"<tr><td style=\\"padding:8px;border-top:1px solid #e5e7eb\\">Bu hafta yeni kayıt</td><td style=\\"padding:8px;border-top:1px solid #e5e7eb;text-align:right\\">"+$json.users.newThisWeek+"</td></tr>"'
        '+"<tr><td style=\\"padding:8px;border-top:1px solid #e5e7eb\\">Bu ay yeni kayıt</td><td style=\\"padding:8px;border-top:1px solid #e5e7eb;text-align:right\\">"+$json.users.newThisMonth+"</td></tr>"'
        '+"<tr><td style=\\"padding:8px;border-top:1px solid #e5e7eb\\">Toplam kullanıcı</td><td style=\\"padding:8px;border-top:1px solid #e5e7eb;text-align:right\\">"+$json.users.total+"</td></tr>"'
        '+"<tr style=\\"background:#f3f4f6\\"><td style=\\"padding:8px;border-top:1px solid #e5e7eb\\">Bugün üretilen proje</td><td style=\\"padding:8px;border-top:1px solid #e5e7eb;text-align:right;font-weight:bold\\">"+$json.projects.createdToday+"</td></tr>"'
        '+"<tr><td style=\\"padding:8px;border-top:1px solid #e5e7eb\\">Bu hafta üretilen proje</td><td style=\\"padding:8px;border-top:1px solid #e5e7eb;text-align:right\\">"+$json.projects.createdThisWeek+"</td></tr>"'
        '+"<tr><td style=\\"padding:8px;border-top:1px solid #e5e7eb\\">Toplam proje</td><td style=\\"padding:8px;border-top:1px solid #e5e7eb;text-align:right\\">"+$json.projects.total+"</td></tr>"'
        '+"</table>"'
        '+"<br><a href=\\"https://promptforgeai.dev/admin\\" style=\\"color:#4f46e5\\">Admin Panel →</a>"'
        '+"</div>"'
    )

    nodes = [
        schedule_node("s2", "Daily 09:00", [240, 300], "cron", "0 9 * * *"),
        http_get_node("h2", "Get Stats", [480, 300], f"{API_BASE}/api/v1/automation/stats", automation_headers()),
        resend_node(
            "email2", "Send KPI Email", [720, 300],
            subject_expr='"📊 PromptForge Günlük Rapor - " + new Date().toLocaleDateString(\'tr-TR\')',
            html_expr=html_expr
        )
    ]
    connections = {
        "Daily 09:00": {"main": [[{"node": "Get Stats", "type": "main", "index": 0}]]},
        "Get Stats": {"main": [[{"node": "Send KPI Email", "type": "main", "index": 0}]]}
    }
    return create_workflow({"name": "2. Daily KPI Report", "nodes": nodes, "connections": connections, "settings": {"executionOrder": "v1"}})

# ════════════════════════════════════════════════════════════════════════════
# WORKFLOW 3: Drip Mail Series
# ════════════════════════════════════════════════════════════════════════════
def wf3_drip():
    print("\n[WF3] Drip Mail Series")

    day1_html = (
        '"<div style=\\"font-family:sans-serif;max-width:600px\\">"'
        '+"<h2 style=\\"color:#4f46e5\\">PromptForge\'a hoş geldin, "+$json.name+"! 🚀</h2>"'
        '+"<p>İlk SaaS projenizi oluşturmaya hazır mısınız?</p>"'
        '+"<p>Başlamak çok kolay:</p>"'
        '+"<ol><li>Dashboard\'a girin</li><li>Bir prompt yazın (örn: \'blog yönetim sistemi\')</li><li>Kodunuz saniyeler içinde hazır!</li></ol>"'
        f'+"<a href=\\"{FRONTEND}/dashboard/new\\" style=\\"display:inline-block;background:#4f46e5;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px\\">İlk Projeyi Oluştur →</a>"'
        '+"<br><br><p style=\\"color:#888;font-size:12px\\">Sorularınız için <a href=\\"https://promptforgeai.dev/contact\\">bizimle iletişime geçin</a>.</p>"'
        '+"</div>"'
    )

    day3_html = (
        '"<div style=\\"font-family:sans-serif;max-width:600px\\">"'
        '+"<h2 style=\\"color:#4f46e5\\">"+$json.name+", takıldınız mı? 🤔</h2>"'
        '+"<p>Henüz bir proje oluşturmadığınızı fark ettik. Yardımcı olabilir miyiz?</p>"'
        '+"<p><b>Sık sorulan sorular:</b></p>"'
        '+"<ul>"'
        '+"<li>\'Prompt nasıl yazmalıyım?\' → Basit bir cümle yeterli: \'kullanıcı yönetimli blog sistemi\'</li>"'
        '+"<li>\'Ne kadar sürer?\' → Ortalama 45 saniye</li>"'
        '+"<li>\'Ücretsiz mi?\' → Evet, 3 proje ücretsiz</li>"'
        '+"</ul>"'
        f'+"<a href=\\"{FRONTEND}/dashboard/new\\" style=\\"display:inline-block;background:#4f46e5;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:8px\\">Şimdi Dene →</a>"'
        f'+"<br><br><p style=\\"color:#888;font-size:12px\\">Yardım için: <a href=\\"{FRONTEND}/docs\\">Dokümantasyon</a> | <a href=\\"{FRONTEND}/support\\">Destek</a></p>"'
        '+"</div>"'
    )

    day7_html = (
        '"<div style=\\"font-family:sans-serif;max-width:600px\\">"'
        '+"<h2 style=\\"color:#4f46e5\\">"+$json.name+", bir haftadır aramızdasınız! ⚡</h2>"'
        '+"<p>Pro plana geçerek tüm özelliklere erişin:</p>"'
        '+"<ul>"'
        '+"<li>✅ Sınırsız proje üretimi</li>"'
        '+"<li>✅ GitHub\'a otomatik export</li>"'
        '+"<li>✅ Public showcase linki</li>"'
        '+"<li>✅ AI Chat desteği</li>"'
        '+"</ul>"'
        f'+"<a href=\\"{FRONTEND}/pricing\\" style=\\"display:inline-block;background:#4f46e5;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:8px\\">Pro\'ya Geç →</a>"'
        '+"</div>"'
    )

    nodes = [
        schedule_node("s3", "Every Hour", [240, 300], "hours", 1),
        # Day 1 branch
        http_get_node("h3a", "Get Day1 Users", [480, 180], f"{API_BASE}/api/v1/automation/drip?day=1", automation_headers()),
        split_node("sp3a", "Split Day1 Users", [720, 180], "users"),
        resend_node("e3a", "Send Day1 Welcome", [960, 180],
            subject_expr='"🚀 PromptForge\'a hoş geldin! İlk projeyi oluştur"',
            html_expr=day1_html,
            to_expr='[$json.email]'
        ),
        # Day 3 branch
        http_get_node("h3b", "Get Day3 Users", [480, 360], f"{API_BASE}/api/v1/automation/drip?day=3", automation_headers()),
        split_node("sp3b", "Split Day3 Users", [720, 360], "users"),
        resend_node("e3b", "Send Day3 Nudge", [960, 360],
            subject_expr='"PromptForge\'da takıldınız mı? Yardımcı olalım 👋"',
            html_expr=day3_html,
            to_expr='[$json.email]'
        ),
        # Day 7 branch
        http_get_node("h3c", "Get Day7 Users", [480, 540], f"{API_BASE}/api/v1/automation/drip?day=7", automation_headers()),
        split_node("sp3c", "Split Day7 Users", [720, 540], "users"),
        resend_node("e3c", "Send Day7 Upgrade", [960, 540],
            subject_expr='"Bir haftadır PromptForge\'dasınız ⚡ Pro\'ya geçin"',
            html_expr=day7_html,
            to_expr='[$json.email]'
        ),
    ]
    connections = {
        "Every Hour": {"main": [[
            {"node": "Get Day1 Users", "type": "main", "index": 0},
            {"node": "Get Day3 Users", "type": "main", "index": 0},
            {"node": "Get Day7 Users", "type": "main", "index": 0}
        ]]},
        "Get Day1 Users":   {"main": [[{"node": "Split Day1 Users",  "type": "main", "index": 0}]]},
        "Split Day1 Users": {"main": [[{"node": "Send Day1 Welcome", "type": "main", "index": 0}]]},
        "Get Day3 Users":   {"main": [[{"node": "Split Day3 Users",  "type": "main", "index": 0}]]},
        "Split Day3 Users": {"main": [[{"node": "Send Day3 Nudge",   "type": "main", "index": 0}]]},
        "Get Day7 Users":   {"main": [[{"node": "Split Day7 Users",  "type": "main", "index": 0}]]},
        "Split Day7 Users": {"main": [[{"node": "Send Day7 Upgrade", "type": "main", "index": 0}]]},
    }
    return create_workflow({"name": "3. Drip Mail Series", "nodes": nodes, "connections": connections, "settings": {"executionOrder": "v1"}})

# ════════════════════════════════════════════════════════════════════════════
# WORKFLOW 4: Re-engagement
# ════════════════════════════════════════════════════════════════════════════
def wf4_reengagement():
    print("\n[WF4] Re-engagement")

    html_expr = (
        '"<div style=\\"font-family:sans-serif;max-width:600px\\">"'
        '+"<h2 style=\\"color:#4f46e5\\">"+$json.name+", sizi özledik! 👀</h2>"'
        '+"<p>14 gündür PromptForge\'a giriş yapmadığınızı fark ettik.</p>"'
        '+"<p>Yapay zeka ile birkaç dakikada tam bir SaaS backend\'i oluşturabilirsiniz:</p>"'
        '+"<ul><li>NestJS + Prisma backend</li><li>REST API endpointleri</li><li>Docker konfigürasyonu</li><li>GitHub\'a doğrudan export</li></ul>"'
        f'+"<a href=\\"{FRONTEND}/dashboard\\" style=\\"display:inline-block;background:#4f46e5;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:8px\\">Geri Dön →</a>"'
        '+"<br><br><p style=\\"color:#888;font-size:12px\\">E-posta almak istemiyorsanız <a href=\\"https://promptforgeai.dev/dashboard/settings\\">ayarlardan</a> çıkabilirsiniz.</p>"'
        '+"</div>"'
    )

    nodes = [
        schedule_node("s4", "Daily 10:00", [240, 300], "cron", "0 10 * * *"),
        http_get_node("h4", "Get Inactive Users", [480, 300], f"{API_BASE}/api/v1/automation/inactive", automation_headers()),
        split_node("sp4", "Split Inactive Users", [720, 300], "users"),
        resend_node("e4", "Send Re-engagement Email", [960, 300],
            subject_expr='"PromptForge\'u özlediniz mi? Sizi bekliyoruz 👋"',
            html_expr=html_expr,
            to_expr='[$json.email]'
        )
    ]
    connections = {
        "Daily 10:00":          {"main": [[{"node": "Get Inactive Users",    "type": "main", "index": 0}]]},
        "Get Inactive Users":   {"main": [[{"node": "Split Inactive Users",  "type": "main", "index": 0}]]},
        "Split Inactive Users": {"main": [[{"node": "Send Re-engagement Email", "type": "main", "index": 0}]]}
    }
    return create_workflow({"name": "4. Re-engagement Emails", "nodes": nodes, "connections": connections, "settings": {"executionOrder": "v1"}})

# ════════════════════════════════════════════════════════════════════════════
# WORKFLOW 5: Subscription Expire Reminder
# ════════════════════════════════════════════════════════════════════════════
def wf5_expiring():
    print("\n[WF5] Subscription Expire Reminder")

    html_expr = (
        '"<div style=\\"font-family:sans-serif;max-width:600px\\">"'
        '+"<h2 style=\\"color:#d97706\\">⏰ Aboneliğiniz Bitiyor!</h2>"'
        '+"<p>Merhaba "+$json.name+",</p>"'
        '+"<p><b>"+$json.plan.toUpperCase()+"</b> planınız <b>"+$json.daysLeft+" gün</b> sonra sona eriyor.</p>"'
        '+"<p>Kesintisiz erişim için aboneliğinizi yenileyin.</p>"'
        f'+"<a href=\\"{FRONTEND}/pricing\\" style=\\"display:inline-block;background:#d97706;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:8px\\">Aboneliği Yenile →</a>"'
        '+"<br><br><p style=\\"color:#888;font-size:12px\\">Sorularınız için: <a href=\\"https://promptforgeai.dev/support\\">Destek Merkezi</a></p>"'
        '+"</div>"'
    )

    nodes = [
        schedule_node("s5", "Daily 11:00", [240, 300], "cron", "0 11 * * *"),
        http_get_node("h5", "Get Expiring Subs", [480, 300], f"{API_BASE}/api/v1/automation/expiring", automation_headers()),
        split_node("sp5", "Split Expiring Subs", [720, 300], "subscriptions"),
        resend_node("e5", "Send Renewal Reminder", [960, 300],
            subject_expr='"⏰ PromptForge aboneliğiniz " + $json.daysLeft + " gün içinde bitiyor"',
            html_expr=html_expr,
            to_expr='[$json.email]'
        )
    ]
    connections = {
        "Daily 11:00":        {"main": [[{"node": "Get Expiring Subs",    "type": "main", "index": 0}]]},
        "Get Expiring Subs":  {"main": [[{"node": "Split Expiring Subs",  "type": "main", "index": 0}]]},
        "Split Expiring Subs":{"main": [[{"node": "Send Renewal Reminder","type": "main", "index": 0}]]}
    }
    return create_workflow({"name": "5. Subscription Expire Reminder", "nodes": nodes, "connections": connections, "settings": {"executionOrder": "v1"}})

# ════════════════════════════════════════════════════════════════════════════
# MAIN
# ════════════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    print("=== PromptForge n8n Workflow Creator ===")

    ids = {}
    ids["wf1"] = "9OugdrZ49OwW6x2A"  # already created
    print("[WF1] Health Check - already created, skipping")
    ids["wf2"] = wf2_kpi_report()
    ids["wf3"] = wf3_drip()
    ids["wf4"] = wf4_reengagement()
    ids["wf5"] = wf5_expiring()

    print("\n=== TAMAMLANDI ===")
    for k, v in ids.items():
        status = "✓" if v else "✗ FAILED"
        print(f"  {k}: {status} (id={v})")
