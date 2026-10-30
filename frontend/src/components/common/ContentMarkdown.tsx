import { useMemo, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Marked } from "marked";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// The page title is the h1, so content headings start at h2 and never skip a level.
let lastDepth = 1;
let tableCount = 0;

const marked = new Marked({ gfm: true, breaks: false });
marked.use({
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      const level = Math.max(2, Math.min(depth, lastDepth + 1));
      lastDepth = level;
      return `<h${level} id="${slugify(text)}">${text}</h${level}>\n`;
    },
    table(token) {
      // Wrap tables so they scroll horizontally on small screens (focusable so keyboard users can scroll too).
      const cells = token.header.map((cell) => this.parser.parseInline(cell.tokens));
      const header = cells.some((c) => c.replace(/<[^>]+>/g, "").trim())
        ? `<thead><tr>${cells.map((c) => (c.replace(/<[^>]+>/g, "").trim() ? `<th scope="col">${c}</th>` : "<td></td>")).join("")}</tr></thead>`
        : "";
      const rows = token.rows
        .map((row) => `<tr>${row.map((cell) => `<td>${this.parser.parseInline(cell.tokens)}</td>`).join("")}</tr>`)
        .join("");
      tableCount += 1;
      return `<div class="table-wrap" tabindex="0" role="region" aria-label="Table ${tableCount}"><table>${header}<tbody>${rows}</tbody></table></div>`;
    },
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      if (!href) return text;
      const external = /^https?:\/\//.test(href);
      const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a href="${href}"${title ? ` title="${title}"` : ""}${attrs}>${text}</a>`;
    },
  },
});

const markdownToHtml = (markdown: string) => {
  lastDepth = 1;
  tableCount = 0;
  return marked.parse(markdown, { async: false }) as string;
};

/**
 * Renders the Province's own (trusted) markdown content. Internal links are
 * routed client-side so navigation stays instant.
 */
export function ContentMarkdown({ markdown, className = "prose" }: { markdown: string; className?: string }) {
  const navigate = useNavigate();
  const html = useMemo(() => markdownToHtml(markdown), [markdown]);

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    const anchor = (event.target as HTMLElement).closest("a");
    const href = anchor?.getAttribute("href");
    if (!anchor || !href || anchor.target === "_blank" || event.metaKey || event.ctrlKey) return;
    if (href.startsWith("/") && !href.startsWith("//") && !/\.(pdf|jpe?g|png|webp)$/i.test(href)) {
      event.preventDefault();
      navigate(href);
    }
  };

  return <div className={className} onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />;
}
