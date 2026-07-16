import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  affiliateClicks,
  affiliateConversions,
  affiliateProfile,
  seedAffiliateCommissions,
  seedAffiliateWithdrawals,
  type AffiliateCommission,
  type AffiliateWithdrawal,
  type WithdrawalStatus,
} from "@/lib/data/affiliate";

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

interface AffiliateState {
  referralCode: string;
  clicks: typeof affiliateClicks;
  conversions: typeof affiliateConversions;
  commissions: AffiliateCommission[];
  withdrawals: AffiliateWithdrawal[];
  payoutDestination: string;
  requestWithdrawal: (amount: number, destination?: string) =>
    | AffiliateWithdrawal
    | { error: string };
  updateWithdrawalStatus: (id: string, status: WithdrawalStatus) => void;
  setPayoutDestination: (destination: string) => void;
}

export const useAffiliateStore = create<AffiliateState>()(
  persist(
    (set, get) => ({
      referralCode: affiliateProfile.referralCode,
      clicks: affiliateClicks,
      conversions: affiliateConversions,
      commissions: seedAffiliateCommissions,
      withdrawals: seedAffiliateWithdrawals,
      payoutDestination: affiliateProfile.payoutDestination,
      setPayoutDestination: (destination) => set({ payoutDestination: destination }),
      requestWithdrawal: (amount, destination) => {
        if (amount < affiliateProfile.minWithdrawal) {
          return {
            error: `Minimum withdrawal is $${affiliateProfile.minWithdrawal}`,
          };
        }
        const today = new Date().toISOString().slice(0, 10);
        const withdrawal: AffiliateWithdrawal = {
          id: uid("wd"),
          amount,
          currency: "USD",
          status: "PENDING",
          method: affiliateProfile.payoutMethod,
          destination: destination || get().payoutDestination,
          requestedAt: today,
        };
        set((state) => ({
          withdrawals: [withdrawal, ...state.withdrawals],
        }));
        return withdrawal;
      },
      updateWithdrawalStatus: (id, status) =>
        set((state) => ({
          withdrawals: state.withdrawals.map((w) =>
            w.id === id
              ? {
                  ...w,
                  status,
                  processedAt:
                    status === "PAID" || status === "REJECTED"
                      ? new Date().toISOString().slice(0, 10)
                      : w.processedAt,
                }
              : w
          ),
        })),
    }),
    { name: "tradebib-affiliate" }
  )
);
