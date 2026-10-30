import { Link } from "react-router-dom";
import { Seo } from "@/components/seo/Seo";

/** A local introduction for visitors; the Province Superior has a separate message page. */
export function SuperiorGeneralMessagePage() {
  return (
    <>
      <Seo
        title="Message from Superior General"
        description="A welcome inspired by the Congregation of Jesus Mary Joseph's faith, service, and apostolic availability."
        path="/message-from-superior-general"
        type="article"
      />
      <section className="superior-general-page">
        <div className="container superior-general-page__layout">
          <div>
            <nav className="superior-general-page__breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link><span aria-hidden="true"> / </span><span aria-current="page">Superior General</span>
            </nav>
            <p className="superior-general-page__eyebrow">Congregation of Jesus Mary Joseph</p>
            <h1>Message from Superior General</h1>
            <p className="superior-general-page__lead">
              Welcome to the Congregation of Jesus Mary Joseph, whose mission continues through a life of faith,
              compassion, and service in the spirit of Jesus, Mary, and Joseph.
            </p>
            <p>
              The founder, Rev. Fr. Mathias Wolff S.J., entrusted the Congregation with a charism of
              <strong> ever-adaptable apostolic availability</strong>. Across its communities, the Sisters carry this
              commitment forward through education, healthcare, pastoral ministry, and care for people in need.
            </p>
            <p>
              We invite you to discover this shared mission and the work of JMJ Hyderabad Province.
              For a personal message from the Province's own leader, please read the Provincial Superior's welcome.
            </p>
            <div className="superior-general-page__links">
              <Link to="/province/provincial-message">Message from the Provincial Superior</Link>
              <Link to="/who-we-are/history">Our history</Link>
            </div>
          </div>
          <figure className="superior-general-page__portrait">
            <img src="/brand/congregation-superior-general.webp" alt="Superior General of the Congregation of Jesus Mary Joseph" width={370} height={250} />
          </figure>
        </div>
      </section>
    </>
  );
}
