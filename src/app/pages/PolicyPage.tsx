import { Link, useParams } from 'react-router-dom';
import { getPolicies } from '../config/policies';

type PolicyPageProps = {
  forcedSlug?: string;
};

export function PolicyPage({ forcedSlug }: PolicyPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const resolvedSlug = forcedSlug || slug;
  const policy = resolvedSlug ? getPolicies()[resolvedSlug] : undefined;

  if (!policy) {
    return (
      <main className="container mx-auto px-4 pt-36 pb-12 min-h-screen">
        <h1 className="text-3xl font-bold text-foreground">Page not found</h1>
        <p className="text-muted-foreground mt-2">This policy page doesn’t exist.</p>
        <div className="mt-6">
          <Link to="/" className="text-primary font-semibold hover:underline">
            Back to Home →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 pt-36 pb-12 min-h-screen">
      <div className="max-w-4xl">
        <Link
          to="/"
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          ← Back
        </Link>

        <h1 className="mt-6 text-4xl font-bold text-foreground">{policy.title}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{policy.intro}</p>
        <p className="mt-1 text-sm text-muted-foreground">Last updated: {policy.lastUpdated}</p>

        {policy.sections.map((section) => (
          <div
            key={section.heading}
            className="mt-6 bg-white rounded-3xl border border-border shadow-sm p-6 sm:p-10"
          >
            <h2 className="text-xl font-bold text-foreground">{section.heading}</h2>
            <ul className="mt-4 space-y-3 list-disc pl-5 text-foreground">
              {section.points.map((p) => (
                <li key={p} className="leading-relaxed">
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
