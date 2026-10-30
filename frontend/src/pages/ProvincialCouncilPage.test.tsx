import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderWithProviders } from "@/test/utils";
import { ProvincialCouncilPage } from "./ProvincialCouncilPage";

describe("Provincial Council photographs", () => {
  it("displays all five distinct portraits and the roles printed on the supplied cards", () => {
    renderWithProviders(<ProvincialCouncilPage />);
    const list = screen.getByRole("region", { name: /provincial council members/i });
    const expected = [
      ["Sr. Pauline Nusi", "Provincial Superior", "sr-pauline-nusi.png"],
      ["Sr. Showrilu Gundiga", "Provincial Councillor", "sr-showrilu-gundiga.jpg"],
      ["Sr. Thangam Puliyani", "Provincial Councillor", "sr-thangam-puliyani.jpg"],
      ["Sr. Nirmala Jaddu", "Provincial Councillor", "sr-nirmala-jaddu.jpg"],
      ["Sr. Fathima Mary Singareddy", "Province Procurator", "sr-fathima-mary-singareddy.jpg"],
    ];
    for (const [name, role, image] of expected) {
      expect(within(list).getByRole("img", { name: `${name} — ${role}` })).toHaveAttribute("src", `/media/provincial-council/${image}`);
    }
    expect(within(list).getAllByRole("img")).toHaveLength(5);
  });
});
