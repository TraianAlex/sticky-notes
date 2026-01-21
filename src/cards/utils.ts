export type DragState = 
  | { type: 'drag'; card: CardType; offset: { x: number; y: number } }
  | { type: 'resize'; card: CardType; handle: string; startPos: { x: number; y: number }; startSize: { width: number; height: number } }
  | null;

export interface CardType {
  id: string;
  label: string;
  position: {
    top: number;
    left: number;
  };
  size: {
    width: number;
    height: number;
  };
}

export type ResizeHandle = 'se' | 'sw' | 'ne' | 'nw' | 'e' | 'w' | 'n' | 's';

// Helper functions
export const constrainToContainer = (
  value: number,
  min: number,
  max: number
): number => Math.max(min, Math.min(value, max));

export const isPointInRect = (
  x: number,
  y: number,
  rect: DOMRect
): boolean => {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
};

// Resize handle configuration
export const getHandleStyle = (handle: ResizeHandle, isHovered: boolean): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    backgroundColor: '#ccc',
    zIndex: 10,
    opacity: isHovered ? 0.8 : 0,
    transition: 'opacity 0.2s',
  };

  const handleConfig: Record<ResizeHandle, Partial<React.CSSProperties>> = {
    nw: { top: '-0.25rem', left: '-0.25rem', width: '0.75rem', height: '0.75rem', cursor: 'nw-resize' },
    ne: { top: '-0.25rem', right: '-0.25rem', width: '0.75rem', height: '0.75rem', cursor: 'ne-resize' },
    se: { bottom: '-0.25rem', right: '-0.25rem', width: '0.75rem', height: '0.75rem', cursor: 'se-resize' },
    sw: { bottom: '-0.25rem', left: '-0.25rem', width: '0.75rem', height: '0.75rem', cursor: 'sw-resize' },
    n: { top: '-0.25rem', left: '0', right: '0', height: '0.5rem', cursor: 'n-resize' },
    s: { bottom: '-0.25rem', left: '0', right: '0', height: '0.5rem', cursor: 's-resize' },
    e: { top: '0', right: '-0.25rem', bottom: '0', width: '0.5rem', cursor: 'e-resize' },
    w: { top: '0', left: '-0.25rem', bottom: '0', width: '0.5rem', cursor: 'w-resize' },
  };

  return { ...baseStyle, ...handleConfig[handle] };
};
