import type { SkillCategory } from '../../types/resume';
import { ReorderButtons } from '../ReorderButtons';
import { useResumeStore } from '../../store/resumeStore';
import { EditorEntryCard } from './EditorEntryCard';
import { Field, SectionHeader } from './EditorFields';

function SkillCardFields({
  category,
  onUpdate,
}: {
  category: SkillCategory;
  onUpdate: (updates: Partial<SkillCategory>) => void;
}) {
  return (
    <>
      <Field
        label="Category"
        value={category.name}
        onChange={(name) => onUpdate({ name })}
        placeholder="Languages"
      />
      <Field
        label="Skills (comma-separated)"
        value={category.skills}
        onChange={(skills) => onUpdate({ skills })}
        placeholder="TypeScript, Python, Go"
      />
    </>
  );
}

export function SkillsSection() {
  const skills = useResumeStore((s) => s.data.skills);
  const addSkillCategory = useResumeStore((s) => s.addSkillCategory);
  const updateSkillCategory = useResumeStore((s) => s.updateSkillCategory);
  const removeSkillCategory = useResumeStore((s) => s.removeSkillCategory);
  const moveSkillCategory = useResumeStore((s) => s.moveSkillCategory);

  return (
    <section>
      <SectionHeader
        title="Skills"
        onAdd={addSkillCategory}
        addLabel="Add category"
      />
      <div className="space-y-3">
        {skills.map((category, index) => (
          <EditorEntryCard
            key={category.id}
            position={index + 1}
            actions={
              <ReorderButtons
                onMoveUp={() => moveSkillCategory(category.id, 'up')}
                onMoveDown={() => moveSkillCategory(category.id, 'down')}
                onRemove={() => removeSkillCategory(category.id)}
                canMoveUp={index > 0}
                canMoveDown={index < skills.length - 1}
              />
            }
          >
            <SkillCardFields
              category={category}
              onUpdate={(updates) => updateSkillCategory(category.id, updates)}
            />
          </EditorEntryCard>
        ))}
      </div>
    </section>
  );
}
