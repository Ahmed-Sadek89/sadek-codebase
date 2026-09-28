import { Button } from "@repo/ui/button";
import { ArrowRight } from "@repo/ui/icons";
import Link from "next/link";

export function Hero() {
  return (
    <section
      id="home"
      className="mx-auto w-full max-w-[1440px] px-4 py-[76px] max-[700px]:py-[54px] relative min-h-[650px] text-center bg-radial-[circle_at_50%_13%] from-primary-muted from-0% to-transparent to-27% max-[700px]:min-h-[590px] max-[700px]:pt-[62px]"
    >
      <div className="absolute top-[45px] left-1/2 h-[170px] w-[300px] -translate-x-1/2 bg-glow blur-[45px]" />
      <div className="relative mx-auto mb-3 grid size-[100px] place-items-center rounded-full border-[3px] border-border-strong bg-linear-135/srgb from-accent-soft to-accent-strong font-extrabold">
        DM
      </div>
      <p className="relative text-[10px] text-primary">
        ✦ Available for new projects
      </p>
      <h1 className="relative my-[14px] text-6xl leading-[1.1] tracking-[-0.04em] max-[700px]:text-[26px]">
        I&apos;m Daniel Mercer, a{" "}
        <em className="text-primary not-italic">product designer</em> &<br />{" "}
        developer building delightful digital
        <br className="max-[700px]:hidden" /> experiences.
      </h1>
      <p className="text-[11px] leading-[1.7] text-muted-foreground">
        For nearly a decade I&apos;ve helped startups and studios ship
        interfaces that are
        <br className="max-[700px]:hidden" /> as dependable as they are
        beautiful — from first sketch to final pixel.
      </p>
      <div className="m-[18px] flex justify-center gap-2.5">
        <Button asChild>
          <Link className="text-[11px]" href="#work">
            View My Work <ArrowRight className="w-[13px]" />
          </Link>
        </Button>
        <Link
          className="flex items-center gap-[5px] rounded-[30px] border border-border px-[13px] py-0 text-[11px] text-secondary-foreground no-underline"
          href="#contact"
        >
          Let&apos;s Talk <ArrowRight className="w-[13px]" />
        </Link>
      </div>
      <div className="text-sm text-muted-foreground">in　◉　◈　◎</div>
      <div className="mt-20 text-[8px] tracking-[0.12em] text-muted-foreground max-[700px]:mt-[60px]">
        TRUSTED BY FORWARD-THINKING TEAMS AND STUDIOS
        <div className="mt-4 flex justify-between gap-5 text-xs tracking-normal text-muted-foreground max-[700px]:justify-start max-[700px]:overflow-hidden">
          <b>Altisale</b>
          <b>HSC</b>
          <b>LUXMARK</b>
          <b>Westward</b>
          <b>Raygun</b>
          <b>TRITON</b>
        </div>
      </div>
    </section>
  );
}
