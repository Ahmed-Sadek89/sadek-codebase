"use client";

import { X } from "@repo/ui/icons";

type ClearButtonProps = {
  label: string;
  onClick: () => void;
};

export function ClearButton({ label, onClick }: ClearButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="absolute end-1.5 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <X className="size-3.5" aria-hidden />
    </button>
  );
}
