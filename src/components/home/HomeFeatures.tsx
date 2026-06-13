import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { glassCardClass } from '../GlassPanel';
import { SectionHeading } from './HomeLayout';

const features = [
  {
    title: 'Live preview',
    description:
      'See every change instantly on the right as you type. No refresh, no guesswork.',
  },
  {
    title: 'Structured sections',
    description:
      'Personal info, summary, skills, experience, education, projects, and certifications — all organized.',
  },
  {
    title: 'Reorder & toggle',
    description:
      'Move entries up or down, hide optional sections, and keep only what belongs on your resume.',
  },
  {
    title: 'Autosave',
    description:
      'Your work saves to localStorage automatically. Close the tab and pick up where you left off.',
  },
  {
    title: 'JSON backup',
    description:
      'Export your data as JSON for backups or import it later on another device.',
  },
  {
    title: 'Print-ready PDF',
    description:
      'Download a clean PDF straight from the builder — no print dialog, no watermarks.',
  },
];

export function HomeFeatures() {
  return (
    <section id="features" className="mt-16 scroll-mt-28">
      <SectionHeading
        subtitle="Features"
        title="Everything you need, nothing you don't"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card
            key={feature.title}
            className={cn(
              glassCardClass,
              'group transition-shadow hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]',
            )}
          >
            <CardHeader className="p-6">
              <CardTitle className="text-base">{feature.title}</CardTitle>
              <CardDescription className="leading-relaxed text-neutral-600">
                {feature.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
