import { create } from "zustand";
import { persist } from "zustand/middleware";
import { adminUsers } from "@/lib/data/admin";
import { bots } from "@/lib/data/bots";
import {
  seedAdminAnnouncements,
  seedAdminCategories,
  seedAdminCoupons,
  seedAdminPricing,
  seedAdminReviews,
  type AdminAnnouncementRecord,
  type AdminBotRecord,
  type AdminCategoryRecord,
  type AdminCouponRecord,
  type AdminPricingRecord,
  type AdminReviewRecord,
  type AdminUserRecord,
} from "@/lib/data/admin-crud";

function uid(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

interface AdminCrudState {
  users: AdminUserRecord[];
  bots: AdminBotRecord[];
  categories: AdminCategoryRecord[];
  reviews: AdminReviewRecord[];
  pricing: AdminPricingRecord[];
  coupons: AdminCouponRecord[];
  announcements: AdminAnnouncementRecord[];

  createUser: (data: Omit<AdminUserRecord, "id">) => void;
  updateUser: (id: string, data: Partial<AdminUserRecord>) => void;
  deleteUser: (id: string) => void;

  createBot: (data: Omit<AdminBotRecord, "id">) => void;
  updateBot: (id: string, data: Partial<AdminBotRecord>) => void;
  deleteBot: (id: string) => void;

  createCategory: (data: Omit<AdminCategoryRecord, "id">) => void;
  updateCategory: (id: string, data: Partial<AdminCategoryRecord>) => void;
  deleteCategory: (id: string) => void;

  createReview: (data: Omit<AdminReviewRecord, "id">) => void;
  updateReview: (id: string, data: Partial<AdminReviewRecord>) => void;
  deleteReview: (id: string) => void;

  createPricing: (data: Omit<AdminPricingRecord, "id">) => void;
  updatePricing: (id: string, data: Partial<AdminPricingRecord>) => void;
  deletePricing: (id: string) => void;

  createCoupon: (data: Omit<AdminCouponRecord, "id">) => void;
  updateCoupon: (id: string, data: Partial<AdminCouponRecord>) => void;
  deleteCoupon: (id: string) => void;

  createAnnouncement: (data: Omit<AdminAnnouncementRecord, "id">) => void;
  updateAnnouncement: (id: string, data: Partial<AdminAnnouncementRecord>) => void;
  deleteAnnouncement: (id: string) => void;
}

const initialBots: AdminBotRecord[] = bots.map((b) => ({
  id: b.id,
  name: b.name,
  slug: b.slug,
  strategy: b.strategy,
  tradingPair: b.tradingPair,
  category: b.category,
  riskLevel: b.riskLevel,
  price: b.price,
  roi: b.roi,
  verified: b.verified,
  approved: b.featured,
}));

const initialUsers: AdminUserRecord[] = adminUsers.map((u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  plan: u.plan as AdminUserRecord["plan"],
  role: u.role as AdminUserRecord["role"],
  joined: u.joined,
  status: u.status as AdminUserRecord["status"],
}));

export const useAdminCrudStore = create<AdminCrudState>()(
  persist(
    (set) => ({
      users: initialUsers,
      bots: initialBots,
      categories: seedAdminCategories,
      reviews: seedAdminReviews,
      pricing: seedAdminPricing,
      coupons: seedAdminCoupons,
      announcements: seedAdminAnnouncements,

      createUser: (data) =>
        set((s) => ({ users: [{ id: uid("user"), ...data }, ...s.users] })),
      updateUser: (id, data) =>
        set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, ...data } : u)) })),
      deleteUser: (id) => set((s) => ({ users: s.users.filter((u) => u.id !== id) })),

      createBot: (data) => set((s) => ({ bots: [{ id: uid("bot"), ...data }, ...s.bots] })),
      updateBot: (id, data) =>
        set((s) => ({ bots: s.bots.map((b) => (b.id === id ? { ...b, ...data } : b)) })),
      deleteBot: (id) => set((s) => ({ bots: s.bots.filter((b) => b.id !== id) })),

      createCategory: (data) =>
        set((s) => ({ categories: [{ id: uid("cat"), ...data }, ...s.categories] })),
      updateCategory: (id, data) =>
        set((s) => ({
          categories: s.categories.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),
      deleteCategory: (id) =>
        set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),

      createReview: (data) =>
        set((s) => ({ reviews: [{ id: uid("rev"), ...data }, ...s.reviews] })),
      updateReview: (id, data) =>
        set((s) => ({
          reviews: s.reviews.map((r) => (r.id === id ? { ...r, ...data } : r)),
        })),
      deleteReview: (id) => set((s) => ({ reviews: s.reviews.filter((r) => r.id !== id) })),

      createPricing: (data) =>
        set((s) => ({ pricing: [{ id: uid("price"), ...data }, ...s.pricing] })),
      updatePricing: (id, data) =>
        set((s) => ({
          pricing: s.pricing.map((p) => (p.id === id ? { ...p, ...data } : p)),
        })),
      deletePricing: (id) => set((s) => ({ pricing: s.pricing.filter((p) => p.id !== id) })),

      createCoupon: (data) =>
        set((s) => ({ coupons: [{ id: uid("cp"), ...data }, ...s.coupons] })),
      updateCoupon: (id, data) =>
        set((s) => ({
          coupons: s.coupons.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),
      deleteCoupon: (id) => set((s) => ({ coupons: s.coupons.filter((c) => c.id !== id) })),

      createAnnouncement: (data) =>
        set((s) => ({
          announcements: [{ id: uid("an"), ...data }, ...s.announcements],
        })),
      updateAnnouncement: (id, data) =>
        set((s) => ({
          announcements: s.announcements.map((a) => (a.id === id ? { ...a, ...data } : a)),
        })),
      deleteAnnouncement: (id) =>
        set((s) => ({ announcements: s.announcements.filter((a) => a.id !== id) })),
    }),
    { name: "tradebib-admin-crud" }
  )
);
