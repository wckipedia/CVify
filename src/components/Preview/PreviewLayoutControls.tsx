import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useResumeStore } from '../../store/resumeStore';
import { getTemplateName, templateUsesAccentColor } from '../templates/registry';
import { AccentColorPicker } from './AccentColorPicker';
import { TemplateBrowser } from './TemplateBrowser';

export function PreviewLayoutControls() {
  const layout = useResumeStore((s) => s.data.layout);
  const setLayout = useResumeStore((s) => s.setLayout);
  const [browserOpen, setBrowserOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setBrowserOpen(true)}
          >
            View templates
          </Button>
          <span className="text-xs text-neutral-500">
            {getTemplateName(layout.template)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Label className="mb-0 shrink-0 text-sm normal-case tracking-normal text-neutral-600">
            Size
          </Label>
          <Select
            value={layout.fontSize}
            onValueChange={(fontSize) =>
              setLayout({ fontSize: fontSize as 'S' | 'M' | 'L' })
            }
          >
            <SelectTrigger className="w-[72px]" size="sm">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="S">S</SelectItem>
              <SelectItem value="M">M</SelectItem>
              <SelectItem value="L">L</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label className="mb-0 shrink-0 text-sm normal-case tracking-normal text-neutral-600">
            Spacing
          </Label>
          <Select
            value={layout.sectionSpacing}
            onValueChange={(sectionSpacing) =>
              setLayout({
                sectionSpacing: sectionSpacing as 'compact' | 'normal',
              })
            }
          >
            <SelectTrigger className="w-[110px]" size="sm">
              <SelectValue placeholder="Spacing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compact">Compact</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {templateUsesAccentColor(layout.template) && (
          <div className="flex items-center gap-2">
            <Label className="mb-0 shrink-0 text-sm normal-case tracking-normal text-neutral-600">
              Accent
            </Label>
            <AccentColorPicker
              value={layout.accentColor}
              onChange={(accentColor) => setLayout({ accentColor })}
            />
          </div>
        )}
      </div>

      <TemplateBrowser open={browserOpen} onClose={() => setBrowserOpen(false)} />
    </>
  );
}
