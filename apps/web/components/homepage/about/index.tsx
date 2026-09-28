import { Card, CardContent } from "@repo/ui/card";
import { SectionTitle } from "../components/section-title";

export function About() {
  const stats = [
    ["8+", "Years Experience"],
    ["120+", "Projects Shipped"],
    ["48", "Happy Clients"],
    ["16", "Awards Won"],
  ];
  return (
    <section
      id="about"
      className="mx-auto w-full max-w-[1440px] px-4 py-[76px] max-[700px]:py-[54px] bg-muted"
    >
      <SectionTitle
        title="About Me"
        copy="A short story, and a few numbers from the journey"
      />
      <p className="mx-auto mb-[26px] max-w-[750px] text-center text-[11px] leading-[1.7] text-muted-foreground">
        I&apos;m a multidisciplinary product designer and front-end developer
        based in Austin, Texas. I help founders turn rough ideas into refined,
        usable products — pairing research-driven design decisions with clean,
        accessible code. When I&apos;m not pushing pixels you&apos;ll find me
        sketching type, mentoring juniors, or chasing good coffee.
      </p>
      <div className="grid grid-cols-4 gap-3 max-[700px]:grid-cols-2">
        {stats.map(([number, label]) => (
          <Card className="border-0 bg-card" key={label}>
            <CardContent className="p-4 text-center">
              <strong className="block text-2xl text-primary">{number}</strong>
              <small className="text-[9px] text-muted-foreground">
                {label}
              </small>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
