#!/usr/bin/env node
/**
 * PromptForge – Stripe Setup Script
 * Çalıştırma: node scripts/setup-stripe.js
 *
 * STRIPE_SECRET_KEY ortam değişkeni olarak verilmelidir:
 *   Windows CMD : set STRIPE_SECRET_KEY=sk_test_... && node scripts/setup-stripe.js
 *   PowerShell  : $env:STRIPE_SECRET_KEY="sk_test_..."; node scripts/setup-stripe.js
 *   bash/Git Bash: STRIPE_SECRET_KEY=sk_test_... node scripts/setup-stripe.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!SECRET_KEY || !SECRET_KEY.startsWith('sk_')) {
  console.error('\n❌  STRIPE_SECRET_KEY ortam değişkeni eksik veya geçersiz.');
  console.error('    Kullanım:');
  console.error('      PowerShell  : $env:STRIPE_SECRET_KEY="sk_test_..."; node scripts/setup-stripe.js');
  console.error('      bash        : STRIPE_SECRET_KEY=sk_test_... node scripts/setup-stripe.js\n');
  process.exit(1);
}

// ─── HTTP helper ──────────────────────────────────────────────────────────────

function stripePost(endpoint, params) {
  return new Promise((resolve, reject) => {
    const body = new URLSearchParams(params).toString();
    const options = {
      hostname: 'api.stripe.com',
      path: `/v1/${endpoint}`,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(parsed.error.message));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🚀  PromptForge Stripe kurulumu başlıyor...\n');

  // 1. Starter ürünü + fiyat
  console.log('📦  Starter ürünü oluşturuluyor...');
  const starterProduct = await stripePost('products', {
    name: 'PromptForge Starter',
    description: '25 uygulama üretimi / ay. Railway deploy dahil.',
  });

  const starterPrice = await stripePost('prices', {
    product: starterProduct.id,
    unit_amount: 2900,   // $29.00
    currency: 'usd',
    'recurring[interval]': 'month',
    nickname: 'Starter Monthly',
  });

  console.log(`   ✅  Starter Price ID: ${starterPrice.id}`);

  // 2. Pro ürünü + fiyat
  console.log('📦  Pro ürünü oluşturuluyor...');
  const proProduct = await stripePost('products', {
    name: 'PromptForge Pro',
    description: 'Sınırsız uygulama üretimi. Öncelikli destek.',
  });

  const proPrice = await stripePost('prices', {
    product: proProduct.id,
    unit_amount: 9900,   // $99.00
    currency: 'usd',
    'recurring[interval]': 'month',
    nickname: 'Pro Monthly',
  });

  console.log(`   ✅  Pro Price ID: ${proPrice.id}`);

  // 3. .env dosyasını güncelle
  const envPath = path.join(__dirname, '..', '.env');

  if (!fs.existsSync(envPath)) {
    console.error('\n❌  .env dosyası bulunamadı:', envPath);
    process.exit(1);
  }

  let envContent = fs.readFileSync(envPath, 'utf8');

  const updates = {
    STRIPE_SECRET_KEY: SECRET_KEY,
    STRIPE_STARTER_PRICE_ID: starterPrice.id,
    STRIPE_PRO_PRICE_ID: proPrice.id,
  };

  for (const [key, value] of Object.entries(updates)) {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      envContent += `\n${key}=${value}`;
    }
  }

  fs.writeFileSync(envPath, envContent, 'utf8');

  console.log('\n✅  .env dosyası güncellendi:');
  console.log(`   STRIPE_SECRET_KEY      = ${SECRET_KEY.slice(0, 12)}...`);
  console.log(`   STRIPE_STARTER_PRICE_ID = ${starterPrice.id}`);
  console.log(`   STRIPE_PRO_PRICE_ID     = ${proPrice.id}`);

  console.log('\n⚠️   Webhook secret için şunu çalıştır:');
  console.log('   stripe listen --forward-to localhost:3001/api/v1/stripe/webhook');
  console.log('   Çıktıdaki whsec_... değerini .env içindeki STRIPE_WEBHOOK_SECRET\'e yaz.\n');
  console.log('   Stripe CLI yüklü değilse: https://docs.stripe.com/stripe-cli\n');
}

main().catch((err) => {
  console.error('\n❌  Hata:', err.message);
  process.exit(1);
});
