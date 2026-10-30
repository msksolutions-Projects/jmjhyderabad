import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/utils";
import { PreparingPage } from "./PreparingPage";

describe("PreparingPage", () => {
  it("names the page, says it is being prepared and links to the rest of the section", () => {
    renderWithProviders(<PreparingPage />, { initialEntries: ["/mary-glowrey/life"] });
    expect(screen.getByRole("heading", { level: 1, name: "Life of Ven. Mary Glowrey" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /being prepared/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /contact us/i })).toHaveAttribute("href", "/contact");
  });
});
