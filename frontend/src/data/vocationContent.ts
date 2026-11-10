/**
 * Faithful editorial restatements of the Congregation's Joining Us pages.
 * Contacts are facts published on the Becoming a JMJ Nun page, checked
 * 30 October 2026. Another older "Whom do I contact?" page gives different
 * names for some Provinces, so the office should confirm these periodically.
 */
interface VocationContact {
  region: string;
  name: string;
  area?: string;
  address: string;
  email: string;
  telephone?: string;
}

export const vocationContacts: VocationContact[] = [
  {
    region: "Bangalore Province · India",
    name: "Sr. Lilly Eluvathingal",
    area: "Karnataka, Andhra Pradesh, Kerala, Goa and Maharashtra",
    address: "JMJ Provincialate, Nagavara, Arabic College P.O., Bangalore – 560045, Karnataka",
    email: "srlillyjmj@gmail.com",
  },
  {
    region: "Guntur Province · India",
    name: "Sr. Annie Stella Gali",
    area: "Andhra Pradesh, Tamil Nadu, Puducherry and Odisha",
    address: "JMJ Provincialate, Snehalaya, New Bank Colony, Mangalagiri – 522503, Guntur, Andhra Pradesh",
    email: "stellagalijmj1964@gmail.com",
  },
  {
    region: "Hyderabad Province · India",
    name: "Sr. Bala Theresa Vatti",
    area: "Telangana, Andhra Pradesh (Kurnool district) and Madhya Pradesh",
    address: "JMJ Provincialate, 6-3-900, Somajiguda, Raj Bhavan Road, Street No. 9, Hyderabad – 500082, Telangana",
    email: "blvatti75@gmail.com",
  },
  {
    region: "Raipur Province · India",
    name: "Sr. Annie Hansa",
    area: "Chhattisgarh, Bihar, Jharkhand and the northeastern states; please confirm district coverage directly",
    address: "Bharat Mata Convent, Tatiband, Raipur – 492099, Chhattisgarh",
    email: "hansaannie57@gmail.com",
  },
  {
    region: "Ghana Region · West Africa",
    name: "Sr. Rosily Abraham",
    address: "JMJ Ghana Region, P.O. Box SY 1532, Plot No. 37, Block C, Sector 24, Asufufu–Nanketewa, Bono Region, Ghana",
    email: "ghanajmj@gmail.com",
  },
  {
    region: "Europe · Italy, Germany, Austria and the Netherlands",
    name: "Sr. Celine Kokkat",
    address: "Via Monte Senario 57, 00141 Rome, Italy",
    telephone: "+39 327 337 0762",
    email: "celkok@gmail.com",
  },
  {
    region: "United States of America",
    name: "Sr. Reena Jocob Chirayath",
    address: "Immaculate Heart of Mary Church, 455 South Lake Powell Boulevard, P.O. Box 1387, Page, Arizona 86040-1387, USA",
    telephone: "+1 505 870 7224",
    email: "reenaj310@gmail.com",
  },
];

export const vocationDirectory = vocationContacts
  .map((contact) =>
    [
      `### ${contact.region}`,
      `**Vocation promoter:** ${contact.name}`,
      contact.area ? `**Area served:** ${contact.area}` : null,
      `**Address:** ${contact.address}`,
      contact.telephone ? `**Telephone:** ${contact.telephone}` : null,
      `**Email:** [${contact.email}](mailto:${contact.email})`,
    ]
      .filter(Boolean)
      .join("\n\n"),
  )
  .join("\n\n");

export const becomingPage = `A call to consecrated religious life is discerned gradually. If you are a Catholic woman who desires a deeper relationship with God, feels drawn to a life of service, notices the struggles of the poor and hopes to make a difference, you may wish to explore whether JMJ is the community to which you are called.

## Questions for personal discernment

- Do you actively practise the Catholic faith?
- Do you sense an invitation to something deeper in your life?
- Are you seeking a purpose beyond your present surroundings?
- Do the needs of people living in poverty touch your heart?
- Would you like to put your faith into practical service?

An affirmative response is a beginning for conversation and prayer, not an automatic admission into religious life.

## How JMJ accompanies someone discerning her vocation

1. **Regular contact:** A candidate can meet her vocation facilitator at least monthly, either in person or through an online conversation.
2. **Personal accompaniment:** The facilitator helps her reflect on a possible religious vocation without rushing a decision.
3. **Sharing her journey:** The candidate considers her personal experience, the development of her faith and what she understands of God's invitation.
4. **Conversation about life and commitment:** Topics may include her family, friendships, significant decisions, her relationship with God, involvement in the Church, and the demands of service and community life.
5. **Prayer and retreat:** Spiritual direction and a short retreat or weekend of reflection provide room for deeper listening.
6. **Experience of the Church and JMJ:** Participation in worship and the sacraments is joined with an introduction to JMJ's history, charism and the witness of Fr. Mathias Wolff.
7. **Further discernment and application:** If the candidate freely decides to proceed, she explores the next stages of formation and completes the application process.

## Who to contact about joining JMJ

For an initial conversation, you may approach the promoter responsible for your geographical area. The published contacts are listed below.

${vocationDirectory}

## Continuing the journey

Read about the [five stages of formation](/ministries/formation), or [send an enquiry to the Hyderabad Provincialate](/contact).

*Contact assignments may change; please check with the relevant Province before travelling.*`;

export const whomToContactPage = `The Sisters welcome vocation enquiries from women considering life in the Congregation of Jesus Mary Joseph. Please contact the promoter for your region. For general enquiries unrelated to vocations, the Congregation's Generalate can be reached at [cjmjroma@gmail.com](mailto:cjmjroma@gmail.com); for Hyderabad Province matters, use the [Provincialate contact form](/contact).

## Vocation contacts — India, Africa, Europe and the USA

${vocationDirectory}

## What happens after you enquire?

A vocation promoter can arrange a conversation, explain the Congregation's life and ministries, and accompany your discernment. Exploring a vocation is a gradual process that includes reflection, prayer, community experience and dialogue.

Learn more about [Becoming A JMJ Nun](/joining-us/becoming-a-jmj-sister) and [Stages of Formation](/ministries/formation).

*Contact assignments may change; please confirm current details with the relevant Province.*`;

export const formationPage = `JMJ formation is a lifelong process of learning to follow Christ as a religious missionary. The Congregation identifies five stages: **Aspirancy, Pre-novitiate, Novitiate, Temporary Profession and Ongoing Formation**. Each stage combines discernment with human, spiritual, communal and apostolic growth.

## 1. Aspirancy

This is an introductory time for a young woman to become familiar with the spirit and charism of JMJ, its communities and its mission. With the guidance of a formator, she reflects on her personal vocation and grows in her relationship with Jesus. The community also comes to know the aspirant through accompaniment and shared experience.

**Usual duration:** One year, sometimes extended by up to another year. The Congregation lists completion of Intermediate, Class XII or PUC-equivalent education or above among the qualifications.

## 2. Pre-novitiate

The pre-novice continues to grow in human and Christian maturity. Prayer, silence, honest self-knowledge and dialogue help her understand the demands of religious missionary life. She learns to discern with freedom and responsibility and to consider the realities of living in a community of Sisters from different backgrounds.

**Usual duration:** One year, with an extension of at most six months when appropriate.

## 3. Novitiate

The two-year novitiate is a period of intense formation and mutual discernment. The novice learns more deeply about prayer, the Trinity, consecrated life, the vows, community relationships and JMJ's spiritual heritage and ministries.

### First year — canonical novitiate

The first twelve months centre on the essentials of religious life: prayer and contemplation, Scripture, communal living, the evangelical counsels of poverty, chastity and obedience, and the Congregation's traditions. The canonical requirements for presence in the novitiate house apply during this year.

### Second year — apostolic experience

The second year places greater emphasis on living the mission. The Congregation describes a guided rural exposure of about one month and approximately three months of experience in an apostolic JMJ community. These experiences help the novice integrate contemplation with service.

## 4. Temporary Profession

After the novitiate, a Sister makes her first religious vows for an initial period of three years. She may renew her temporary commitment in further periods of one, two or three years, with total temporary profession normally lasting **six to nine years**.

During this time she continues her spiritual and professional formation, reflects on her prayer and community life, gains apostolic experience and discerns whether to make a lifelong commitment. At perpetual profession she promises to live consecrated chastity, evangelical poverty and apostolic obedience as a permanent member of the Congregation.

## 5. Ongoing Formation

Formation continues after perpetual profession and throughout a Sister's life. Communities and leadership provide opportunities for prayer, study, renewal, practical learning and development of skills for ministry. A Sister grows in self-knowledge, adapts to new responsibilities and changing stages of life, and remains attentive to contemporary social needs.

### Goals and objectives

- Deepen friendship with God and unite contemplative prayer with active mission.
- Grow in emotional, spiritual and human maturity while remaining faithful to religious commitment.
- Remain flexible, attentive and discerning in everyday life.
- Live the Gospel values and vows within intercultural community and apostolic service.
- Integrate concern for justice, peace and the integrity of creation (JPIC), especially in response to poverty and environmental harm.
- Accept the changes of ageing and personal circumstances with grace, gratitude and hope.

## Enquire about joining

Read [Becoming A JMJ Nun](/joining-us/becoming-a-jmj-sister) or consult the [vocation contacts](/joining-us/whom-to-contact).`;
