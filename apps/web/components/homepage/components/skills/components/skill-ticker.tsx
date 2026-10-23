import type { CSSProperties } from "react";
import type { PublicCategorySkillItem } from "@repo/types/category-skills";
import { cn } from "@repo/ui/utils";
import { useTickerTrack } from "../hooks";
import { SkillChip } from "./skill-chip";

/**
 * The skills drifting in an endless loop (pauses on hover). Decorative and
 * hidden from screen readers; SkillStream renders the readable list. Hidden
 * entirely for users who prefer reduced motion.
 */
export function SkillTicker({
  skills,
  reverse = false,
}: {
  skills: PublicCategorySkillItem[];
  reverse?: boolean;
}) {
  const { track, duration } = useTickerTrack(skills);
  const copy = (
    // Trailing padding equals the gap, so the two copies join seamlessly.
    <div className="flex shrink-0 gap-3 pr-3">
      {track.map(({ item, key }) => (
        <SkillChip key={key} skill={item} />
      ))}
    </div>
  );
  return (
    // Always laid out left to right so the loop math holds in Arabic too.
    <div
      aria-hidden="true"
      className="group/ticker overflow-hidden py-1 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-reduce:hidden"
      dir="ltr"
    >
      <div
        className={cn(
          "flex w-max animate-marquee group-hover/ticker:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
        style={{ "--marquee-duration": duration } as CSSProperties}
      >
        {copy}
        {copy}
      </div>
    </div>
  );
}
