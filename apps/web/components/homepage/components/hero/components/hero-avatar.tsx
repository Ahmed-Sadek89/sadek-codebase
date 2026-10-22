import Image from "next/image";
import { useTranslations } from "next-intl";

/** The profile photo, or the name's initials while there is none. */
export function HeroAvatar({
  name,
  initials,
  avatarUrl,
}: {
  name?: string;
  initials?: string;
  avatarUrl?: string;
}) {
  const t = useTranslations();
  return (
    <div className="relative mx-auto mb-3 grid size-[100px] place-items-center overflow-hidden rounded-full border-[3px] border-border-strong bg-linear-135/srgb from-accent-soft to-accent-strong font-extrabold">
      {avatarUrl && name ? (
        <Image
          alt={t("heroAvatarAlt", { name })}
          className="size-full object-cover"
          height={100}
          priority
          src={avatarUrl}
          unoptimized
          width={100}
        />
      ) : (
        initials
      )}
    </div>
  );
}
