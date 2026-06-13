import { useState } from 'react';
import { EditorPanel } from '../components/Editor/EditorPanel';
import { GlassPanel } from '../components/GlassPanel';
import { Navbar } from '../components/Navbar';
import { PreviewPanel } from '../components/Preview/PreviewPanel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type MobilePanel = 'editor' | 'preview';

export function BuilderPage() {
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('editor');

  return (
    <div className="min-h-screen pb-8">
      <Navbar />
      <main className="mx-auto max-w-[1600px] px-3 pb-6 pt-28 sm:px-4 sm:pt-32 lg:pt-24 print:block print:p-0 print:pt-0">
        <div className="no-print mb-4 grid grid-cols-2 gap-2 lg:hidden">
          <Button
            type="button"
            variant={mobilePanel === 'editor' ? 'default' : 'secondary'}
            onClick={() => setMobilePanel('editor')}
          >
            Editor
          </Button>
          <Button
            type="button"
            variant={mobilePanel === 'preview' ? 'default' : 'secondary'}
            onClick={() => setMobilePanel('preview')}
          >
            Preview
          </Button>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row print:block">
          <GlassPanel
            className={cn(
              'no-print w-full shrink-0 lg:max-h-[calc(100vh-7rem)] lg:max-w-xl lg:overflow-y-auto lg:overscroll-y-contain',
              mobilePanel !== 'editor' && 'hidden lg:block',
            )}
          >
            <EditorPanel />
          </GlassPanel>
          <GlassPanel
            className={cn(
              'min-w-0 flex-1 print:border-0 print:bg-transparent print:shadow-none print:backdrop-blur-none',
              mobilePanel !== 'preview' && 'hidden lg:block',
            )}
          >
            <PreviewPanel />
          </GlassPanel>
        </div>
      </main>
    </div>
  );
}
