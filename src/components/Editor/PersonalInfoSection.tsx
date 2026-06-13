import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useResumeStore } from '../../store/resumeStore';
import { Field, SectionHeader, TextAreaField } from './EditorFields';

export function PersonalInfoSection() {
  const personalInfo = useResumeStore((s) => s.data.personalInfo);
  const setPersonalInfo = useResumeStore((s) => s.setPersonalInfo);

  return (
    <section>
      <SectionHeader title="Personal Info" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label="Name"
          value={personalInfo.name}
          onChange={(name) => setPersonalInfo({ name })}
          placeholder="Jane Doe"
        />
        <Field
          label="Title"
          value={personalInfo.title}
          onChange={(title) => setPersonalInfo({ title })}
          placeholder="Software Engineer"
        />
        <Field
          label="Email"
          value={personalInfo.email}
          onChange={(email) => setPersonalInfo({ email })}
          placeholder="jane@example.com"
          type="email"
        />
        <Field
          label="Phone"
          value={personalInfo.phone}
          onChange={(phone) => setPersonalInfo({ phone })}
          placeholder="+1 555 123 4567"
        />
        <Field
          label="Location"
          value={personalInfo.location}
          onChange={(location) => setPersonalInfo({ location })}
          placeholder="City, State"
        />
        <Field
          label="Website"
          value={personalInfo.website}
          onChange={(website) => setPersonalInfo({ website })}
          placeholder="https://example.com"
        />
        <Field
          label="LinkedIn"
          value={personalInfo.linkedin}
          onChange={(linkedin) => setPersonalInfo({ linkedin })}
          placeholder="linkedin.com/in/username"
        />
        <Field
          label="Additional link"
          value={personalInfo.github}
          onChange={(github) => setPersonalInfo({ github })}
          placeholder="Portfolio, profile, or other link"
        />
      </div>
    </section>
  );
}

export function SummarySection() {
  const summary = useResumeStore((s) => s.data.summary);
  const visible = useResumeStore((s) => s.data.visibility.summary);
  const setSummary = useResumeStore((s) => s.setSummary);
  const setVisibility = useResumeStore((s) => s.setVisibility);

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-neutral-900">Summary</h2>
        <div className="flex items-center gap-2">
          <Checkbox
            id="summary-visible"
            checked={visible}
            onCheckedChange={(checked) =>
              setVisibility({ summary: checked === true })
            }
          />
          <Label
            htmlFor="summary-visible"
            className="mb-0 text-sm font-normal normal-case tracking-normal text-neutral-600"
          >
            Show in resume
          </Label>
        </div>
      </div>
      <TextAreaField
        label="Professional summary"
        value={summary}
        onChange={setSummary}
        placeholder="Brief overview of your experience and goals..."
        rows={5}
      />
    </section>
  );
}
