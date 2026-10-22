import type { MessageKey } from "../../../../../i18n/types";

// Static testimonials: no backend endpoint holds reviews yet.
export const reviews: {
  name: string;
  quoteKey: MessageKey;
  roleKey: MessageKey;
}[] = [
  { name: "Elena Ross", quoteKey: "review1Quote", roleKey: "review1Role" },
  { name: "Marcus Hale", quoteKey: "review2Quote", roleKey: "review2Role" },
  { name: "Priya Rai", quoteKey: "review3Quote", roleKey: "review3Role" },
];
