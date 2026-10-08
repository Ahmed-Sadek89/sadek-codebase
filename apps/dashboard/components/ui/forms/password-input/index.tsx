"use client";

import { useId, useState, type ComponentProps } from "react";
import { Label } from "@repo/ui/label";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@repo/ui/input-group";
import { EyeIcon, EyeOffIcon } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";

export type PasswordInputProps = Omit<
  ComponentProps<typeof InputGroupInput>,
  "type"
> & {
  label: string;
  error?: string;
  containerClassName?: string;
};

export function PasswordInput({
  label,
  error,
  id,
  disabled,
  containerClassName,
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const descriptionIds = [describedBy, error ? errorId : undefined]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cn("flex flex-col gap-y-2", containerClassName)}>
      <Label htmlFor={inputId}>{label}</Label>
      <InputGroup data-disabled={disabled} className="overflow-hidden">
        <InputGroupInput
          {...props}
          id={inputId}
          type={isVisible ? "text" : "password"}
          disabled={disabled}
          aria-invalid={error ? true : invalid}
          aria-describedby={descriptionIds || undefined}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            variant="ghost"
            size="icon-xs"
            disabled={disabled}
            onClick={() => setIsVisible((prev) => !prev)}
            aria-label={isVisible ? "Hide password" : "Show password"}
            aria-pressed={isVisible}
            aria-controls={inputId}
            className="text-muted-foreground hover:bg-transparent"
          >
            {isVisible ? <EyeOffIcon /> : <EyeIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      {error && (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
