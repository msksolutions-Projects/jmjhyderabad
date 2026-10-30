import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HomePage } from "./HomePage";
import { renderWithProviders } from "@/test/utils";

describe("HomePage", () => {
  it("exposes exactly one h1 naming the Province", () => {
    renderWithProviders(<HomePage />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(/hyderabad province/i);
  });

  it("shows a photo-only carousel of the Province photographs", () => {
    renderWithProviders(<HomePage />);
    const carousel = screen.getByRole("region", { name: /province photographs/i });
    expect(carousel).toHaveAttribute("aria-roledescription", "carousel");
    expect(within(carousel).queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
    expect(within(carousel).getByRole("img", { name: /holy family/i })).toBeInTheDocument();
    expect(within(carousel).getAllByRole("button", { name: /show slide/i })).toHaveLength(13);
  });

  it("moves between photos with the controls", async () => {
    const user = userEvent.setup();
    renderWithProviders(<HomePage />);
    const carousel = screen.getByRole("region", { name: /province photographs/i });
    expect(within(carousel).getByRole("button", { name: "Show slide 1" })).toHaveAttribute("aria-current", "true");
    await user.click(screen.getByRole("button", { name: /next slide/i }));
    expect(within(carousel).getByRole("button", { name: "Show slide 2" })).toHaveAttribute("aria-current", "true");
    await user.click(screen.getByRole("button", { name: /previous slide/i }));
    await user.click(screen.getByRole("button", { name: /previous slide/i }));
    expect(within(carousel).getByRole("button", { name: "Show slide 13" })).toHaveAttribute("aria-current", "true");
    expect(within(carousel).getByText("13 / 13")).toBeInTheDocument();
  });

  it("lets the visitor stop the slideshow", () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByRole("button", { name: /pause slideshow/i })).toBeInTheDocument();
  });

  it("follows the reference site's home sections, in order", () => {
    renderWithProviders(<HomePage />);
    const order = [/^welcome to the congregation/i, /^founder$/i, /^ven\. mary glowrey$/i, /^message from the provincial superior$/i, /^joining us$/i, /^news strings$/i, /^latest news$/i, /^our presence$/i, /^photo gallery$/i];
    const headings = screen.getAllByRole("heading").map((h) => h.textContent ?? "");
    let last = -1;
    for (const name of order) {
      const at = headings.findIndex((h) => name.test(h));
      expect(at, String(name)).toBeGreaterThan(last);
      last = at;
    }
    expect(screen.getAllByRole("link", { name: /^view all/i }).map((a) => a.getAttribute("href"))).toEqual(expect.arrayContaining(["/news", "/gallery"]));
  });

  it("lists the Province's communities by state", () => {
    renderWithProviders(<HomePage />);
    const table = screen.getByRole("table", { name: /our presence/i });
    for (const state of ["TELANGANA", "ANDHRA PRADESH", "MADHYA PRADESH"]) {
      expect(within(table).getByRole("rowheader", { name: new RegExp(state) })).toBeInTheDocument();
    }
    expect(within(table).getByRole("rowheader", { name: /total/i })).toHaveTextContent("25 communities");
  });

  it("links the local Provincial Superior message rather than sending visitors to the Congregation's site", () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByRole("heading", { name: /message from the provincial superior/i })).toBeInTheDocument();
    const messageCard = screen.getByRole("heading", { name: /message from the provincial superior/i }).closest("article")!;
    expect(within(messageCard).getByRole("link", { name: /read more/i })).toHaveAttribute("href", "/province/provincial-message");
    expect(within(messageCard).getByRole("link", { name: /meet our province teams/i })).toHaveAttribute("href", "/province/teams");
    const portraits = [
      "/brand/congregation-founder.png",
      "/brand/congregation-mary-glowrey.png",
      "/media/provincial-council/sr-pauline-nusi.png",
    ];
    const sources = screen.getAllByRole("img").map((img) => img.getAttribute("src"));
    for (const src of portraits) expect(sources).toContain(src);
    for (const name of [/loving tribute/i, /quote of the day/i]) {
      expect(screen.queryByText(name)).not.toBeInTheDocument();
    }
  });

  it("keeps text off the photographs", () => {
    const { container } = renderWithProviders(<HomePage />);
    expect(container.querySelector(".welcome__badge, .album__label, .quote-band img, .hero-gallery h2")).toBeNull();
    expect(container.querySelectorAll(".album-box__title").length).toBe(4);
  });
});
