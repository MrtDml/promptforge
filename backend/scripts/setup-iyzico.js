#!/usr/bin/env node
/**
 * PromptForge – iyzico Kurulum Scripti
 *
 * iyzico'da Starter ve Pro ürünlerini + planları oluşturur,
 * referans kodlarını .env dosyasına yazar.
 *
 * Kullanım (PowerShell):
 *   $env:IYZICO_API_KEY="sandbox-api-key"; $env:IYZICO_SECRET_KEY="sandbox-secret-key"; node scripts/setup-iyzico.js
 *
 * Kullanım (bash / Git Bash):
 *   IYZICO_API_KEY="sandbox-api-key" IYZICO_SECRET_KEY="sandbox-secret-key" node scripts/setup-iyzico.js
 *
 * Sandbox key'leri için: https://sandbox.iyzipay.com → Panel → Ayarlar → API Anahtarları
 */

const Iyzipay = require('iyzipay');
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.IYZICO_API_KEY;
const SECRET_KEY = process.env.IYZICO_SECRET_KEY;

if (!API_KEY || !SECRET_KEY) {
  console.error('\n❌  IYZICO_API_KEY veya IYZICO_SECRET_KEY eksik.');
  console.error('    PowerShell:');
  console.error('      $env:IYZICO_API_KEY="key"; $env:IYZICO_SECRET_KEY="secret"; node scripts/setup-iyzico.js\n');
  process.exit(1);
}

const iyzipay = new Iyzipay({
  apiKey: API_KEY,
  secretKey: SECRET_KEY,
  uri: 'https://sandbox.iyzipay.com',
});

// ─── Promise wrapper ─────────────────────────────────────────────────────────

function call(fn) {
  return new Promise((resolve, reject) => {
    fn((err, result) => {
      if (err) { reject(new Error(err.message || JSON.stringify(err))); return; }
      if (result.status === 'failure') { reject(new Error(result.errorMessage || JSON.stringify(result))); return; }
      resolve(result);
    });
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🚀  iyzico kurulumu başlıyor (sandbox)...\n');

  // ── 1. Starter ürünü ──────────────────────────────────────────────────────
  console.log('📦  Starter ürünü oluşturuluyor...');
  const starterProduct = await call((cb) =>
    iyzipay.subscriptionProduct.create({
      locale: 'tr',
      name: 'PromptForge Starter',
      description: 'Aylık 50 uygulama üretimi. Railway deploy dahil.',
    }, cb)
  );
  console.log(`   Ürün referansı: ${starterProduct.referenceCode}`);

  // ── 2. Starter planı ──────────────────────────────────────────────────────
  console.log('💳  Starter planı oluşturuluyor ($29/ay)...');
  const starterPlan = await call((cb) =>
    iyzipay.subscriptionPlan.create({
      locale: 'tr',
      name: 'Starter Aylık',
      price: '29',
      currencyCode: 'USD',
      paymentInterval: 'MONTHLY',
      paymentIntervalCount: 1,
      trialPeriodDays: 0,
      planPaymentType: 'RECURRING',
      productReferenceCode: starterProduct.referenceCode,
    }, cb)
  );
  console.log(`   ✅  Starter Plan Ref: ${starterPlan.referenceCode}`);

  // ── 3. Pro ürünü ──────────────────────────────────────────────────────────
  console.log('📦  Pro ürünü oluşturuluyor...');
  const proProduct = await call((cb) =>
    iyzipay.subscriptionProduct.create({
      locale: 'tr',
      name: 'PromptForge Pro',
      description: 'Sınırsız uygulama üretimi. Öncelikli destek.',
    }, cb)
  );
  console.log(`   Ürün referansı: ${proProduct.referenceCode}`);

  // ── 4. Pro planı ──────────────────────────────────────────────────────────
  console.log('💳  Pro planı oluşturuluyor ($99/ay)...');
  const proPlan = await call((cb) =>
    iyzipay.subscriptionPlan.create({
      locale: 'tr',
      name: 'Pro Aylık',
      price: '99',
      currencyCode: 'USD',
      paymentInterval: 'MONTHLY',
      paymentIntervalCount: 1,
      trialPeriodDays: 0,
      planPaymentType: 'RECURRING',
      productReferenceCode: proProduct.referenceCode,
    }, cb)
  );
  console.log(`   ✅  Pro Plan Ref: ${proPlan.referenceCode}`);

  // ── 5. .env dosyasını güncelle ────────────────────────────────────────────
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.error('\n❌  .env dosyası bulunamadı:', envPath);
    process.exit(1);
  }

  let envContent = fs.readFileSync(envPath, 'utf8');

  const updates = {
    IYZICO_API_KEY: API_KEY,
    IYZICO_SECRET_KEY: SECRET_KEY,
    IYZICO_STARTER_PLAN_REF: starterPlan.referenceCode,
    IYZICO_PRO_PLAN_REF: proPlan.referenceCode,
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
  console.log(`   IYZICO_API_KEY           = ${API_KEY.slice(0, 12)}...`);
  console.log(`   IYZICO_SECRET_KEY        = ${SECRET_KEY.slice(0, 12)}...`);
  console.log(`   IYZICO_STARTER_PLAN_REF  = ${starterPlan.referenceCode}`);
  console.log(`   IYZICO_PRO_PLAN_REF      = ${proPlan.referenceCode}`);

  console.log('\n⚠️   Webhook (callback) için ngrok kullan:');
  console.log('   ngrok http 3001');
  console.log('   Çıktıdaki URL\'yi .env içindeki APP_URL\'ye yaz:\n');
  console.log('   APP_URL=https://xxxx.ngrok.io\n');
  console.log('   Ardından backend\'i yeniden başlat.\n');
}

main().catch((err) => {
  console.error('\n❌  Hata:', err.message);
  process.exit(1);
});
