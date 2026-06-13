import { ReorderButtons } from '../ReorderButtons';
import { useResumeStore } from '../../store/resumeStore';
import { EditorEntryCard } from './EditorEntryCard';
import { Field, SectionHeader, TextAreaField } from './EditorFields';

export function EducationSection() {
  const education = useResumeStore((s) => s.data.education);
  const addEducation = useResumeStore((s) => s.addEducation);
  const updateEducation = useResumeStore((s) => s.updateEducation);
  const removeEducation = useResumeStore((s) => s.removeEducation);
  const moveEducation = useResumeStore((s) => s.moveEducation);

  return (
    <section>
      <SectionHeader
        title="Education"
        onAdd={addEducation}
        addLabel="Add school"
      />
      <div className="space-y-3">
        {education.map((entry, index) => (
          <EditorEntryCard
            key={entry.id}
            position={index + 1}
            actions={
              <ReorderButtons
                onMoveUp={() => moveEducation(entry.id, 'up')}
                onMoveDown={() => moveEducation(entry.id, 'down')}
                onRemove={() => removeEducation(entry.id)}
                canMoveUp={index > 0}
                canMoveDown={index < education.length - 1}
              />
            }
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="School"
                value={entry.school}
                onChange={(school) => updateEducation(entry.id, { school })}
              />
              <Field
                label="Degree"
                value={entry.degree}
                onChange={(degree) => updateEducation(entry.id, { degree })}
              />
              <Field
                label="Start date"
                value={entry.startDate}
                onChange={(startDate) =>
                  updateEducation(entry.id, { startDate })
                }
              />
              <Field
                label="End date"
                value={entry.endDate}
                onChange={(endDate) => updateEducation(entry.id, { endDate })}
              />
            </div>
            <TextAreaField
              label="Notes (optional)"
              value={entry.notes}
              onChange={(notes) => updateEducation(entry.id, { notes })}
              rows={2}
            />
          </EditorEntryCard>
        ))}
      </div>
    </section>
  );
}
