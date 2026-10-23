import { useTranslations } from "next-intl";
import { ChevronRight } from "@repo/ui/icons";
import type { Step } from "../utils";

/** One step of the process as a glass card over the cover photo; an arrow leads to the next on large screens. */
export function StepCard({
  step,
  index,
  isLast,
}: {
  step: Step;
  index: number;
  isLast: boolean;
}) {
  const t = useTranslations();
  const { Icon } = step;
  return (
    <li className="group relative">
      <article className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-card/45 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:bg-card/60">
        <span
          aria-hidden="true"
          className="absolute -end-3 -top-4 bg-linear-to-b from-white/20 to-transparent bg-clip-text text-7xl font-black text-transparent tabular-nums select-none"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="relative grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/40 transition-transform duration-300 group-hover:scale-110">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <h3 className="relative mt-5 text-lg font-bold text-foreground">
          {t(step.titleKey)}
        </h3>
        <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
          {t(step.copyKey)}
        </p>
      </article>
      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute top-1/2 -end-[22px] z-10 hidden size-7 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-card/80 text-primary shadow-sm backdrop-blur lg:grid"
        >
          <ChevronRight className="size-4 rtl:-scale-x-100" />
        </span>
      )}
    </li>
  );
}
