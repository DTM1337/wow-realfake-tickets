/**
 * Prefix:ar en publik sökväg med Next.js basePath.
 * Behövs för vanliga <img>-taggar och fetch()-anrop — till skillnad från
 * next/image som hanterar basePath automatiskt.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return `${BASE}${path}`;
}
