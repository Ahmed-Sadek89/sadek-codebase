"use client";

import { useState } from "react";
import { Button } from "@repo/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/dialog";

export type ConfirmActionProps = {
  question: string;
  onConfirm: () => void | Promise<void>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ConfirmAction({
  question,
  onConfirm,
  open,
  onOpenChange,
}: ConfirmActionProps) {
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => !isPending && onOpenChange(next)}
    >
      <DialogContent
        showCloseButton={false}
        className="duration-200 ease-out data-[state=closed]:slide-out-to-bottom-2 data-[state=open]:slide-in-from-bottom-4 motion-reduce:animate-none sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>{question}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button"  disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant={"danger"}
            onClick={() => void handleConfirm()}
            disabled={isPending}
            aria-busy={isPending}
          >
            {isPending ? "Please wait…" : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
