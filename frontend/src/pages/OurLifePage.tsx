import { PageHeader } from "@/components/common/PageHeader";
import { PageShell } from "@/components/common/PageShell";
import { Seo } from "@/components/seo/Seo";

const photos = [
  { n: 1, w: 1600, h: 1200, alt: "JMJ Sisters seated together at a Province meeting" },
  { n: 2, w: 1600, h: 1205, alt: "JMJ Sisters together with young women in formation, in white, at a community house chapel" },
  { n: 3, w: 1280, h: 720, alt: "JMJ Sisters at a community celebration, some holding gifts and wearing congratulation sashes" },
];

/**
 * Community → Our Life in the Community.
 * Text supplied by the Province, following the layout of https://congregationjmj.org/our-life-in-the-community;
 * the Province's own community photographs, the JMJ Cross, Ora et Labora and the JMJ ring stand where that page has its pictures.
 */
export function OurLifePage() {
  return (
    <>
      <Seo
        title="Our Life in the Community"
        description="Community life of the Sisters of Jesus Mary Joseph: modelled on the Holy Trinity, with hallmarks of hospitality and care, and the meaning of the JMJ Cross and Ring."
        path="/who-we-are/our-life"
      />
      <PageHeader
        eyebrow="Community"
        title="Our Life in the Community"
        description="“That they be one as we are One.”"
        breadcrumbs={[{ label: "Community" }]}
        image="/media/client-2026/pcci-meet/1TELjtYX0OUg2sCDG-Gj2lfNbQd4HokFX-md.webp"
      />
      <PageShell>
        <article className="panel prose community-life" style={{ maxWidth: "none" }}>
          <p>
            The Holy Trinity is the model of our community life, and therefore, we anchor ourselves in the words of
            Jesus, “That they be one as we are One.”
          </p>
          <p>
            In our living together, we believe that God, who brought us together, supports, journeys with, and inspires
            us to live in communion in sisterly love and understanding.
          </p>
          <p>
            Our union and harmony in the community are nourished by prayer, distinguished by generous mortification, and
            characterized by joy and hope. The shared Vision and Mission keep us together with ‘one heart and mind’,
            which is the hallmark of an Ecclesial community. (Cont. 38)
          </p>
          <p>
            We proclaim to the world that the ideal evangelical community is possible. We believe that God has placed us
            together to fulfil His Mission. We manifest it by showing concern for one another, sharing our
            responsibility, inspiring through our very life example, respecting the common traditions, and through our
            regular participation and practice of forgiveness and reconciliation.
          </p>

          <div className="community-photos">
            {photos.map((p) => (
              <a key={p.n} href={`/media/community/community-${p.n}.webp`} target="_blank" rel="noopener noreferrer">
                <img
                  src={`/media/community/community-${p.n}-md.webp`}
                  srcSet={`/media/community/community-${p.n}-md.webp 800w, /media/community/community-${p.n}.webp ${p.w}w`}
                  sizes="(min-width: 1100px) 290px, (min-width: 640px) 31vw, 92vw"
                  width={p.w}
                  height={p.h}
                  loading="lazy"
                  decoding="async"
                  alt={p.alt}
                />
                <span className="visually-hidden"> (opens full size in a new tab)</span>
              </a>
            ))}
          </div>

          <p>
            Thus, our identity as members of the Congregation of Jesus Mary Joseph, our community life, and our mission
            are three inseparable dimensions of one single reality. Our community is for mission, and the community
            itself is mission. (Cont. 39)
          </p>
          <p>
            We live together as a community in a legitimately established house and to carry out the ministries of the
            Congregation for the needs of the universal Church and of the world.
          </p>
          <p>Community prayer, sharing of meals, and recreation are important means to shape our communities. (Cont. 40)</p>
          <p>Three hallmarks of our community life are:</p>
          <ul>
            <li>Hospitality to everyone who visits us.</li>
            <li>Compassionate care of the sick and ailing sisters in our Congregation.</li>
            <li>
              Great value for our ageing members, recognizing their hard labour, richness of their experience, and valuing
              their presence in the community.
            </li>
          </ul>

          <h2>External Identity – Congregation’s Cross and Ring</h2>
          <p>
            We wear a simple uniform, religious dress, adhering to the norms that bear witness to our Consecration. Our
            identity is recognized by our Congregation’s Cross and Ring. (Cont. 47)
          </p>

          <h2>Meaning of the Cross and the imprints on its two sides</h2>
          <h3>The Cross</h3>
          <p>The Cross symbolizes:</p>
          <ul>
            <li>
              <strong>Love:</strong> Christ chose to die for us, sinners, and this choice is made in love. God showed His
              great love for us by sending Christ to die for us while we were still sinners (Romans 5:8).
            </li>
            <li>
              <strong>Humility:</strong> Christ’s death was an act of His willful humility. Christ hung on the cross with
              a purpose. Jesus humbled Himself in obedience and died a criminal death on the Cross (Phil 2:7–8).
            </li>
            <li>
              <strong>Sacrifice:</strong> Laying aside His Divinity, He was born a helpless baby, completely dependent upon
              others. During His public ministry, He faithfully carried out God’s plan all the way to His death on the
              cross (Romans 12:1–2).
            </li>
            <li>
              <strong>Service:</strong> Jesus said, “I did not come to be served, but to serve and to give my life as a
              ransom for many” (Mark 10:45). Christ’s supreme act of service was dying on the Cross so we might have
              eternal life.
            </li>
          </ul>
          <div className="community-symbols">
            <figure>
              <img src="/media/community/jmj-cross-ihs.webp" width={400} height={266} loading="lazy" decoding="async" alt="The JMJ Cross: IHS in the centre, with the letters J, M, J around it" />
            </figure>
            <figure>
              <img src="/media/community/ora-et-labora.webp" width={400} height={266} loading="lazy" decoding="async" alt="Stained-glass oval with the words Ora et Labora (pray and work) in the centre" />
            </figure>
          </div>
          <p>
            As Sisters of JMJ, we are constantly invited to die to our will, as Christ did. Our life’s prayer should be
            “Thy will be done.” Christ calls us to deny ourselves and follow Him through sacrificial service to others
            (Luke 9:23).
          </p>
          <p>
            And just like Jesus, it is our responsibility to become symbols of love, humility, sacrifice, and service,
            involving ourselves in the Salvific Mission of Jesus.
          </p>

          <h3>IHS (on one side of the JMJ Cross)</h3>
          <p>The Christogram IHS (Iesus Hominum Salvator) is a monogram symbolizing Jesus Christ as Savior.</p>
          <p>In 1541, Saint Ignatius adopted the monogram IHS as an emblem to represent his newly founded order, the Society of Jesus.</p>
          <p>
            JMJ Founder, being a Jesuit, used this monogram on the one side of the Cross to indicate Jesus Christ as
            Savior of us all.
          </p>

          <h3>Hearts of Jesus and Mary on the other side of the JMJ Cross</h3>
          <p>
            The joint devotion to the Hearts of Jesus and Mary formally started in the 17th century. The Hearts of Jesus
            and Mary are mentioned explicitly in the New Testament. Luke 2:19 states: “Mary kept all these things
            pondering them in her heart”, and Luke 2:51: “His Mother kept all these things carefully in Her Heart.” John
            7:38 refers to the heart of Jesus: “From His Heart will flow rivers of living water.”
          </p>
          <p>
            Rev. Fr. Mathias Wolff, a man of faith, grew in devotion to the hearts of Jesus and Mary like many other holy
            men and women of his time, depicting the Heart of Jesus thorn-crowned and the Heart of Mary pierced with a
            sword. Hence, the JMJ cross has this imprint, so that the sisters of JMJ practice this devotion to the two
            hearts of Jesus and Mary. By this devotion, we pray that Jesus and Mary lead us to selfless love of God and
            our neighbor.
          </p>

          <h2>JMJ Ring with the imprint of a crucifix</h2>
          <p>
            The crucifix image on the JMJ ring represents the path of transformation. It reminds us of the narrow path
            that we constantly need to choose. It means to die and rise with Christ. We find this in St. Paul: “I have
            been crucified with Christ. It is no longer I who live, but Christ who lives in me.” (Galatians 2:20)
          </p>
          <div className="community-symbols community-symbols--single">
            <figure>
              <img src="/media/community/jmj-ring.webp" width={400} height={266} loading="lazy" decoding="async" alt="The JMJ ring with the imprint of a crucifix, surrounded by rays of light" />
            </figure>
          </div>
          <p>
            Jesus’ Crucifix proclaims that love is more powerful than hatred, compassion triumphs over oppression, and
            vulnerability overcomes power. The Crucifix invites us to put our trust in God, even in the face of dismay,
            oppression, cruelty, and death. God is with us. God feels and suffers deeply with us.
          </p>
          <p>
            We wear the ring with the imprint of the crucifix as a sign of our total commitment to God, following the
            path of Christ crucified faithfully till the end of our lives.
          </p>
        </article>
      </PageShell>
    </>
  );
}
