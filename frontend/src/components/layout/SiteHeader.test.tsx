import { describe, expect, it } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SiteHeader } from "./SiteHeader";
import { renderWithProviders } from "@/test/utils";

describe("SiteHeader", () => {
  it("renders the main navigation landmark", () => {
    renderWithProviders(<SiteHeader />);
    expect(screen.getAllByRole("navigation", { name: /main/i }).length).toBeGreaterThan(0);
  });

  it("offers every section of the reference site map", () => {
    renderWithProviders(<SiteHeader />);
    const [desktop] = screen.getAllByRole("navigation", { name: /main/i });
    for (const label of ["Provincialate", "Spirituality", "Mission", "Community", "News Flash", "Joining Us", "Ven. Mary Glowrey"]) {
      expect(within(desktop!).getByRole("button", { name: label })).toBeInTheDocument();
    }
    // The menu follows the Province's list exactly, including pages still being prepared.
    expect(within(desktop!).getByRole("link", { name: "Message from the Provincial Superior" })).toHaveAttribute("href", "/province/provincial-message");
    expect(within(desktop!).getByRole("link", { name: "Jubilee Vibes" })).toHaveAttribute("href", "/news-flash/jubilee-vibes");
  });

  it("marks menu buttons as collapsed until opened", () => {
    renderWithProviders(<SiteHeader />);
    const [desktop] = screen.getAllByRole("navigation", { name: /main/i });
    expect(within(desktop!).getByRole("button", { name: "Spirituality" })).toHaveAttribute("aria-expanded", "false");
  });

  it("opens a submenu and exposes its items", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SiteHeader />);
    const [desktop] = screen.getAllByRole("navigation", { name: /main/i });
    const button = within(desktop!).getByRole("button", { name: "Spirituality" });
    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(within(desktop!).getByRole("link", { name: /our founder/i })).toHaveAttribute("href", "/who-we-are/founder");
  });

  it("marks the current page in the menu", () => {
    renderWithProviders(<SiteHeader />, { initialEntries: ["/ministries/education"] });
    const [desktop] = screen.getAllByRole("navigation", { name: /main/i });
    expect(within(desktop!).getByRole("link", { name: /^education$/i })).toHaveAttribute("aria-current", "page");
  });

  it("opens the search dialog from the toolbar button", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SiteHeader />);
    await user.click(screen.getAllByRole("button", { name: /open search/i })[0]!);
    await waitFor(() => expect(screen.getByLabelText(/search this website/i)).toBeInTheDocument());
  });

  it("opens the mobile drawer with grouped navigation", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SiteHeader />);
    await user.click(screen.getByRole("button", { name: /open navigation menu/i }));
    const drawer = screen.getByRole("dialog", { name: /site menu/i });
    expect(drawer).toHaveClass("is-open");
    await user.click(within(drawer).getByRole("button", { name: "Mission" }));
    expect(within(drawer).getByRole("link", { name: /health care/i })).toBeInTheDocument();
  });
});
