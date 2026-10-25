import type { ComponentProps } from "react";
import { sanitizeRichText } from "@repo/rich-text";
import { cn } from "./utils";

/**
 * Typography for rich-text HTML (the tags in RICH_TEXT_ALLOWED_TAGS), shared
 * by RichTextContent and the dashboard's Tiptap editor so both look the same.
 */
export const richTextClassName = [
  "text-sm leading-relaxed break-words text-foreground",
  "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
  "[&_p]:my-2",
  "[&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold",
  "[&_h3]:mt-3 [&_h3]:mb-1.5 [&_h3]:text-base [&_h3]:font-semibold",
  "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:ps-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:ps-5",
  "[&_li]:my-0.5 [&_li>p]:my-0",
  "[&_blockquote]:my-3 [&_blockquote]:border-s-2 [&_blockquote]:border-primary/40 [&_blockquote]:ps-3 [&_blockquote]:text-muted-foreground",
  "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em]",
  "[&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0",
  "[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2",
  "[&_hr]:my-4 [&_hr]:border-border",
  "[&_strong]:font-semibold",
].join(" ");

export type RichTextContentProps = Omit<
  ComponentProps<"div">,
  "children" | "dangerouslySetInnerHTML"
> & {
  /** Untrusted HTML; it is sanitized here before rendering. */
  html: string | null | undefined;
};

/**
 * Renders rich-text HTML after sanitizing it with the shared allowlist
 * (`@repo/rich-text`): no scripts, iframes, event handlers, class/id/style or
 * unsafe links ever reach the DOM, even if the stored HTML was tampered with.
 * Renders nothing when there is no visible text.
 */
export function RichTextContent({ html, className, ...props }: RichTextContentProps) {
  const safeHtml = sanitizeRichText(html);
  if (!safeHtml) return null;
  return (
    <div
      {...props}
      className={cn(richTextClassName, className)}
      // Safe: sanitizeRichText only keeps allowlisted tags and attributes.
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}
