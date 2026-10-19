import type { ReactNode } from "react";

type FormSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

/** A titled group of fields; the title sits beside the fields from `lg` up. */
export function FormSection({
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <fieldset className="grid gap-4 border-b border-border pb-6 last-of-type:border-0 last-of-type:pb-0 lg:grid-cols-[minmax(0,14rem)_1fr] lg:gap-8">
      <div className="space-y-1">
        <legend className="font-semibold">{title}</legend>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="min-w-0 space-y-4">{children}</div>
    </fieldset>
  );
}
