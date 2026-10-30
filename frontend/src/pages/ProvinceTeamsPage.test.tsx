import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/utils";
import { ProvinceTeamsPage } from "./ProvinceTeamsPage";

describe("Meet Our Province Teams", () => {
  it("shows five complete portraits and local links", () => {
    renderWithProviders(<ProvinceTeamsPage />);
    expect(screen.getByRole("heading", { name: "Meet Our Province Teams" })).toBeInTheDocument();
    const portraits = screen.getAllByRole("button", { name: /^view full portrait/i });
    expect(portraits).toHaveLength(5);
    expect(screen.getByRole("link", { name: /read the provincial superior’s message/i })).toHaveAttribute("href", "/province/provincial-message");
    expect(within(portraits[3]).getByRole("img", { name: /sr. nirmala jaddu/i })).toHaveAttribute("src", "/media/provincial-council/sr-nirmala-jaddu.jpg");
  });

  it("opens and closes a full-size portrait with keyboard navigation", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProvinceTeamsPage />);
    await user.click(screen.getByRole("button", { name: /view full portrait of sr. pauline nusi/i }));
    expect(screen.getByRole("dialog", { name: /sr. pauline nusi/i })).toBeInTheDocument();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("dialog", { name: /sr. showrilu gundiga/i })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
