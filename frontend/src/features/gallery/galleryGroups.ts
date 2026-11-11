/**
 * Gallery folders that sit inside a main folder. The main folder shows as one button; selecting it shows
 * every photo from its sub-folders, and a second row of buttons narrows to one sub-folder.
 */
export interface GalleryGroup {
  id: string;
  label: string;
  /** Label of the button that shows every sub-folder together. */
  allLabel: string;
  children: { id: string; label: string }[];
}

export const galleryGroups: GalleryGroup[] = [
  {
    id: "formation",
    label: "Formation",
    allLabel: "All stages",
    children: [
      { id: "aspirancy", label: "Pre Postulancy" },
      { id: "postulency", label: "Postulancy" },
      { id: "novices", label: "Novices" },
    ],
  },
  {
    id: "senior-sisters-day",
    label: "Senior Sisters' Day",
    allLabel: "All",
    children: [{ id: "senior-sisters-day-2025", label: "Senior Sisters' Day · Oct 2025" }],
  },
  {
    id: "province-council",
    label: "Province Council",
    allLabel: "All",
    children: [
      { id: "ps-installation-2024", label: "PS Installation · Sep 2024" },
      { id: "pc-installation", label: "PC Installation · Nov 2024" },
      { id: "thanksgiving-pc", label: "Thanksgiving (PC) · Nov 2024" },
    ],
  },
  {
    id: "jubilee",
    label: "Jubilee",
    allLabel: "All years",
    children: [
      { id: "jubilee-2024", label: "2024" },
      { id: "jubilee-2025", label: "2025" },
    ],
  },
  {
    id: "youth-fest",
    label: "Youth Fest",
    allLabel: "All",
    children: [{ id: "youth-fest-2025", label: "Youth Fest 2025" }],
  },
  {
    id: "lay-collaboration-folder",
    label: "Lay Collaboration",
    allLabel: "All",
    children: [{ id: "lay-collaboration", label: "Lay Collaboration · July 2026" }],
  },
  {
    id: "assessment-teams-folder",
    label: "Assessment Teams",
    allLabel: "All",
    children: [{ id: "assessment-teams", label: "Assessment Teams · Feb 2025" }],
  },
  {
    id: "temporary-profession",
    label: "Temporary Profession",
    allLabel: "All years",
    children: [
      { id: "temporary-profession-2025", label: "2025" },
      { id: "temporary-profession-2026", label: "2026" },
    ],
  },
  {
    id: "lgbtq",
    label: "LGBTQ",
    allLabel: "All",
    children: [{ id: "lgbtq-2025", label: "LGBTQ · Jan 2025" }],
  },
  {
    id: "perpetual-profession",
    label: "Perpetual Profession",
    allLabel: "All years",
    children: [
      { id: "pp-2024", label: "2024" },
      { id: "pp-2025", label: "2025" },
      { id: "pp-2026", label: "2026" },
    ],
  },
];

/** The main folder that `id` is, or belongs to. */
export function groupFor(id: string): GalleryGroup | undefined {
  return galleryGroups.find((group) => group.id === id || group.children.some((child) => child.id === id));
}
