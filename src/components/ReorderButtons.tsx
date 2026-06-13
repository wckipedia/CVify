import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReorderButtonsProps {
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function ReorderButtons({
  onMoveUp,
  onMoveDown,
  onRemove,
  canMoveUp,
  canMoveDown,
}: ReorderButtonsProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onMoveUp}
        disabled={!canMoveUp}
        aria-label="Move up"
      >
        <ChevronUp className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onMoveDown}
        disabled={!canMoveDown}
        aria-label="Move down"
      >
        <ChevronDown className="size-4" />
      </Button>
      <Button
        type="button"
        variant="destructive"
        size="icon-sm"
        onClick={onRemove}
        aria-label="Remove"
      >
        ✕
      </Button>
    </div>
  );
}
