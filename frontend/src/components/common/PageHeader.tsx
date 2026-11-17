import { Link } from "react-router-dom";
import { Icon } from "@/components/ui/Icon";

export interface PageHeaderCrumb {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  /** Intermediate crumbs. "Home" and the current page are added automatically. */
  breadcrumbs?: PageHeaderCrumb[];
  /** Optional faint background photograph. */
  image?: string;
  /**
   * "sky": the image is shown in full colour, the title is centred with the breadcrumb below it,
   * and the banner ends in a torn-paper edge (used on Prayers of the Congregation).
   */
  variant?: "default" | "sky";
}

/** Banner opening every interior page, with breadcrumbs. */
export function PageHeader({ eyebrow, title, description, breadcrumbs = [], image, variant = "default" }: PageHeaderProps) {
  const sky = variant === "sky";
  const crumbs = (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        <li>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon name="home" /> Home
          </Link>
        </li>
        {breadcrumbs.map((crumb) => (
          <li key={crumb.label}>{crumb.href ? <Link to={crumb.href}>{crumb.label}</Link> : crumb.label}</li>
        ))}
        <li aria-current="page">{title}</li>
      </ol>
    </nav>
  );
  return (
    <header className={sky ? "page-hero page-hero--sky" : "page-hero"}>
      {image && <img className="page-hero__bg" src={image} alt="" loading="eager" decoding="async" />}
      <div className="container">
        {!sky && crumbs}
        {eyebrow && !sky && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {sky && crumbs}
        {description && <p>{description}</p>}
      </div>
    </header>
  );
}
