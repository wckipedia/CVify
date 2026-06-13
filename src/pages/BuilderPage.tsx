import { EditorPanel } from '../components/Editor/EditorPanel';
import { GlassPanel } from '../components/GlassPanel';
import { Navbar } from '../components/Navbar';
import { PreviewPanel } from '../components/Preview/PreviewPanel';

export function BuilderPage() {
  return (
    <div className="min-h-screen pb-8">
      <Navbar />
      <main className="mx-auto flex max-w-[1600px] flex-col gap-6 px-4 pb-6 pt-24 lg:flex-row print:block print:p-0 print:pt-0">
        <GlassPanel className="no-print w-full shrink-0 lg:max-h-[calc(100vh-7rem)] lg:max-w-xl lg:overflow-y-auto lg:overscroll-y-contain">
          <EditorPanel />
        </GlassPanel>
        <GlassPanel className="min-w-0 flex-1 print:border-0 print:bg-transparent print:shadow-none print:backdrop-blur-none">
          <PreviewPanel />
        </GlassPanel>
      </main>
    </div>
  );
}
