import { Transform } from 'class-transformer';
import { sanitizeRichText } from '@repo/rich-text';

/**
 * Sanitizes an HTML string with the shared rich-text allowlist before
 * validation (scripts, iframes, event handlers, class/id/style and unsafe
 * links are removed). Text with nothing visible left becomes '', so
 * `@IsNotEmpty()` rejects an empty editor (`<p></p>`).
 */
export function ToRichText() {
  return Transform(({ value }) => (typeof value === 'string' ? sanitizeRichText(value) : value));
}
