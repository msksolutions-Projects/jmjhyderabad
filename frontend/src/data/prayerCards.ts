/**
 * Prayers of the Congregation, shown as the supplied designed prayer cards (prayer0 – prayer6), in that order.
 * Where a card carries a prayer, its text is kept here as well, so it can be read aloud by screen readers,
 * found by search and opened below the card with "Read the prayer as text".
 * Cards without a prayer (the cover card and the short life of Mary Glowrey) have an empty `text` list,
 * and no "Read the prayer as text" button is shown for them.
 */
export interface PrayerCard {
  id: string;
  title: string;
  image: string;
  imageMd: string;
  /** Pixel size of the full image, so each card keeps its own shape (portrait or landscape). */
  width: number;
  height: number;
  alt: string;
  /** Language of the card text, when it is not English (for example "te" for Telugu). */
  lang?: string;
  text: string[];
}

export const prayerCards: PrayerCard[] = [
  {
    id: "congregation-jesus-mary-joseph-hyderabad-province",
    title: "Congregation Jesus Mary Joseph, Hyderabad Province",
    image: "/media/prayers/prayer0.webp",
    imageMd: "/media/prayers/prayer0-md.webp",
    width: 1080,
    height: 1350,
    alt: "Card: Congregation Jesus Mary Joseph, Hyderabad Province, with a painting of the Holy Family",
    text: [],
  },
  {
    id: "prayer-to-jesus-mary-joseph",
    title: "Prayer to Jesus Mary Joseph",
    image: "/media/prayers/prayer1.webp",
    imageMd: "/media/prayers/prayer1-md.webp",
    width: 1600,
    height: 1128,
    alt: "Prayer card: Prayer to Jesus Mary Joseph, with a painting of the Holy Family",
    text: [
      "God our loving Father,",
      "We praise and thank you for the gift of Jesus Mary and Joseph, the patrons of our Congregation and for all the favours we have received through their intercessions.",
      "Loving Father, Grant us the grace to reveal and radiate your love and joy and to seek and discern your will every moment of our life and be united to one another in the bond of love.",
      "Lord, bless all the members of our Congregation and give us the grace to live worthy of our Call and work for the spread of Your Kingdom.",
      "Jesus Mary and Joseph, we implore you to obtain for us genuine vocations and the grace that each one of us guided by the Holy Spirit may continue the mission of Christ – the Liberation of the total person, with a spirit of an ever adaptable apostolic availability.",
      "This prayer we make through Jesus Christ, our Blessed Mother Mary and St. Joseph. Amen.",
    ],
  },
  {
    id: "prayer-for-the-beatification-of-our-holy-founder",
    title: "Prayer for the Beatification of our Holy Founder",
    image: "/media/prayers/prayer2.webp",
    imageMd: "/media/prayers/prayer2-md.webp",
    width: 1600,
    height: 1128,
    alt: "Prayer card: Prayer for the Beatification of our Holy Founder, with a framed portrait of Rev. Fr. Mathias Wolff SJ (1779 – 1857)",
    text: [
      "“Change me into thyself dear Lord, That I may live in Thee and for Thee alone. May my happiness on earth consist in fulfilling Thy Holy Will. Amen.” – Rev. Fr. Mathias Wolff SJ (1779 – 1857)",
      "Eternal Father, source of all good, You alone grant us every blessing in Heaven and on earth, through the redemptive Mission of Your Divine Son Jesus Christ, by the working of the Holy Spirit. In every situation and in every age, You raise up men and women as channels of Your divine election, to contribute to the Mission of the Church.",
      "Fr. Mathias Wolff our Founder, with an inexhaustible zeal and integrated spirituality of seeking You in all things and doing Your Will, lived his vocation and mission, in leading all people to the experience of Your fatherly love. His whole life was concerned with Your greater glory and honour. He sought and lived for the same at all times.",
      "Gracious Father we pray, if it be Your Holy Will, move Your Church to glorify Your servant Fr. Mathias Wolff. We make this prayer through Jesus Christ Your Son and our Lord. Amen.",
      "Rev. Fr. Mathias Wolff – Pray for us.",
    ],
  },
  {
    id: "prayer-to-venerable-mary-glowrey",
    title: "Prayer to Venerable Mary Glowrey",
    image: "/media/prayers/prayer3.webp",
    imageMd: "/media/prayers/prayer3-md.webp",
    width: 1600,
    height: 1257,
    alt: "Prayer card: Venerable Mary Glowrey (Sr. Mary of the Sacred Heart, JMJ), 23.06.1887 Australia – 05.05.1957 India, with her photograph and prayer",
    text: [
      "Heavenly Father, in Venerable Mary Glowrey, we recognise a woman deeply surrendered to Your love, and an extraordinary witness to the value of every human life. You blessed her with a brilliant mind and led her to place herself and her gifts at the service of humanity. Through the practice of medicine and her religious consecration to You, she touched countless people with Your compassionate love.",
      "With confidence and gratitude for the life of Mary Glowrey, we entrust to you our prayers…",
      "If it be Your Will Father, may Venerable Mary Glowrey, soon be raised to the honours of the Altar. We make this prayer to You through Jesus Christ, Our Lord, Amen.",
      "Our Father, Hail Mary, Glory be…",
      "Imprimatur: + Bhagyaiah Chinnabathini, Bishop of Guntur, 21.11.2025",
      "Please report any favours or miracles received through her intercession to: The Vice Postulator, JMJ Provincialate, Mangalagiri – 522 503, Guntur Dt. A.P., India, or Congregation of Jesus Mary Joseph (JMJ), Via Tevere 5/D, 00198 Roma, Italia. Email: mglowreyfavours@gmail.com",
    ],
  },
  {
    id: "prayer-to-venerable-mary-glowrey-telugu",
    title: "Prayers to Venerable Mary Glowrey (Telugu)",
    image: "/media/prayers/prayer4.webp",
    imageMd: "/media/prayers/prayer4-md.webp",
    width: 1600,
    height: 1371,
    alt: "Prayer card in Telugu: two prayers to Venerable Mary Glowrey, with her photograph",
    lang: "te",
    text: [
      "పూజ్యనీయ మేరి గ్లౌరీ గారి కొరకు ప్రార్థన (కన్యాస్త్రీ, వేద ప్రచారకురాలు, వైద్యశాస్త్ర పండితులు)",
      "ఓ ప్రభువా! అనంతమైన ప్రేమను డాక్టర్ మేరి గ్లౌరీ గారి జీవితములో ప్రదర్శించితిరే! అద్భుతమైన జ్ఞానముతో నింపబడినను, ఆ జ్ఞాన ప్రసాదితవు నీవని, ఆ జ్ఞానము పేదల వైద్య సేవలకు ఉపయోగించుటలోనే పరిపూర్ణ, పరమార్థమున్నదని గ్రహించి, మీ దివ్య చిత్తమునకు తలవంచిన వినయమూర్తి పూజ్య మేరి గ్లౌరీ గారు. మీరు ఆమెను కన్యాస్త్రీగా ఎన్నుకొని, ఆమె జీవిత విధానము ద్వారా, వైద్య సేవల ద్వారా ఎంతో మందికి మీ ప్రేమను పంచితిరే!",
      "మేమునూ, పూజ్య మేరి గ్లౌరీ గారి వలె, మా జీవితములందు మిమ్ము తెలుసుకొని, మమ్ము మీకు పూర్తిగా అంకితమొనర్చుకొనునట్లు చేయండి. ఆమె వలే, మేమునూ, మీ ప్రేమను పేద సాదలకు, అభాగ్యులకు, నిరాశ్రయులకు పంచే భాగ్యమును దయచేయండి. ప్రభూ! మీ చిత్త ప్రకారము పూజ్య మేరి గ్లౌరీ గారిని త్వరలో మీ పునీతుల సమూహములో చేర్చుకొనండి. తద్వారా ఆమె వలన మేమునూ మనుష్యావతారుడైన క్రీస్తు ప్రేమచే నడిపించబడునట్లు కృపచేయనవధరించండి. ఆమెన్!",
      "పూజ్యనీయ మేరి గ్లౌరీ గారికి ప్రార్థన",
      "సేవా హృదయం గల్గిన పూజ్య మేరి గ్లౌరీ గారా!",
      "దక్షిణ భారతదేశంలో సువార్త వ్యాప్తికై, పేదల వైద్య సేవలకై, శోకార్తులను ఓదార్చుటకు మీ జీవితమును త్యాగం చేసితిరి. మీయందు గల ప్రగాఢమైన నమ్మకముతో మీ ప్రార్థనా సహాయమునకై మీ చెంతకు వచ్చియున్నాము. మేము విన్నవించు విన్నపములను, దయతో విననవధరించండి. దేవుని చిత్తప్రకారము, ఆయన మహిమార్థమై వీటిని మాకు దయచేయండి. మీవలె మేమునూ, మా శరీరములందు క్రీస్తు సిలువ శ్రమలను అనుభవించు భాగ్యమును, ధైర్యమును దయచేయండి. దేవుని చిత్తానికి తలయొగ్గి, విధేయత జీవితమును అలవర్చుకొనుటలో మాకు సహాయము చేయండి. మిమ్ములను, మీ సేవా జీవిత విలువలను అనుసరించి జీవించుటకు, వేద ప్రచారమునకై అచంచలమైన త్యాగనిరతిని, ధృఢ సంకల్పమును మా అందరికి దయచేయమని దేవుని ప్రార్థించండి. ఆమెన్!",
      "Imprimatur: + Bhagyaiah Chinnabathini, Bishop of Guntur – 21.11.2025",
    ],
  },
  {
    id: "life-of-venerable-mary-glowrey-telugu",
    title: "A Short Life of Venerable Mary Glowrey (Telugu)",
    image: "/media/prayers/prayer5.webp",
    imageMd: "/media/prayers/prayer5-md.webp",
    width: 1600,
    height: 1371,
    alt: "Card in Telugu: a short life of Venerable Mary Glowrey, from her birth in Victoria, Australia in 1887 to her declaration as Venerable on 21 November 2025",
    text: [],
  },
  {
    id: "prayer-for-vocations",
    title: "Prayer for Vocations",
    image: "/media/prayers/prayer6.webp",
    imageMd: "/media/prayers/prayer6-md.webp",
    width: 1080,
    height: 1350,
    alt: "Prayer card: Prayer for Vocations",
    text: [
      "Almighty and Ever-Living God, the One who plants the seeds of faith and purpose in every heart, we humbly implore You to send forth more laborers into Your vineyard. Ignite within the hearts of many young men and women a fervent desire to answer Your radical call to consecrated life and grant them the courage to respond with generosity.",
      "May they be filled with Your Holy Spirit and inspire them to embrace a life of poverty, chastity, and obedience for the sake of the Kingdom.",
      "We also pray for those already serving in religious life, sustain them in their commitment to spread Your love and compassion throughout the world. We make this prayer through the intercession of our Holy Founder Rev. Fr. Mathias Wolff. Amen.",
      "Jesus Mary Joseph our holy Patrons – Pray for us.",
    ],
  },
];
