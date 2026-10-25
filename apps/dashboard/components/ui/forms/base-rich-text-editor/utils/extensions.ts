import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import { isSafeRichTextHref, RICH_TEXT_LINK_REL } from "@repo/rich-text";

/**
 * Only the nodes and marks in RICH_TEXT_ALLOWED_TAGS (`@repo/rich-text`), so
 * the editor never produces HTML the backend would strip. Pasted content is
 * reduced to this schema too.
 */
export function createRichTextExtensions(placeholder?: string) {
  return [
    StarterKit.configure({
      heading: { levels: [2, 3] },
      link: {
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        defaultProtocol: "https",
        protocols: ["http", "https", "mailto"],
        // Same rule as the sanitizer: http(s) and mailto only.
        isAllowedUri: (url) => isSafeRichTextHref(url),
        shouldAutoLink: (url) => isSafeRichTextHref(url),
        HTMLAttributes: { target: "_blank", rel: RICH_TEXT_LINK_REL, class: null },
      },
      codeBlock: { HTMLAttributes: { class: null } },
    }),
    Placeholder.configure({ placeholder: placeholder ?? "" }),
  ];
}
