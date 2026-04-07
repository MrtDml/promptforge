"""
WF12 Profesyonel Asistan Upgrade
- /ara: DuckDuckGo + Claude araştırma
- /blog, /ozet, /mail: AI entegrasyonu düzeltildi
- /odeme: ödeme hatırlatıcısı
- /not: not alma
- /istatistik alias fix
- Claude'a zengin PromptForge sistem prompt'u
- Check Reminders: ödeme bildirimlerini de kapsar
"""
import json
import urllib.request
import urllib.error

N8N_URL       = "https://n8n.promptforgeai.dev"
N8N_API_KEY   = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYzAwMTYxMS0zYjdhLTQzNmItYTdlYi01MTJiMWJhODAyZGQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiZDE5ZjI0NzktNzJhZS00YjBiLWE3YmUtMjI3NmZjZDIyM2M3IiwiaWF0IjoxNzc1NTEzMDgyfQ.i35VqeXu6ZqQLAYdS-GNh3gdnpd6iFAYjtMR4i_ttx4"
WF12_ID       = "X9WOxnSUM8imj1oq"
TELEGRAM_TOKEN = "8226317784:AAGj2rolmw1VyynN-g6ypIHYwfxK3rRsACg"
CHAT_ID       = "6416910856"

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

def tg_send(nid, name, pos):
    """Telegram send node (uses $json.chatId and $json.message)."""
    return {
        "id": nid, "name": name,
        "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2,
        "position": pos,
        "parameters": {
            "method": "POST",
            "url": f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage",
            "sendBody": True, "contentType": "raw", "rawContentType": "application/json",
            "body": "={{ JSON.stringify({chat_id: $json.chatId, text: $json.message, parse_mode: 'HTML'}) }}",
        },
    }

def code_node(nid, name, pos, code):
    return {
        "id": nid, "name": name,
        "type": "n8n-nodes-base.code", "typeVersion": 2,
        "position": pos,
        "parameters": {"jsCode": code, "mode": "runOnceForAllItems"},
    }

# ─── Node kodları ─────────────────────────────────────────────────────────────

PARSE_CODE = r"""
const raw     = $input.first().json;
const update  = raw.body || raw;
const msg     = update.message || update.edited_message;

if (!msg || !msg.text) return [];

const rawText   = msg.text.trim();
const lowerText = rawText.toLowerCase();
const chatId    = String(msg.chat.id);
const messageId = msg.message_id;

// Uyandırma kelimeleri
const wakeWords = ['uyan','hazir','hazır','merhaba','hey','basla','başla','hi','hello','bot hazir','bot hazır'];
const isWakeUp  = rawText === '/start' || wakeWords.some(w => lowerText === w || lowerText.startsWith(w + ' '));
if (isWakeUp) return [{json:{commandType:'uyan', args:'', chatId, messageId}}];

// Serbest metin → Claude
if (!rawText.startsWith('/')) return [{json:{commandType:'claude', args:rawText, chatId, messageId}}];

const parts       = rawText.split(/\s+/);
const commandType = parts[0].toLowerCase().replace(/^\//, '').replace(/@\w+$/, '');
const args        = parts.slice(1).join(' ').trim();
return [{json:{commandType, args, chatId, messageId}}];
""".strip()

PREP_CLAUDE_CODE = r"""
const item = $input.first().json;
const {commandType, args, chatId, messageId} = item;

const PF_SYSTEM = `Sen Murat'ın kişisel yapay zeka asistanısın.

Murat, PromptForge adlı bir AI SaaS platformunun kurucusu ve baş geliştiricisi.

PromptForge Teknik Detayları:
- Ne yapar: Doğal dil prompt'tan çalışan tam SaaS uygulaması üretiyor (ZIP + NestJS backend)
- Frontend: Next.js 14 / Vercel (https://promptforgeai.dev)
- Backend: NestJS / Railway (https://api.promptforgeai.dev, port 8080)
- Veritabanı: PostgreSQL + Prisma ORM (Railway)
- AI: Anthropic Claude API (proje üretimi + chat)
- Ödeme: iyzico entegrasyonu (sandbox onayı bekleniyor; Stripe kaldırıldı)
- Auth: JWT + Google OAuth + GitHub OAuth
- Email: Resend (domain: promptforgeai.dev)
- Monitoring: Sentry (hata takibi) + PostHog (analytics)
- Admin panel: /admin route - kullanıcılar, projeler, blog, ayarlar
- Otomasyon: n8n ile 14 aktif workflow (sağlık kontrolü, KPI raporu, takvim, bu bot vb.)
- Güvenlik: JWT fallback kaldırıldı, TypeScript strict, Prisma indeksler eklendi

Mevcut durum:
- Platform canlıda ve çalışıyor
- iyzico sandbox onayı bekleniyor (ödeme özelliği aktif olmayan)
- PostHog API key henüz eklenmedi
- Google Search Console'a sitemap gönderildi

Görevin:
- Murat'ın proje sorularını yanıtla
- Teknik tavsiye ver
- Kod önerileri sun
- Genel bilgi sorularına cevap ver
Türkçe konuş. Kısa, pratik, direkt cevaplar ver.`;

// commandType'a göre sistem prompt ve kullanıcı mesajını belirle
let userMsg = '';
let sysPrompt = PF_SYSTEM;

switch(commandType) {
  case 'claude':
    userMsg = args;
    break;
  case 'blog':
    userMsg = `Şu konu hakkında Türkçe, SEO dostu, kapsamlı blog yazısı taslağı hazırla. H2 başlıklar kullan, giriş + 4 ana bölüm + sonuç içersin. Pratik örnekler ekle. Konu: ${args}`;
    sysPrompt = 'Sen deneyimli bir içerik yazarısın. Türkçe, bilgilendirici, akıcı blog yazıları hazırlıyorsun.';
    break;
  case 'ozet':
    userMsg = `Şu metni Türkçe özetle. Madde madde ana noktaları çıkar, orijinalin ~%25\'i uzunluğunda olsun:\n\n${args}`;
    sysPrompt = 'Sen profesyonel bir metin analizcisin. Net ve özlü özetler çıkarıyorsun.';
    break;
  case 'mail':
    userMsg = `Şu konu için profesyonel, nazik Türkçe e-posta taslağı yaz. Konu başlığı, selamlama, içerik ve kapanış bölümleri olsun. Konu: ${args}`;
    sysPrompt = 'Sen profesyonel iş yazışmaları uzmanısın.';
    break;
  case 'ara':
    // claudeUser Ara Prep node'u tarafından set edilir
    userMsg = item.claudeUser || `${args} hakkında kapsamlı bilgi ver.`;
    sysPrompt = item.claudeSystem || 'Sen araştırma asistanısın. Türkçe, kapsamlı, pratik cevaplar veriyorsun.';
    break;
  default:
    userMsg = item.claudeUser || args || 'Nasıl yardımcı olabileceğini kısaca anlat.';
    sysPrompt = item.claudeSystem || PF_SYSTEM;
}

const body = {
  model: 'claude-opus-4-6',
  max_tokens: 3000,
  system: sysPrompt,
  messages: [{role: 'user', content: userMsg}]
};

return [{json: {anthropicBody: JSON.stringify(body), chatId: chatId || $('Parse Command').item.json.chatId}}];
""".strip()

ARA_PREP_CODE = r"""
const searchRes = $input.first().json;
const parseData = $('Parse Command').item.json;
const {chatId, args} = parseData;

const abstract      = searchRes.AbstractText || '';
const definition    = searchRes.Definition || '';
const relatedTopics = (searchRes.RelatedTopics || [])
  .filter(t => t.Text)
  .slice(0, 5)
  .map(t => '- ' + t.Text)
  .join('\n');

let searchContext = '';
if (abstract)      searchContext += `Özet: ${abstract}\n\n`;
if (definition)    searchContext += `Tanım: ${definition}\n\n`;
if (relatedTopics) searchContext += `İlgili:\n${relatedTopics}`;

const claudeUser = searchContext
  ? `Soru: ${args}\n\nWeb'den bulunan bilgiler:\n${searchContext}\n\nBu bilgilere dayanarak kapsamlı, doğru bir yanıt ver. Gerekiyorsa kendi bilginle destekle.`
  : `${args}\n\nBu konuda kapsamlı, güncel ve pratik bilgi ver.`;

const claudeSystem = 'Sen araştırma asistanısın. Türkçe, kapsamlı ve doğru cevaplar veriyorsun.';

return [{json: {commandType: 'ara', args, chatId, claudeUser, claudeSystem}}];
""".strip()

ODEME_HANDLER_CODE = r"""
const {chatId, args} = $input.first().json;
const sd  = $getWorkflowStaticData('global');
if (!sd.odemeler) sd.odemeler = [];

const text    = (args || '').trim();
const parts   = text.split(/\s+/);
const subCmd  = (parts[0] || '').toLowerCase();

// LISTELE
if (!text || subCmd === 'listele') {
  if (!sd.odemeler.length) {
    return [{json:{chatId, message:'📭 <b>Kayıtlı ödeme hatırlatıcısı yok.</b>\n\n<i>Eklemek için:\n/odeme 15/05 1500TL iyzico abonelik\n/odeme 3gun 250TL domain yenileme</i>'}}];
  }
  const list = sd.odemeler.map((o,i) => {
    const d   = new Date(o.dueAt);
    const ds  = d.toLocaleDateString('tr-TR');
    const st  = o.dueAt < Date.now() ? '⚠️ GECİKTİ' : '🔔 Bekliyor';
    return `${i+1}. ${st}\n   📌 <b>${o.desc}</b>${o.amount?' | 💰 '+o.amount:''}\n   📅 ${ds}`;
  }).join('\n\n');
  return [{json:{chatId, message:`<b>💳 Ödeme Hatırlatıcıları</b>\n\n${list}`}}];
}

// SIL
if (subCmd === 'sil') {
  const idx = parseInt(parts[1]) - 1;
  if (isNaN(idx) || idx < 0 || idx >= sd.odemeler.length) {
    return [{json:{chatId, message:'❌ Geçersiz numara. /odeme listele ile mevcut hatırlatıcıları gör.'}}];
  }
  const removed = sd.odemeler.splice(idx, 1)[0];
  return [{json:{chatId, message:`✅ <b>${removed.desc}</b> silindi.`}}];
}

// EKLE: /odeme 15/05 1500TL açıklama  VEYA  /odeme 3gun 500TL açıklama
const now = new Date();
let dueAt = null;
let amount = '';
let descParts = [];

for (const part of parts) {
  // DD/MM veya DD/MM/YYYY
  if (/^\d{1,2}\/\d{1,2}/.test(part)) {
    const seg = part.split('/').map(Number);
    const dy = seg[0], dm = seg[1], yr = seg[2] || now.getFullYear();
    dueAt = new Date(yr, dm-1, dy, 9, 0, 0).getTime();
    if (dueAt < Date.now()) dueAt = new Date(yr+1, dm-1, dy, 9, 0, 0).getTime();
  }
  // Xgun veya Xgün
  else if (/^\d+(g[uü]n|gun|gün)$/i.test(part)) {
    dueAt = Date.now() + parseInt(part) * 86400000;
  }
  // Miktar (sayı + TL/USD vs.)
  else if (/^\d[\d.,]*([a-zA-Z]{0,3})$/.test(part) && /\d/.test(part)) {
    amount = part.toUpperCase();
  }
  else {
    descParts.push(part);
  }
}

if (!dueAt) dueAt = Date.now() + 86400000; // varsayılan: 1 gün sonra

const desc     = descParts.join(' ').trim() || 'Ödeme';
sd.odemeler.push({dueAt, amount, desc, chatId, reminded:false, overdueNotified:false});

const dueDateStr = new Date(dueAt).toLocaleDateString('tr-TR', {day:'2-digit', month:'long', year:'numeric'});
return [{json:{chatId, message:`✅ <b>Ödeme Hatırlatıcısı Kaydedildi!</b>\n\n📌 ${desc}${amount?'\n💰 '+amount:''}\n📅 ${dueDateStr}\n\n<i>/odeme listele ile tüm hatırlatıcıları gör</i>`}}];
""".strip()

NOT_HANDLER_CODE = r"""
const {chatId, args} = $input.first().json;
const sd = $getWorkflowStaticData('global');
if (!sd.notlar) sd.notlar = [];

const text     = (args || '').trim();
const firstWord = text.split(' ')[0].toLowerCase();
const rest      = text.slice(firstWord.length).trim();

// LISTELE
if (!text || firstWord === 'listele') {
  if (!sd.notlar.length) {
    return [{json:{chatId, message:'📭 <b>Kayıtlı not yok.</b>\n\n<i>Not eklemek için:\n/not Toplantı öncesi hazırlanacaklar\n/not ekle Proje deadline: 20 Nisan</i>'}}];
  }
  const list = sd.notlar.map((n,i) =>
    `${i+1}. ${n.text}\n   <i>${new Date(n.at).toLocaleString('tr-TR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}</i>`
  ).join('\n\n');
  return [{json:{chatId, message:`<b>📝 Notlarım (${sd.notlar.length})</b>\n\n${list}`}}];
}

// SIL
if (firstWord === 'sil') {
  const idx = parseInt(rest) - 1;
  if (isNaN(idx) || idx < 0 || idx >= sd.notlar.length) {
    return [{json:{chatId, message:'❌ Geçersiz numara. /not listele ile notları gör.'}}];
  }
  const removed = sd.notlar.splice(idx, 1)[0];
  return [{json:{chatId, message:`✅ Not silindi: "<i>${removed.text}</i>"`}}];
}

// TEMIZLE
if (firstWord === 'temizle') {
  const count = sd.notlar.length;
  sd.notlar = [];
  return [{json:{chatId, message:`✅ ${count} not silindi.`}}];
}

// EKLE (hem "ekle X" hem de direkt metin)
const noteText = (firstWord === 'ekle') ? rest : text;
if (!noteText) return [{json:{chatId, message:'❌ Not metni boş olamaz.'}}];

sd.notlar.push({text: noteText, at: Date.now()});
return [{json:{chatId, message:`✅ <b>Not kaydedildi!</b>\n\n📝 ${noteText}\n\n<i>/not listele ile tüm notları gör</i>`}}];
""".strip()

CHECK_REMINDERS_CODE = r"""
const sd  = $getWorkflowStaticData('global');
const now = Date.now();
const results = [];
const CHAT_ID = '""" + CHAT_ID + r"""';

// Hatırlatıcılar
if (sd.reminders && sd.reminders.length > 0) {
  const due = sd.reminders.filter(r => r.dueAt <= now);
  sd.reminders = sd.reminders.filter(r => r.dueAt > now);
  for (const r of due) {
    results.push({json:{chatId: r.chatId || CHAT_ID, message:`⏰ <b>Hatırlatıcı!</b>\n\n${r.msg}`}});
  }
}

// Ödeme hatırlatıcıları
if (sd.odemeler && sd.odemeler.length > 0) {
  const oneDayMs = 86400000;

  for (const o of sd.odemeler) {
    const remaining = o.dueAt - now;

    // 1 gün öncesinde bildirim
    if (!o.reminded && remaining > 0 && remaining <= oneDayMs) {
      o.reminded = true;
      const ds = new Date(o.dueAt).toLocaleDateString('tr-TR');
      results.push({json:{chatId: o.chatId || CHAT_ID,
        message:`🔔 <b>Yarın Ödeme Var!</b>\n\n📌 ${o.desc}${o.amount?'\n💰 '+o.amount:''}\n📅 ${ds}`}});
    }

    // Geçmiş / bugün bildirim
    if (!o.overdueNotified && remaining <= 0) {
      o.overdueNotified = true;
      const ds = new Date(o.dueAt).toLocaleDateString('tr-TR');
      results.push({json:{chatId: o.chatId || CHAT_ID,
        message:`⚠️ <b>Ödeme Tarihi Geldi!</b>\n\n📌 ${o.desc}${o.amount?'\n💰 '+o.amount:''}\n📅 ${ds}`}});
    }
  }
}

return results;
""".strip()

HELP_BODY = (
    "={{ JSON.stringify({"
    f"chat_id: $json.chatId,"
    r"text: '🤖 <b>PromptForge Asistan</b>\n\n"
    r"<b>🧠 Araştırma & İçerik:</b>\n"
    r"/ara [soru] — Web araştırması\n"
    r"/blog [konu] — Blog yazısı taslağı\n"
    r"/ozet [metin] — Metin özetle\n"
    r"/mail [konu] — E-posta taslağı\n\n"
    r"<b>📋 Görevler & Notlar:</b>\n"
    r"/todo [ekle/listele/tamam/sil] — Yapılacaklar\n"
    r"/not [metin] — Not al (listele/sil destekli)\n"
    r"/hatirlatici [süre] [mesaj] — Hatırlatıcı kur\n\n"
    r"<b>💳 Ödemeler:</b>\n"
    r"/odeme [tarih] [miktar] [açıklama] — Hatırlatıcı\n"
    r"/odeme listele — Tüm ödemeler\n"
    r"/odeme sil [no] — Sil\n\n"
    r"<b>🗓️ Takvim:</b>\n"
    r"/toplanti [bilgi] — Google Calendar\'a ekle\n\n"
    r"<b>📊 Platform:</b>\n"
    r"/istatistik — Platform istatistikleri\n"
    r"/durum — Sistem sağlığı\n\n"
    r"<i>Komut olmadan yaz → AI asistan olarak cevaplar\n"
    r"Örn: \"PromptForge\'da auth nasıl çalışıyor?\"</i>',"
    "parse_mode: 'HTML'"
    "}) }}"
)

UYAN_BODY = (
    "={{ JSON.stringify({"
    f"chat_id: $json.chatId,"
    r"text: '✅ <b>Hazırım!</b>\n\n"
    r"PromptForge Asistan aktif ve bekliyor.\n\n"
    r"<b>Hızlı başlangıç:</b>\n"
    r"/yardim — Tüm komutlar\n"
    r"/ara [soru] — Bir şey araştır\n"
    r"/not [metin] — Hızlı not al\n\n"
    r"<i>Ya da doğrudan bir şey yazabilirsin.</i>',"
    "parse_mode: 'HTML'"
    "}) }}"
)


def make_switch_rule(output_key, field_val, case_sensitive=False):
    return {
        "outputKey": str(output_key),
        "conditions": {
            "options": {"caseSensitive": case_sensitive},
            "conditions": [{
                "id": f"r{output_key}",
                "leftValue": "={{ $json.commandType }}",
                "rightValue": field_val,
                "operator": {"type": "string", "operation": "equals"},
            }],
            "combinator": "and",
        },
        "renameOutput": False,
    }


def upgrade():
    print("[WF12] Mevcut workflow alınıyor...")
    wf = api_call("GET", f"/workflows/{WF12_ID}")
    if not wf:
        print("  HATA: WF12 alınamadı!")
        return

    nodes       = wf["nodes"]
    connections = wf["connections"]

    def find_node(name):
        return next((n for n in nodes if n["name"] == name), None)

    def update_node_code(name, code):
        n = find_node(name)
        if n:
            n["parameters"]["jsCode"] = code
            print(f"  [OK] {name} guncellendi")
        else:
            print(f"  [WARN] {name} bulunamadi!")

    def update_node_body(name, body):
        n = find_node(name)
        if n:
            n["parameters"]["body"] = body
            print(f"  [OK] {name} body guncellendi")
        else:
            print(f"  [WARN] {name} bulunamadi!")

    def node_exists(name):
        return find_node(name) is not None

    def add_node(node):
        if not node_exists(node["name"]):
            nodes.append(node)
            print(f"  [ADD] {node['name']} eklendi")
        else:
            # Güncelle
            for i, n in enumerate(nodes):
                if n["name"] == node["name"]:
                    nodes[i] = node
                    print(f"  [UPDATE] {node['name']} guncellendi")
                    break

    # ── 1. Parse Command ──────────────────────────────────────────────────────
    update_node_code("Parse Command", PARSE_CODE)

    # ── 2. Prep Claude ────────────────────────────────────────────────────────
    update_node_code("Prep Claude", PREP_CLAUDE_CODE)

    # ── 3. Check Reminders (ödeme bildirimlerini de destekle) ─────────────────
    update_node_code("Check Reminders", CHECK_REMINDERS_CODE)

    # ── 4. Send Help → kapsamlı help metni ───────────────────────────────────
    n = find_node("Send Help")
    if n:
        n["parameters"]["body"] = HELP_BODY
        print("  [OK] Send Help body guncellendi")

    # ── 5. Send Wake Up → yeni uyandırma metni ────────────────────────────────
    n = find_node("Send Wake Up")
    if n:
        n["parameters"]["body"] = UYAN_BODY
        print("  [OK] Send Wake Up body guncellendi")

    # ── 6. Yeni node'lar ──────────────────────────────────────────────────────
    # DuckDuckGo arama node'u
    ddg_node = {
        "id": "ddg_fetch", "name": "DuckDuckGo Fetch",
        "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2,
        "position": [1020, 900],
        "onError": "continueRegularOutput",
        "parameters": {
            "method": "GET",
            "url": "={{ 'https://api.duckduckgo.com/?q=' + encodeURIComponent($('Parse Command').item.json.args) + '&format=json&no_html=1&skip_disambig=1' }}",
            "options": {},
        },
    }
    add_node(ddg_node)

    # Ara Prep → Claude prompt hazırlama
    add_node(code_node("ara_prep", "Ara Prep", [1280, 900], ARA_PREP_CODE))

    # Ödeme Handler
    add_node(code_node("odeme_handler", "Odeme Handler", [1020, 1060], ODEME_HANDLER_CODE))
    add_node(tg_send("send_odeme", "Send Odeme", [1280, 1060]))

    # Not Handler
    add_node(code_node("not_handler", "Not Handler", [1020, 1220], NOT_HANDLER_CODE))
    add_node(tg_send("send_not", "Send Not", [1280, 1220]))

    # ── 7. Switch rules temizle ve yeniden yaz ────────────────────────────────
    # Sıralı, temiz kural seti
    # Index → (commandType, hedef_node)
    SWITCH_MAP = [
        (0,  "yardim",     "Send Help"),
        (1,  "stats",      "Get Stats"),
        (2,  "istatistik", "Get Stats"),     # alias fix
        (3,  "claude",     "Prep Claude"),
        (4,  "durum",      "Get Health"),
        (5,  "todo",       "Todo Handler"),
        (6,  "hatirlatici","Reminder Handler"),
        (7,  "toplanti",   "Prep Toplanti"),
        (8,  "uyan",       "Send Wake Up"),
        (9,  "ara",        "DuckDuckGo Fetch"),
        (10, "blog",       "Prep Claude"),
        (11, "ozet",       "Prep Claude"),
        (12, "mail",       "Prep Claude"),
        (13, "odeme",      "Odeme Handler"),
        (14, "not",        "Not Handler"),
    ]

    sw = find_node("Switch Command")
    if not sw:
        print("  [HATA] Switch Command bulunamadi!")
        return

    new_rules = [make_switch_rule(idx, cmd) for idx, cmd, _ in SWITCH_MAP]
    sw["parameters"]["rules"]["values"] = new_rules
    print(f"  [OK] Switch {len(new_rules)} kural ile guncellendi")

    # Switch connections'ı yeniden yaz
    sw_main = [[] for _ in range(len(SWITCH_MAP))]
    for idx, _, target in SWITCH_MAP:
        sw_main[idx] = [{"node": target, "type": "main", "index": 0}]

    connections["Switch Command"] = {"main": sw_main}

    # ── 8. Yeni bağlantılar ───────────────────────────────────────────────────
    connections["DuckDuckGo Fetch"] = {"main": [[{"node": "Ara Prep",  "type": "main", "index": 0}]]}
    connections["Ara Prep"]         = {"main": [[{"node": "Prep Claude","type": "main", "index": 0}]]}
    connections["Odeme Handler"]    = {"main": [[{"node": "Send Odeme", "type": "main", "index": 0}]]}
    connections["Not Handler"]      = {"main": [[{"node": "Send Not",   "type": "main", "index": 0}]]}

    # ── 9. Kaydet ─────────────────────────────────────────────────────────────
    wf["nodes"]       = nodes
    wf["connections"] = connections
    payload = {k: wf[k] for k in ["name","nodes","connections","settings","staticData"] if k in wf}

    print("\n  Kaydediliyor...")
    result = api_call("PUT", f"/workflows/{WF12_ID}", payload)
    if result:
        print("  SUCCESS: WF12 profesyonel upgrade tamamlandi!")
        print()
        print("  Test edilecek komutlar:")
        for _, cmd, target in SWITCH_MAP:
            print(f"    /{cmd} → {target}")
    else:
        print("  HATA: Kaydetme basarisiz!")


if __name__ == "__main__":
    print("=== WF12 Profesyonel Asistan Upgrade ===\n")
    upgrade()
