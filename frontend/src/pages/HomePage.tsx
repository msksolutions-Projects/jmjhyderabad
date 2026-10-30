import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { Seo } from "@/components/seo/Seo";
import { organizationSchema } from "@/components/seo/schema";
import { Icon } from "@/components/ui/Icon";
import { HeroSlider } from "@/features/home/HeroSlider";
import { ProvinceAssemblyAnnouncement } from "@/features/home/ProvinceAssemblyAnnouncement";
import { presence, presenceTotal } from "@/features/home/presence";
import { featuredAlbums } from "@/features/gallery/albums";
import { fetchUploadedPhotos, UPLOADS_ID } from "@/features/gallery/gallery.service";
import { fetchPublishedNews, newsDate, type PublicNews } from "@/features/news/news.service";
import {
  firstParagraph,
  founderReflections,
  glowreyReflections,
  maryGlowrey,
  tributes,
  type Reflection,
} from "@/data/homeFeatures";
import { hasSection } from "@/services/extraPages";

const B = "/media/home-banners";

/** Latest issue of the Province newsletter (the Province's counterpart to "The Encounter"). */
const latestIssue = { title: "News Strings", label: "Issue 13", file: "/documents/publications/13-news-strings.pdf", cover: "/media/covers/news-strings-13.webp" };

const bannerSrc = (n: string) => ({ src: `${B}/banner-${n}-sm.webp`, srcSet: `${B}/banner-${n}-sm.webp 600w, ${B}/banner-${n}-md.webp 1000w` });

/* ---------- Building blocks shared by the six cards ---------- */

function ReadMore({ to, children = "Read More" }: { to: string; children?: ReactNode }) {
  return (
    <Link to={to} className="read-more-anim">
      {children} <span className="arrow" aria-hidden="true">→</span>
    </Link>
  );
}

function ThemeButton({ to, href, children }: { to?: string; href?: string; children: ReactNode }) {
  const inner = (
    <>
      {children} <Icon name="arrowRight" />
    </>
  );
  return href ? (
    <a className="theme-btn" href={href} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  ) : (
    <Link className="theme-btn" to={to!}>
      {inner}
    </Link>
  );
}

interface CardProps {
  title: string;
  image?: { src: string; srcSet?: string; alt: string; contain?: boolean };
  children: ReactNode;
  className?: string;
}

function CardBox({ title, image, children, className }: CardProps) {
  return (
    <article className={`card-box${className ? ` ${className}` : ""}`}>
      {image && (
        <div className={`card-box__image${image.contain ? " card-box__image--contain" : ""}`}>
          <img src={image.src} srcSet={image.srcSet} sizes="(min-width: 1000px) 380px, (min-width: 700px) 50vw, 100vw" alt={image.alt} loading="lazy" decoding="async" />
        </div>
      )}
      <div className="card-box__content">
        <h3>{title}</h3>
        {children}
      </div>
    </article>
  );
}

function ReflectionBlock({ items, anchor }: { items: Reflection[]; anchor: string }) {
  const latest = items[0];
  if (!latest) return null;
  return (
    <>
      <div className="reflection-block">
        <h4>Monthly Reflection</h4>
        <p className="reflection-quote">“{firstParagraph(latest.text)}”</p>
        <p className="reflection-date">{latest.month}</p>
      </div>
      <div className="link-box">
        <ThemeButton to={`/reflections#${anchor}-0`}>Read More</ThemeButton>
        <ThemeButton to="/reflections">View All</ThemeButton>
      </div>
    </>
  );
}

/* ---------- The six cards (reference order) ---------- */

function FounderCard() {
  return (
    <CardBox title="Founder" className="reference-portrait" image={{ src: "/brand/congregation-founder.png", alt: "Portrait of Rev. Fr. Mathias Wolff S.J., founder of the Society of Jesus Mary Joseph" }}>
      <p>
        Rev. Fr. Mathias Wolff S.J. (1779–1857) founded the Society of Jesus Mary Joseph in Amersfoort, Netherlands, in
        1822, for the liberation of the oppressed, the poor, the voiceless and the marginalized. <ReadMore to="/who-we-are/founder" />
      </p>
      {founderReflections.length ? (
        <ReflectionBlock items={founderReflections} anchor="founder" />
      ) : (
        <div className="reflection-block">
          <h4>In his words</h4>
          <p className="reflection-quote">“Always ready for souls, and I want to labour as a giant.”</p>
          <p className="reflection-date">Rev. Fr. Mathias Wolff S.J.</p>
        </div>
      )}
    </CardBox>
  );
}

/** Ven. Mary Glowrey once her content is supplied; until then the charism of Jesus, Mary and Joseph. */
function SecondCard() {
  if (maryGlowrey) {
    return (
      <CardBox title="Ven. Mary Glowrey" className="reference-portrait" image={maryGlowrey.photo ? { src: maryGlowrey.photo, alt: "Ven. Mary Glowrey in the white JMJ habit" } : undefined}>
        <p>
          {maryGlowrey.summary} {hasSection("mary-glowrey-life") && <ReadMore to="/mary-glowrey/life" />}
        </p>
        <ReflectionBlock items={glowreyReflections} anchor="glowrey" />
      </CardBox>
    );
  }
  return (
    <CardBox title="Our Charism" image={{ ...bannerSrc("04"), alt: "Painting of the Holy Family — Jesus, Mary and Joseph — in the carpenter's workshop" }}>
      <p>
        In total surrender to the Will of the Father, with passion for God&rsquo;s Kingdom, like Mary and Joseph, we
        follow Christ the Saviour to liberate oppressed humanity through the ministries of mercy. <ReadMore to="/who-we-are/vision-mission" />
      </p>
      <div className="reflection-block">
        <h4>An Ever-Adaptable Apostolic Availability</h4>
        <p className="reflection-quote">“We are sent to serve the poor and marginalized … with a global concern for justice, caring for the Integrity of Creation.”</p>
      </div>
    </CardBox>
  );
}

/** Congregation leadership is distinct from the Province's Provincial Superior. */
function ThirdCard() {
  return (
    <CardBox title="Message from Superior General" className="reference-portrait" image={{ src: "/brand/congregation-superior-general.png", alt: "Portrait of the Superior General of the Congregation of Jesus Mary Joseph in a blue religious habit" }}>
      <p>
        The Superior General welcomes visitors on behalf of the Congregation of Jesus Mary Joseph,
        drawing inspiration from the life of Jesus and the Founder's charism of apostolic availability. <ReadMore to="/message-from-superior-general" />
      </p>
      <div className="link-box"><ThemeButton to="/province/provincial-message">Message from Our Provincial Superior</ThemeButton></div>
    </CardBox>
  );
}

/** Loving Tribute once names are supplied; until then the path of formation. */
function FourthCard() {
  if (tributes.length) {
    return (
      <CardBox title="Loving Tribute" className="tribute-card" image={{ ...bannerSrc("10"), alt: "Sisters lighting lamps at the altar" }}>
        <p className="tribute-prayer">
          Eternal rest grant unto our beloved Sisters, O Lord, and let perpetual light shine upon them. May their souls
          rest in peace.
        </p>
        <ul className="tribute-list reset-list">
          {tributes.slice(0, 6).map((t) => (
            <li key={`${t.name}-${t.died}`}>
              <strong>{t.name}</strong>
              <span>{t.died}</span>
            </li>
          ))}
        </ul>
      </CardBox>
    );
  }
  return (
    <CardBox title="Joining Us" image={{ ...bannerSrc("07"), alt: "Sisters gathered before the altar at a profession celebration" }}>
      <p>
        A person-oriented, contextualised and integral journey into the likeness of Christ — from pre-postulancy and
        postulancy, through the novitiate, to the juniorate and final profession. <ReadMore to="/ministries/formation" />
      </p>
      <div className="link-box">
        <ThemeButton to="/ministries/formation">Stages of Formation</ThemeButton>
        <ThemeButton to="/contact">Contact Us</ThemeButton>
      </div>
    </CardBox>
  );
}

function EncounterCard() {
  return (
    <article className="card-box encounter-home">
      <h3>{latestIssue.title}</h3>
      <a href={latestIssue.file} target="_blank" rel="noopener noreferrer" className="encounter-home__cover">
        <img src={latestIssue.cover} alt={`Cover of ${latestIssue.title}, ${latestIssue.label}`} width={240} height={340} loading="lazy" decoding="async" />
      </a>
      <p className="title">{latestIssue.label} · The Province newsletter</p>
      <div className="link-box">
        <ThemeButton href={latestIssue.file}>View PDF</ThemeButton>
        <ThemeButton to="/publications">All Issues</ThemeButton>
      </div>
    </article>
  );
}

const thumbOf = (item: PublicNews) =>
  item.attachments?.find((a) => a.kind === "image")?.thumbUrl || item.attachments?.find((a) => a.kind === "image")?.url || item.image;

function NewsCard() {
  const { data, isPending } = useQuery({
    queryKey: ["public-news"],
    queryFn: ({ signal }) => fetchPublishedNews(signal),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
  const all = data ?? [];
  const items = all.slice(0, 4);
  return (
    <article className="card-box news-card">
      <div className="news-card-header">
        <h3>Latest News</h3>
        {all.length > 0 && <span className="news-card-count">{all.length} {all.length === 1 ? "update" : "updates"}</span>}
      </div>
      <div className="news-items" aria-busy={isPending}>
        {isPending && [0, 1, 2].map((i) => <div key={i} className="skeleton" style={{ height: 64 }} />)}
        {!isPending && items.length === 0 && (
          <>
            {[
              { to: "/notices", icon: "bell" as const, title: "Notices from the provincial office" },
              { to: "/publications", icon: "file" as const, title: "News Strings — the Province newsletter" },
              { to: "/gallery", icon: "image" as const, title: "Photographs from our communities" },
            ].map((c) => (
              <div className="news-item" key={c.to}>
                <div className="news-thumb news-thumb--icon">
                  <Icon name={c.icon} />
                </div>
                <div className="news-info">
                  <h4>
                    <Link to={c.to}>{c.title}</Link>
                  </h4>
                </div>
              </div>
            ))}
          </>
        )}
        {items.map((item) => {
          const date = newsDate(item);
          const thumb = thumbOf(item);
          return (
            <div className="news-item" key={item._id}>
              <div className={`news-thumb${thumb ? "" : " news-thumb--icon"}`}>{thumb ? <img src={thumb} alt="" loading="lazy" /> : <img src="/brand/jmj-logo-128.webp" alt="" loading="lazy" />}</div>
              <div className="news-info">
                <h4>
                  <Link to="/news">{item.title}</Link>
                </h4>
                <span className="date">
                  <Icon name="calendar" /> {date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="link-box">
        <ThemeButton to="/news">View All</ThemeButton>
      </div>
    </article>
  );
}

/** Album tiles: a "Latest uploads" tile leads when the admin has published new photos. */
function useAlbumTiles() {
  const { data: uploads = [] } = useQuery({
    queryKey: ["gallery-uploads-home"],
    queryFn: ({ signal }) => fetchUploadedPhotos(signal, 50),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  const tiles = featuredAlbums.map((a) => ({ id: a.id as string, label: a.label as string, meta: a.meta as string, cover: a.cover as string, href: `/gallery?category=${a.id}` }));
  if (!uploads.length) return tiles;
  return [
    {
      id: UPLOADS_ID,
      label: "Latest uploads",
      meta: `${uploads.length} new ${uploads.length === 1 ? "photo" : "photos"}`,
      cover: uploads[0]!.thumbnail,
      href: `/gallery?category=${UPLOADS_ID}`,
    },
    ...tiles.slice(0, 3),
  ];
}

function SecTitle({ id, children }: { id: string; children: ReactNode }) {
  return (
    <div className="sec-title">
      <h2 id={id}>{children}</h2>
    </div>
  );
}

export function HomePage() {
  const albums = useAlbumTiles();
  return (
    <>
      <Seo
        title="JMJ Hyderabad Province"
        description="The Congregation of Jesus Mary Joseph, Hyderabad Province — serving through education, health care, social work and formation across Telangana, Andhra Pradesh and Madhya Pradesh since 1904."
        path="/"
        jsonLd={organizationSchema}
      />

      <ProvinceAssemblyAnnouncement />

      {/* Full-width photo banner — no empty coloured side panels. */}
      <section className="hero-carousel-section">
        <HeroSlider />
      </section>

      {/* Welcome (on the reference this sits on the banner; here it stays off the photos) */}
      <section className="welcome-strip" aria-labelledby="welcome-title">
        <div className="container">
          <h2 id="welcome-title">Welcome to the Congregation of Jesus Mary Joseph, Hyderabad Province</h2>
          <p>
            The Congregation of Jesus Mary Joseph is a Catholic religious congregation of women founded by Rev. Fr.
            Mathias Wolff S.J. in 1822. Serving in India since 1904, the Hyderabad Province carries this mission through
            schools, hospitals, nursing colleges, social service societies and formation houses across Telangana, Andhra
            Pradesh and Madhya Pradesh. <ReadMore to="/who-we-are/province-profile" />
          </p>
        </div>
      </section>

      {/* Six-card grid */}
      <section className="six-card-grid-section" aria-label="Founder, charism, mission, news and newsletter">
        <div className="container">
          <div className="six-card-grid">
            <FounderCard />
            <SecondCard />
            <ThirdCard />
            <FourthCard />
            <EncounterCard />
            <NewsCard />
          </div>
        </div>
      </section>

      {/* Our Presence + Photo Gallery */}
      <section className="presence-gallery-section">
        <div className="container presence-gallery">
          <div>
            <SecTitle id="presence-title">Our Presence</SecTitle>
            <table className="home-table" aria-labelledby="presence-title">
              <caption className="visually-hidden">Communities of the Hyderabad Province by state</caption>
              <tbody>
                {presence.map((row) => (
                  <tr key={row.state}>
                    <th scope="row">
                      <Icon name="pin" /> {row.state.toUpperCase()}
                      <small>
                        {row.count} {row.count === 1 ? "community" : "communities"}
                      </small>
                    </th>
                    <td>{row.places.join(", ")}</td>
                  </tr>
                ))}
                <tr>
                  <th scope="row">
                    <Icon name="globe" /> TOTAL
                    <small>{presenceTotal} communities</small>
                  </th>
                  <td>
                    <Link to="/contact/convents" className="read-more-anim">
                      Convent Directory <span className="arrow" aria-hidden="true">→</span>
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <SecTitle id="gallery-title">Photo Gallery</SecTitle>
            <div className="gallery-grid">
              {albums.map((album) => (
                <Link key={album.id} className="album-box" to={album.href}>
                  <span className="album-box__image">
                    <img src={album.cover} alt="" loading="lazy" decoding="async" width={500} height={375} />
                  </span>
                  <span className="album-box__title">{album.label}</span>
                </Link>
              ))}
            </div>
            <div className="link-box">
              <ThemeButton to="/gallery">View All</ThemeButton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
