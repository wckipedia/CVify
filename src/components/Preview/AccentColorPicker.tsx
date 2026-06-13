import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { createPortal } from 'react-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  hexToHsv,
  hexToRgb,
  hsvToHex,
  normalizeHex,
  rgbToHex,
} from '../../utils/color';

interface AccentColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function AccentColorPicker({ value, onChange }: AccentColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [hsv, setHsv] = useState(
    () => hexToHsv(value) ?? { h: 220, s: 70, v: 90 },
  );
  const [hexInput, setHexInput] = useState(value);
  const [rgbInput, setRgbInput] = useState(
    () => hexToRgb(value) ?? { r: 37, g: 99, b: 235 },
  );

  const triggerRef = useRef<HTMLButtonElement>(null);
  const slPlaneRef = useRef<HTMLDivElement>(null);
  const hueSliderRef = useRef<HTMLDivElement>(null);
  const hsvRef = useRef(hsv);
  const isDraggingRef = useRef(false);
  const [panelStyle, setPanelStyle] = useState({ top: 0, left: 0 });

  hsvRef.current = hsv;

  const panelId = useId();

  const applyColor = useCallback(
    (hex: string) => {
      const normalized = normalizeHex(hex);
      if (!normalized) return;

      const rgb = hexToRgb(normalized);
      const nextHsv = hexToHsv(normalized);
      if (!rgb || !nextHsv) return;

      onChange(normalized);
      setHexInput(normalized);
      setRgbInput(rgb);
      setHsv(nextHsv);
      hsvRef.current = nextHsv;
    },
    [onChange],
  );

  const applyHsv = useCallback(
    (next: { h: number; s: number; v: number }) => {
      const hex = hsvToHex(next.h, next.s, next.v);
      const rgb = hexToRgb(hex);
      if (!rgb) return;

      setHsv(next);
      hsvRef.current = next;
      setHexInput(hex);
      setRgbInput(rgb);
      onChange(hex);
    },
    [onChange],
  );

  const updatePanelPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const panelWidth = 252;
    const margin = 8;
    let left = rect.left + rect.width / 2 - panelWidth / 2;
    left = clamp(left, margin, window.innerWidth - panelWidth - margin);

    setPanelStyle({
      top: rect.bottom + margin,
      left,
    });
  }, []);

  useEffect(() => {
    if (!value || isDraggingRef.current) return;

    const nextHsv = hexToHsv(value);
    const nextRgb = hexToRgb(value);
    if (!nextHsv || !nextRgb) return;

    setHsv(nextHsv);
    setHexInput(value);
    setRgbInput(nextRgb);
  }, [value]);

  useEffect(() => {
    if (!open) return;

    updatePanelPosition();

    const onResize = () => updatePanelPosition();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open, updatePanelPosition]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const handleSlPointer = (clientX: number, clientY: number) => {
    const plane = slPlaneRef.current;
    if (!plane) return;

    const rect = plane.getBoundingClientRect();
    const x = clamp((clientX - rect.left) / rect.width, 0, 1);
    const y = clamp((clientY - rect.top) / rect.height, 0, 1);

    applyHsv({
      h: hsvRef.current.h,
      s: x * 100,
      v: (1 - y) * 100,
    });
  };

  const handleHuePointer = (clientX: number) => {
    const slider = hueSliderRef.current;
    if (!slider) return;

    const rect = slider.getBoundingClientRect();
    const x = clamp((clientX - rect.left) / rect.width, 0, 1);

    applyHsv({
      h: x * 360,
      s: hsvRef.current.s,
      v: hsvRef.current.v,
    });
  };

  const startDrag = (
    event: ReactPointerEvent<HTMLDivElement>,
    onMove: (clientX: number, clientY: number) => void,
  ) => {
    const target = event.currentTarget;
    isDraggingRef.current = true;
    target.setPointerCapture(event.pointerId);
    onMove(event.clientX, event.clientY);

    const handleMove = (moveEvent: PointerEvent) => {
      onMove(moveEvent.clientX, moveEvent.clientY);
    };

    const handleUp = () => {
      isDraggingRef.current = false;
      target.releasePointerCapture(event.pointerId);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  const commitHex = (raw: string) => {
    const normalized = normalizeHex(raw);
    if (normalized) {
      applyColor(normalized);
      return;
    }

    setHexInput(value);
  };

  const updateRgbChannel = (channel: 'r' | 'g' | 'b', raw: string) => {
    if (raw.trim() === '') return;

    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed)) return;

    const next = {
      ...rgbInput,
      [channel]: clamp(parsed, 0, 255),
    };

    applyColor(rgbToHex(next.r, next.g, next.b));
  };

  const slThumb = {
    left: `${hsv.s}%`,
    top: `${100 - hsv.v}%`,
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls={open ? panelId : undefined}
        aria-label="Pick accent color"
        onClick={() => setOpen((current) => !current)}
        className="h-8 w-8 shrink-0 rounded-lg border border-neutral-600 shadow-sm transition-all duration-200 hover:border-neutral-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
        style={{ backgroundColor: value }}
      />

      {open &&
        createPortal(
          <>
            <button
              type="button"
              className="fixed inset-0 z-[90]"
              aria-label="Close color picker"
              onClick={() => setOpen(false)}
            />

            <div
              id={panelId}
              role="dialog"
              aria-label="Accent color picker"
              className={cn(
                'fixed z-[100] w-[252px] rounded-lg border border-neutral-600 bg-white/85 p-3 shadow-lg backdrop-blur-[14px]',
              )}
              style={{ top: panelStyle.top, left: panelStyle.left }}
            >
              <div
                ref={slPlaneRef}
                className="relative h-36 w-full cursor-crosshair overflow-hidden rounded-lg border border-neutral-600/70 touch-none select-none"
                style={{ backgroundColor: `hsl(${hsv.h} 100% 50%)` }}
                onPointerDown={(event) =>
                  startDrag(event, handleSlPointer)
                }
              >
                <div className="absolute inset-0 bg-linear-to-r from-white to-transparent" />
                <div className="absolute inset-0 bg-linear-to-t from-black to-transparent" />
                <div
                  className="pointer-events-none absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.35)]"
                  style={slThumb}
                />
              </div>

              <div
                ref={hueSliderRef}
                className="relative mt-3 h-3 w-full cursor-pointer overflow-hidden rounded-lg border border-neutral-600/70 touch-none select-none"
                style={{
                  background:
                    'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
                }}
                onPointerDown={(event) =>
                  startDrag(event, (clientX) => handleHuePointer(clientX))
                }
              >
                <div
                  className="pointer-events-none absolute top-1/2 h-4 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.35)]"
                  style={{ left: `${(hsv.h / 360) * 100}%` }}
                />
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {(['r', 'g', 'b'] as const).map((channel) => (
                  <div key={channel}>
                    <Label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                      {channel}
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      max={255}
                      value={rgbInput[channel]}
                      onChange={(event) =>
                        updateRgbChannel(channel, event.target.value)
                      }
                      className="h-8 px-2 py-0 text-xs tabular-nums"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-2">
                <Label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                  Hex
                </Label>
                <Input
                  type="text"
                  value={hexInput}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                  onChange={(event) => setHexInput(event.target.value)}
                  onBlur={() => commitHex(hexInput)}
                  onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                    if (event.key === 'Enter') event.currentTarget.blur();
                  }}
                  className="h-8 px-2 py-0 font-mono text-xs uppercase tracking-wide"
                />
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
