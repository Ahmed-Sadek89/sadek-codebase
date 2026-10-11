"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/dialog";
import { LucideIcon, X } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";

export type AppDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** HTML/JSX for the header; its wrapper is the dialog's accessible title. */
  title: string,
  description?: string,
  Icon: LucideIcon,
  /** The dialog body. */
  children: ReactNode;
  /** Extra classes for the dialog panel (size, layout, spacing). */
  className?: string;
};

/**
 * Controlled dialog that stays open on outside clicks; Escape and the X button
 * still close it. The header (with the X) stays pinned while the body scrolls.
 */
export function AppDialog({
  open,
  onOpenChange,
  title,
  description = "",
  Icon,
  children,
  className,
}: AppDialogProps) {
  const t = useTranslations();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        // Below lg (phones and tablets) a tall dialog scrolls inside the
        // viewport instead of overflowing it; lg and up keep the natural height.
        className={cn(
          "max-h-[85dvh] overflow-y-auto lg:max-h-none lg:overflow-y-visible",
          className,
        )}
        onInteractOutside={(event) => event.preventDefault()}
        // The built-in X would scroll away; the header renders its own.
        showCloseButton={false}
      >
        {/* Negative margins + matching padding stretch it over the panel's
            p-6, so scrolled content never shows above or beside it. */}
        <DialogHeader className="sticky -top-6 z-10 -mx-6  rounded-t-lg border-b border-border bg-card px-6 pt-6 pb-4">
          <DialogClose
            className="absolute end-4 top-6 cursor-pointer rounded-xs opacity-70 ring-offset-background transition-opacity outline-none hover:opacity-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={t("dialogClose")}
            title={t("dialogClose")}
          >
            <X className="size-4" aria-hidden />
          </DialogClose>
          <DialogTitle asChild>
            <div className="flex items-start gap-3 pe-6 text-start">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold leading-tight">
                  {title}
                </h2>
                {
                  description &&
                  <p className="text-sm font-normal text-muted-foreground">
                    {description}
                  </p>
                }
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="pt-4 pb-5">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
