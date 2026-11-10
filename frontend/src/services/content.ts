import data from "@/data/content.json";
import { extraPages } from "@/services/extraPages";
import { becomingPage, formationPage, whomToContactPage } from "@/data/vocationContent";
import attachedWordContent from "@/data/attachedWordContent.json";
import type { ContentData, ContentHeading, ContentSection } from "@/types/content";

const headingId = (title: string) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** Pages added later from the Province's content document; headings are read from the markdown. */
const extraSections: ContentSection[] = extraPages.map((page) => ({
    slug: page.slug,
    title: page.title,
    markdown: page.markdown,
    headings: [...page.markdown.matchAll(/^(#{2,3})\s+(.+)$/gm)].map(
      (m): ContentHeading => ({ level: m[1]!.length, title: m[2]!.trim(), id: headingId(m[2]!.trim()) }),
    ),
  }));

const content = data as ContentData;
const baseSections = [...content.sections, ...extraSections];
const find = (slug: string) => baseSections.find((item) => item.slug === slug);
/** Turns "## Heading" into "### Heading" so a section can sit under a new heading. */
const demote = (markdown: string) => markdown.replace(/^(#{2,5}) /gm, "#$1 ").replace(/\n---\s*$/g, "");
const headingsOf = (markdown: string): ContentHeading[] =>
  [...markdown.matchAll(/^(#{2,3})\s+(.+)$/gm)].map((m) => ({ level: m[1]!.length, title: m[2]!.trim(), id: headingId(m[2]!.trim()) }));
const section = (slug: string, title: string, markdown: string): ContentSection => ({ slug, title, markdown, headings: headingsOf(markdown) });

// The extracted Province document includes names and open-ended offices from
// earlier administrations. Do not display them as an up-to-date 2026 roster.
const replaceSection = (slug: string, markdown: string) => {
  const index = baseSections.findIndex((item) => item.slug === slug);
  if (index !== -1) baseSections[index] = section(slug, baseSections[index]!.title, markdown);
};
replaceSection("becoming-a-jmj-sister", becomingPage);
replaceSection("formation", formationPage);
// These articles were supplied in full by the Province in its attached Word
// document. Use that source text, rather than the earlier shortened drafts.
for (const slug of ["our-founder", "our-history", "education", "social-work"] as const) {
  replaceSection(slug, attachedWordContent.sections[slug]);
}
replaceSection(
  "formation",
  `${attachedWordContent.sections.formation}\n\n## Congregation-wide stages of formation\n\n${demote(formationPage)}`,
);
const provinceProfile = find("province-profile");
if (provinceProfile) {
  replaceSection("province-profile", `${attachedWordContent.sections["province-introduction"]}\n\n${provinceProfile.markdown}`);
}
const spirituality = find("spirituality-charism");
if (spirituality) {
  replaceSection("spirituality-charism", `${spirituality.markdown}\n\n${attachedWordContent.sections["founder-charism"]}`);
}
const historicalSuperiors = find("provincial-superiors");
if (historicalSuperiors) {
  replaceSection(
    "provincial-superiors",
    `> **Historical record:** The list below comes from an earlier Hyderabad Province content document. It should not be used as a current office-holder directory.\n\n${historicalSuperiors.markdown
      .replace("| Sr. Mukta Xess | 2018– |", "| Sr. Mukta Xess | From 2018; reported in office in 2023 (end date not verified) |")
      .replace("## Provincial Council Members", "## Provincial Council members in the archived record (not a current roster)")}\n\n## More recent documented leadership\n\n**Sr. Pauline Nusi, JMJ** is identified as the Hyderabad **Provincial Superior** in the foreword to [*Jubilee Vibes* 1 (January–March 2025)](https://drive.google.com/file/d/1HV6P8ENNQ8nS2LtSjQik_3R9ZR04Pba2/view). For the current Council and full verified terms of office, consult the [Provincial Council page](/province/provincial-council) or [contact the Provincialate](/contact).`,
  );
}
replaceSection(
  "administration-team",
  `## Hyderabad Province leadership\n\n**Sr. Pauline Nusi, JMJ** is recorded as the Hyderabad Provincial Superior in the 2025 *Jubilee Vibes* foreword. The earlier administration list in the Province's archival content contains office-holders from a previous period, so it has not been presented as the current team.\n\n- [Provincial Council](/province/provincial-council)\n- [Province teams and commissions](/province/teams)\n- [Contact the Provincialate](/contact)\n\n*Source: [Jubilee Vibes, Issue 1 (2025)](https://drive.google.com/file/d/1HV6P8ENNQ8nS2LtSjQik_3R9ZR04Pba2/view).*`,
);
const historicalCommissions = find("province-commissions");
if (historicalCommissions) {
  replaceSection(
    "province-commissions",
    `> **Archived commission lists:** The names below were supplied in an earlier Province content document. Commission membership may have changed after the 2023 Provincial Chapter. Please [contact the Provincialate](/contact) to verify current responsibilities.\n\n${historicalCommissions.markdown}`,
  );
}

/** Pages put together from existing content for the Province's menu. */
const virtualSections: ContentSection[] = [];
{
  const commissions = find("province-commissions");
  if (commissions) {
    virtualSections.push(
      section(
        "province-teams",
        "Meet our Province Teams",
        `## Province leadership\n\n**Sr. Pauline Nusi, JMJ** is identified as Provincial Superior in the 2025 *Jubilee Vibes* foreword. [Read her Jubilee message](/province/provincial-message) or see the [Provincial Council](/province/provincial-council) page.\n\n## Province Commissions — archived roster\n\nThe following names are from earlier Province materials, and are presented for historical reference pending confirmation of the current teams.\n\n${demote(commissions.markdown)}\n\nFor present office-holders and commission contacts, please [write to the Provincialate](/contact).`,
      ),
    );
  }
  // Pastoral & Evangelization includes the JMJ Subodha Centre text.
  const pastoral = find("pastoral-and-evangelization");
  const subodha = find("jmj-subodha-centre");
  if (pastoral && subodha) {
    const i = baseSections.indexOf(pastoral);
    baseSections[i] = section(pastoral.slug, pastoral.title, `${pastoral.markdown.replace(/\n---\s*$/g, "")}\n\n## JMJ Subodha Centre, Kurnool\n\n${demote(subodha.markdown)}`);
  }
  // The official Joining Us page lists contacts across all Regions. Prefer
  // that complete directory to the short, older Province-only placeholder.
  if (!find("whom-to-contact")) {
    virtualSections.push(
      section(
        "whom-to-contact",
        "Whom to Contact?",
        whomToContactPage,
      ),
    );
  }
}

// Provincial source notes previously linked to the large Drive original.
// The same issue is now hosted locally to avoid Drive preview failures.
const localizePublicationLinks = (markdown: string) =>
  markdown.replaceAll(
    "https://drive.google.com/file/d/1HV6P8ENNQ8nS2LtSjQik_3R9ZR04Pba2/view",
    "/documents/periodicals/jubilee-vibes-1.pdf",
  );

export const allSections = [...baseSections, ...virtualSections].map((item) => ({
  ...item,
  markdown: localizePublicationLinks(item.markdown),
}));


export function getSection(slug: string): ContentSection {
  const section = allSections.find((item) => item.slug === slug);
  if (!section) throw new Error(`Content section not found: ${slug}`);
  return section;
}

export function searchContent(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  return content.sections
    .filter((section) => `${section.title} ${section.markdown}`.toLowerCase().includes(normalized))
    .slice(0, 12);
}

/** Titles in the source are upper-case; render them in title case. */
export const toTitleCase = (value: string) =>
  value
    .toLowerCase()
    .replace(/\b[a-z]/g, (char) => char.toUpperCase())
    .replace(/\bJmj\b/g, "JMJ")
    .replace(/\bT\.l\.c\.\b/gi, "T.L.C.")
    .replace(/\bAnd\b/g, "and")
    .replace(/(?!^)\bOf\b/g, "of");

/** Public route for each content section. */
export const routeForSlug: Record<string, string> = {
  "our-founder": "/who-we-are/founder",
  "our-history": "/who-we-are/history",
  "missionary-work": "/who-we-are/missionary-work",
  "vision-mission": "/who-we-are/vision-mission",
  "province-profile": "/who-we-are/province-profile",
  "the-congregation-worldwide": "/who-we-are/our-presence",
  formation: "/ministries/formation",
  education: "/ministries/education",
  "health-care": "/ministries/health-care",
  "social-work": "/ministries/social-work",
  "pastoral-and-evangelization": "/ministries/pastoral-evangelization",
  "eco-friendliness-and-protection": "/ministries/eco-friendliness",
  "provincial-superiors": "/administration/provincial-superiors",
  "administration-team": "/administration/team",
  "province-commissions": "/administration/commissions",
  institutions: "/institution-profiles",
  "institutions-master-table": "/institutions",
  "contact-us-convent-directory": "/contact/convents",
  gallery: "/gallery",
  "news-and-updates": "/news",
  "jmj-subodha-centre": "/mission/jmj-subodha-centre",
  "province-teams": "/province/teams",
  "provincial-message": "/province/provincial-message",
  "direction-statement": "/province/direction-statement",
  "spirituality-charism": "/spirituality/charism",
  "life-with-god": "/spirituality/life-with-god",
  "congregation-prayers": "/spirituality/prayers",
  "becoming-a-jmj-sister": "/joining-us/becoming-a-jmj-sister",
  "lay-association": "/joining-us/lay-association",
  "whom-to-contact": "/joining-us/whom-to-contact",
  "mary-glowrey-life": "/mary-glowrey/life",
  "mary-glowrey-reflection": "/mary-glowrey/reflection",
  "mary-glowrey-prayers": "/mary-glowrey/prayers",
  "mary-glowrey-intercessions": "/mary-glowrey/intercessions",
};
