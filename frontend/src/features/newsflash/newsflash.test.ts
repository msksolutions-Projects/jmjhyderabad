import { describe, expect, it } from "vitest";
import { issueLinks } from "./newsflash";
import issues from "../../../public/data/newsflash.json";

describe("News Flash links", () => {
  it("builds view, download and cover links for PDFs hosted on our own site", () => {
    expect(issueLinks({ title: "Local", file: "/a.pdf", cover: "/a.webp" })).toEqual({ view: "/a.pdf", download: "/a.pdf", cover: "/a.webp" });
  });
  it("lists all nine issues with self-hosted PDFs and thumbnails", () => {
    expect(issues.jubilee).toHaveLength(3);
    expect(issues.newsflash).toHaveLength(6);
    const all = [...issues.jubilee, ...issues.newsflash];
    const ready = all.filter((issue) => "file" in issue);
    expect(ready).toHaveLength(9);
    expect(new Set(ready.map((issue) => issue.file)).size).toBe(9);
    for (const issue of ready) {
      expect(issue.file).toMatch(/^\/documents\/periodicals\/[a-z0-9-]+\.pdf$/);
      expect(issue.cover).toMatch(/^\/media\/covers\/periodicals\/[a-z0-9-]+\.jpg$/);
      expect(issueLinks({ title: issue.title, file: issue.file, cover: issue.cover }).view).toBe(issue.file);
    }
    const thirdIssue = issues.newsflash.find((issue) => issue.title === "News Flash 3");
    expect(thirdIssue?.file).toBe("/documents/periodicals/news-flash-3.pdf");
  });
});
