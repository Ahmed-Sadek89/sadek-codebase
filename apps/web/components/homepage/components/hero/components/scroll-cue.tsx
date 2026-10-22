import { ChevronDown } from "@repo/ui/icons";

/** A bouncing arrow at the bottom of the hero that jumps to the next section. */
export function ScrollCue({ label }: { label: string }) {
  return (
    <a
      aria-label={label}
      className="absolute bottom-6 left-1/2 grid size-9 -translate-x-1/2 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-border-strong hover:text-primary max-[700px]:hidden"
      href="#about"
    >
      <ChevronDown className="size-4 animate-bounce" />
    </a>
  );
}
