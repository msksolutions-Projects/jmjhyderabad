import directory from "@/data/directory.json";

const STATES = ["Telangana", "Andhra Pradesh", "Madhya Pradesh"] as const;

/** State for a directory entry; Hyderabad houses list only the house name. */
const stateOf = (state: string, location: string) =>
  STATES.find((s) => state.includes(s)) ?? (location === "Hyderabad" ? "Telangana" : state);

/** Communities of the Province grouped by state, for the home page "Our Presence" table. */
export const presence = STATES.map((state) => {
  const entries = (directory as { state: string; location: string }[]).filter((e) => stateOf(e.state, e.location) === state);
  return { state, count: entries.length, places: [...new Set(entries.map((e) => e.location))].sort() };
}).filter((row) => row.count > 0);

export const presenceTotal = presence.reduce((n, row) => n + row.count, 0);
