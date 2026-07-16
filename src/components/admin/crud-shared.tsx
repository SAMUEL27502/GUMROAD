"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FieldType = "text" | "number" | "textarea" | "select" | "boolean";

export interface CrudField {
  key: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
}

interface CrudFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  fields: CrudField[];
  initialValues?: Record<string, string | number | boolean>;
  onSubmit: (values: Record<string, string | number | boolean>) => void;
  submitLabel?: string;
}

export function CrudFormDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
  initialValues = {},
  onSubmit,
  submitLabel = "Save",
}: CrudFormDialogProps) {
  const [values, setValues] = useState<Record<string, string | number | boolean>>(initialValues);

  function syncOpen(next: boolean) {
    if (next) setValues(initialValues);
    onOpenChange(next);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    for (const field of fields) {
      if (field.required && (values[field.key] === undefined || values[field.key] === "")) {
        toast.error(`${field.label} is required`);
        return;
      }
    }
    onSubmit(values);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={syncOpen}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {fields.map((field) => {
            const type = field.type ?? "text";
            return (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>{field.label}</Label>
                {type === "select" ? (
                  <Select
                    value={String(values[field.key] ?? "")}
                    onValueChange={(v) => setValues((s) => ({ ...s, [field.key]: v }))}
                  >
                    <SelectTrigger id={field.key}>
                      <SelectValue placeholder={field.placeholder || "Select"} />
                    </SelectTrigger>
                    <SelectContent>
                      {(field.options || []).map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : type === "boolean" ? (
                  <Select
                    value={String(Boolean(values[field.key]))}
                    onValueChange={(v) => setValues((s) => ({ ...s, [field.key]: v === "true" }))}
                  >
                    <SelectTrigger id={field.key}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                ) : type === "textarea" ? (
                  <textarea
                    id={field.key}
                    className="border-input bg-background min-h-[88px] w-full rounded-xl border px-3 py-2 text-sm"
                    placeholder={field.placeholder}
                    value={String(values[field.key] ?? "")}
                    onChange={(e) => setValues((s) => ({ ...s, [field.key]: e.target.value }))}
                  />
                ) : (
                  <Input
                    id={field.key}
                    type={type === "number" ? "number" : "text"}
                    placeholder={field.placeholder}
                    value={values[field.key] === undefined ? "" : String(values[field.key])}
                    onChange={(e) =>
                      setValues((s) => ({
                        ...s,
                        [field.key]:
                          type === "number" ? Number(e.target.value || 0) : e.target.value,
                      }))
                    }
                  />
                )}
              </div>
            );
          })}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{submitLabel}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CrudToolbar({
  title,
  count,
  onCreate,
  createLabel = "Add new",
}: {
  title: string;
  count: number;
  onCreate: () => void;
  createLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{count} records</p>
      </div>
      <Button onClick={onCreate}>
        <Plus className="h-4 w-4" />
        {createLabel}
      </Button>
    </div>
  );
}

export function CrudRowActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button size="icon" variant="ghost" onClick={onEdit} aria-label="Edit">
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="text-red-400"
        onClick={onDelete}
        aria-label="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
