import { Check, X } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { TemplateId } from '../../types/resume';
import { useResumeStore } from '../../store/resumeStore';
import {
  getTemplateComponent,
  getTemplateName,
  TEMPLATES,
} from '../templates/registry';

interface TemplateBrowserProps {
  open: boolean;
  onClose: () => void;
}

const LOOP_COPIES = 3;
const SLIDE_COUNT = TEMPLATES.length;

function TemplateSlide({
  templateId,
  selected,
  onSelect,
  onConfirm,
}: {
  templateId: TemplateId;
  selected: boolean;
  onSelect: () => void;
  onConfirm: () => void;
}) {
  const data = useResumeStore((s) => s.data);
  const Template = getTemplateComponent(templateId);
  const previewData = {
    ...data,
    layout: { ...data.layout, template: templateId },
  };
  const templateName = getTemplateName(templateId);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        if (selected) {
          onConfirm();
        } else {
          onSelect();
        }
      }}
      className={cn(
        'group flex w-[8.5in] max-w-[calc(100vw-3rem)] shrink-0 flex-col overflow-hidden rounded-xl border text-left shadow-sm transition-all duration-300 ease-out',
        selected
          ? 'cursor-pointer border-neutral-700 bg-white/95 opacity-100 shadow-[0_12px_40px_rgba(0,0,0,0.14)] ring-1 ring-neutral-900/10'
          : 'border-neutral-600/45 bg-white/70 opacity-50 hover:border-neutral-600 hover:opacity-80 hover:shadow-md',
      )}
      aria-label={
        selected
          ? `Use ${templateName} template`
          : `Preview ${templateName} template`
      }
      aria-pressed={selected}
    >
      <div
        className={cn(
          'border-b px-4 py-3 sm:px-5 sm:py-3.5',
          selected
            ? 'border-neutral-600/30 bg-white'
            : 'border-neutral-600/20 bg-white/90 backdrop-blur-sm',
        )}
      >
        {selected ? (
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
            Currently previewing
          </p>
        ) : null}
        <h3
          className={cn(
            'font-bold tracking-tight text-neutral-900',
            selected
              ? 'mt-0.5 text-xl sm:text-2xl'
              : 'text-base sm:text-lg',
          )}
        >
          {templateName}
        </h3>
      </div>

      <div
        className={cn(
          'overflow-y-auto bg-white p-6 text-left sm:p-10',
          'max-h-[calc(100vh-11.5rem)] min-h-[min(11in,calc(100vh-11.5rem))]',
        )}
      >
        <Template data={previewData} />
      </div>

      {selected ? (
        <div className="flex items-center justify-center gap-2 border-t border-neutral-800 bg-neutral-900 px-4 py-3 transition-colors group-hover:bg-neutral-800">
          <Check className="size-3.5 text-white" strokeWidth={2.5} />
          <span className="text-sm font-semibold text-white">
            Use this template
          </span>
        </div>
      ) : (
        <div className="border-t border-neutral-600/15 bg-neutral-50/90 px-4 py-2.5 text-center">
          <span className="text-xs font-medium text-neutral-500">
            Click to preview
          </span>
        </div>
      )}
    </button>
  );
}

export function TemplateBrowser({ open, onClose }: TemplateBrowserProps) {
  const layout = useResumeStore((s) => s.data.layout);
  const setLayout = useResumeStore((s) => s.setLayout);
  const [pendingTemplate, setPendingTemplate] = useState<TemplateId>(
    layout.template,
  );
  const [translateX, setTranslateX] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideIndexRef = useRef(SLIDE_COUNT);
  const loopStrideRef = useRef(0);

  const slides = useMemo(
    () =>
      Array.from({ length: LOOP_COPIES }, (_, copy) =>
        TEMPLATES.map((template) => ({
          template,
          key: `${copy}-${template.id}`,
        })),
      ).flat(),
    [],
  );

  const measureLoopStride = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length < SLIDE_COUNT * 2) return 0;

    const firstCopy = track.children[0] as HTMLElement;
    const middleCopy = track.children[SLIDE_COUNT] as HTMLElement;
    loopStrideRef.current = middleCopy.offsetLeft - firstCopy.offsetLeft;
    return loopStrideRef.current;
  }, []);

  const centerSlide = useCallback((index: number, animate: boolean) => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    const slide = track.children[index] as HTMLElement | undefined;
    if (!slide) return;

    const viewportCenter = viewport.clientWidth / 2;
    const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;

    slideIndexRef.current = index;
    setTransitionEnabled(animate);
    setTranslateX(viewportCenter - slideCenter);
    setPendingTemplate(slides[index].template.id);
  }, [slides]);

  const normalizePosition = useCallback(() => {
    const index = slideIndexRef.current;
    if (index < SLIDE_COUNT) {
      centerSlide(index + SLIDE_COUNT, false);
    } else if (index >= SLIDE_COUNT * 2) {
      centerSlide(index - SLIDE_COUNT, false);
    }
  }, [centerSlide]);

  const go = useCallback(
    (delta: number) => {
      const nextIndex = slideIndexRef.current + delta;
      if (nextIndex < 0 || nextIndex >= slides.length) return;
      centerSlide(nextIndex, true);
    },
    [centerSlide, slides.length],
  );

  const handleTrackTransitionEnd = useCallback(
    (event: React.TransitionEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) return;
      if (event.propertyName !== 'transform') return;
      normalizePosition();
    },
    [normalizePosition],
  );

  const handleClose = useCallback(() => {
    setLayout({ template: pendingTemplate });
    onClose();
  }, [onClose, pendingTemplate, setLayout]);

  useEffect(() => {
    if (!open) return;
    setPendingTemplate(layout.template);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, layout.template]);

  useLayoutEffect(() => {
    if (!open) return;

    const templateIndex = TEMPLATES.findIndex((t) => t.id === layout.template);
    const startIndex = SLIDE_COUNT + (templateIndex >= 0 ? templateIndex : 0);

    measureLoopStride();
    centerSlide(startIndex, false);
  }, [open, layout.template, centerSlide, measureLoopStride]);

  useEffect(() => {
    if (!open) return;

    const onResize = () => {
      measureLoopStride();
      centerSlide(slideIndexRef.current, false);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open, centerSlide, measureLoopStride]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      } else if (event.key === 'ArrowLeft') {
        go(-1);
      } else if (event.key === 'ArrowRight') {
        go(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, go, handleClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="no-print fixed inset-0 z-[100] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Choose a template"
    >
      <button
        type="button"
        className="absolute inset-0 bg-neutral-900/35 backdrop-blur-[6px] transition-opacity"
        aria-label="Close template browser"
        onClick={handleClose}
      />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col px-4 pb-4 pt-4 pointer-events-none sm:px-6 sm:pb-6">
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          className="pointer-events-auto absolute right-4 top-4 z-20 sm:right-6 sm:top-6"
          onClick={handleClose}
          aria-label="Close"
        >
          <X />
        </Button>

        <div className="relative flex min-h-0 flex-1 items-center">
          <div
            ref={viewportRef}
            className="min-h-0 w-full overflow-hidden px-4 sm:px-6"
          >
            <div
              ref={trackRef}
              className="pointer-events-auto flex w-max items-stretch gap-6 py-2 sm:gap-8"
              style={{
                transform: `translateX(${translateX}px)`,
                transition: transitionEnabled
                  ? 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1)'
                  : 'none',
              }}
              onTransitionEnd={handleTrackTransitionEnd}
            >
              {slides.map(({ template, key }, slideIndex) => (
                <TemplateSlide
                  key={key}
                  templateId={template.id}
                  selected={pendingTemplate === template.id}
                  onSelect={() => centerSlide(slideIndex, true)}
                  onConfirm={handleClose}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
