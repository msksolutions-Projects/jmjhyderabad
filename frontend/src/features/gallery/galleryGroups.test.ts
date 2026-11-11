import { describe, expect, it } from "vitest";
import { galleryGroups, groupFor } from "./galleryGroups";

describe("gallery main folders", () => {
  it("puts PP 2024, PP 2025 and PP 2026 under Perpetual Profession", () => {
    const group = galleryGroups.find((g) => g.id === "perpetual-profession");
    expect(group?.label).toBe("Perpetual Profession");
    expect(group?.children.map((c) => c.id)).toEqual(["pp-2024", "pp-2025", "pp-2026"]);
  });

  it("puts Pre Postulancy, Postulancy and Novices under Formation", () => {
    const group = galleryGroups.find((g) => g.id === "formation");
    expect(group?.children.map((c) => c.label)).toEqual(["Pre Postulancy", "Postulancy", "Novices"]);
    expect(groupFor("aspirancy")?.id).toBe("formation");
  });

  it("puts Jubilee 2024 and Jubilee 2025 under Jubilee", () => {
    const group = galleryGroups.find((g) => g.id === "jubilee");
    expect(group?.children.map((c) => c.id)).toEqual(["jubilee-2024", "jubilee-2025"]);
    expect(groupFor("jubilee-2025")?.id).toBe("jubilee");
  });

  it("puts PC Installation and Thanksgiving (PC) under Province Council", () => {
    const group = galleryGroups.find((g) => g.id === "province-council");
    expect(group?.children.map((c) => c.id)).toEqual(["ps-installation-2024", "pc-installation", "thanksgiving-pc"]);
  });

  it("has Youth Fest and Lay Collaboration main folders", () => {
    expect(groupFor("youth-fest-2025")?.label).toBe("Youth Fest");
    expect(groupFor("lay-collaboration")?.label).toBe("Lay Collaboration");
    expect(groupFor("senior-sisters-day-2025")?.label).toBe("Senior Sisters' Day");
    expect(groupFor("assessment-teams")?.label).toBe("Assessment Teams");
    expect(groupFor("temporary-profession-2026")?.label).toBe("Temporary Profession");
    expect(groupFor("lgbtq-2025")?.label).toBe("LGBTQ");
    expect(groupFor("ps-installation-2024")?.label).toBe("Province Council");
  });

  it("finds the main folder from either the folder itself or a sub-folder", () => {
    expect(groupFor("perpetual-profession")?.id).toBe("perpetual-profession");
    expect(groupFor("pp-2025")?.id).toBe("perpetual-profession");
    expect(groupFor("pcci-meet")).toBeUndefined();
  });
});
