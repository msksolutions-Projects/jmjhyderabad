import { Link, useLocation } from "react-router-dom";
import { PageHeader } from "@/components/common/PageHeader";
import { PageShell } from "@/components/common/PageShell";
import { Seo } from "@/components/seo/Seo";
import { Icon } from "@/components/ui/Icon";
import { findGroup, groupHref, navigation } from "@/data/navigation";

/**
 * Shown for a menu page whose text the Province has not supplied yet.
 * It is replaced automatically once the page is added to src/data/extraPages.json.
 */
export function PreparingPage() {
  const { pathname } = useLocation();
  const group = findGroup(pathname);
  const item = navigation.flatMap((g) => g.items ?? []).find((i) => i.href === pathname);
  const title = item?.label ?? "Coming soon";
  const others = (group?.items ?? []).filter((i) => i.href !== pathname && !i.slug);

  return (
    <>
      <Seo title={title} path={pathname} noIndex />
      <PageHeader eyebrow={group?.label} title={title} breadcrumbs={group ? [{ label: group.label, href: groupHref(group) === pathname ? undefined : groupHref(group) }] : []} />
      <PageShell>
        <div className="preparing panel">
          <span className="preparing__icon" aria-hidden="true">
            <Icon name="draft" />
          </span>
          <h2>This page is being prepared</h2>
          <p>
            The Province is preparing the content for <strong>{title}</strong>. It will be published here soon.
          </p>
          {others.length > 0 && (
            <>
              <p className="preparing__more">Meanwhile, you may like to read:</p>
              <ul className="preparing__links">
                {others.map((o) => (
                  <li key={o.href}>
                    <Link to={o.href} className="read-more-anim">
                      {o.label} <span className="arrow" aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
          <div className="row" style={{ justifyContent: "center", marginTop: 20 }}>
            <Link className="btn" to="/">
              <Icon name="home" /> Home
            </Link>
            <Link className="btn btn--outline" to="/contact">
              <Icon name="mail" /> Contact us
            </Link>
          </div>
        </div>
      </PageShell>
    </>
  );
}
