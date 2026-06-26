import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';
import type { ResumeData } from '../../types/resume';
import { getTemplateComponent } from '../templates/registry';

interface PageSlice {
  start: number;
  end: number;
}

interface ResumePrintDocumentProps {
  data: ResumeData;
  id?: string;
  className?: string;
  contentClassName?: string;
  hidden?: boolean;
  pageClassName?: string;
  onReady?: () => void;
}

const DEFAULT_PAGE_HEIGHT = 1056;
const PAGE_GAP_CLASS = 'gap-6 print:gap-0';

function createPageSlices(
  source: HTMLElement,
  pageHeight: number,
): PageSlice[] {
  const sourceTop = source.getBoundingClientRect().top;
  const sourceHeight = source.scrollHeight;
  const slices: PageSlice[] = [];
  let start = 0;

  while (start < sourceHeight - 2) {
    const pageEnd = start + pageHeight;
    const blocks = Array.from(
      source.querySelectorAll<HTMLElement>('.resume-section, .resume-entry'),
    ).map((node) => {
      const rect = node.getBoundingClientRect();
      return {
        top: Math.round(rect.top - sourceTop),
        bottom: Math.round(rect.bottom - sourceTop),
      };
    });
    const candidates = blocks
      .map((block, index) => {
        const previousBlock = blocks[index - 1];
        const previousBottom =
          previousBlock &&
          previousBlock.bottom > start &&
          previousBlock.bottom < block.top
            ? previousBlock.bottom
            : null;

        return {
          ...block,
          breakAt: previousBottom ?? block.top,
        };
      })
      .filter(
        ({ top, bottom }) =>
          top > start + pageHeight * 0.55 && top < pageEnd && bottom > pageEnd,
      )
      .map(({ breakAt }) => breakAt);

    const end = candidates.length ? Math.min(...candidates) : pageEnd;
    const safeEnd = end <= start + 16 ? pageEnd : end;
    slices.push({ start, end: Math.min(safeEnd, sourceHeight) });
    start = safeEnd;
  }

  return slices.length ? slices : [{ start: 0, end: pageHeight }];
}

export const ResumePrintDocument = forwardRef<
  HTMLDivElement,
  ResumePrintDocumentProps
>(function ResumePrintDocument(
  {
    data,
    id,
    className,
    contentClassName,
    hidden = false,
    pageClassName,
    onReady,
  },
  ref,
) {
  const Template = getTemplateComponent(data.layout.template);
  const firstPageRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [pageHeight, setPageHeight] = useState(DEFAULT_PAGE_HEIGHT);
  const [slices, setSlices] = useState<PageSlice[]>([
    { start: 0, end: DEFAULT_PAGE_HEIGHT },
  ]);
  const [layoutVersion, setLayoutVersion] = useState(0);

  useLayoutEffect(() => {
    const page = firstPageRef.current;
    const source = measureRef.current;
    if (!page || !source) return;

    const pageStyles = window.getComputedStyle(page);
    const availablePageHeight =
      page.clientHeight -
      parseFloat(pageStyles.paddingTop) -
      parseFloat(pageStyles.paddingBottom);
    const nextSlices = createPageSlices(source, availablePageHeight);

    setPageHeight(availablePageHeight);
    setSlices((current) => {
      const unchanged =
        current.length === nextSlices.length &&
        current.every(
          (slice, index) =>
            Math.abs(slice.start - nextSlices[index].start) <= 2 &&
            Math.abs(slice.end - nextSlices[index].end) <= 2,
        );

      return unchanged ? current : nextSlices;
    });
    setLayoutVersion((current) => current + 1);
  }, [data]);

  useEffect(() => {
    if (layoutVersion === 0) return;
    onReady?.();
  }, [layoutVersion, onReady]);

  return (
    <div
      ref={ref}
      id={id}
      className={cn('relative mx-auto w-[8.5in] max-w-none', className)}
    >
      <div
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute left-0 top-0 w-full p-6 sm:p-10"
      >
        <Template data={data} />
      </div>
      <div
        className={cn(
          'flex flex-col text-left transition-opacity duration-[640ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
          PAGE_GAP_CLASS,
          hidden && 'invisible',
          contentClassName,
        )}
      >
        {slices.map((slice, index) => (
          <div
            key={`${slice.start}-${slice.end}`}
            ref={index === 0 ? firstPageRef : undefined}
            className={cn(
              'resume-print-page cvify-print-page h-[11in] w-full overflow-hidden rounded-lg border border-neutral-300/70 bg-white p-6 shadow-inner sm:p-10 print:rounded-none print:border-0 print:p-0 print:shadow-none',
              pageClassName,
            )}
            aria-label={index > 0 ? `Resume page ${index + 1}` : undefined}
          >
            <div
              data-resume-page-source
              style={{
                height: Math.min(slice.end - slice.start, pageHeight),
                clipPath: 'inset(0)',
                contain: 'paint',
                overflow: 'hidden',
              }}
            >
              <div style={{ marginTop: -slice.start }}>
                <Template data={data} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
