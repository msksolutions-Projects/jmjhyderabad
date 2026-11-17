import { Link, useParams } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { PageShell } from "@/components/common/PageShell";
import { Seo } from "@/components/seo/Seo";
import { Icon } from "@/components/ui/Icon";
import {
  INSTITUTES_PATH,
  categoryPath,
  institutesIntro,
  serviceCategories,
  type ServiceList,
} from "@/data/institutesServices";
import { NotFoundPage } from "@/pages/NotFoundPage";

const SECTION = "Institutes & Services";

function Intro() {
  return (
    <div className="inst-intro">
      {institutesIntro.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}

/** Institutes & Services: the introduction and one card for each apostolate. */
export function InstitutesServicesPage() {
  return (
    <>
      <Seo
        title={SECTION}
        description="The institutions and services of JMJ Hyderabad Province: education, healthcare, social apostolate, and pastoral ministry and evangelisation."
        path={INSTITUTES_PATH}
      />
      <PageHeader eyebrow="JMJ Hyderabad Province" title={SECTION} />
      <PageShell sidebar={false}>
        <Intro />
        <ul className="reset-list inst-cards">
          {serviceCategories.map((category) => (
            <li key={category.slug}>
              <Link className="inst-card" to={categoryPath(category.slug)}>
                <span className="inst-card__icon" aria-hidden="true">
                  <Icon name={category.icon} />
                </span>
                <span className="inst-card__title">{category.title}</span>
                <span className="inst-card__count">
                  {category.list.items.length} {category.list.items.length === 1 ? "institution" : "institutions"}
                </span>
                <span className="inst-card__text">{category.summary}</span>
                <span className="inst-card__more">
                  View list <Icon name="arrowRight" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </PageShell>
    </>
  );
}

function InstitutionList({ list }: { list: ServiceList }) {
  return (
    <section className="inst-list" aria-label={list.title}>
      <h2 className="inst-list__title">{list.title}</h2>
      {list.note && <p className="inst-list__note">{list.note}</p>}
      <ol className="inst-list__items">
        {list.items.map(([name, place], i) => (
          <li key={`${name}-${place}-${i}`}>
            <span className="inst-list__num" aria-hidden="true">{i + 1}</span>
            <span className="inst-list__body">
              <strong>{name}</strong>
              <span className="inst-list__place">
                <Icon name="pin" /> {place}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** One apostolate: the introduction followed by its list of institutions. */
export function InstitutesServicesCategoryPage() {
  const { category: slug } = useParams();
  const category = serviceCategories.find((c) => c.slug === slug);
  if (!category) return <NotFoundPage />;
  const others = serviceCategories.filter((c) => c.slug !== category.slug);

  return (
    <>
      <Seo title={`${category.title} | ${SECTION}`} description={category.summary} path={categoryPath(category.slug)} />
      <PageHeader eyebrow={SECTION} title={category.title} breadcrumbs={[{ label: SECTION, href: INSTITUTES_PATH }]} />
      <PageShell>
        <Intro />
        <InstitutionList list={category.list} />
        {category.more?.map((list) => (
          <InstitutionList key={list.title} list={list} />
        ))}
        <nav className="inst-others" aria-label="Other apostolates">
          <span>Also see:</span>
          {others.map((c) => (
            <Link key={c.slug} to={categoryPath(c.slug)} className="filter-chip">
              {c.title}
            </Link>
          ))}
        </nav>
      </PageShell>
    </>
  );
}
