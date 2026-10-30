import { Link } from "react-router-dom";
import { Icon } from "@/components/ui/Icon";
import { navigation, type NavItem } from "@/data/navigation";
import { site } from "@/data/site";
import { hasSection } from "@/services/extraPages";

const tel = (value: string) => `tel:${value.replace(/[^\d+]/g, "")}`;

const quickLinks: NavItem[] = [
  { label: "Province Profile", href: "/who-we-are/province-profile" },
  { label: "Our History", href: "/who-we-are/history" },
  { label: "Our Institutions", href: "/institutions" },
  { label: "Convent Directory", href: "/contact/convents" },
  { label: "Whom To Contact?", href: "/joining-us/whom-to-contact" },
  { label: "Contact Us", href: "/contact" },
];

const media: NavItem[] = [
  { label: "Province News", href: "/news" },
  { label: "Notices", href: "/notices" },
  { label: "News Flash", href: "/news-flash" },
  { label: "Jubilee Vibes", href: "/news-flash/jubilee-vibes" },
  { label: "News Strings", href: "/publications" },
  { label: "Photo Gallery", href: "/gallery" },
];

const connect = [
  { label: "Congregation of Jesus Mary Joseph", href: "https://congregationjmj.org/" },
  { label: "JMJ Guntur Province", href: "https://jmjgunturprovince.org/" },
  { label: "JMJ Raipur Province", href: "https://jmjraipur.in/" },
];

/** Menu pages that already have content (pages still being prepared are left out of the footer). */
const items = (id: string, max = 7) =>
  (navigation.find((group) => group.id === id)?.items ?? []).filter((item) => !item.slug || hasSection(item.slug)).slice(0, max);

function LinkList({ title, links }: { title: string; links: NavItem[] }) {
  if (!links.length) return null;
  return (
    <nav className="footer-widget" aria-label={title}>
      <h3>{title}</h3>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link to={link.href}>
              <span className="footer-chev" aria-hidden="true">»</span> {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="main-footer">
      <div className="container widgets-section">
        <div className="footer-col">
          <div className="footer-widget">
            <h3>Contact Us</h3>
            <ul className="contact-info">
              <li>
                <Icon name="building" />
                <span>
                  <strong>{site.fullName}</strong>
                  <br />
                  {site.address}
                </span>
              </li>
              <li>
                <Icon name="phone" />
                <span>
                  <a href={tel(site.phone)}>{site.phone}</a>
                  <br />
                  <a href={tel(site.alternatePhone)}>{site.alternatePhone}</a>
                </span>
              </li>
              <li>
                <Icon name="mail" />
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <Icon name="clock" />
                <span>Mon–Sat, 08:00–18:00</span>
              </li>
            </ul>
          </div>
          <div className="footer-widget footer-widget--spaced">
            <h3>Connect with Us</h3>
            <ul className="footer-connect">
              {connect.map((c) => (
                <li key={c.href}>
                  <a href={c.href} target="_blank" rel="noopener noreferrer">
                    <Icon name="globe" /> {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-col">
          <LinkList title="Quick Links" links={quickLinks} />
          <div className="footer-widget--spaced">
            <LinkList title="Spirituality" links={items("spirituality")} />
          </div>
        </div>
        <div className="footer-col">
          <LinkList title="News & Media" links={media} />
          <div className="footer-widget--spaced">
            <LinkList title="Mission" links={items("mission")} />
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <span>
            © {new Date().getFullYear()} <strong>{site.fullName}.</strong> All Rights Reserved.
          </span>
          <ul className="reset-list">
            <li>
              <Link to="/ministries/safeguarding">Safeguarding</Link>
            </li>
            <li>
              <Link to="/admin/login">Staff login</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
