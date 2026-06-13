import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { glassCardClass } from '../GlassPanel';
import { SectionHeading } from './HomeLayout';

const faqs = [
  {
    question: 'Is CVify really free?',
    answer:
      'Yes. There are no subscriptions, no premium templates, and no account required. It is a personal tool I built for myself and shared as-is.',
  },
  {
    question: 'Do I need to create an account?',
    answer:
      'No. Open the builder and start editing. Your progress is saved automatically in your browser.',
  },
  {
    question: 'Will my resume work with ATS systems?',
    answer:
      'The ATS Clean template uses a simple single-column layout with standard headings and no graphics — a safe choice for applicant tracking systems.',
  },
  {
    question: 'Can I use this on multiple devices?',
    answer:
      'Data lives in each browser separately. Export JSON on one device and import it on another to move your resume.',
  },
  {
    question: 'How do I get a PDF?',
    answer:
      'Click Download PDF in the builder. Your resume is saved directly as a PDF file — no print dialog needed.',
  },
];

export function HomeFaq() {
  return (
    <section id="faq" className="mt-12 scroll-mt-24 sm:mt-16 sm:scroll-mt-28">
      <SectionHeading subtitle="FAQ" title="Common questions" />
      <div className="space-y-3">
        {faqs.map((item) => (
          <Card key={item.question} className={glassCardClass}>
            <CardHeader className="p-5 sm:p-6">
              <CardTitle className="text-sm">{item.question}</CardTitle>
              <CardDescription className="leading-relaxed text-neutral-600">
                {item.answer}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
