import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { glassCardClass } from '../GlassPanel';
import { SectionHeading } from './HomeLayout';

const privacyPoints = [
  {
    title: 'No server, no database',
    description:
      'CVify is a static web app. There is no backend storing your personal information.',
  },
  {
    title: 'Local autosave only',
    description:
      'Edits are saved to your browser’s localStorage. Clear site data and your saved resume is cleared too.',
  },
  {
    title: 'You own your PDF',
    description:
      'PDF files are generated on your device. Download them and use them anywhere, with no watermark.',
  },
];

export function HomePrivacy() {
  return (
    <section className="mt-16">
      <SectionHeading
        subtitle="Privacy"
        title="Your resume stays on your device"
      />
      <Card className={`${glassCardClass} p-6 sm:p-8`}>
        <CardContent className="grid gap-6 p-0 md:grid-cols-3">
          {privacyPoints.map((point) => (
            <CardHeader key={point.title} className="p-0">
              <CardTitle className="text-sm">{point.title}</CardTitle>
              <CardDescription className="leading-relaxed text-neutral-600">
                {point.description}
              </CardDescription>
            </CardHeader>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
