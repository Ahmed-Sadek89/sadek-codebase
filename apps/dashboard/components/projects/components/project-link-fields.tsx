"use client";

import { useTranslations } from "next-intl";
import { BaseInput } from "../../ui/forms/base-input";
import { URL_MAX } from "../schema";
import type { ProjectFieldsProps } from "./project-image-field";

/** The optional live and repository links; render inside the form's 2-column grid. */
export function ProjectLinkFields({ form, disabled }: ProjectFieldsProps) {
  const t = useTranslations();
  const { errors } = form.formState;

  return (
    <>
      <BaseInput
        id="liveUrl"
        type="url"
        inputMode="url"
        label={t("projectFormLiveUrlLabel")}
        placeholder="https://"
        dir="ltr"
        maxLength={URL_MAX}
        disabled={disabled}
        error={errors.liveUrl?.message}
        {...form.register("liveUrl")}
      />
      <BaseInput
        id="repoUrl"
        type="url"
        inputMode="url"
        label={t("projectFormRepoUrlLabel")}
        placeholder="https://github.com/"
        dir="ltr"
        maxLength={URL_MAX}
        disabled={disabled}
        error={errors.repoUrl?.message}
        {...form.register("repoUrl")}
      />
    </>
  );
}
