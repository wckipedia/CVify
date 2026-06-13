import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GlassPanel } from '../GlassPanel';

export function HomeCta() {
  return (
    <section className="mt-16">
      <GlassPanel className="relative overflow-hidden px-6 py-12 text-center sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.04),transparent_55%)]" />
        <div className="relative">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            Ready to skip the sign-up screen?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-neutral-600 sm:text-base">
            Jump straight into the builder. Pick a template, fill in your
            details, and export a resume you actually want to send — free, fast,
            and entirely in your browser.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link to="/builder">Start building your resume</Link>
          </Button>
        </div>
      </GlassPanel>
    </section>
  );
}
