import Image from "next/image";
import { useTranslations } from "next-intl";

/**
 * The profile photo in a gradient ring with an "available" dot, or the
 * name's initials while there is no photo.
 */
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
    <div className="relative mx-auto mb-5 size-[124px] rounded-full bg-linear-135/srgb from-primary via-accent-strong to-accent-soft p-[3px] shadow-lg shadow-primary/20">
      <div className="grid size-full place-items-center overflow-hidden rounded-full border-4 border-background bg-linear-135/srgb from-accent-soft to-accent-strong text-2xl font-extrabold">
        {avatarUrl && name ? (
          <Image
            alt={t("heroAvatarAlt", { name })}
            className="size-full object-cover"
            height={124}
            priority
            src={avatarUrl}
            width={124}
          />
        ) : (
          initials
        )}
      </div>
      <span
        aria-hidden="true"
        className="absolute end-2 bottom-2 size-4 rounded-full border-[3px] border-background bg-success"
      />
    </div>
  );
}
