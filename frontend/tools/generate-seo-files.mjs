/* global process, console */
/**
 * Writes public/sitemap.xml and public/robots.txt for the live domain.
 * Runs automatically before `npm run build`. Domain: VITE_SITE_URL (frontend/.env).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readEnv() {
  const out = {};
  for (const name of [".env", ".env.production"]) {
    const file = path.join(root, name);
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
  return out;
}

const SITE = (process.env.VITE_SITE_URL || readEnv().VITE_SITE_URL || "https://jmjhyderabadprovince.org").replace(/\/$/, "");
const today = new Date().toISOString().slice(0, 10);

const pages = [
  ["/", 1.0, "weekly"],
  ["/who-we-are/founder", 0.8], ["/who-we-are/history", 0.8], ["/who-we-are/missionary-work", 0.7],
  ["/who-we-are/vision-mission", 0.8], ["/who-we-are/province-profile", 0.8], ["/who-we-are/our-presence", 0.6],
  ["/who-we-are/our-life", 0.7],
  ["/administration/provincial-superiors", 0.6], ["/administration/team", 0.6], ["/administration/commissions", 0.6],
  ["/ministries/formation", 0.8], ["/ministries/education", 0.8], ["/ministries/health-care", 0.8],
  ["/ministries/social-work", 0.8], ["/ministries/pastoral-evangelization", 0.7], ["/ministries/eco-friendliness", 0.7],
  ["/ministries/safeguarding", 0.7],
  ["/institutions", 0.9, "monthly"], ["/institution-profiles", 0.7],
  ["/news", 0.8, "daily"], ["/notices", 0.7, "daily"], ["/publications", 0.6], ["/gallery", 0.7, "weekly"],
  ["/contact", 0.8], ["/contact/convents", 0.7],
  ["/province/teams", 0.6], ["/joining-us/whom-to-contact", 0.7], ["/mission/jmj-subodha-centre", 0.6],
  ["/news-flash", 0.7, "weekly"], ["/news-flash/jubilee-vibes", 0.7, "weekly"],
];

// Pages added from the Province's content document appear once written.
const extraRoutes = {
  "provincial-message": "/province/provincial-message", "provincial-chapter-2023": "/province/provincial-chapter-2023",
  "spirituality-charism": "/spirituality/charism", "life-with-god": "/spirituality/life-with-god", "congregation-prayers": "/spirituality/prayers",
  "becoming-a-jmj-sister": "/joining-us/becoming-a-jmj-sister", "lay-association": "/joining-us/lay-association",
  "mary-glowrey-life": "/mary-glowrey/life", "mary-glowrey-reflection": "/mary-glowrey/reflection",
  "mary-glowrey-prayers": "/mary-glowrey/prayers", "mary-glowrey-intercessions": "/mary-glowrey/intercessions",
};
const extra = JSON.parse(fs.readFileSync(path.join(root, "src/data/extraPages.json"), "utf8"));
for (const page of extra.sections ?? []) if (extraRoutes[page.slug] && page.markdown?.trim()) pages.push([extraRoutes[page.slug], 0.6]);

const institutions = JSON.parse(fs.readFileSync(path.join(root, "src/data/institutions.json"), "utf8"));
for (const item of institutions) pages.push([`/institutions/${item.id}`, 0.5]);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(([p, priority, freq = "monthly"]) => `  <url><loc>${SITE}${p}</loc><lastmod>${today}</lastmod><changefreq>${freq}</changefreq><priority>${priority.toFixed(1)}</priority></url>`)
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${SITE}/sitemap.xml
`;

fs.writeFileSync(path.join(root, "public/sitemap.xml"), xml);
fs.writeFileSync(path.join(root, "public/robots.txt"), robots);
console.log(`SEO files written for ${SITE} (${pages.length} URLs)`);
