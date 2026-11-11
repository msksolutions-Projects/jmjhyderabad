import { Icon } from "@/components/ui/Icon";
import { formatBytes } from "@/features/publications/publications.service";

/**
 * A downloadable PDF. With a `thumbnail` (an image of the first page) the card shows the page preview
 * beside the title (without the file-size chip); selecting the preview opens the PDF.
 */
export function DocumentCard({ title, file, bytes, description, thumbnail }: { title: string; file: string; bytes: number; description?: string; thumbnail?: string }) {
  return (
    <article className={thumbnail ? "card doc-card doc-card--thumb" : "card"}>
      <div className="card__body">
        {thumbnail ? (
          <div className="doc-card__layout">
            <a className="doc-card__thumb" href={file} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
              <img src={thumbnail} alt="" width={636} height={900} loading="lazy" decoding="async" />
            </a>
            <div className="doc-card__info">
              <h3>{title}</h3>
              {description && <p>{description}</p>}
            </div>
          </div>
        ) : (
          <>
            <div className="row row--between" style={{ marginBottom: 12 }}>
              <span className="card__icon" style={{ marginBottom: 0 }}>
                <Icon name="file" />
              </span>
              <span className="chip chip--outline">PDF · {formatBytes(bytes)}</span>
            </div>
            <h3>{title}</h3>
            {description && <p>{description}</p>}
          </>
        )}
      </div>
      <div className="card__foot">
        <a className="btn btn--sm" href={file} target="_blank" rel="noopener noreferrer" aria-label={`View ${title}`}>
          <Icon name="external" /> View
        </a>
        <a className="btn btn--sm btn--outline" href={file} download aria-label={`Download ${title}`}>
          <Icon name="download" /> Download
        </a>
      </div>
    </article>
  );
}
