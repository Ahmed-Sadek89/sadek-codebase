import { useTranslations } from "next-intl";
import { Card, CardContent } from "@repo/ui/card";
import { SectionTitle } from "../../../ui/section-title";
import { reviews } from "./utils";

export function Reviews() {
  const t = useTranslations();
  return (
    <section className="py-[76px] max-[700px]:py-[54px] bg-muted">
      <div className="app-container py-0">
        <SectionTitle title={t("reviewsTitle")} copy={t("reviewsCopy")} />
        <div className="grid grid-cols-3 gap-3 max-[700px]:grid-cols-1">
          {reviews.map(({ name, quoteKey, roleKey }) => (
            <Card className="border-0 bg-card" key={name}>
              <CardContent className="p-[18px]">
                <div className="text-[10px] text-warning">★★★★★</div>
                <p className="text-[10px] leading-[1.6] text-muted-foreground">
                  “{t(quoteKey)}”
                </p>
                <b className="block text-[10px]">{name}</b>
                <small className="text-[9px] text-muted-foreground">
                  {t(roleKey)}
                </small>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
