import { NextResponse } from "next/server";
import {
  affiliateClicks,
  affiliateConversions,
  affiliateProfile,
  buildReferralLink,
  computeAffiliateStats,
  seedAffiliateCommissions,
  seedAffiliateWithdrawals,
} from "@/lib/data/affiliate";

export async function GET() {
  const stats = computeAffiliateStats(
    affiliateConversions,
    seedAffiliateCommissions,
    seedAffiliateWithdrawals,
    affiliateClicks
  );

  return NextResponse.json({
    profile: {
      ...affiliateProfile,
      referralLink: buildReferralLink(affiliateProfile.referralCode),
    },
    stats,
    clicks: affiliateClicks,
    conversions: affiliateConversions,
    commissions: seedAffiliateCommissions,
    withdrawals: seedAffiliateWithdrawals,
  });
}
