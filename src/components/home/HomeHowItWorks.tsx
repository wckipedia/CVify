import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { glassCardClass } from '../GlassPanel';
import { SectionHeading } from './HomeLayout';

const steps = [
  {
    step: '01',
    title: 'Fill in your details',
    description:
      'Add your experience, education, skills, and anything else that belongs on your resume. The editor guides you section by section.',
  },
  {
    step: '02',
    title: 'Pick a template & layout',
    description:
      'Choose from 11 templates, adjust font size and spacing, and fine-tune the accent color — all from the top bar.',
  },
  {
    step: '03',
    title: 'Export and apply',
    description:
      'Download a polished PDF when you are ready. Your resume data stays in your browser.',
  },
];

export function HomeHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mt-12 scroll-mt-24 sm:mt-16 sm:scroll-mt-28"
    >
      <SectionHeading
        subtitle="How it works"
        title="Three steps to a finished resume"
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {steps.map((item, index) => (
          <Card
            key={item.step}
            className={cn(glassCardClass, 'relative p-6 sm:p-8')}
          >
            {index < steps.length - 1 && (
              <span className="pointer-events-none absolute right-0 top-1/2 hidden h-px w-4 translate-x-full bg-black/10 lg:block" />
            )}
            <Badge
              variant="outline"
              className="text-lg font-bold tracking-tight"
            >
              {item.step}
            </Badge>
            <CardHeader className="p-0 pt-3">
              <CardTitle className="text-lg">{item.title}</CardTitle>
              <CardDescription className="leading-relaxed text-neutral-600">
                {item.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
