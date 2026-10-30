import { PageHeader } from "@/components/common/PageHeader";
import { PageShell } from "@/components/common/PageShell";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Seo } from "@/components/seo/Seo";
import { founderReflections, glowreyReflections, type Reflection } from "@/data/homeFeatures";

const anchor = (set: string, i: number) => `${set}-${i}`;

function ReflectionList({ id, title, items }: { id: string; title: string; items: Reflection[] }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby={`${id}-title`} className="reflections">
      <h2 id={`${id}-title`}>{title}</h2>
      {items.map((r, i) => (
        <article key={`${r.month}-${r.title}`} id={anchor(id, i)} className="panel reflection">
          <div className="card__meta">
            <span className="chip">{r.month}</span>
          </div>
          <h3>{r.title}</h3>
          {r.text.split(/\n\s*\n/).map((p, j) => (
            <p key={j}>{p.trim()}</p>
          ))}
        </article>
      ))}
    </section>
  );
}

export function ReflectionsPage() {
  const none = !founderReflections.length && !glowreyReflections.length;
  return (
    <>
      <Seo title="Monthly Reflections" description="Monthly reflections on the life and spirituality of our Founder and Ven. Mary Glowrey." path="/reflections" />
      <PageHeader eyebrow="Spirituality" title="Monthly Reflections" description="Reflections for each month, drawn from the life of our Founder and Ven. Mary Glowrey." breadcrumbs={[{ label: "Spirituality", href: "/who-we-are/founder" }]} />
      <PageShell sidebar={false}>
        {none ? (
          <EmptyState icon="book" title="Reflections will appear here" description="The monthly reflections are published here each month." />
        ) : (
          <div className="stack">
            <ReflectionList id="founder" title="Our Founder — Monthly Reflection" items={founderReflections} />
            <ReflectionList id="glowrey" title="Ven. Mary Glowrey — Monthly Reflection" items={glowreyReflections} />
            <p className="text-muted">
              More reflections:{" "}
              <a href="https://congregationjmj.org/mary-glowrey-inspirations" target="_blank" rel="noopener noreferrer">
                Congregation of Jesus Mary Joseph — Mary Glowrey inspirations
              </a>{" "}
              · <a href="/mary-glowrey/reflection">Reflection on Mary Glowrey</a>
            </p>
          </div>
        )}
      </PageShell>
    </>
  );
}
