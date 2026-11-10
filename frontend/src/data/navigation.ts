import type { IconName } from "@/components/ui/Icon";

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  icon?: IconName;
  /** Page written from the content document; the link shows only once it exists. */
  slug?: string;
}

export interface NavGroup {
  /** Stable key, also used for the section sidebar title. */
  id: string;
  label: string;
  /** Landing page for the section (first item when omitted). */
  href?: string;
  items?: NavItem[];
}

/**
 * Site map, exactly as set out by the Province ("Website 2" document):
 * Home · Provincialate · Spirituality · Mission · Community · News Flash ·
 * Joining Us · Ven. Mary Glowrey. Every older URL still works and the
 * remaining pages (institutions, gallery, news, contact…) are linked from
 * the home page and footer.
 *
 * Items with a `slug` are written from the Province's content; until that
 * text is supplied the page shows a short "being prepared" notice.
 */
export const navigation: NavGroup[] = [
  {
    id: "provincialate",
    label: "Provincialate",
    items: [
      { label: "Message from the Provincial Superior", href: "/province/provincial-message", icon: "mail", slug: "provincial-message" },
      { label: "Meet our Province Teams", href: "/province/teams", icon: "users" },
      { label: "Provincial Council", href: "/province/provincial-council", icon: "building", slug: "provincial-council" },
    ],
  },
  {
    id: "spirituality",
    label: "Spirituality",
    items: [
      { label: "Our Founder", href: "/who-we-are/founder", icon: "star" },
      { label: "JMJ Spirituality & Charism", href: "/spirituality/charism", icon: "heart", slug: "spirituality-charism" },
      { label: "Our Life With God", href: "/spirituality/life-with-god", icon: "cross", slug: "life-with-god" },
      { label: "Prayers of the Congregation", href: "/spirituality/prayers", icon: "book", slug: "congregation-prayers" },
    ],
  },
  {
    id: "mission",
    label: "Mission",
    items: [
      { label: "Vision & Mission Statement", href: "/who-we-are/vision-mission", icon: "eye" },
      { label: "Education", href: "/ministries/education", icon: "school" },
      { label: "Health Care", href: "/ministries/health-care", icon: "health" },
      { label: "Social Apostolate", href: "/ministries/social-work", icon: "social" },
      { label: "Pastoral & Evangelization", href: "/ministries/pastoral-evangelization", icon: "church" },
      { label: "Mission & JPIC", href: "/ministries/eco-friendliness", icon: "leaf" },
      { label: "Safeguarding", href: "/ministries/safeguarding", icon: "shield" },
    ],
  },
  {
    id: "community",
    label: "Community",
    items: [{ label: "Our Life in the Community", href: "/who-we-are/our-life", icon: "users" }],
  },
  {
    id: "newsflash",
    label: "News Flash",
    items: [
      { label: "Jubilee Vibes", href: "/news-flash/jubilee-vibes", icon: "star" },
      { label: "News Flash", href: "/news-flash", icon: "news" },
    ],
  },
  {
    id: "joining",
    label: "Joining Us",
    items: [
      { label: "Stages of Formation", href: "/ministries/formation", icon: "users" },
      { label: "Becoming A JMJ Nun", href: "/joining-us/becoming-a-jmj-sister", icon: "heart", slug: "becoming-a-jmj-sister" },
      { label: "Lay Association", href: "/joining-us/lay-association", icon: "social", slug: "lay-association" },
      { label: "Whom To Contact?", href: "/joining-us/whom-to-contact", icon: "mail" },
    ],
  },
  {
    id: "glowrey",
    label: "Ven. Mary Glowrey",
    items: [
      { label: "Life of Ven. Mary Glowrey", href: "/mary-glowrey/life", icon: "star", slug: "mary-glowrey-life" },
      { label: "Reflection on Mary Glowrey", href: "/mary-glowrey/reflection", icon: "book", slug: "mary-glowrey-reflection" },
      { label: "Prayers To Mary Glowrey", href: "/mary-glowrey/prayers", icon: "cross", slug: "mary-glowrey-prayers" },
      { label: "Intercessions to Ven. Mary Glowrey", href: "/mary-glowrey/intercessions", icon: "heart", slug: "mary-glowrey-intercessions" },
    ],
  },
];

/** Flat list used by the footer and search index. */
export const allNavItems: NavItem[] = navigation.flatMap((group) => group.items ?? []);

export const groupHref = (group: NavGroup) => group.href ?? group.items?.[0]?.href ?? "/";

const pathOf = (href: string) => href.split("?")[0] ?? href;

/** Every group that contains the given path, best match first. */
export function findGroup(pathname: string): NavGroup | undefined {
  // Prefer a group whose items list the exact path (excluding query-string variants).
  const exact = navigation.find((group) =>
    (group.items ?? []).some((item) => !item.href.includes("?") && pathOf(item.href) === pathname),
  );
  if (exact) return exact;
  if (pathname.startsWith("/mission/")) return navigation.find((g) => g.id === "mission");
  return undefined;
}

export function isGroupActive(group: NavGroup, pathname: string) {
  if (group.href && pathOf(group.href) === pathname) return true;
  return findGroup(pathname)?.id === group.id;
}

/** Previous / next pages inside the same section, for the inner-page pager. */
export function siblings(pathname: string) {
  const group = findGroup(pathname);
  const items = (group?.items ?? []).filter((item) => !item.href.includes("?"));
  const index = items.findIndex((item) => pathOf(item.href) === pathname);
  if (!group || index === -1) return { group, prev: undefined, next: undefined };
  return { group, prev: items[index - 1], next: items[index + 1] };
}

/** Breadcrumb trail (section level) for a path. */
export function crumbsFor(pathname: string) {
  const group = findGroup(pathname);
  if (!group || !group.items) return [];
  const href = groupHref(group);
  return [{ label: group.label, href: href === pathname ? undefined : href }];
}
