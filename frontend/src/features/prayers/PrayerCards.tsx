import { Link } from "react-router-dom";
import { prayerCards, type PrayerCard } from "@/data/prayerCards";

/** The card picture, linked to its full-size image (opens in a new tab). */
function CardImage({ card, sizes }: { card: PrayerCard; sizes: string }) {
  return (
    <a className="prayer-card__image" href={card.image} target="_blank" rel="noopener noreferrer">
      <img
        src={card.imageMd}
        srcSet={`${card.imageMd} 800w, ${card.image} ${card.width}w`}
        sizes={sizes}
        width={card.width}
        height={card.height}
        loading="lazy"
        decoding="async"
        alt={card.alt}
      />
      <span className="visually-hidden"> (opens full size in a new tab)</span>
    </a>
  );
}

/**
 * Prayers of the Congregation.
 * The first card (the Province cover card) is shown on its own, as a card.
 * Every other card follows as a prayer section: a heading, the prayer text on the left and the
 * card picture on the right. A card without a prayer (the short life of Mary Glowrey) shows only its picture.
 */
export function PrayerCards() {
  const [cover, ...prayers] = prayerCards;
  return (
    <>
      <p className="prayer-cards__intro">
        The prayers that unite the Sisters of Jesus Mary Joseph across our communities. Select a card to view it in full size.
      </p>

      {cover && (
        <section id={cover.id} className="prayer-cover" aria-labelledby={`${cover.id}-title`}>
          <CardImage card={cover} sizes="(min-width: 700px) 420px, 92vw" />
          <h2 id={`${cover.id}-title`} className="prayer-card__title">{cover.title}</h2>
        </section>
      )}

      {prayers.map((card) => {
        const hasText = card.text.length > 0;
        return (
          <section
            key={card.id}
            id={card.id}
            className={`prayer-section${hasText ? "" : " prayer-section--image-only"}`}
            aria-labelledby={`${card.id}-title`}
          >
            <h2 id={`${card.id}-title`} className="prayer-section__title">{card.title}</h2>
            <div className="prayer-section__body">
              {hasText && (
                <div className="prayer-section__text" lang={card.lang}>
                  {card.text.map((line, i) => <p key={i}>{line}</p>)}
                </div>
              )}
              <div className="prayer-section__media">
                <CardImage card={card} sizes={hasText ? "(min-width: 900px) 420px, 92vw" : "(min-width: 900px) 820px, 92vw"} />
              </div>
            </div>
          </section>
        );
      })}

      <p className="prayer-cards__related">
        Related pages: <Link to="/mary-glowrey/prayers">Prayers To Mary Glowrey</Link> · <Link to="/spirituality/life-with-god">Our Life With God</Link>
      </p>
    </>
  );
}
