import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ReorderButtons } from '../ReorderButtons';
import { useResumeStore } from '../../store/resumeStore';
import { EditorEntryCard } from './EditorEntryCard';
import { BulletListEditor, Field } from './EditorFields';

export function ProjectsSection() {
  const projects = useResumeStore((s) => s.data.projects);
  const visible = useResumeStore((s) => s.data.visibility.projects);
  const addProject = useResumeStore((s) => s.addProject);
  const updateProject = useResumeStore((s) => s.updateProject);
  const removeProject = useResumeStore((s) => s.removeProject);
  const moveProject = useResumeStore((s) => s.moveProject);
  const updateProjectBullet = useResumeStore((s) => s.updateProjectBullet);
  const addProjectBullet = useResumeStore((s) => s.addProjectBullet);
  const removeProjectBullet = useResumeStore((s) => s.removeProjectBullet);
  const setVisibility = useResumeStore((s) => s.setVisibility);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-neutral-900">Projects</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="projects-visible"
              checked={visible}
              onCheckedChange={(checked) =>
                setVisibility({ projects: checked === true })
              }
            />
            <Label
              htmlFor="projects-visible"
              className="mb-0 text-sm font-normal normal-case tracking-normal text-neutral-600"
            >
              Show in resume
            </Label>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={addProject}>
            + Add project
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        {projects.map((entry, index) => (
          <EditorEntryCard
            key={entry.id}
            position={index + 1}
            actions={
              <ReorderButtons
                onMoveUp={() => moveProject(entry.id, 'up')}
                onMoveDown={() => moveProject(entry.id, 'down')}
                onRemove={() => removeProject(entry.id)}
                canMoveUp={index > 0}
                canMoveDown={index < projects.length - 1}
              />
            }
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Project name"
                value={entry.name}
                onChange={(name) => updateProject(entry.id, { name })}
              />
              <Field
                label="Link (optional)"
                value={entry.link}
                onChange={(link) => updateProject(entry.id, { link })}
                placeholder="https://example.com/..."
              />
            </div>
            <BulletListEditor
              bullets={entry.bullets}
              onChange={(i, value) => updateProjectBullet(entry.id, i, value)}
              onAdd={() => addProjectBullet(entry.id)}
              onRemove={(i) => removeProjectBullet(entry.id, i)}
            />
          </EditorEntryCard>
        ))}
      </div>
    </section>
  );
}
