-- AlterTable: add referral columns to users
ALTER TABLE "users"
  ADD COLUMN "referralCode" TEXT,
  ADD COLUMN "referredById" TEXT;

-- CreateIndex (unique referral code)
CREATE UNIQUE INDEX "users_referralCode_key" ON "users"("referralCode");

-- CreateIndex
CREATE INDEX "users_referralCode_idx" ON "users"("referralCode");

-- AddForeignKey
ALTER TABLE "users"
  ADD CONSTRAINT "users_referredById_fkey"
  FOREIGN KEY ("referredById") REFERENCES "users"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
