import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  className,
}: FieldProps) {
  return (
    <div className={cn('block', className)}>
      <Label htmlFor={label}>{label}</Label>
      <Input
        id={label}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: TextAreaFieldProps) {
  return (
    <div className="block">
      <Label htmlFor={label}>{label}</Label>
      <Textarea
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  onAdd?: () => void;
  addLabel?: string;
}

export function SectionHeader({ title, onAdd, addLabel }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
      {onAdd ? (
        <Button type="button" variant="ghost" size="sm" onClick={onAdd}>
          + {addLabel ?? 'Add'}
        </Button>
      ) : null}
    </div>
  );
}

interface EntryCardProps {
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function EntryCard({ children, actions }: EntryCardProps) {
  return (
    <Card>
      <CardContent>
        {actions && <div className="mb-3 flex justify-end">{actions}</div>}
        <div className="space-y-3">{children}</div>
      </CardContent>
    </Card>
  );
}

interface BulletListEditorProps {
  bullets: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function BulletListEditor({
  bullets,
  onChange,
  onAdd,
  onRemove,
}: BulletListEditorProps) {
  return (
    <div className="space-y-2">
      <Label>Bullet points</Label>
      {bullets.map((bullet, index) => (
        <div key={index} className="flex gap-2">
          <Input
            className="min-w-0 flex-1"
            value={bullet}
            onChange={(e) => onChange(index, e.target.value)}
            placeholder="Achievement or responsibility"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon-sm"
            onClick={() => onRemove(index)}
            aria-label="Remove bullet"
          >
            ✕
          </Button>
        </div>
      ))}
      <Button type="button" variant="ghost" size="sm" onClick={onAdd}>
        + Add bullet
      </Button>
    </div>
  );
}
