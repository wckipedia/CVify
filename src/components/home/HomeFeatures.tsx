import { cn } from '@/lib/utils';
import { glassCardClass } from '../GlassPanel';
import { SectionHeading } from './HomeLayout';

const features = [
  {
    title: 'Live preview',
    bullets: ['Instant updates', 'No refresh needed', 'Always visible'],
  },
  {
    title: 'Structured sections',
    bullets: ['Guided resume fields', 'Everything organized', 'Easy to scan'],
  },
  {
    title: 'Reorder & toggle',
    bullets: [
      'Move entries easily',
      'Hide optional sections',
      'Keep it focused',
    ],
  },
  {
    title: 'Autosave',
    bullets: ['Saves in-browser', 'Pick up later', 'No account needed'],
  },
  {
    title: 'Print-ready PDF',
    bullets: ['Clean PDF export', 'No watermark', 'Ready to send'],
  },
];

export function HomeFeatures() {
  return (
    <section
      id="features"
      className="mt-12 scroll-mt-24 sm:mt-16 sm:scroll-mt-28"
    >
      <SectionHeading
        subtitle="Features"
        title="Build faster, export cleaner"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {features.map((feature) => (
          <article
            key={feature.title}
            className={cn(
              glassCardClass,
              'flex min-h-[210px] flex-col rounded-2xl p-5 transition-transform duration-200 hover:-translate-y-0.5 sm:p-6',
            )}
          >
            <div className="min-h-8">
              <h3 className="text-base font-semibold leading-snug text-neutral-900">
                {feature.title}
              </h3>
            </div>
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-neutral-600">
              {feature.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-neutral-400" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
