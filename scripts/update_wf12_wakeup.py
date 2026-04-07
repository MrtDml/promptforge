"""
WF12 güncelleme: uyandırma komutu ekleme
- "uyan", "hazır", "merhaba", "/start", "hey", "başla" gibi mesajlara
  bot "Hazırım!" mesajıyla cevap verir.
"""
import json
import urllib.request
import urllib.error

N8N_URL      = "https://n8n.promptforgeai.dev"
N8N_API_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYzAwMTYxMS0zYjdhLTQzNmItYTdlYi01MTJiMWJhODAyZGQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZDE5ZjI0NzktNzJhZS00YjBiLWE3YmUtMjI3NmZjZDIyM2M3IiwiaWF0IjoxNzc1NTEzMDgyfQ.i35VqeXu6ZqQLAYdS-GNh3gdnpd6iFAYjtMR4i_ttx4"
WF12_ID      = "X9WOxnSUM8imj1oq"
TELEGRAM_TOKEN = "8226317784:AAGj2rolmw1VyynN-g6ypIHYwfxK3rRsACg"

HEADERS = {"X-N8N-API-KEY": N8N_API_KEY, "Content-Type": "application/json"}

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

# ─── Yeni parse kodu: hem komutları hem uyandırma kelimelerini tanır ──────────
NEW_PARSE_CODE = r"""
const raw    = $input.first().json;
const update = raw.body || raw;
const msg    = update.message || update.edited_message;

if (!msg || !msg.text) {
  return [];
}

const rawText  = msg.text.trim();
const lowerText = rawText.toLowerCase();
const chatId   = String(msg.chat.id);
const messageId = msg.message_id;

// Uyandırma anahtar kelimeleri
const wakeWords = ['uyan', 'hazir', 'hazır', 'merhaba', 'hey', 'basla', 'başla', 'bot hazir', 'bot hazır', 'hi', 'hello'];
const isWakeUp  = rawText === '/start' || wakeWords.some(w => lowerText === w || lowerText.startsWith(w + ' '));

if (isWakeUp) {
  return [{json: {commandType: 'uyan', args: '', chatId, messageId}}];
}

if (!rawText.startsWith('/')) {
  // Serbest metin → Claude kişisel asistan
  return [{json: {commandType: 'claude', args: rawText, chatId, messageId}}];
}

const parts       = rawText.split(/\s+/);
const commandType = parts[0].toLowerCase().replace(/^\//, '').replace(/@\w+$/, '');
const args        = parts.slice(1).join(' ').trim();
return [{json: {commandType, args, chatId, messageId}}];
""".strip()

# ─── Wake-up yanıt mesajı ─────────────────────────────────────────────────────
WAKEUP_BODY = (
    "={{ JSON.stringify({"
    "chat_id: $json.chatId,"
    r"text: '✅ <b>Hazırım!</b>\n\n"
    r"PromptForge Asistan aktif ve bekliyor.\n\n"
    r"<b>Komutlar:</b>\n"
    r"/yardim — Tüm komutlar\n"
    r"/istatistik — Platform istatistikleri\n"
    r"/durum — Sistem durumu\n"
    r"/blog [konu] — Blog taslağı\n"
    r"/ozet [metin] — Metin özeti\n\n"
    r"<i>Ya da doğrudan bir şey yazabilirsin.</i>',"
    "parse_mode: 'HTML'"
    "}) }}"
)

def update_wf12():
    print(f"[WF12] Mevcut workflow alınıyor (id={WF12_ID})...")
    wf = api_call("GET", f"/workflows/{WF12_ID}")
    if not wf:
        print("  HATA: WF12 alınamadı!")
        return

    nodes = wf.get("nodes", [])
    connections = wf.get("connections", {})

    # 1. "Parse Command" node'unu bul ve kodunu güncelle
    parse_node = next((n for n in nodes if n.get("name") == "Parse Command"), None)
    if not parse_node:
        print("  HATA: 'Parse Command' node bulunamadı!")
        print("  Mevcut node isimleri:", [n.get("name") for n in nodes])
        return

    old_code = parse_node["parameters"].get("jsCode", "")[:80]
    parse_node["parameters"]["jsCode"] = NEW_PARSE_CODE
    print(f"  ✓ Parse Command güncellendi (eski başlangıç: '{old_code[:60]}...')")

    # 2. "Switch Command" node'unu bul
    switch_node = next((n for n in nodes if n.get("name") == "Switch Command"), None)
    if not switch_node:
        print("  HATA: 'Switch Command' node bulunamadı!")
        return

    rules = switch_node["parameters"].get("rules", {}).get("values", [])
    existing_commands = [r.get("conditions", {}).get("conditions", [{}])[0].get("rightValue", "") for r in rules]
    print(f"  Mevcut komutlar: {existing_commands}")

    # /uyan zaten yoksa ekle (output index = len(rules))
    # Önceki hatalardan kalan /uyan ve uyan kurallarını temizle
    rules = [r for r in rules if r['conditions']['conditions'][0].get('rightValue') not in ['/uyan', 'uyan']]
    switch_node["parameters"]["rules"]["values"] = rules
    existing_commands = [r['conditions']['conditions'][0].get('rightValue','') for r in rules]
    print(f"  Temizlendi, kalan kurallar: {existing_commands}")

    uyan_value = "uyan"
    if uyan_value not in existing_commands:
        uyan_rule = {
            "outputKey": str(len(rules)),
            "conditions": {
                "options": {"caseSensitive": False, "leftValue": "", "typeValidation": "strict"},
                "conditions": [{
                    "id": "r_uyan",
                    "leftValue": "={{ $json.commandType }}",
                    "rightValue": uyan_value,
                    "operator": {"type": "string", "operation": "equals"},
                }],
                "combinator": "and",
            },
            "renameOutput": False,
        }
        rules.append(uyan_rule)
        switch_node["parameters"]["rules"]["values"] = rules
        uyan_output_index = len(rules) - 1
        print(f"  ✓ Switch'e '{uyan_value}' eklendi (output index={uyan_output_index})")
    else:
        uyan_output_index = existing_commands.index(uyan_value)
        print(f"  '{uyan_value}' zaten mevcut (output index={uyan_output_index})")

    # 3. Wake-up yanıt node'u ekle (zaten yoksa)
    wakeup_node_name = "Send Wake Up"
    if not any(n.get("name") == wakeup_node_name for n in nodes):
        wakeup_node = {
            "id": "wakeup12",
            "name": wakeup_node_name,
            "type": "n8n-nodes-base.httpRequest",
            "typeVersion": 4.2,
            "position": [1020, 800],
            "parameters": {
                "method": "POST",
                "url": f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage",
                "sendBody": True,
                "contentType": "raw",
                "rawContentType": "application/json",
                "body": WAKEUP_BODY,
            },
        }
        nodes.append(wakeup_node)
        print(f"  ✓ '{wakeup_node_name}' node eklendi")
    else:
        print(f"  '{wakeup_node_name}' zaten mevcut")

    # 4. Switch → Send Wake Up bağlantısını ekle
    sw_connections = connections.get("Switch Command", {}).get("main", [])

    # output listesini gereken uzunluğa genişlet
    while len(sw_connections) <= uyan_output_index:
        sw_connections.append([])

    # Zaten bağlı mı?
    already_connected = any(
        e.get("node") == wakeup_node_name
        for e in sw_connections[uyan_output_index]
    )
    if not already_connected:
        sw_connections[uyan_output_index] = [{"node": wakeup_node_name, "type": "main", "index": 0}]
        print(f"  ✓ Switch output[{uyan_output_index}] → '{wakeup_node_name}' bağlantısı eklendi")

    connections["Switch Command"] = {"main": sw_connections}
    wf["connections"] = connections
    wf["nodes"] = nodes

    # 5. Kaydet
    payload = {k: wf[k] for k in ["name", "nodes", "connections", "settings", "staticData"] if k in wf}
    print("\n  Workflow kaydediliyor...")
    result = api_call("PUT", f"/workflows/{WF12_ID}", payload)
    if result:
        print("  ✅ WF12 başarıyla güncellendi!")
        print(f"\n  Test: Telegram'dan 'uyan' veya 'merhaba' yaz → bot hazır mesajı görmeli.")
    else:
        print("  ❌ Güncelleme başarısız!")

if __name__ == "__main__":
    print("=== WF12 Uyandırma Komutu Güncellemesi ===\n")
    update_wf12()
