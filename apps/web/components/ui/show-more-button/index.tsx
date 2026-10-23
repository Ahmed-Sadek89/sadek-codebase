import { useTranslations } from "next-intl";
import { Button } from "@repo/ui/button";
import { ChevronDown, LoaderCircle } from "@repo/ui/icons";

/** "Show more" for an infinite list: loads the next page and spins while it does. */
export function ShowMoreButton({
  isLoading,
  onClick,
}: {
  isLoading: boolean;
  onClick: () => void;
}) {
  const t = useTranslations();
  return (
    <div className="mt-8 flex justify-center">
      <Button
        aria-busy={isLoading}
        className="h-11 min-w-40 rounded-full px-6"
        disabled={isLoading}
        onClick={onClick}
        type="button"
        variant="outline"
      >
        {isLoading ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <ChevronDown className="size-4" aria-hidden="true" />
        )}
        {isLoading ? t("statusLoading") : t("showMore")}
      </Button>
    </div>
  );
}
