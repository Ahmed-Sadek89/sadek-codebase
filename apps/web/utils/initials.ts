/** "Ahmed Sadek" -> "AS": shown in place of a missing profile photo. */
export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toLocaleUpperCase())
    .join("");
}
