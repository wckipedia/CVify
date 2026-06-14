import { Check, X } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type TransitionEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
  onFlybackStart?: () => void;
  getPreviewElement: () => HTMLElement | null;
}

interface ViewRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

type BrowserPhase =
  | 'idle'
  | 'focus'
  | 'stack'
  | 'disperse'
  | 'ready'
  | 'closing-converge'
  | 'closing-stack'
  | 'closing-focus';

const LOOP_COPIES = 3;
const SLIDE_COUNT = TEMPLATES.length;
const SLIDE_GAP = 32;
const FOCUS_MS = 520;
const DISPERSE_MS = 620;
const STACK_HOLD_MS = 240;
const PHASE_BUFFER_MS = 120;
const EXTEND_MS = 480;
const CHROME_SKELETON_MS = 280;
const CHROME_CONTENT_MS = 240;
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

type ChromeRevealPhase = 'collapsed' | 'skeleton' | 'content';

function isClosingPhase(phase: BrowserPhase): boolean {
  return (
    phase === 'closing-converge' ||
    phase === 'closing-stack' ||
    phase === 'closing-focus'
  );
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getCenterHeroRect(source: ViewRect): ViewRect {
  const width = Math.min(source.width, window.innerWidth - 48);
  const height = Math.min(source.height, window.innerHeight - 48);
  return {
    width,
    height,
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2,
  };
}

function getDefaultOriginRect(): ViewRect {
  return getCenterHeroRect({
    top: window.innerHeight * 0.2,
    left: window.innerWidth * 0.2,
    width: Math.min(816, window.innerWidth - 48),
    height: Math.min(1056, window.innerHeight - 48),
  });
}

function rectFromElement(element: HTMLElement): ViewRect {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

const HERO_SHADOW = '0 12px 40px rgba(0,0,0,0.18)';

function heroStyle(
  rect: ViewRect,
  animate: boolean,
  options?: { fadeShadow?: boolean; shadowRemoved?: boolean },
): CSSProperties {
  const transitions = [
    `top ${FOCUS_MS}ms ${EASING}`,
    `left ${FOCUS_MS}ms ${EASING}`,
    `width ${FOCUS_MS}ms ${EASING}`,
    `height ${FOCUS_MS}ms ${EASING}`,
  ];

  if (options?.fadeShadow) {
    transitions.push(`box-shadow ${FOCUS_MS}ms ${EASING}`);
  }

  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    ...(options?.fadeShadow
      ? { boxShadow: options.shadowRemoved ? 'none' : HERO_SHADOW }
      : {}),
    transition: animate ? transitions.join(', ') : 'none',
  };
}

function TemplateSlide({
  templateId,
  selected,
  onSelect,
  onConfirm,
  compact = false,
  enableTransition = false,
  previewOnly = false,
  chromeReveal = 'content',
  borderReveal = true,
}: {
  templateId: TemplateId;
  selected: boolean;
  onSelect: () => void;
  onConfirm: () => void;
  compact?: boolean;
  enableTransition?: boolean;
  previewOnly?: boolean;
  chromeReveal?: ChromeRevealPhase;
  borderReveal?: boolean;
}) {
  const data = useResumeStore((s) => s.data);
  const Template = getTemplateComponent(templateId);
  const previewData = {
    ...data,
    layout: { ...data.layout, template: templateId },
  };
  const templateName = getTemplateName(templateId);
  const showSlideChrome = !previewOnly;

  const previewClassName = cn(
    'flex-1 min-h-0 overflow-y-auto bg-white p-6 text-left sm:p-10',
    'max-h-[calc(100vh-11.5rem)]',
    !showSlideChrome && 'min-h-[min(11in,calc(100vh-11.5rem))] rounded-xl',
    showSlideChrome && 'min-h-[min(11in,calc(100vh-11.5rem))]',
  );

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
        'group flex max-h-[calc(100vh-2rem)] w-[8.5in] max-w-[calc(100vw-3rem)] shrink-0 flex-col overflow-hidden rounded-xl border text-left shadow-sm transition-[border-color,box-shadow,opacity] ease-[cubic-bezier(0.22,1,0.36,1)]',
        enableTransition ? 'duration-300' : 'duration-[480ms]',
        selected
          ? cn(
              'cursor-pointer bg-white/95 opacity-100',
              borderReveal
                ? 'border-neutral-700 shadow-[0_12px_40px_rgba(0,0,0,0.14)] ring-1 ring-neutral-900/10'
                : 'border-transparent shadow-[0_12px_40px_rgba(0,0,0,0.18)] ring-0',
            )
          : cn(
              'bg-white/70 opacity-50 hover:opacity-80',
              borderReveal
                ? 'border-neutral-600/45 hover:border-neutral-600 hover:shadow-md'
                : 'border-transparent shadow-none',
            ),
      )}
      aria-label={
        selected
          ? `Use ${templateName} template`
          : `Preview ${templateName} template`
      }
      aria-pressed={selected}
    >
      <div
        className="grid shrink-0 transition-[grid-template-rows] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          gridTemplateRows: showSlideChrome ? '1fr' : '0fr',
          transitionDuration: `${EXTEND_MS}ms`,
        }}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              'border-b px-4 py-3 transition-[border-color] duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-5 sm:py-3.5',
              selected
                ? cn(
                    'bg-white',
                    showSlideChrome
                      ? 'border-neutral-600/30'
                      : 'border-transparent',
                  )
                : cn(
                    'bg-white/90 backdrop-blur-sm',
                    showSlideChrome
                      ? 'border-neutral-600/20'
                      : 'border-transparent',
                  ),
            )}
          >
            {selected ? (
              <div className="relative min-h-[3.25rem] sm:min-h-[3.5rem]">
                <div
                  className={cn(
                    'absolute inset-0 transition-opacity',
                    chromeReveal === 'skeleton'
                      ? 'opacity-100'
                      : 'pointer-events-none opacity-0',
                  )}
                  style={{
                    transitionDuration: `${CHROME_CONTENT_MS}ms`,
                    transitionTimingFunction: EASING,
                  }}
                  aria-hidden={chromeReveal !== 'skeleton'}
                >
                  <Skeleton className="h-2.5 w-28 rounded bg-neutral-200" />
                  <Skeleton className="mt-2 h-7 w-44 rounded bg-neutral-200 sm:h-8 sm:w-52" />
                </div>
                <div
                  className={cn(
                    'absolute inset-0 transition-opacity',
                    chromeReveal === 'content'
                      ? 'opacity-100'
                      : 'pointer-events-none opacity-0',
                  )}
                  style={{
                    transitionDuration: `${CHROME_CONTENT_MS}ms`,
                    transitionTimingFunction: EASING,
                  }}
                  aria-hidden={chromeReveal !== 'content'}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                    Currently previewing
                  </p>
                  <h3 className="mt-0.5 text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
                    {templateName}
                  </h3>
                </div>
              </div>
            ) : (
              <h3 className="text-base font-bold tracking-tight text-neutral-900 sm:text-lg">
                {templateName}
              </h3>
            )}
          </div>
        </div>
      </div>

      <div className={previewClassName}>
        <Template data={previewData} />
      </div>

      <div
        className="grid shrink-0 transition-[grid-template-rows] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          gridTemplateRows: showSlideChrome ? '1fr' : '0fr',
          transitionDuration: `${EXTEND_MS}ms`,
        }}
      >
        <div className="overflow-hidden rounded-b-xl">
          {selected ? (
            <div className="relative">
              <div
                className={cn(
                  'flex items-center justify-center gap-2 border-t border-neutral-800 bg-neutral-900 px-4 py-3 transition-[opacity,border-color,background-color] duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:bg-neutral-800',
                  chromeReveal === 'content'
                    ? 'relative opacity-100'
                    : 'pointer-events-none absolute inset-x-0 top-0 opacity-0',
                  showSlideChrome ? 'border-neutral-800' : 'border-transparent',
                )}
                style={{
                  transitionDuration: `${CHROME_CONTENT_MS}ms`,
                  transitionTimingFunction: EASING,
                }}
                aria-hidden={chromeReveal !== 'content'}
              >
                <Check className="size-3.5 text-white" strokeWidth={2.5} />
                <span className="text-sm font-semibold text-white">
                  Use this template
                </span>
              </div>
              <div
                className={cn(
                  'flex items-center justify-center gap-2 border-t bg-neutral-900 px-4 py-3 transition-[opacity,border-color] duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                  chromeReveal === 'skeleton'
                    ? 'opacity-100'
                    : 'pointer-events-none absolute inset-x-0 top-0 opacity-0',
                  showSlideChrome ? 'border-neutral-800' : 'border-transparent',
                )}
                style={{
                  transitionDuration: `${CHROME_CONTENT_MS}ms`,
                  transitionTimingFunction: EASING,
                }}
                aria-hidden={chromeReveal !== 'skeleton'}
              >
                <Skeleton className="size-3.5 rounded bg-neutral-700" />
                <Skeleton className="h-4 w-32 rounded bg-neutral-700" />
              </div>
            </div>
          ) : (
            <div
              className={cn(
                'border-t bg-neutral-50/90 px-4 py-2.5 text-center transition-[border-color] duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                showSlideChrome
                  ? 'border-neutral-600/15'
                  : 'border-transparent',
              )}
            >
              <span className="text-xs font-medium text-neutral-500">
                Click to preview
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

export function TemplateBrowser({
  open,
  onClose,
  onFlybackStart,
  getPreviewElement,
}: TemplateBrowserProps) {
  const data = useResumeStore((s) => s.data);
  const layout = useResumeStore((s) => s.data.layout);
  const setLayout = useResumeStore((s) => s.setLayout);

  const [pendingTemplate, setPendingTemplate] = useState<TemplateId>(
    layout.template,
  );
  const [translateX, setTranslateX] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<BrowserPhase>('idle');
  const [backdropVisible, setBackdropVisible] = useState(false);
  const [heroRect, setHeroRect] = useState<ViewRect | null>(null);
  const [heroAnimate, setHeroAnimate] = useState(false);
  const [heroAtCenter, setHeroAtCenter] = useState(false);
  const [slideWidth, setSlideWidth] = useState(816);
  const [cardsSpread, setCardsSpread] = useState(false);
  const [cardsTransition, setCardsTransition] = useState(false);
  const [chromeReveal, setChromeReveal] = useState<ChromeRevealPhase>('collapsed');
  const [heroFlyRect, setHeroFlyRect] = useState<ViewRect | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideMeasureRef = useRef<HTMLDivElement>(null);
  const slideIndexRef = useRef(SLIDE_COUNT);
  const loopStrideRef = useRef(0);
  const stackTimerRef = useRef<number | null>(null);
  const phaseTimerRef = useRef<number | null>(null);
  const phaseRef = useRef<BrowserPhase>('idle');
  const closingRef = useRef(false);
  const heroAtCenterRef = useRef(false);
  const wasOpenRef = useRef(false);
  const needsInitialCenterRef = useRef(false);
  const chromeSequenceStartedRef = useRef(false);
  const pendingTemplateRef = useRef(pendingTemplate);
  const getPreviewElementRef = useRef(getPreviewElement);
  const onFlybackStartRef = useRef(onFlybackStart);

  heroAtCenterRef.current = heroAtCenter;
  pendingTemplateRef.current = pendingTemplate;
  getPreviewElementRef.current = getPreviewElement;
  onFlybackStartRef.current = onFlybackStart;

  const centerTemplateIndex = TEMPLATES.findIndex(
    (t) => t.id === pendingTemplate,
  );

  const heroTemplateId =
    phase === 'closing-focus' ? pendingTemplate : layout.template;
  const HeroTemplate = getTemplateComponent(heroTemplateId);
  const heroData = {
    ...data,
    layout: { ...data.layout, template: heroTemplateId },
  };

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

  const clearPhaseTimer = useCallback(() => {
    if (phaseTimerRef.current) {
      window.clearTimeout(phaseTimerRef.current);
      phaseTimerRef.current = null;
    }
  }, []);

  const clearStackTimer = useCallback(() => {
    if (stackTimerRef.current) {
      window.clearTimeout(stackTimerRef.current);
      stackTimerRef.current = null;
    }
  }, []);

  const measureSlideWidth = useCallback(() => {
    const slide = slideMeasureRef.current;
    if (!slide) return 816;
    const width = slide.offsetWidth;
    if (width > 0) setSlideWidth(width);
    return width > 0 ? width : 816;
  }, []);

  const measureLoopStride = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length < SLIDE_COUNT * 2) return 0;

    const firstCopy = track.children[0] as HTMLElement;
    const middleCopy = track.children[SLIDE_COUNT] as HTMLElement;
    loopStrideRef.current = middleCopy.offsetLeft - firstCopy.offsetLeft;
    return loopStrideRef.current;
  }, []);

  const centerSlide = useCallback(
    (index: number, animate: boolean) => {
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
    },
    [slides],
  );

  const normalizePosition = useCallback(() => {
    if (phaseRef.current !== 'ready') return;

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
    (event: TransitionEvent<HTMLDivElement>) => {
      if (event.target !== event.currentTarget) return;
      if (event.propertyName !== 'transform') return;
      normalizePosition();
    },
    [normalizePosition],
  );

  const getPreviewOriginRect = useCallback(() => {
    const preview = getPreviewElementRef.current();
    return preview ? rectFromElement(preview) : getDefaultOriginRect();
  }, []);

  const finishClose = useCallback(() => {
    if (phaseRef.current === 'idle') return;

    clearPhaseTimer();
    clearStackTimer();

    setLayout({ template: pendingTemplateRef.current });

    phaseRef.current = 'idle';
    closingRef.current = false;
    wasOpenRef.current = false;
    setMounted(false);
    setPhase('idle');
    setBackdropVisible(false);
    setHeroAtCenter(false);
    setHeroAnimate(false);
    setHeroRect(null);
    setCardsSpread(false);
    setCardsTransition(false);
    setChromeReveal('collapsed');
    setHeroFlyRect(null);
    chromeSequenceStartedRef.current = false;
    onClose();
  }, [clearPhaseTimer, clearStackTimer, onClose, setLayout]);

  const beginClosingFlyback = useCallback(() => {
    if (!closingRef.current) return;

    clearStackTimer();
    clearPhaseTimer();

    const track = trackRef.current;
    const slideWrapper = track?.children[slideIndexRef.current] as
      | HTMLElement
      | undefined;
    const slideButton = slideWrapper?.querySelector('button');
    const startRect = slideButton
      ? rectFromElement(slideButton)
      : getCenterHeroRect(getPreviewOriginRect());
    const endRect = getPreviewOriginRect();

    setCardsSpread(false);
    setCardsTransition(false);
    setChromeReveal('collapsed');

    phaseRef.current = 'closing-focus';
    setPhase('closing-focus');
    setHeroRect(endRect);
    setHeroAtCenter(false);
    setHeroAnimate(false);
    setHeroFlyRect(startRect);

    onFlybackStartRef.current?.();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!closingRef.current) return;
        setBackdropVisible(false);
        setHeroAnimate(true);
        setHeroFlyRect(endRect);
      });
    });

    phaseTimerRef.current = window.setTimeout(() => {
      if (phaseRef.current === 'closing-focus') {
        finishClose();
      }
    }, FOCUS_MS + PHASE_BUFFER_MS);
  }, [clearPhaseTimer, clearStackTimer, finishClose, getPreviewOriginRect]);

  const advanceToClosingStack = useCallback(() => {
    if (phaseRef.current !== 'closing-converge') return;

    clearPhaseTimer();
    phaseRef.current = 'closing-stack';
    setPhase('closing-stack');

    stackTimerRef.current = window.setTimeout(() => {
      beginClosingFlyback();
    }, STACK_HOLD_MS);
  }, [beginClosingFlyback, clearPhaseTimer]);

  const beginClosingConverge = useCallback(() => {
    measureSlideWidth();
    setChromeReveal('collapsed');
    chromeSequenceStartedRef.current = false;

    phaseRef.current = 'closing-converge';
    setPhase('closing-converge');
    setTransitionEnabled(false);
    setCardsSpread(true);
    setCardsTransition(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!closingRef.current) return;
        setCardsTransition(true);
        setCardsSpread(false);
      });
    });

    phaseTimerRef.current = window.setTimeout(
      advanceToClosingStack,
      DISPERSE_MS + 80,
    );
  }, [advanceToClosingStack, measureSlideWidth]);

  const startClose = useCallback(() => {
    if (phaseRef.current === 'idle' || closingRef.current) return;

    if (prefersReducedMotion()) {
      finishClose();
      return;
    }

    closingRef.current = true;
    clearPhaseTimer();
    clearStackTimer();

    const current = phaseRef.current;

    if (current === 'ready' || current === 'disperse') {
      beginClosingConverge();
      return;
    }

    if (current === 'stack') {
      phaseRef.current = 'closing-stack';
      setPhase('closing-stack');
      stackTimerRef.current = window.setTimeout(() => {
        beginClosingFlyback();
      }, STACK_HOLD_MS);
      return;
    }

    beginClosingFlyback();
  }, [
    beginClosingConverge,
    beginClosingFlyback,
    clearPhaseTimer,
    clearStackTimer,
    finishClose,
  ]);

  const handleClose = useCallback(() => {
    if (phaseRef.current === 'idle' || isClosingPhase(phaseRef.current)) {
      return;
    }
    startClose();
  }, [startClose]);

  const advanceToStack = useCallback(() => {
    if (phaseRef.current !== 'focus' || closingRef.current) return;
    clearPhaseTimer();
    phaseRef.current = 'stack';
    setPhase('stack');
    measureSlideWidth();

    stackTimerRef.current = window.setTimeout(() => {
      if (phaseRef.current !== 'stack') return;
      requestAnimationFrame(() => {
        phaseRef.current = 'disperse';
        setPhase('disperse');
        setCardsSpread(false);
        setCardsTransition(false);
        requestAnimationFrame(() => {
          setCardsTransition(true);
          setCardsSpread(true);
        });
      });
    }, STACK_HOLD_MS);
  }, [clearPhaseTimer, measureSlideWidth]);

  const advanceToReady = useCallback(() => {
    if (phaseRef.current !== 'disperse') return;
    phaseRef.current = 'ready';
    setPhase('ready');
    setCardsTransition(false);
  }, []);

  const handleHeroTransitionEnd = useCallback(
    (event: TransitionEvent<HTMLDivElement>) => {
      if (event.target !== heroRef.current) return;
      if (!['top', 'left', 'width', 'height'].includes(event.propertyName)) {
        return;
      }

      if (phaseRef.current === 'closing-focus') {
        finishClose();
        return;
      }

      if (closingRef.current) return;
    },
    [finishClose],
  );

  useEffect(() => {
    if (!open) {
      wasOpenRef.current = false;
      return;
    }

    if (wasOpenRef.current || closingRef.current) {
      return;
    }

    wasOpenRef.current = true;

    const origin = getPreviewOriginRect();

    phaseRef.current = 'focus';
    closingRef.current = false;
    setMounted(true);
    setPhase('focus');
    setPendingTemplate(layout.template);
    setHeroRect(origin);
    setHeroAtCenter(false);
    setHeroAnimate(false);
    setBackdropVisible(false);
    setCardsSpread(false);
    setCardsTransition(false);
    setChromeReveal('collapsed');
    chromeSequenceStartedRef.current = false;

    if (prefersReducedMotion()) {
      phaseRef.current = 'ready';
      setPhase('ready');
      setBackdropVisible(true);
      setChromeReveal('content');
      needsInitialCenterRef.current = true;
      return;
    }

    let frame2 = 0;
    const frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => {
        if (closingRef.current || !wasOpenRef.current) return;
        setBackdropVisible(true);
        setHeroAnimate(true);
        setHeroAtCenter(true);
      });
    });

    phaseTimerRef.current = window.setTimeout(() => {
      advanceToStack();
    }, FOCUS_MS + PHASE_BUFFER_MS);

    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
      clearPhaseTimer();
      clearStackTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (phase !== 'disperse') return;
    const timer = window.setTimeout(advanceToReady, DISPERSE_MS + 80);
    return () => window.clearTimeout(timer);
  }, [phase, advanceToReady]);

  useEffect(() => {
    if (!cardsSpread) {
      if (phase !== 'ready') {
        setChromeReveal('collapsed');
        chromeSequenceStartedRef.current = false;
      }
      return;
    }

    if (chromeSequenceStartedRef.current) return;
    chromeSequenceStartedRef.current = true;

    if (prefersReducedMotion()) {
      setChromeReveal('content');
      return;
    }

    setChromeReveal('skeleton');

    const contentTimer = window.setTimeout(() => {
      setChromeReveal('content');
    }, CHROME_SKELETON_MS);

    return () => {
      window.clearTimeout(contentTimer);
    };
  }, [cardsSpread, phase]);

  useEffect(() => {
    if (!mounted) return;

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mounted]);

  useLayoutEffect(() => {
    const templateIndex = TEMPLATES.findIndex((t) => t.id === pendingTemplate);
    const startIndex = SLIDE_COUNT + (templateIndex >= 0 ? templateIndex : 0);

    if (phase === 'stack') {
      measureLoopStride();
      measureSlideWidth();
      centerSlide(startIndex, false);
      return;
    }

    if (phase === 'ready' && needsInitialCenterRef.current) {
      measureLoopStride();
      measureSlideWidth();
      centerSlide(startIndex, false);
      needsInitialCenterRef.current = false;
    }
  }, [phase, pendingTemplate, centerSlide, measureLoopStride, measureSlideWidth]);

  useEffect(() => {
    if (phase !== 'ready') return;

    const onResize = () => {
      measureSlideWidth();
      measureLoopStride();
      centerSlide(slideIndexRef.current, false);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [phase, centerSlide, measureLoopStride, measureSlideWidth]);

  useEffect(() => {
    if (phase !== 'ready') return;

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
  }, [phase, go, handleClose]);

  const spreadOffset = useCallback(
    (index: number) => {
      return (index - centerTemplateIndex) * (slideWidth + SLIDE_GAP);
    },
    [centerTemplateIndex, slideWidth],
  );

  const carouselStackTransform = useCallback(
    (templateIndex: number) => {
      if (templateIndex === centerTemplateIndex) {
        return 'translate(0px, 0px) scale(1)';
      }

      const depth = Math.min(
        Math.abs(templateIndex - centerTemplateIndex),
        6,
      );
      const direction = templateIndex < centerTemplateIndex ? -1 : 1;
      const y = depth * 6;
      const x = direction * depth * 4;
      const scale = 1 - depth * 0.025;
      const naturalOffset = spreadOffset(templateIndex);

      return `translate(calc(${-naturalOffset}px + ${x}px), ${y}px) scale(${scale})`;
    },
    [centerTemplateIndex, spreadOffset],
  );

  if (!mounted) return null;

  const closing = isClosingPhase(phase);
  const showHero = phase === 'focus' || phase === 'closing-focus';
  const showCarousel =
    phase === 'stack' ||
    phase === 'disperse' ||
    phase === 'ready' ||
    phase === 'closing-converge' ||
    phase === 'closing-stack';

  const useStackLayout =
    ((phase === 'stack' || phase === 'disperse') && !cardsSpread) ||
    (phase === 'closing-converge' && !cardsSpread) ||
    phase === 'closing-stack';

  const cardsAnimate =
    (phase === 'disperse' && cardsTransition) ||
    (phase === 'closing-converge' && cardsTransition);

  const carouselInteractive = phase === 'ready';

  const displayHeroRect =
    heroFlyRect ??
    (heroRect &&
      (heroAtCenter && phase === 'focus'
        ? getCenterHeroRect(heroRect)
        : heroRect));

  return createPortal(
    <>
      <div
        ref={slideMeasureRef}
        className="pointer-events-none fixed -left-[9999px] top-0 opacity-0"
        aria-hidden
      >
        <TemplateSlide
          templateId={layout.template}
          selected
          onSelect={() => undefined}
          onConfirm={() => undefined}
          compact
        />
      </div>

      <div
        className="no-print fixed inset-0 z-[100] flex h-full w-full flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Choose a template"
      >
        <button
          type="button"
          className={cn(
            'template-browser-backdrop absolute inset-0 z-0 bg-neutral-900/35 backdrop-blur-[6px] transition-opacity duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
            backdropVisible ? 'opacity-100' : 'opacity-0',
          )}
          aria-label="Close template browser"
          onClick={(event) => {
            event.stopPropagation();
            handleClose();
          }}
          disabled={closing}
        />

        {showHero && displayHeroRect ? (
          <div
            ref={heroRef}
            className={cn(
              'pointer-events-none fixed z-20 overflow-hidden rounded-lg bg-white p-6 sm:p-10',
              phase !== 'closing-focus' && 'shadow-[0_12px_40px_rgba(0,0,0,0.18)]',
            )}
            style={heroStyle(displayHeroRect, heroAnimate, {
              fadeShadow: phase === 'closing-focus',
              shadowRemoved: phase === 'closing-focus' && heroAnimate,
            })}
            onTransitionEnd={handleHeroTransitionEnd}
          >
            <HeroTemplate data={heroData} />
          </div>
        ) : null}

        {!closing ? (
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            className="pointer-events-auto absolute right-4 top-4 z-50 sm:right-6 sm:top-6"
            onClick={(event) => {
              event.stopPropagation();
              handleClose();
            }}
            aria-label="Close"
          >
            <X />
          </Button>
        ) : null}

        {showCarousel ? (
          <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
            <div
              ref={viewportRef}
              className="pointer-events-none absolute left-0 right-0 top-1/2 w-full -translate-y-1/2 overflow-hidden"
            >
              <div
                ref={trackRef}
                className={cn(
                  'flex w-max items-center gap-8',
                  carouselInteractive ? 'pointer-events-auto' : 'pointer-events-none',
                )}
                style={{
                  transform: `translateX(${translateX}px)`,
                  transition: transitionEnabled
                    ? 'transform 380ms cubic-bezier(0.22, 1, 0.36, 1)'
                    : 'none',
                }}
                onTransitionEnd={handleTrackTransitionEnd}
              >
                {slides.map(({ template, key }, slideIndex) => {
                  const templateIndex = slideIndex % SLIDE_COUNT;
                  const wrapperTransform = useStackLayout
                    ? carouselStackTransform(templateIndex)
                    : 'translate(0px, 0px) scale(1)';

                  return (
                    <div
                      key={key}
                      className="shrink-0 will-change-transform"
                      style={{
                        transform: wrapperTransform,
                        transition: cardsAnimate
                          ? `transform ${DISPERSE_MS}ms ${EASING}`
                          : undefined,
                        zIndex: useStackLayout
                          ? 40 - Math.abs(templateIndex - centerTemplateIndex)
                          : undefined,
                      }}
                    >
                      <TemplateSlide
                        templateId={template.id}
                        selected={pendingTemplate === template.id}
                        onSelect={() => centerSlide(slideIndex, true)}
                        onConfirm={handleClose}
                        enableTransition={transitionEnabled}
                        previewOnly={useStackLayout}
                        borderReveal={!useStackLayout}
                        chromeReveal={
                          pendingTemplate === template.id
                            ? phase === 'ready'
                              ? 'content'
                              : chromeReveal
                            : 'content'
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>,
    document.body,
  );
}
