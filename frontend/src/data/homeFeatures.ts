/**
 * Content for the home page sections that follow the Congregation website.
 * Filled in from the Province's content document. While a value is empty
 * (null or []), its section is simply not shown, so the site never shows
 * empty boxes or placeholder text.
 */

export interface Reflection {
  /** e.g. "October 2026" */
  month: string;
  title: string;
  /** Plain text; blank lines separate paragraphs. */
  text: string;
}

export interface Person {
  name: string;
  /** e.g. "Provincial Superior" */
  role?: string;
  /** Path under /public, e.g. "/brand/provincial.webp" */
  photo?: string;
}

/** "Message from the Provincial": short excerpt on the home page; the full text is the page "provincial-message". */
export const provincialMessage: (Person & { excerpt: string }) | null = {
  name: "Sr. Pauline Nusi, JMJ",
  role: "Provincial Superior · Jubilee 2025 foreword",
  excerpt:
    "In her Jubilee Vibes 2025 foreword, Sr. Pauline invites the JMJ family to reflect on grace-filled moments, share experiences of faith and service, and renew their commitment to the Congregation's mission.",
};

/** "Quote of the Day": one quote is shown per day, in turn. */
export const quotes: { text: string; author?: string }[] = [];

/** "Monthly Reflection" under Our Founder (newest first). */
export const founderReflections: Reflection[] = [];

/** "Ven. Mary Glowrey" feature: short summary; the full life is the page "mary-glowrey-life". */
export const maryGlowrey: { summary: string; dates?: string; photo?: string } | null = {
  dates: "1887 – 1957 · Declared Venerable in 2025",
  // Authentic homepage portrait supplied by the official Congregation website.
  photo: "/brand/congregation-mary-glowrey.webp",
  summary:
    "Dr. Mary Glowrey, one of the first women doctors of Melbourne, arrived at St. Joseph's Convent, Guntur, in 1920 and became the first JMJ novice in India. As Sr. Mary of the Sacred Heart she served the sick for 36 years, founded what is now St. Joseph's Hospital and the Catholic Health Association of India.",
};

/** "Monthly Reflection" under Ven. Mary Glowrey (newest first). */
export const glowreyReflections: Reflection[] = [
  {
    month: "October 2026",
    title: "The woman who heard the cry of women in India",
    text: "A chain of providential encounters led Dr. Mary Glowrey, the \"Medical Apostle of India\", from a promising career in Melbourne to a life of healing among the women and children of Guntur.",
  },
  {
    month: "September 2026",
    title: "Fame of sanctity at the time of her death",
    text: "After her death in 1957, the people of Guntur and many who had known her spoke at once of her virtue, humility, zeal and devotion to her patients.",
  },
  {
    month: "August 2026",
    title: "Fame of sanctity during her lifetime",
    text: "Long before the Church examined her heroic virtues, those around her already recognised Sr. Mary of the Sacred Heart as a holy woman.",
  },
];

/** "Loving Tribute": sisters who have gone home to God (most recent first). */
export const tributes: { name: string; died: string; born?: string; community?: string; photo?: string }[] = [];

/** Quote for a given day, cycling through the list. */
export function quoteForDay(date = new Date()) {
  if (!quotes.length) return null;
  const start = Date.UTC(date.getFullYear(), 0, 0);
  const day = Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - start) / 86_400_000);
  return quotes[day % quotes.length]!;
}

export const firstParagraph = (text: string) => text.split(/\n\s*\n/)[0]?.trim() ?? "";
