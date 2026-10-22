import { useTranslations } from "next-intl";
import type { Stat } from "../utils";

export function StatCard({ stat }: { stat: Stat }) {
  const t = useTranslations();
  const { Icon } = stat;
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 sm:p-6">
      {/* Soft corner glow that brightens on hover. */}
      <span
        aria-hidden="true"
        className="absolute -end-8 -top-8 size-28 rounded-full bg-primary/5 transition-colors duration-300 group-hover:bg-primary/10"
      />
      <span className="relative mb-4 grid size-11 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <strong className="relative block bg-linear-to-br from-foreground to-primary bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
        {stat.value}
      </strong>
      <span className="relative mt-1 block text-xs text-muted-foreground sm:text-sm">
        {t(stat.labelKey)}
      </span>
    </div>
  );
}
