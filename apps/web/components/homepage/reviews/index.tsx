import { Card, CardContent } from "@repo/ui/card";
import { SectionTitle } from "../components/section-title";

export function Reviews() {
  const reviews = [
    [
      "Daniel transformed a vague idea into a product our users adore. The speed, the taste, and the design and code were outstanding.",
      "Elena Ross",
      "Founder, Lumen",
    ],
    [
      "Rare to find someone equally strong in design and engineering. Dependable, communicative, and always over-delivers.",
      "Marcus Hale",
      "Director, Northwind",
    ],
    [
      "His design system was a massive flow. Our product and dev team work confidently now, with way fewer loose ends.",
      "Priya Rai",
      "Design Lead, Altisale",
    ],
  ];
  return (
    <section className="mx-auto w-full max-w-[1440px] px-4 py-[76px] max-[700px]:py-[54px] bg-muted">
      <SectionTitle
        title="Kind Words"
        copy="A few notes from people I've had the joy of working with"
      />
      <div className="grid grid-cols-3 gap-3 max-[700px]:grid-cols-1">
        {reviews.map(([quote, name, role]) => (
          <Card className="border-0 bg-card" key={name}>
            <CardContent className="p-[18px]">
              <div className="text-[10px] text-warning">★★★★★</div>
              <p className="text-[10px] leading-[1.6] text-muted-foreground">
                “{quote}”
              </p>
              <b className="block text-[10px]">{name}</b>
              <small className="text-[9px] text-muted-foreground">{role}</small>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
