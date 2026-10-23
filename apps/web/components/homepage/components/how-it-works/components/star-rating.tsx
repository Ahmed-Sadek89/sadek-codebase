import { useTranslations } from "next-intl";
import { Star } from "@repo/ui/icons";
import { cn } from "@repo/ui/utils";

/** Five stars, `rating` of them filled; read out as "Rated 5 out of 5". */
export function StarRating({ rating }: { rating: number }) {
  const t = useTranslations();
  return (
    <div
      aria-label={t("reviewsRating", { rating })}
      className="flex gap-0.5"
      role="img"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          aria-hidden="true"
          className={cn(
            "size-4",
            index < rating
              ? "fill-warning text-warning"
              : "fill-muted text-muted-foreground/30",
          )}
          key={index}
        />
      ))}
    </div>
  );
}
