import { ChevronRight } from "@repo/ui/icons";
import { services } from "../utils";
import { SectionTitle } from "../components/section-title";

export function Services() {
  return (
    <section
      id="services"
      className="mx-auto w-full max-w-[1440px] px-4 py-[76px] max-[700px]:py-[54px] bg-surface"
    >
      <SectionTitle
        title="What I Do"
        copy="A focused set of services, delivered end to end"
      />
      <div className="border-t border-border">
        {services.map(([number, title, copy]) => (
          <div
            className="grid grid-cols-[45px_1fr_20px] items-center border-b border-border py-[18px]"
            key={number}
          >
            <span className="text-xs text-primary">{number}</span>
            <div>
              <h3 className="m-0 text-[13px]">{title}</h3>
              <p className="my-1 text-[10px] text-muted-foreground">{copy}</p>
            </div>
            <ChevronRight className="w-[13px] text-muted-foreground" />
          </div>
        ))}
      </div>
    </section>
  );
}
