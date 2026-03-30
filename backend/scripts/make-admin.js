/**
 * make-admin.js
 *
 * Bir kullanıcıyı ADMIN yapar.
 *
 * Kullanım:
 *   node backend/scripts/make-admin.js your@email.com
 *
 * Veya local'de backend klasöründen:
 *   node scripts/make-admin.js your@email.com
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];

  if (!email) {
    console.error('Usage: node make-admin.js <email>');
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    console.error(`User not found: ${email}`);
    process.exit(1);
  }

  await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' },
  });

  console.log(`✅  ${email} is now an ADMIN.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
