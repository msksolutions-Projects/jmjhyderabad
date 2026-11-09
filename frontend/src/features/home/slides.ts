export interface Slide {
  /** Path without size suffix: `${base}-sm.webp`, `${base}-md.webp`, `${base}.webp`. */
  base: string;
  alt: string;
  width: number;
  height: number;
  /**
   * "cover" (default) fills the whole banner edge to edge; some edges are cropped.
   * "contain" shows the whole picture on a plain `background` — only for pictures that already sit on
   * a plain background (e.g. the Founder's oval portrait on white), so the banner still looks seamless.
   */
  fit?: "cover" | "contain";
  /** Plain colour around a "contain" picture; should match the picture's own background. */
  background?: string;
  /** Which part stays in view when a "cover" photo is cropped (x% y%). Lower y keeps faces near the top in view. */
  focus?: string;
}

const P = "/media/assembly-banners";

/**
 * Province homepage slides, in the exact upload order:
 * 01 = 00(2).jpg, 02 = 11(2).jpeg, ... 13 = 1212(2).jpg.
 * The invitation is a separate image in the Province Assembly popup.
 * Photos fill the banner edge to edge (no blur, no side panels); `focus` keeps faces in view when cropped.
 * Slide 1's file was re-cropped to remove blurred side strips that were baked into the original image.
 */
export const slides: Slide[] = [
  { base: `${P}/assembly-01`, alt: "The Holy Family, Jesus, Mary and Joseph, in Joseph's workshop", width: 1184, height: 900, focus: "50% 50%" },
  { base: `${P}/assembly-02`, alt: "Ornately framed portrait of Father Mathias Wolff, founder of JMJ", width: 973, height: 1280, fit: "contain", background: "#ffffff" },
  { base: `${P}/assembly-03`, alt: "The JMJ Hyderabad Provincialate chapel and its entrance", width: 1600, height: 1066, focus: "50% 55%" },
  { base: `${P}/assembly-04`, alt: "Four JMJ Sisters standing together in a convent garden", width: 1280, height: 960, focus: "50% 22%" },
  { base: `${P}/assembly-05`, alt: "JMJ Sisters and clergy gathered on a decorated stage during a celebration", width: 1600, height: 901, focus: "50% 40%" },
  { base: `${P}/assembly-06`, alt: "JMJ Sisters and priests together during a celebration in the chapel", width: 1600, height: 1066, focus: "50% 42%" },
  { base: `${P}/assembly-07`, alt: "JMJ Sisters honouring a jubilarian at a community celebration", width: 1600, height: 1066, focus: "50% 25%" },
  { base: `${P}/assembly-08`, alt: "A JMJ Sister cutting a ceremonial ribbon with clergy and guests", width: 1280, height: 720, focus: "50% 30%" },
  { base: `${P}/assembly-09`, alt: "JMJ Sisters and priests in a group photograph in front of the altar", width: 1600, height: 1066, focus: "50% 30%" },
  { base: `${P}/assembly-10`, alt: "JMJ Sisters lighting ceremonial lamps", width: 1600, height: 1066, focus: "50% 45%" },
  { base: `${P}/assembly-11`, alt: "JMJ Sisters processing outdoors, led by a sister carrying a staff", width: 1500, height: 1000, focus: "50% 15%" },
  { base: `${P}/assembly-12`, alt: "Four senior JMJ Sisters wearing white habits and orange saris", width: 1536, height: 1024, focus: "50% 10%" },
  { base: `${P}/assembly-13`, alt: "Four JMJ Sisters together, in white habits and an orange sari", width: 1536, height: 1024, focus: "50% 8%" },
];
