export interface Slide {
  /** Path without size suffix: `${base}-sm.webp`, `${base}-md.webp`, `${base}.webp`. */
  base: string;
  alt: string;
  width: number;
  height: number;
  /** "contain" shows the full photograph on a soft blurred backdrop. */
  fit?: "cover" | "contain";
  /** Which part stays in view when a "cover" photo is cropped, e.g. "50% 30%" keeps faces near the top. */
  focus?: string;
}

const P = "/media/assembly-banners";

/**
 * Province homepage slides, in the exact upload order:
 * 01 = 00(2).jpg, 02 = 11(2).jpeg, ... 13 = 1212(2).jpg.
 * The invitation is a separate image in the Province Assembly popup.
 * All 13 images use "contain" so they are never cropped.
 */
export const slides: Slide[] = [
  { base: `${P}/assembly-01`, alt: "The Holy Family, Jesus, Mary and Joseph, in Joseph's workshop", width: 1920, height: 1080, fit: "contain" },
  { base: `${P}/assembly-02`, alt: "Ornately framed portrait of Father Mathias Wolff, founder of JMJ", width: 973, height: 1280, fit: "contain" },
  { base: `${P}/assembly-03`, alt: "The JMJ Hyderabad Provincialate chapel and its entrance", width: 1600, height: 1066, fit: "contain" },
  { base: `${P}/assembly-04`, alt: "Four JMJ Sisters standing together in a convent garden", width: 1280, height: 960, fit: "contain" },
  { base: `${P}/assembly-05`, alt: "Four senior JMJ Sisters wearing white habits and an orange sari", width: 1600, height: 901, fit: "contain" },
  { base: `${P}/assembly-06`, alt: "Four JMJ Sisters together, in white habits and orange saris", width: 1600, height: 1066, fit: "contain" },
  { base: `${P}/assembly-07`, alt: "JMJ Sisters processing outdoors, led by a sister carrying a staff", width: 1600, height: 1066, fit: "contain" },
  { base: `${P}/assembly-08`, alt: "JMJ Sisters lighting ceremonial lamps in a chapel", width: 1280, height: 720, fit: "contain" },
  { base: `${P}/assembly-09`, alt: "JMJ Sisters and priests together during a celebration in the chapel", width: 1600, height: 1066, fit: "contain" },
  { base: `${P}/assembly-10`, alt: "A JMJ Sister cutting a ceremonial ribbon with clergy and guests", width: 1600, height: 1066, fit: "contain" },
  { base: `${P}/assembly-11`, alt: "JMJ Sisters honouring a jubilarian at a community celebration", width: 1500, height: 1000, fit: "contain" },
  { base: `${P}/assembly-12`, alt: "JMJ Sisters and priests in a group photograph at a celebration", width: 1536, height: 1024, fit: "contain" },
  { base: `${P}/assembly-13`, alt: "JMJ Sisters gathered in front of an altar during a celebration", width: 1536, height: 1024, fit: "contain" },
];
