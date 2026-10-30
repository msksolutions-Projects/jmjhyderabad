import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProvinceAssemblyAnnouncement } from "./ProvinceAssemblyAnnouncement";
import { slides } from "./slides";

describe("Province Assembly announcement", () => {
  beforeEach(() => window.sessionStorage.clear());

  it("shows the invitation first and allows switching to the programme", async () => {
    const user = userEvent.setup();
    render(<ProvinceAssemblyAnnouncement />);
    expect(screen.getByRole("dialog", { name: /province assembly 2026/i })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /invitation, theme, venue, and date/i })).toHaveAttribute("src", "/media/events/province-assembly-2026-invitation-page.webp");
    await user.click(screen.getByRole("tab", { name: /programme schedule/i }));
    expect(screen.getByRole("img", { name: /programme schedule/i })).toHaveAttribute("src", "/media/events/province-assembly-2026-programme-page.webp");
    expect(screen.queryByRole("img", { name: /invitation, theme, venue, and date/i })).not.toBeInTheDocument();
  });

  it("closes on Escape and reopens from the announcement ticker", async () => {
    const user = userEvent.setup();
    render(<ProvinceAssemblyAnnouncement />);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(window.sessionStorage.getItem("jmj-province-assembly-2026-invitation-dismissed")).toBe("yes");
    await user.click(screen.getByRole("button", { name: /view invitation/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("presents one readable announcement without overlapping scrolling duplicates", () => {
    render(<ProvinceAssemblyAnnouncement />);
    expect(screen.getByRole("button", { name: /Rekindling Commitment & Revitalizing Mission.*31 October 2026/i })).toBeInTheDocument();
    const ticker = screen.getByRole("complementary", { name: /province assembly 2026 announcement/i });
    expect(ticker.querySelectorAll(".assembly-ticker__message")).toHaveLength(1);
    expect(ticker.querySelectorAll(".assembly-ticker__moving")).toHaveLength(0);
    expect(screen.getByRole("button", { name: /view invitation/i })).toBeInTheDocument();
  });
});

describe("Homepage banner order", () => {
  it("shows all 13 supplied photos in numbered order without cropping", () => {
    expect(slides).toHaveLength(13);
    expect(slides.map((slide) => slide.base)).toEqual(
      Array.from({ length: 13 }, (_, i) => `/media/assembly-banners/assembly-${String(i + 1).padStart(2, "0")}`),
    );
    expect(slides.every((slide) => slide.fit === "contain")).toBe(true);
  });
});
