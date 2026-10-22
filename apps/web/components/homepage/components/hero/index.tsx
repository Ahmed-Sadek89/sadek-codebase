"use client";

import { Button } from "@repo/ui/button";
import { ArrowRight } from "@repo/ui/icons";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { PublicUserInfoResponse } from "@repo/types/user-info";
import type { QueryState } from "../../utils";
import { HeroAvatar, HeroCover, ScrollCue, SocialLinks } from "./components";
import { useHeroContent } from "./hooks";

// Staggered entrance; skipped when the user prefers reduced motion.
const reveal =
  "animate-in fade-in slide-in-from-bottom-3 duration-700 fill-mode-both motion-reduce:animate-none";

export function Hero({
  userInfo,
}: {
  userInfo: QueryState<PublicUserInfoResponse | undefined>;
}) {
  const t = useTranslations();
  const { profile, headline, summary, socialLinks } = useHeroContent(
    userInfo.data,
  );
  return (
    <section
      id="home"
      className="relative isolate flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4 py-[76px] text-center bg-radial-[circle_at_50%_13%] from-primary-muted from-0% to-transparent to-27% max-[700px]:min-h-[590px] max-[700px]:py-[54px]"
    >
      <HeroCover name={profile?.name || "default user"} src={profile?.coverPhotoUrl} />
      <div className="absolute top-[45px] left-1/2 -z-10 h-[170px] w-[300px] -translate-x-1/2 bg-glow blur-[45px]" />

      <div className={reveal}>
        <HeroAvatar
          name={profile?.name}
          initials={profile?.initials}
          avatarUrl={profile?.avatarUrl}
        />
      </div>

      <div
        className={`${reveal} flex flex-wrap items-center justify-center gap-2 delay-100`}
      >
        {profile && (
          <span className="rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
            {t("heroGreeting", { name: profile.name })}
          </span>
        )}
        <span className="flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-[11px] font-medium text-success">
          <span aria-hidden="true" className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          {t("heroAvailable")}
        </span>
      </div>

      <h1
        className={`${reveal} mx-auto my-5 max-w-[900px] bg-linear-to-b from-foreground to-foreground/65 bg-clip-text pb-1 text-6xl leading-[1.1] font-bold tracking-[-0.04em] text-transparent delay-200 max-[700px]:text-[30px]`}
      >
        {headline ?? (userInfo.isLoading ? "…" : t("heroWelcome"))}
      </h1>

      {summary && (
        <p
          className={`${reveal} mx-auto max-w-[640px] text-sm leading-[1.8] text-muted-foreground delay-300 max-[700px]:text-[13px]`}
        >
          {summary}
        </p>
      )}

      <div
        className={`${reveal} my-7 flex flex-wrap justify-center gap-3 delay-500`}
      >
        <Button
          asChild
          className="h-11 rounded-full px-6 shadow-md shadow-primary/25"
        >
          <Link className="text-[13px]" href="#work">
            {t("heroViewWork")}
            <ArrowRight className="w-[15px] rtl:-scale-x-100" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-11 rounded-full px-6">
          <Link className="text-[13px]" href="#contact">
            {t("heroLetsTalk")}
            <ArrowRight className="w-[15px] rtl:-scale-x-100" />
          </Link>
        </Button>
      </div>

      <div className={`${reveal} delay-700`}>
        <SocialLinks links={socialLinks} />
      </div>

      <ScrollCue label={t("heroScrollLabel")} />
    </section>
  );
}
