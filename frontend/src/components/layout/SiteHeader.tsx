import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Icon } from "@/components/ui/Icon";
import { groupHref, isGroupActive, navigation, type NavGroup } from "@/data/navigation";
import { site } from "@/data/site";
import { useSearchShortcut } from "@/features/search/useSearchShortcut";

const GlobalSearchDialog = lazy(() =>
  import("@/features/search/GlobalSearchDialog").then((m) => ({ default: m.GlobalSearchDialog })),
);

const tel = (value: string) => `tel:${value.replace(/[^\d+]/g, "")}`;

function isItemActive(href: string, pathname: string, search: string) {
  const [path, query] = href.split("?");
  if (query) return pathname === path && search.includes(query);
  return pathname === path && (path !== "/institutions" || !search.includes("group="));
}

function DesktopNav({ pathname, search, onSearch }: { pathname: string; search: string; onSearch: () => void }) {
  const [open, setOpen] = useState<string | null>(null);
  const navRef = useRef<HTMLUListElement>(null);

  // Close on outside click and on Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpen(null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        const button = navRef.current?.querySelector<HTMLButtonElement>(`[data-group="${open}"]`);
        setOpen(null);
        button?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // After choosing a page, keep hover menus shut until the pointer leaves the menu bar.
  const [suppressed, setSuppressed] = useState(false);
  const firstRender = useRef(true);
  useEffect(() => {
    setOpen(null);
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setSuppressed(true);
  }, [pathname, search]);

  return (
    <nav className="navbar" aria-label="Main">
      <div className="container">
        <ul className={`nav${suppressed ? " is-suppressed" : ""}`} ref={navRef} onMouseLeave={() => setSuppressed(false)}>
          <li className="nav__item">
            <NavLink to="/" end className={({ isActive }) => `nav__link${isActive ? " is-active" : ""}`}>
              Home
            </NavLink>
          </li>
          {navigation.map((group) => {
            const active = isGroupActive(group, pathname);
            if (!group.items) {
              return (
                <li className="nav__item" key={group.id}>
                  <Link to={groupHref(group)} className={`nav__link${active ? " is-active" : ""}`}>
                    {group.label}
                  </Link>
                </li>
              );
            }
            const isOpen = open === group.id;
            return (
              <li
                className={`nav__item${isOpen ? " is-open" : ""}`}
                key={group.id}
                onMouseEnter={() => suppressed && setSuppressed(false)}
                onMouseLeave={() => isOpen && setOpen(null)}
              >
                <button
                  type="button"
                  data-group={group.id}
                  className={`nav__link${active ? " is-active" : ""}`}
                  aria-expanded={isOpen}
                  aria-controls={`menu-${group.id}`}
                  onClick={() => setOpen(isOpen ? null : group.id)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      setOpen(group.id);
                      requestAnimationFrame(() =>
                        document.querySelector<HTMLAnchorElement>(`#menu-${group.id} a`)?.focus(),
                      );
                    }
                  }}
                >
                  {group.label}
                  <Icon name="chevronDown" />
                </button>
                <div id={`menu-${group.id}`} className="dropdown">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`dropdown__link${isItemActive(item.href, pathname, search) ? " is-active" : ""}`}
                      aria-current={isItemActive(item.href, pathname, search) ? "page" : undefined}
                    >
                      <span className="dropdown__label">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
        <button type="button" className="nav__search" onClick={onSearch} aria-label="Open search" title="Search (Ctrl + K)">
          <Icon name="search" />
        </button>
      </div>
    </nav>
  );
}

function MobileDrawer({
  open,
  onClose,
  onSearch,
  pathname,
  search,
}: {
  open: boolean;
  onClose: () => void;
  onSearch: () => void;
  pathname: string;
  search: string;
}) {
  const activeGroup = navigation.find((group) => isGroupActive(group, pathname));
  const [expanded, setExpanded] = useState<string | null>(activeGroup?.id ?? null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Keep the closed drawer out of the tab order (React 18 has no `inert` prop).
  useEffect(() => {
    const node = drawerRef.current;
    if (!node) return;
    if (open) node.removeAttribute("inert");
    else node.setAttribute("inert", "");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setExpanded(navigation.find((group) => isGroupActive(group, pathname))?.id ?? null);
    document.body.classList.add("no-scroll");
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("no-scroll");
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, pathname]);

  const renderGroup = (group: NavGroup) => {
    const active = isGroupActive(group, pathname);
    if (!group.items) {
      return (
        <li key={group.id}>
          <div className="m-nav__row">
            <Link to={groupHref(group)} className={`m-nav__link${active ? " is-active" : ""}`}>
              {group.label}
            </Link>
          </div>
        </li>
      );
    }
    const isOpen = expanded === group.id;
    return (
      <li key={group.id}>
        <div className="m-nav__row">
          <button
            type="button"
            className={`m-nav__toggle${active ? " is-active" : ""}`}
            aria-expanded={isOpen}
            aria-controls={`m-${group.id}`}
            onClick={() => setExpanded(isOpen ? null : group.id)}
          >
            {group.label}
            <Icon name="chevronDown" />
          </button>
        </div>
        {isOpen && (
          <ul className="m-nav__sub" id={`m-${group.id}`}>
            {group.items.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={isItemActive(item.href, pathname, search) ? "is-active" : undefined}
                  aria-current={isItemActive(item.href, pathname, search) ? "page" : undefined}
                >
                  {item.icon && <Icon name={item.icon} />}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <>
      <div className={`drawer-backdrop${open ? " is-open" : ""}`} onClick={onClose} aria-hidden="true" />
      <div
        className={`drawer${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        ref={drawerRef}
      >
        <div className="drawer__head">
          <img src="/brand/jmj-logo-128.webp" srcSet="/brand/jmj-logo-128.webp 1x, /brand/jmj-logo-256.webp 2x" alt="" width={40} height={40} />
          <div className="drawer__title">JMJ Hyderabad Province</div>
          <button ref={closeRef} type="button" className="icon-btn" onClick={onClose} aria-label="Close navigation menu">
            <Icon name="close" />
          </button>
        </div>
        <div className="drawer__body">
          <button type="button" className="btn btn--outline drawer__search" onClick={onSearch}>
            <Icon name="search" /> Search this website
          </button>
          <nav aria-label="Main">
            <ul className="m-nav">
              <li>
                <div className="m-nav__row">
                  <Link to="/" className={`m-nav__link${pathname === "/" ? " is-active" : ""}`}>
                    Home
                  </Link>
                </div>
              </li>
              {navigation.map(renderGroup)}
            </ul>
          </nav>
        </div>
        <div className="drawer__foot">
          <a href={tel(site.phone)}>
            <Icon name="phone" /> {site.phone}
          </a>
          <a href={`mailto:${site.email}`}>
            <Icon name="mail" /> {site.email}
          </a>
          <Link to="/admin/login">
            <Icon name="lock" /> Staff login
          </Link>
        </div>
      </div>
    </>
  );
}

export function SiteHeader() {
  const { pathname, search } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoaded, setSearchLoaded] = useState(false);

  const openSearch = useCallback(() => {
    setDrawerOpen(false);
    setSearchLoaded(true);
    setSearchOpen(true);
  }, []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  useSearchShortcut(openSearch);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname, search]);

  return (
    <>
      <header className="masthead">
        <div className="container masthead__inner">
          <Link to="/" className="masthead__logo" aria-label={`${site.name} — home`}>
            <img src="/brand/jmj-logo-128.webp" srcSet="/brand/jmj-logo-128.webp 1x, /brand/jmj-logo-256.webp 2x" alt="" width={110} height={110} />
          </Link>
          <Link to="/" className="masthead__title" tabIndex={-1} aria-hidden="true">
            <span className="masthead__name">Congregation of Jesus Mary Joseph</span>
            <span className="masthead__sub">(JMJ) · Hyderabad Province</span>
          </Link>
          <img className="masthead__portrait" src="/brand/founder-oval-120.webp" srcSet="/brand/founder-oval-120.webp 1x, /brand/founder-oval-240.webp 2x" alt="Rev. Fr. Mathias Wolff S.J., our Founder" width={92} height={120} />
          <div className="masthead__actions">
            <button
              type="button"
              className="icon-btn"
              onClick={openSearch}
              onMouseEnter={() => setSearchLoaded(true)}
              aria-label="Open search"
              title="Search (Ctrl + K)"
            >
              <Icon name="search" />
            </button>
            <button
              type="button"
              className="icon-btn burger"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
            >
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </header>
      <DesktopNav pathname={pathname} search={search} onSearch={openSearch} />
      <MobileDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        onSearch={openSearch}
        pathname={pathname}
        search={search}
      />
      {searchLoaded && (
        <Suspense fallback={null}>
          <GlobalSearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
