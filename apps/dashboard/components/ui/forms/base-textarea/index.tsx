"use client";

import { useId, type ComponentProps } from "react";
import { Textarea } from "@repo/ui/textarea";
import { Label } from "@repo/ui/label";
import { cn } from "@repo/ui/utils";

export type BaseTextareaProps = ComponentProps<typeof Textarea> & {
  label: string;
  error?: string;
  containerClassName?: string;
};

export function BaseTextarea({
  label,
  error,
  id,
  containerClassName,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: BaseTextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const errorId = `${textareaId}-error`;
  const descriptionIds = [describedBy, error ? errorId : undefined]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cn("flex flex-col gap-y-2", containerClassName)}>
      <Label htmlFor={textareaId}>{label}</Label>
      <Textarea
        {...props}
        id={textareaId}
        aria-invalid={error ? true : invalid}
        aria-describedby={descriptionIds || undefined}
      />
      {error && (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
