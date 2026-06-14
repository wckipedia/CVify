import { ReorderButtons } from '../ReorderButtons';
import { useResumeStore } from '../../store/resumeStore';
import { EditorEntryCard } from './EditorEntryCard';
import {
  BulletListEditor,
  Field,
  SectionHeader,
} from './EditorFields';

export function ExperienceSection() {
  const experience = useResumeStore((s) => s.data.experience);
  const addExperience = useResumeStore((s) => s.addExperience);
  const updateExperience = useResumeStore((s) => s.updateExperience);
  const removeExperience = useResumeStore((s) => s.removeExperience);
  const moveExperience = useResumeStore((s) => s.moveExperience);
  const updateExperienceBullet = useResumeStore(
    (s) => s.updateExperienceBullet,
  );
  const addExperienceBullet = useResumeStore((s) => s.addExperienceBullet);
  const removeExperienceBullet = useResumeStore(
    (s) => s.removeExperienceBullet,
  );

  return (
    <section>
      <SectionHeader
        title="Experience"
        onAdd={addExperience}
        addLabel="Add role"
      />
      <div className="space-y-3">
        {experience.map((entry, index) => (
          <EditorEntryCard
            key={entry.id}
            position={index + 1}
            actions={
              <ReorderButtons
                onMoveUp={() => moveExperience(entry.id, 'up')}
                onMoveDown={() => moveExperience(entry.id, 'down')}
                onRemove={() => removeExperience(entry.id)}
                canMoveUp={index > 0}
                canMoveDown={index < experience.length - 1}
              />
            }
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Role"
                value={entry.role}
                onChange={(role) => updateExperience(entry.id, { role })}
              />
              <Field
                label="Company"
                value={entry.company}
                onChange={(company) => updateExperience(entry.id, { company })}
              />
              <Field
                label="Location"
                value={entry.location}
                onChange={(location) =>
                  updateExperience(entry.id, { location })
                }
                className="sm:col-span-2"
              />
              <Field
                label="Start date"
                value={entry.startDate}
                onChange={(startDate) =>
                  updateExperience(entry.id, { startDate })
                }
                placeholder="2022-01"
              />
              <Field
                label="End date"
                value={entry.endDate}
                onChange={(endDate) => updateExperience(entry.id, { endDate })}
                placeholder="Present"
              />
            </div>
            <BulletListEditor
              bullets={entry.bullets}
              onChange={(i, value) =>
                updateExperienceBullet(entry.id, i, value)
              }
              onAdd={() => addExperienceBullet(entry.id)}
              onRemove={(i) => removeExperienceBullet(entry.id, i)}
            />
          </EditorEntryCard>
        ))}
      </div>
    </section>
  );
}
