import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { cn } from "@repo/ui/utils";

type FormCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  /** Classes for the content area (e.g. a grid). */
  contentClassName?: string;
};

/** A titled card that groups related fields on the project page. */
export function FormCard({
  title,
  description,
  children,
  contentClassName,
}: FormCardProps) {
  return (
    <Card className="gap-5 py-5">
      <CardHeader className="gap-1 px-5">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className={cn("space-y-4 px-5", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
