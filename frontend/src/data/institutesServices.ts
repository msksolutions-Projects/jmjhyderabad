import type { IconName } from "@/components/ui/Icon";

/**
 * "Institutes & Services": the Province's institutions, grouped by apostolate,
 * as supplied by the Province (institutional directory, November 2026).
 * Each entry is [name, place].
 */
export type Institution = [name: string, place: string];

export interface ServiceList {
  title: string;
  note?: string;
  items: Institution[];
}

export interface ServiceCategory {
  slug: string;
  title: string;
  icon: IconName;
  summary: string;
  /** The main list, shown with its count. */
  list: ServiceList;
  /** Further lists shown on the same page (for example Formation). */
  more?: ServiceList[];
}

export const institutesIntro = [
  "The Congregation of Jesus Mary Joseph (JMJ), Hyderabad Province, carries out its mission through education, healthcare, social service, pastoral ministry, evangelisation and spiritual formation.",
  "According to the Province's institutional directory, it has 34 institutions across Telangana, Andhra Pradesh and Madhya Pradesh.",
];

export const serviceCategories: ServiceCategory[] = [
  {
    slug: "education",
    title: "Education Apostolate",
    icon: "school",
    summary: "Schools, colleges and boarding homes across Telangana, Andhra Pradesh and Madhya Pradesh.",
    list: {
      title: "Education Apostolate",
      items: [
        ["JMJ English Medium School", "Achampet, Nagarkurnool, TS"],
        ["JMJ Navajeevan Special School for Deaf", "Ayyalurimetta, Nandyal, AP"],
        ["St. Joseph's High School (CBSE)", "Gajwel, Siddipet, TS"],
        ["JMJ English Medium School", "Gyaraspur, Vidisha, MP"],
        ["St. Theresa's Girls High School E/M", "Sanathnagar, Hyderabad, TS"],
        ["St. Theresa's Girls High School T/M", "Sanathnagar, Hyderabad, TS"],
        ["St. Theresa's Secondary School (CBSE)", "Sanathnagar, Hyderabad, TS"],
        ["St. Theresa's School (ICSE)", "Sanathnagar, Hyderabad, TS"],
        ["St. Joseph's High School (State)", "Koilkuntla, Nandyal, AP"],
        ["St. Joseph's High School (CBSE)", "Koilkuntla, Nandyal, AP"],
        ["St. Joseph's Boarding", "Koilkuntla, Nandyal, AP"],
        ["JMJ English Medium School", "Kurnool, AP"],
        ["St. Joseph's Primary and High School", "Kurnool, AP"],
        ["St. Joseph's Boarding for Girls", "Kurnool, AP"],
        ["St. Joseph's B.Ed. Colleges", "Kurnool, AP"],
        ["St. Joseph's Junior College for Girls", "Kurnool, AP"],
        ["St. Joseph's College for Women", "Kurnool, AP"],
        ["St. Joseph's Junior College Hostel", "Kurnool, AP"],
        ["JMJ English Medium School", "Madhapuram, Jangaon, TS"],
        ["Fathima Vidyalayam (CBSE)", "Christianpally, Mahabubnagar, TS"],
        ["JMJ English Medium School", "Manoharabad, Medak, TS"],
        ["St. Joseph's High School", "Nagarjuna Sagar, Nalgonda, TS"],
        ["JMJ CBSE School", "Karunapuram, Pedda Pendial, TS"],
      ],
    },
  },
  {
    slug: "healthcare",
    title: "Healthcare Apostolate",
    icon: "health",
    summary: "Hospitals and nursing education in Hyderabad and Kurnool.",
    list: {
      title: "Healthcare Apostolate",
      items: [
        ["St. Theresa's Multi Speciality Hospital", "Sanathnagar, Hyderabad"],
        ["JMJ School and College of Nursing", "Sanathnagar, Hyderabad"],
        ["St. Theresa's Hospital", "Shamshabad, Hyderabad"],
        ["St. Theresa's General Hospital", "Kurnool"],
        ["JMJ College of Nursing", "Kurnool"],
        ["JMJ Nursing Hostel", "Kurnool"],
      ],
    },
  },
  {
    slug: "social",
    title: "Social Apostolate",
    icon: "social",
    summary: "Care homes, foster care, skills training and social service for those in need.",
    list: {
      title: "Social Apostolate",
      items: [
        ["St. Theresa's Tender Loving Care (TLC) Home", "Sanathnagar"],
        ["JMJ Nilayam – Tailoring Centre", "Jagadgirigutta"],
        ["JMJ Social Service Society", "Mahabubnagar, TS"],
        ["Foster Care Home “MANA ILLU”", "Mahabubnagar, TS"],
        ["JMJ Sneha Sadan (Orphanage & Old Age Home)", "Miyapur, TS"],
        ["JMJ Shanthi Sadan (Old Age Home)", "Miyapur, TS"],
      ],
    },
  },
  {
    slug: "pastoral-evangelization",
    title: "Pastoral and Evangelization",
    icon: "church",
    summary: "Pastoral ministry and evangelisation, formation houses and collaboration with the dioceses.",
    list: {
      title: "Pastoral and Evangelization",
      items: [["JMJ Subodha Centre", "Kurnool, AP"]],
    },
    more: [
      {
        title: "Formation",
        items: [
          ["Aspirancy", "Somajiguda, Hyderabad"],
          ["Postulancy (Combined)", "Moira, Goa"],
          ["Novitiate (Combined)", "Mangalagiri, Guntur"],
        ],
      },
      {
        title: "Collaboration with Dioceses",
        note: "The JMJ Hyderabad Province is associated with five diocesan jurisdictions, as listed in the Congregation's JMJ India information.",
        items: [
          ["Medicare General Hospital", "Warangal, TS"],
          ["Father Colombo Medical Sciences", "Warangal, TS"],
          ["PGF College of Nursing", "Suryapet, Nalgonda, TS"],
          ["PGF College of Nursing Hostel", "Suryapet, Nalgonda, TS"],
          ["St. Mary's Hr. Secondary School", "Vidisha, Sagar, MP"],
          ["Sr. Mary's Co-Ed School (CBSE)", "Timarni, Bhopal, MP"],
          ["Katra Hospital", "Katra, Jabalpur, MP"],
        ],
      },
    ],
  },
];

export const INSTITUTES_PATH = "/institutes-services";
export const categoryPath = (slug: string) => `${INSTITUTES_PATH}/${slug}`;
