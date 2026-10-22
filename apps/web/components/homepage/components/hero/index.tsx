"use client";

import { Button } from "@repo/ui/button";
import { ArrowRight } from "@repo/ui/icons";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { UserCompany } from "@repo/types/user-company";
import type { PublicUserInfoResponse } from "@repo/types/user-info";
import type { QueryState } from "../../utils";
import { HeroAvatar, HeroCover, SocialLinks, TrustedBy } from "./components";
import { useHeroContent } from "./hooks";

export function Hero({
  userInfo,
  companies,
}: {
  userInfo: QueryState<PublicUserInfoResponse | undefined>;
  companies: QueryState<UserCompany[]>;
}) {
  const t = useTranslations();
  const { profile, headline, summary, socialLinks, companyNames } =
    useHeroContent(userInfo.data, companies.data);
  return (
    <section
      id="home"
      className="mx-auto w-full max-w-[1440px] px-4 py-[76px] max-[700px]:py-[54px] relative min-h-[650px] text-center bg-radial-[circle_at_50%_13%] from-primary-muted from-0% to-transparent to-27% max-[700px]:min-h-[590px] max-[700px]:pt-[62px]"
    >
      <HeroCover src={profile?.coverPhotoUrl} />
      <div className="absolute top-[45px] left-1/2 h-[170px] w-[300px] -translate-x-1/2 bg-glow blur-[45px]" />
      <HeroAvatar
        name={profile?.name}
        initials={profile?.initials}
        avatarUrl={profile?.avatarUrl}
      />
      {profile && (
        <p className="relative mb-1 text-sm font-semibold text-foreground">
          {t("heroGreeting", { name: profile.name })}
        </p>
      )}
      <p className="relative text-[10px] text-primary">{t("heroAvailable")}</p>
      <h1 className="relative mx-auto my-[14px] max-w-[900px] text-6xl leading-[1.1] tracking-[-0.04em] max-[700px]:text-[26px]">
        {headline ?? (userInfo.isLoading ? "…" : t("heroWelcome"))}
      </h1>
      {summary && (
        <p className="mx-auto max-w-[620px] text-[11px] leading-[1.7] text-muted-foreground">
          {summary}
        </p>
      )}
      <div className="m-[18px] flex justify-center gap-2.5">
        <Button asChild>
          <Link className="text-[11px]" href="#work">
            {t("heroViewWork")}{" "}
            <ArrowRight className="w-[13px] rtl:-scale-x-100" />
          </Link>
        </Button>
        <Link
          className="flex items-center gap-[5px] rounded-[30px] border border-border px-[13px] py-0 text-[11px] text-secondary-foreground no-underline"
          href="#contact"
        >
          {t("heroLetsTalk")}{" "}
          <ArrowRight className="w-[13px] rtl:-scale-x-100" />
        </Link>
      </div>
      <SocialLinks links={socialLinks} />
      <TrustedBy names={companyNames} />
    </section>
  );
}
