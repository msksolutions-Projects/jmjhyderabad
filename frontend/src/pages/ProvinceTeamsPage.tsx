import { Link } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { Seo } from "@/components/seo/Seo";
import { ProvinceTeamGallery } from "@/components/province/ProvinceTeamGallery";

export function ProvinceTeamsPage() {
  return (
    <>
      <Seo
        title="Meet Our Province Teams"
        description="Meet the Provincial Superior, Provincial Councillors and Province Procurator serving JMJ Hyderabad Province."
        path="/province/teams"
      />
      <PageHeader
        eyebrow="Provincialate"
        title="Meet Our Province Teams"
        description="Faithful leadership. Shared mission. Compassionate service."
        breadcrumbs={[{ label: "Provincialate", href: "/who-we-are/province-profile" }]}
      />
      <main className="province-teams-page">
        <div className="container">
          <div className="province-teams-intro">
            <div>
              <span className="province-teams-intro__eyebrow">JMJ HYDERABAD PROVINCE · PROVINCIALATE</span>
              <h2>Leadership rooted in faith and service</h2>
              <p>Our Provincial Superior and her team accompany the Sisters and support the Province’s mission in education, healthcare, pastoral care and service to communities.</p>
            </div>
            <Link className="province-teams-intro__message" to="/province/provincial-message">
              Read the Provincial Superior’s Message <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <section aria-labelledby="province-team-gallery-title">
            <div className="province-teams-heading">
              <div>
                <p className="province-teams-heading__kicker">OUR LEADERSHIP</p>
                <h2 id="province-team-gallery-title">The Provincial Team</h2>
              </div>
              <p>Five portraits supplied by JMJ Hyderabad Province. Select a portrait to view it in full size.</p>
            </div>
            <ProvinceTeamGallery />
          </section>

          <div className="province-teams-links">
            <div>
              <h2>Serving together in mission</h2>
              <p>Learn more about the leadership of the Province and how to reach the Provincialate.</p>
            </div>
            <div className="province-teams-links__actions">
              <Link to="/province/provincial-council">Provincial Council <span aria-hidden="true">→</span></Link>
              <Link to="/administration/commissions">Province Commissions <span aria-hidden="true">→</span></Link>
              <Link to="/contact">Contact Us <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
