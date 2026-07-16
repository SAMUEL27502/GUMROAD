-- CreateTable
CREATE TABLE "referral_clicks" (
    "id" TEXT NOT NULL,
    "referralCode" TEXT NOT NULL,
    "referrerId" TEXT,
    "source" TEXT,
    "landingPath" TEXT,
    "country" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referral_clicks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "referral_clicks_referralCode_createdAt_idx" ON "referral_clicks"("referralCode", "createdAt");

-- CreateIndex
CREATE INDEX "referral_clicks_referrerId_idx" ON "referral_clicks"("referrerId");

-- AddForeignKey
ALTER TABLE "referral_clicks" ADD CONSTRAINT "referral_clicks_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
