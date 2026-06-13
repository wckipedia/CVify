import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { glassCardClass } from '../GlassPanel';
import { SectionHeading } from './HomeLayout';

const painPoints = [
  'Sign up required before you can preview a template',
  'Paywalls on the designs that actually look professional',
  'Locked exports unless you subscribe',
  'Cluttered editors pushing premium upgrades',
];

const solutions = [
  'Open the builder and start immediately',
  'Eleven polished templates — free, no tiers',
  'Export PDF or JSON anytime, no account',
  'Clean editor focused on your content',
];

export function HomeProblem() {
  return (
    <section className="mt-10">
      <SectionHeading
        subtitle="Why I built this"
        title="Resume sites shouldn't gatekeep your CV"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className={cn(glassCardClass, 'p-6 sm:p-8')}>
          <CardHeader className="p-0">
            <Label className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              The usual experience
            </Label>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <ul className="space-y-3">
              {painPoints.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-sm leading-relaxed text-neutral-600"
                >
                  <span className="mt-0.5 shrink-0 text-neutral-400">—</span>
                  {point}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card
          className={cn(
            glassCardClass,
            'border-neutral-900/20 bg-white/70 p-6 sm:p-8',
          )}
        >
          <CardHeader className="p-0">
            <Label className="text-xs font-semibold uppercase tracking-widest text-neutral-900">
              The CVify way
            </Label>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <ul className="space-y-3">
              {solutions.map((point) => (
                <li
                  key={point}
                  className="flex gap-3 text-sm leading-relaxed text-neutral-700"
                >
                  <span className="mt-0.5 shrink-0 font-semibold text-neutral-900">
                    ✓
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
