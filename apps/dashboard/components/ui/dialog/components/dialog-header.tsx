"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { LucideIcon } from "@repo/ui/icons";

type ICategorySkillsHeaderForm = {
  title: string,
  description?: string,
  Icon: LucideIcon
}
export function CategorySkillsHeaderForm({
  title,
  description = "",
  Icon
}: ICategorySkillsHeaderForm) {
  const t = useTranslations();

  return (
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
  );
}
