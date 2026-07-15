"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Button
        variant="outline"
        size="icon"
        disabled={page <= 1}
        onClick={() => onPageChange(Math.max(1, page - 1))}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {pages.map((p) => (
        <Button
          key={p}
          variant={p === page ? "default" : "outline"}
          size="sm"
          className="min-w-9"
          onClick={() => onPageChange(p)}
          aria-current={p === page ? "page" : undefined}
        >
          {p}
        </Button>
      ))}
      <Button
        variant="outline"
        size="icon"
        disabled={page >= totalPages}
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
