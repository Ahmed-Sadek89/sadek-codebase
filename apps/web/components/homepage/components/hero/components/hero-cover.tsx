import { useTranslations } from "next-intl";
import Image from "next/image";

/** The cover photo, faded into the page background behind the hero. */
export function HeroCover({ src, name }: { src?: string, name: string }) {
  const t = useTranslations();
  if (!src) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-screen mask-b-from-20% mask-b-to-100% opacity-35"
    >
      <Image
        alt={t("heroAvatarAlt", { name })}
        className="size-full object-cover"
        fill
        priority
        sizes="100vw"
        src={src}
      />
    </div>
  );
}
