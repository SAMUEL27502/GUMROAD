import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  description?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
  required?: boolean;
}

export function FormField({
  label,
  htmlFor,
  description,
  error,
  className,
  children,
  required,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={htmlFor}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      {children}
      {description && !error && <p className="text-muted-foreground text-xs">{description}</p>}
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
}
