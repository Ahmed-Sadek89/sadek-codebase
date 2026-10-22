/** `null` and empty strings both mean "not set". */
export function hasText(value: string | null | undefined): value is string {
  return Boolean(value?.trim());
}
