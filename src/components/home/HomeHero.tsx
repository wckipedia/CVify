import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GlassPanel, glassCardClass } from '../GlassPanel';
import { cn } from '@/lib/utils';

const badges = ['Free forever', 'No sign-up', 'Runs in your browser'];

export function HomeHero() {
  return (
    <section className="relative">
      <GlassPanel className="overflow-hidden px-5 py-10 sm:px-10 sm:py-16">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-neutral-900/[0.03] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-neutral-900/[0.04] blur-3xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="text-center lg:text-left">
            <div className="mb-5 flex flex-wrap justify-center gap-2 lg:justify-start">
              {badges.map((badge) => (
                <Badge key={badge} variant="secondary">
                  {badge}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-neutral-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              Build a resume you like.
              <span className="mt-1 block text-neutral-400">
                Without the hassle.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg lg:mx-0">
              I built CVify after one too many sign-up walls and paid templates.
              Polished designs, full control, no account needed.
            </p>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-neutral-500 lg:mx-0">
              Everything runs in your browser. Switch between editor and preview,
              export when you are ready. No subscriptions, no upsells, no
              &ldquo;create an account to download.&rdquo;
            </p>

            <div className="mt-8 flex justify-center lg:justify-start">
              <Button asChild size="lg">
                <Link to="/builder">Start building</Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <Card
              className={cn(
                glassCardClass,
                'rotate-1 border-neutral-600/60 bg-white/70 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.08)]',
              )}
            >
              <CardContent className="rounded-xl bg-white p-5 shadow-inner">
                <Badge variant="outline" className="text-[10px] uppercase tracking-widest">
                  Live preview
                </Badge>
                <h3 className="mt-2 text-lg font-bold text-neutral-900">
                  Jane Doe
                </h3>
                <p className="text-sm text-neutral-600">Software Engineer</p>
                <div className="mt-3 h-px bg-neutral-200" />
                <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-neutral-800">
                  Experience
                </p>
                <p className="mt-1 text-xs text-neutral-700">
                  Software Engineer — Acme Corp
                </p>
                <ul className="mt-1 list-disc pl-4 text-[11px] text-neutral-600">
                  <li>Built customer-facing web applications</li>
                  <li>Shipped features with cross-functional teams</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </GlassPanel>
    </section>
  );
}
