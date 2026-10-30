import { Link } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { PageShell } from "@/components/common/PageShell";
import { Seo } from "@/components/seo/Seo";
import { ProvinceTeamGallery } from "@/components/province/ProvinceTeamGallery";

export function ProvincialCouncilPage() {
  return (
    <>
      <Seo
        title="Provincial Council"
        description="Meet the Provincial Superior, Provincial Councillors and Province Procurator of JMJ Hyderabad Province."
        path="/province/provincial-council"
      />
      <PageHeader
        eyebrow="Provincialate"
        title="Provincial Council"
        description="Leadership and service in the JMJ Hyderabad Province"
        breadcrumbs={[{ label: "Provincialate", href: "/who-we-are/province-profile" }]}
      />
      <PageShell>
        <section className="panel council-intro" aria-labelledby="council-intro-title">
          <h2 id="council-intro-title">Our Province Leadership</h2>
          <p>
            The Provincial Superior and her Council accompany the Sisters and support the
            spiritual, communal and apostolic mission of JMJ Hyderabad Province.
            The portraits and roles below are reproduced from the photographs supplied by the Province.
          </p>
        </section>
        <section aria-label="Provincial Council members">
          <ProvinceTeamGallery />
        </section>
        <p className="council-contact">
          For official correspondence, please <Link to="/contact">contact the Hyderabad Provincialate</Link>.
        </p>
      </PageShell>
    </>
  );
}
