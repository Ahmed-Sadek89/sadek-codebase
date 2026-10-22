import { useTranslations } from "next-intl";

/** Loading, error or empty placeholder shown in place of a section's list. */
export const SectionStatus = ({
  isLoading,
  isError,
  emptyText,
}: {
  isLoading: boolean;
  isError: boolean;
  emptyText: string;
}) => {
  const t = useTranslations();
  let text = emptyText;
  if (isLoading) text = t("statusLoading");
  else if (isError) text = t("statusError");
  return (
    <p
      className="py-6 text-center text-[11px] text-muted-foreground"
      aria-live="polite"
      role={isError ? "alert" : undefined}
    >
      {text}
    </p>
  );
};
