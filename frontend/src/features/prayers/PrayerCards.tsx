import { Link } from "react-router-dom";
import { prayerCards } from "@/data/prayerCards";

/** The three Prayers of the Congregation as designed cards. Select a card to open it full size. */
export function PrayerCards() {
  return (
    <>
      <p className="prayer-cards__intro">
        The prayers that unite the Sisters of Jesus Mary Joseph across our communities. Select a prayer card to view it in full size.
      </p>
      <div className="prayer-cards">
        {prayerCards.map((card) => (
          <section key={card.id} id={card.id} className="prayer-card" aria-labelledby={`${card.id}-title`}>
            <a className="prayer-card__image" href={card.image} target="_blank" rel="noopener noreferrer">
              <img
                src={card.imageMd}
                srcSet={`${card.imageMd} 600w, ${card.image} 1122w`}
                sizes="(min-width: 1100px) 300px, (min-width: 700px) 45vw, 92vw"
                width={1122}
                height={1402}
                loading="lazy"
                decoding="async"
                alt={card.alt}
              />
              <span className="visually-hidden"> (opens full size in a new tab)</span>
            </a>
            <h2 id={`${card.id}-title`} className="prayer-card__title">{card.title}</h2>
            <details className="prayer-card__text">
              <summary>Read the prayer as text</summary>
              {card.text.map((line, i) => <p key={i}>{line}</p>)}
            </details>
          </section>
        ))}
      </div>
      <p className="prayer-cards__related">
        Related pages: <Link to="/mary-glowrey/prayers">Prayers To Mary Glowrey</Link> · <Link to="/spirituality/life-with-god">Our Life With God</Link>
      </p>
    </>
  );
}
