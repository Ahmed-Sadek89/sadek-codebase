import { cn } from "@repo/ui/utils";

/**
 * A section heading: large gradient title, accent bar and subtitle. Give it an `id` and point the section's `aria-labelledby` at
 * it so screen readers announce the section by its title.
 */
export const SectionTitle = ({
  title,
  copy,
  id,
  align = "center",
  className,
}: {
  title: string;
  copy?: string;
  id?: string;
  align?: "center" | "start";
  className?: string;
}) => {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-3 sm:mb-14",
        centered ? "items-center text-center" : "items-start text-start",
        className,
      )}
    >
      <h2
        className="bg-linear-to-b from-foreground to-foreground/70 bg-clip-text pb-1 text-3xl leading-[1.1] font-extrabold tracking-tight text-transparent sm:text-4xl lg:text-5xl"
        id={id}
      >
        {title}
      </h2>
      <span
        aria-hidden="true"
        className="h-1 w-14 rounded-full bg-linear-to-r from-primary to-accent-strong"
      />
      {copy && (
        <p
          className={cn(
            "max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base",
            centered && "mx-auto",
          )}
        >
          {copy}
        </p>
      )}
    </div>
  );
};
