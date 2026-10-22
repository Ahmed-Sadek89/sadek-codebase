/** Loading or empty placeholder shown in place of a section's list. */
export const SectionStatus = ({
  isPending,
  emptyText,
}: {
  isPending: boolean;
  emptyText: string;
}) => (
  <p
    className="py-6 text-center text-[11px] text-muted-foreground"
    aria-live="polite"
  >
    {isPending ? "Loading…" : emptyText}
  </p>
);
