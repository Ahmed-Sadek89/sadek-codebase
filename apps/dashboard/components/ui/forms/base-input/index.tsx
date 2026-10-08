"use client";

import { useId, type ComponentProps } from "react";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import { cn } from "@repo/ui/utils";

export type BaseInputProps = ComponentProps<typeof Input> & {
  label: string;
  error?: string;
  containerClassName?: string;
};

export function BaseInput({
  label,
  error,
  id,
  containerClassName,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: BaseInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const descriptionIds = [describedBy, error ? errorId : undefined]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cn("flex flex-col gap-y-2", containerClassName)}>
      <Label htmlFor={inputId}>{label}</Label>
      <Input
        {...props}
        id={inputId}
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
