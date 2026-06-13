import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ReorderButtons } from '../ReorderButtons';
import { useResumeStore } from '../../store/resumeStore';
import { EditorEntryCard } from './EditorEntryCard';
import { Field } from './EditorFields';

export function CertificationsSection() {
  const certifications = useResumeStore((s) => s.data.certifications);
  const visible = useResumeStore((s) => s.data.visibility.certifications);
  const addCertification = useResumeStore((s) => s.addCertification);
  const updateCertification = useResumeStore((s) => s.updateCertification);
  const removeCertification = useResumeStore((s) => s.removeCertification);
  const moveCertification = useResumeStore((s) => s.moveCertification);
  const setVisibility = useResumeStore((s) => s.setVisibility);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-neutral-900">
          Certifications
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="certifications-visible"
              checked={visible}
              onCheckedChange={(checked) =>
                setVisibility({ certifications: checked === true })
              }
            />
            <Label
              htmlFor="certifications-visible"
              className="mb-0 text-sm font-normal normal-case tracking-normal text-neutral-600"
            >
              Show in resume
            </Label>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addCertification}
          >
            + Add certification
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        {certifications.map((entry, index) => (
          <EditorEntryCard
            key={entry.id}
            position={index + 1}
            actions={
              <ReorderButtons
                onMoveUp={() => moveCertification(entry.id, 'up')}
                onMoveDown={() => moveCertification(entry.id, 'down')}
                onRemove={() => removeCertification(entry.id)}
                canMoveUp={index > 0}
                canMoveDown={index < certifications.length - 1}
              />
            }
          >
            <div className="grid gap-3 sm:grid-cols-3">
              <Field
                label="Name"
                value={entry.name}
                onChange={(name) => updateCertification(entry.id, { name })}
              />
              <Field
                label="Issuer"
                value={entry.issuer}
                onChange={(issuer) => updateCertification(entry.id, { issuer })}
              />
              <Field
                label="Date"
                value={entry.date}
                onChange={(date) => updateCertification(entry.id, { date })}
              />
            </div>
          </EditorEntryCard>
        ))}
      </div>
    </section>
  );
}
