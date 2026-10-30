import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/common/PageHeader";
import { PageShell } from "@/components/common/PageShell";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { LoadingSkeleton } from "@/components/feedback/LoadingSkeleton";
import { Seo } from "@/components/seo/Seo";
import { Icon } from "@/components/ui/Icon";
import { formatBytes } from "@/features/publications/publications.service";
import { fetchIssues, issueLinks, type Kind } from "@/features/newsflash/newsflash";


const pages: Record<Kind, { title: string; path: string; description: string }> = {
  jubilee: {
    title: "Jubilee Vibes",
    path: "/news-flash/jubilee-vibes",
    description: "Jubilee celebrations of our sisters and communities — thanksgiving for years of faithful service.",
  },
  newsflash: {
    title: "News Flash",
    path: "/news-flash",
    description: "Short news bulletins from the JMJ Hyderabad Province.",
  },
};

export function NewsFlashPage({ kind }: { kind: Kind }) {
  const page = pages[kind];
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["newsflash", kind],
    queryFn: ({ signal }) => fetchIssues(kind, signal),
    staleTime: 10 * 60 * 1000,
  });

  return (
    <>
      <Seo title={page.title} description={page.description} path={page.path} />
      <PageHeader eyebrow="News Flash" title={page.title} description={page.description} breadcrumbs={[{ label: "News Flash", href: "/news-flash" }]} />
      <PageShell>
        {isPending && <LoadingSkeleton rows={3} height={200} />}
        {isError && <ErrorState title="This list did not load" message={(error as Error).message} onRetry={() => void refetch()} />}
        {data && data.length === 0 && (
          <EmptyState icon="file" title={`${page.title} issues will appear here`} description="The first issue is being prepared and will be published soon." />
        )}
        {data && data.length > 0 && (
          <>
            <h2 className="visually-hidden">{page.title} issues</h2>
            <ul className="reset-list flash-grid">
              {data.map((issue) => {
                const links = issueLinks(issue);
                const available = Boolean(issue.file) && issue.status !== "pending";
                return (
                  <li key={issue.title}>
                    <article className="flash-card">
                      {available ? <a className="flash-card__cover" href={links.view} target="_blank" rel="noopener noreferrer" aria-label={`Open ${issue.title} (PDF)`}>
                        {links.cover ? (
                          <img
                            src={links.cover}
                            alt=""
                            width={340}
                            height={480}
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            onError={(e) => e.currentTarget.parentElement?.classList.add("is-broken")}
                          />
                        ) : (
                          <span className="flash-card__placeholder">
                            <Icon name="file" />
                          </span>
                        )}
                      </a> : <div className="flash-card__cover flash-card__cover--pending" aria-label={`${issue.title} is awaiting upload`}>
                        <Icon name="file" />
                        <span>PDF awaiting upload</span>
                      </div>}
                      <div className="flash-card__body">
                        <h3>{issue.title}</h3>
                        <p className="flash-card__meta">
                          {issue.date && <span>{issue.date}</span>}
                          {issue.bytes ? <span>PDF · {formatBytes(issue.bytes)}</span> : <span>PDF</span>}
                        {issue.bytes && issue.bytes > 60 * 1024 * 1024 ? <span>Large file — best opened on Wi-Fi</span> : null}
                        </p>
                        {available ? <div className="row">
                          <a className="btn btn--sm" href={links.view} target="_blank" rel="noopener noreferrer">
                            <Icon name="eye" /> View PDF
                          </a>
                          <a className="btn btn--sm btn--outline" href={links.download} download>
                            <Icon name="download" /> Download
                          </a>
                        </div> : <p className="flash-card__pending-note">This issue will be available when its PDF is supplied.</p>}
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </PageShell>
    </>
  );
}

export const JubileeVibesPage = () => <NewsFlashPage kind="jubilee" />;
export const NewsFlashListPage = () => <NewsFlashPage kind="newsflash" />;
