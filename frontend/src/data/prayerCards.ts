/**
 * Prayers of the Congregation, shown as the supplied designed prayer cards (PC, PC1, PC2), in that order.
 * The text of each card is kept here as well, so the prayers can be read aloud by screen readers and found by search.
 */
export interface PrayerCard {
  id: string;
  title: string;
  image: string;
  imageMd: string;
  alt: string;
  text: string[];
}

export const prayerCards: PrayerCard[] = [
  {
    id: "prayer-to-jesus-mary-joseph",
    title: "Prayer to Jesus Mary Joseph",
    image: "/media/prayers/pc.webp",
    imageMd: "/media/prayers/pc-md.webp",
    alt: "Prayer card: Prayer to Jesus Mary Joseph, with a painting of the Holy Family",
    text: [
      "God our loving Father,",
      "We praise and thank you for the gift of Jesus Mary and Joseph, the patrons of our Congregation and for all the favours we have received through their intercessions.",
      "Loving Father,",
      "Grant us the grace to reveal and radiate your love and joy and to seek and discern your will every moment of our life and be united to one another in the bond of love.",
      "Lord, bless all the members of our Congregation and give us the grace to live worthy of our Call and work for the spread of Your Kingdom.",
      "Jesus Mary and Joseph, we implore you to obtain for us genuine vocations and the grace that each one of us guided by the Holy Spirit may continue the mission of Christ – the Liberation of the total person, with a spirit of an ever adaptable apostolic availability.",
      "This prayer we make through Jesus Christ, our Blessed Mother Mary and St. Joseph.",
      "Amen.",
    ],
  },
  {
    id: "prayer-of-fr-mathias-wolff-sj",
    title: "Prayer of Fr. Mathias Wolff SJ",
    image: "/media/prayers/pc1.webp",
    imageMd: "/media/prayers/pc1-md.webp",
    alt: "Prayer card: Prayer of Fr. Mathias Wolff SJ, with a priest kneeling in prayer before an altar",
    text: [
      "Change me into thyself dear Lord,",
      "That I may live in Thee and for Thee alone.",
      "May my happiness on earth consist in fulfilling Thy Holy Will,",
      "Amen.",
    ],
  },
  {
    id: "prayer-for-the-beatification-of-our-holy-founder",
    title: "Prayer for the Beatification of our Holy Founder",
    image: "/media/prayers/pc2.webp",
    imageMd: "/media/prayers/pc2-md.webp",
    alt: "Prayer card: Prayer for the Beatification of our Holy Founder, with a framed portrait of Fr. Mathias Wolff",
    text: [
      "Eternal Father, source of all good, You alone grant us every blessing in Heaven and on earth, through the redemptive Mission of Your Divine Son Jesus Christ, by the working of the Holy Spirit. In every situation and in every age, You raise up men and women as channels of Your divine election, to contribute to the Mission of the Church.",
      "Fr. Mathias Wolff our Founder, with an inexhaustible zeal and integrated spirituality of seeking You in all things and doing Your Will, lived his vocation and mission, in leading all people to the experience of Your fatherly love. His whole life was concerned with Your greater glory and honour. He sought and lived for the same at all times.",
      "Gracious Father we pray, if it be Your Holy Will, move Your Church to glorify Your servant Fr. Mathias Wolff. We make this prayer through Jesus Christ Your Son and our Lord.",
      "Amen.",
      "Rev. Fr. Mathias Wolff – Pray for us.",
    ],
  },
];
