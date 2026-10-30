import { Link } from "react-router-dom";
import { Seo } from "@/components/seo/Seo";

/** The official visual message supplied by the Hyderabad Province. */
export function ProvincialMessagePage() {
  return (
    <>
      <Seo
        title="Message from the Provincial Superior"
        description="A welcome and message of faith, love, and service from Sr. Pauline Nusi, Provincial Superior of JMJ Hyderabad Province."
        path="/province/provincial-message"
        type="article"
      />
      <section className="provincial-message-page" aria-labelledby="provincial-message-title">
        <div className="container provincial-message-page__container">
          <nav className="provincial-message-page__crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Message from the Provincial Superior</span>
          </nav>
          <h1 id="provincial-message-title" className="visually-hidden">Message from the Provincial Superior</h1>
          <figure className="provincial-message-page__artwork">
            <img
              src="/media/provincial/pauline-nusi-message.jpg"
              alt="Designed welcome message from Sr. Pauline Nusi, Provincial Superior, with her portrait, a Bible, a cross and white lilies. The full text is available immediately below the image."
              width={1280}
              height={1021}
              fetchPriority="high"
            />
          </figure>
          <details className="provincial-message-page__transcript">
            <summary>Read the Provincial Superior’s message as text</summary>
            <div className="provincial-message-page__text">
              <h2>A message of welcome</h2>
              <p>With a heart filled with gratitude and joy, I extend a warm welcome to all who visit the official website of JMJ Hyderabad Province.</p>
              <p>Every journey has a purpose, and ours is a journey of faith, love, and service. Inspired by the vision of our founder, Fr. Mathias Wolff, SJ, and rooted in the charism of “Ever Adaptable Apostolic Availability,” we strive to make God’s compassionate presence felt wherever life calls us to serve.</p>
              <p>The story of JMJ Hyderabad Province is not merely a history of institutions and achievements, but a living testimony of countless lives touched through dedication, sacrifice, and selfless service. From classrooms that nurture young minds to healthcare centres that bring healing, from pastoral ministries that strengthen faith to social initiatives that restore hope and dignity, our Sisters continue to carry forward the mission entrusted to us.</p>
              <p>I am deeply grateful to every Sister who has contributed to this beautiful journey, to our collaborators who share our vision, and to the many individuals and communities who have enriched our mission through their trust and support.</p>
              <p>As we look towards the future, we are called not simply to continue what has been entrusted to us, but to rediscover its purpose with renewed enthusiasm. In a world marked by constant change, our mission remains relevant when we listen with compassion, respond with courage, and serve with humility.</p>
              <p>Through this website, I invite you to discover our journey, celebrate our shared mission, and witness the spirit of JMJ reflected in the lives and ministries of our Sisters.</p>
              <p>May Jesus, Mary, and Joseph continue to guide our footsteps as we move forward together, rekindling our commitment, revitalizing our mission, and becoming instruments of God’s love and hope in the world.</p>
              <p>With prayerful wishes and blessings,</p>
              <p><strong>Sr. Pauline Nusi</strong><br />Provincial Superior<br />JMJ Hyderabad Province</p>
            </div>
          </details>
        </div>
      </section>
    </>
  );
}
