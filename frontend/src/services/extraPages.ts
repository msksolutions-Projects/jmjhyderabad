import extra from "@/data/extraPages.json";

/** Pages added from the Province's content document (small file, safe for the main bundle). */
export const extraPages = ((extra as { sections?: { slug: string; title: string; markdown: string }[] }).sections ?? []).filter(
  (page) => page?.slug && page.title && page.markdown?.trim(),
);

/** True when a page from the content document exists (used to show its menu link and route). */
export const hasSection = (slug: string) => extraPages.some((page) => page.slug === slug);
