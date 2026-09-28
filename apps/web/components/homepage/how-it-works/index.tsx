import { Code2, Palette, Search, Send } from "@repo/ui/icons";
import type { LucideIcon } from "@repo/ui/icons";
import { Card, CardContent } from "@repo/ui/card";
import { SectionTitle } from "../components/section-title";

export function HowItWorks() {
  const steps: [LucideIcon, string, string][] = [
    [
      Search,
      "Discover",
      "We dig into your goals, users, and market to map the problem before we touch a pixel.",
    ],
    [
      Palette,
      "Design",
      "Wireframes evolve into polished, accessible screens — validated through quick feedback loops.",
    ],
    [
      Code2,
      "Build",
      "Design becomes accessible, performant code you can confidently hand off or launch.",
    ],
    [
      Send,
      "Launch",
      "We ship, measure, and refine — because great things release into the world.",
    ],
  ];
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-[76px] max-[700px]:py-[54px] bg-surface">
      <SectionTitle
        title="How I Work"
        copy="A simple, collaborative process that keeps projects on track"
      />
      <div className="grid grid-cols-4 gap-3 max-[700px]:grid-cols-2">
        {steps.map(([Icon, title, copy], i) => (
          <Card className="border-0 bg-card" key={title}>
            <CardContent className="relative p-[17px]">
              <span className="absolute top-3 right-[13px] text-xl font-bold text-muted-foreground">
                0{i + 1}
              </span>
              <Icon className="w-[17px] text-primary" />
              <h3 className="mt-[13px] text-xs">{title}</h3>
              <p className="text-[10px] leading-[1.6] text-muted-foreground">
                {copy}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
