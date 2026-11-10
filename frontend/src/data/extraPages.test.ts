import { describe, expect, it } from "vitest";
import { hasSection } from "@/services/extraPages";
import { getSection } from "@/services/content";

describe("Hyderabad Province menu content", () => {
  it("has sourced content for the Provincialate pages", () => {
    for (const slug of ["provincial-message", "provincial-council"]) {
      expect(hasSection(slug)).toBe(true);
      expect(getSection(slug).markdown.length).toBeGreaterThan(500);
    }
  });

  it("no longer has a Provincial Chapter 2023 page", () => {
    expect(hasSection("provincial-chapter-2023")).toBe(false);
  });

  it("links the Provincial message to the hosted Jubilee issue, not an external file viewer", () => {
    const page = getSection("provincial-message").markdown;
    expect(page).toContain("/documents/periodicals/jubilee-vibes-1.pdf");
    expect(page).not.toContain("drive.google.com");
  });
  it("includes the full seven-region vocation directory on both Joining Us pages", () => {
    const regions = ["Bangalore Province", "Guntur Province", "Hyderabad Province", "Raipur Province", "Ghana Region", "Europe", "United States of America"];
    for (const slug of ["becoming-a-jmj-sister", "whom-to-contact"]) {
      const page = getSection(slug).markdown;
      for (const region of regions) expect(page).toContain(region);
    }
  });
  it("shows all five Congregation-wide formation stages and their details", () => {
    const page = getSection("formation").markdown;
    for (const stage of ["Aspirancy", "Pre-novitiate", "Novitiate", "Temporary Profession", "Ongoing Formation"]) {
      expect(page).toContain(stage);
    }
    expect(page).toContain("six to nine years");
  });

  it("uses the full client-supplied Word document for Province ministries and history", () => {
    expect(getSection("formation").markdown).toContain("The Congregation offers ample opportunities at every stage");
    expect(getSection("our-founder").markdown).toContain("9 March 1779 in Diekirch");
    expect(getSection("our-history").markdown).toContain("29 September 2009");
    expect(getSection("social-work").markdown).toContain("Through various initiatives in education, healthcare");
    expect(getSection("education").markdown).toContain("JMJ English Medium School");
    expect(getSection("province-profile").markdown).toContain("cross the frontiers of culture, language, and belief");
  });

  it("marks older team names as archival instead of current", () => {
    expect(getSection("province-teams").markdown).toMatch(/archiv/i);
    expect(getSection("provincial-superiors").markdown).toMatch(/historical/i);
  });
});
