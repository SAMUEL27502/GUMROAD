"use client";

import { locales, type Locale } from "@/lib/i18n/dictionaries";
import { useLocaleStore } from "@/store/locale-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LocaleSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLocaleStore();

  return (
    <Select value={locale} onValueChange={(v) => setLocale(v as Locale)}>
      <SelectTrigger
        className={className ?? "h-9 w-[7.5rem]"}
        aria-label="Language"
      >
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {locales.map((l) => (
          <SelectItem key={l.code} value={l.code}>
            {l.flag} {l.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
