/** Sections drawn while the homepage streams in, in page order. */
export const skeletonSections = [
  { id: "about", background: "bg-muted", rows: 2 },
  { id: "services", background: "bg-surface", rows: 4 },
  { id: "skills", background: "bg-muted", rows: 3 },
  { id: "work", background: "bg-background", rows: 2 },
  { id: "teaching", background: "bg-surface", rows: 2 },
] as const;
