import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/utils";
import type * as Features from "@/data/homeFeatures";

vi.mock("@/data/homeFeatures", async (orig) => {
  const real = await orig<typeof Features>();
  const quotes = [{ text: "Love one another as I have loved you.", author: "John 13:34" }];
  return {
    ...real,
    provincialMessage: { name: "Sr. Example Name", role: "Provincial Superior", excerpt: "Dear friends, greetings from the Province." },
    quotes,
    quoteForDay: () => quotes[0],
    founderReflections: [{ month: "October 2026", title: "Labour as a giant", text: "First paragraph.\n\nSecond paragraph." }],
    maryGlowrey: { summary: "Doctor and religious sister who served the sick in India.", dates: "1887 – 1957" },
    glowreyReflections: [{ month: "October 2026", title: "Healing hands", text: "Reflection text." }],
    tributes: [{ name: "Sr. Example Tribute", died: "12 October 2026", community: "Kurnool" }],
  };
});

import { HomePage } from "./HomePage";

describe("HomePage with the content document filled in", () => {
  it("shows every new section", () => {
    renderWithProviders(<HomePage />);
    expect(screen.getByRole("heading", { name: "Message from the Provincial Superior" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /meet our province teams/i })).toHaveAttribute("href", "/province/teams");
    expect(screen.getByText("Quote of the Day")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Loving Tribute" })).toBeInTheDocument();
    expect(screen.getByText(/love one another/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ven. Mary Glowrey" })).toBeInTheDocument();
    expect(screen.getAllByText("Monthly Reflection")).toHaveLength(2);
    expect(screen.getByText("Sr. Example Tribute")).toBeInTheDocument();
    expect(screen.getByText(/first paragraph/i)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Our Charism" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Joining Us" })).not.toBeInTheDocument();
  });
});
