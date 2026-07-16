"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CrudFormDialog, CrudRowActions, CrudToolbar, type CrudField } from "@/components/admin/crud-shared";
import { VerifiedOwnerBadge } from "@/components/reviews/verified-owner-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { AdminReviewRecord } from "@/lib/data/admin-crud";
import { useAdminCrudStore } from "@/store/admin-crud-store";

const fields: CrudField[] = [
  { key: "botName", label: "Bot", required: true },
  { key: "author", label: "Author", required: true },
  { key: "rating", label: "Rating (1-5)", type: "number", required: true },
  { key: "title", label: "Title", required: true },
  { key: "content", label: "Comment", type: "textarea", required: true },
  { key: "helpfulCount", label: "Helpful votes", type: "number" },
  { key: "date", label: "Date", required: true },
  { key: "verifiedOwner", label: "Verified owner", type: "boolean" },
  { key: "approved", label: "Approved", type: "boolean" },
];

const empty: Omit<AdminReviewRecord, "id"> = {
  botName: "",
  author: "",
  rating: 5,
  title: "",
  content: "",
  date: new Date().toISOString().slice(0, 10),
  approved: false,
  verifiedOwner: false,
  helpfulCount: 0,
};

export default function AdminReviewsPage() {
  const { reviews, createReview, updateReview, deleteReview } = useAdminCrudStore();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminReviewRecord | null>(null);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
        <p className="mt-1 text-muted-foreground">
          Moderate ratings, comments, helpful votes, and verified owner badges.
        </p>
      </motion.div>

      <Card className="glass border-border/60">
        <CardHeader>
          <CrudToolbar
            title="Reviews"
            count={reviews.length}
            createLabel="Add review"
            onCreate={() => {
              setEditing(null);
              setOpen(true);
            }}
          />
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">Bot</th>
                <th className="pb-3 pr-4 font-medium">Author</th>
                <th className="pb-3 pr-4 font-medium">Rating</th>
                <th className="pb-3 pr-4 font-medium">Title</th>
                <th className="pb-3 pr-4 font-medium">Helpful</th>
                <th className="pb-3 pr-4 font-medium">Owner</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id} className="border-b border-border/40 last:border-0">
                  <td className="py-3 pr-4 font-medium">{review.botName}</td>
                  <td className="py-3 pr-4">{review.author}</td>
                  <td className="py-3 pr-4">{review.rating}/5</td>
                  <td className="max-w-xs truncate py-3 pr-4">{review.title}</td>
                  <td className="py-3 pr-4">{review.helpfulCount ?? 0}</td>
                  <td className="py-3 pr-4">
                    {review.verifiedOwner ? <VerifiedOwnerBadge /> : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant={review.approved ? "success" : "warning"}>
                      {review.approved ? "Approved" : "Pending"}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <CrudRowActions
                      onEdit={() => {
                        setEditing(review);
                        setOpen(true);
                      }}
                      onDelete={() => {
                        deleteReview(review.id);
                        toast.message("Review deleted");
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <CrudFormDialog
        key={editing?.id ?? "new-review"}
        open={open}
        onOpenChange={setOpen}
        title={editing ? "Edit review" : "Create review"}
        fields={fields}
        initialValues={editing ?? empty}
        submitLabel={editing ? "Update" : "Create"}
        onSubmit={(values) => {
          const payload = {
            botName: String(values.botName),
            author: String(values.author),
            rating: Number(values.rating),
            title: String(values.title),
            content: String(values.content),
            date: String(values.date),
            approved: Boolean(values.approved),
            verifiedOwner: Boolean(values.verifiedOwner),
            helpfulCount: Number(values.helpfulCount) || 0,
          };
          if (editing) {
            updateReview(editing.id, payload);
            toast.success("Review updated");
          } else {
            createReview(payload);
            toast.success("Review created");
          }
        }}
      />
    </div>
  );
}
