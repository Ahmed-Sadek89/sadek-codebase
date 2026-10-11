"use client";

import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/dialog";
import { LucideIcon } from "@repo/ui/icons";

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

/** Controlled dialog that stays open on outside clicks; Escape and the X button still close it. */
export function AppDialog({
  open,
  onOpenChange,
  title,
  description = "",
  Icon,
  children,
  className,
}: AppDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={className}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle asChild>
            <div className="flex items-start gap-3 text-start">
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
        <div className="pt-10 pb-5">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
