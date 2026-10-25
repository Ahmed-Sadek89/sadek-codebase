import sanitizeHtml from "sanitize-html";

/**
 * Rich-text (HTML) rules shared by the backend (sanitizes on save), the
 * dashboard (Tiptap editor, required check) and the website (sanitizes again
 * before rendering). Everything not listed here is dropped: unknown tags lose
 * their markup but keep their text, and no attribute survives except `href`
 * on links.
 */

/** The tags the dashboard editor produces; nothing else is ever rendered. */
export const RICH_TEXT_ALLOWED_TAGS = [
  "p",
  "br",
  "h2",
  "h3",
  "strong",
  "em",
  "u",
  "s",
  "code",
  "pre",
  "blockquote",
  "ul",
  "ol",
  "li",
  "a",
  "hr",
] as const;

/** Link schemes allowed in `href`; anything else (javascript:, data:, //host …) drops the link. */
export const RICH_TEXT_ALLOWED_SCHEMES = ["http", "https", "mailto"] as const;

/** Every link opens in a new tab without access to this page or a referrer. */
export const RICH_TEXT_LINK_REL = "noopener noreferrer nofollow";

// Tags removed together with everything inside them (not just their markup).
const DROPPED_WITH_CONTENT = [
  "script",
  "style",
  "textarea",
  "option",
  "noscript",
  "iframe",
  "frame",
  "frameset",
  "object",
  "embed",
  "applet",
  "template",
  "svg",
  "math",
  "title",
  "head",
  "select",
  "xmp",
  "noembed",
  "noframes",
  "plaintext",
];

const SAFE_HREF = /^(https?:\/\/|mailto:)/i;

/** True for http(s)/mailto URLs, after the browser's own cleanup of whitespace and control characters. */
export function isSafeRichTextHref(href: string | undefined): href is string {
  if (!href) return false;
  // Browsers ignore control characters and whitespace inside a scheme
  // ("java\tscript:"), so strip them before checking.
  // eslint-disable-next-line no-control-regex
  const normalized = href.replace(/[\u0000- \u007f-\u009f]/g, "");
  return SAFE_HREF.test(normalized);
}

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [...RICH_TEXT_ALLOWED_TAGS],
  allowedAttributes: { a: ["href", "target", "rel"] },
  allowedSchemes: [...RICH_TEXT_ALLOWED_SCHEMES],
  allowedSchemesByTag: {},
  allowedSchemesAppliedToAttributes: ["href"],
  allowProtocolRelative: false,
  allowedStyles: {},
  allowedClasses: {},
  allowVulnerableTags: false,
  disallowedTagsMode: "discard",
  nonTextTags: DROPPED_WITH_CONTENT,
  // Deeper nesting is dropped (guards against stack-exhaustion payloads).
  nestingLimit: 20,
  // Editors and pasted HTML use b/i for bold/italic.
  transformTags: {
    b: "strong",
    i: "em",
    strike: "s",
    del: "s",
    h1: "h2",
    h4: "h3",
    h5: "h3",
    h6: "h3",
    // Safe links get a fixed target and rel; other links lose every attribute
    // and exclusiveFilter drops the tag, keeping the text. (Renaming to a
    // disallowed tag would make sanitize-html close the next link with it.)
    a: (_tagName, attribs): sanitizeHtml.Tag =>
      isSafeRichTextHref(attribs.href)
        ? {
            tagName: "a",
            attribs: {
              href: attribs.href.trim(),
              target: "_blank",
              rel: RICH_TEXT_LINK_REL,
            },
          }
        : { tagName: "a", attribs: {} },
  },
  exclusiveFilter: (frame) => (frame.tag === "a" && !frame.attribs.href ? "excludeTag" : false),
};

const TEXT_ONLY_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [],
  allowedAttributes: {},
  disallowedTagsMode: "discard",
  nonTextTags: DROPPED_WITH_CONTENT,
};

// Editor output always starts with a tag; text that merely contains one is plain text.
const HTML_START = /^\s*<\/?[a-z!][^>]*>/i;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Plain text saved before descriptions were HTML becomes paragraphs: a blank
 * line starts a new paragraph, a single newline becomes `<br>`. Text that
 * starts with a tag is HTML and is returned as is.
 */
export function plainTextToHtml(value: string): string {
  if (HTML_START.test(value)) return value;
  return value
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\r?\n/g, "<br>")}</p>`)
    .join("");
}

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function decodeEntities(text: string): string {
  return text.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
    if (entity[0] === "#") {
      const code =
        entity[1] === "x" || entity[1] === "X"
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10);
      return Number.isFinite(code) && code <= 0x10ffff ? String.fromCodePoint(code) : match;
    }
    return ENTITIES[entity.toLowerCase()] ?? match;
  });
}

/**
 * The visible text of rich text: tags removed, entities decoded, whitespace
 * collapsed. Safe to render as a React text node (never as HTML).
 */
export function richTextToPlainText(html: string | null | undefined): string {
  if (!html) return "";
  // Keep words of adjacent blocks apart once the tags are gone.
  const spaced = plainTextToHtml(html).replace(
    /<\/(p|h[1-6]|li|blockquote|pre)\s*>|<br\s*\/?>|<hr\s*\/?>/gi,
    "$& ",
  );
  return decodeEntities(sanitizeHtml(spaced, TEXT_ONLY_OPTIONS))
    .replace(/\s+/g, " ")
    .trim();
}

/** True when rich text has no visible text, e.g. the editor's empty `<p></p>`. */
export function isRichTextEmpty(html: string | null | undefined): boolean {
  return richTextToPlainText(html) === "";
}
 
export function sanitizeRichText(html: string | null | undefined): string {
  if (!html) return "";
  const clean = sanitizeHtml(plainTextToHtml(html), SANITIZE_OPTIONS).trim();
  return isRichTextEmpty(clean) ? "" : clean;
}
