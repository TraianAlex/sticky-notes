import { memo, useState } from 'react';

interface CardType {
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

type ResizeHandle = 'se' | 'sw' | 'ne' | 'nw' | 'e' | 'w' | 'n' | 's';

interface CardProps {
  card: CardType;
  onDragStart: (dragOffset: { x: number; y: number }) => void;
  onResizeStart: (handle: ResizeHandle, startPos: { x: number; y: number }) => void;
}

export const Card = memo<CardProps>(({ card, onDragStart, onResizeStart }) => {
  const handleDragStart = (ev: React.MouseEvent<HTMLDivElement>) => {
    ev.stopPropagation();
    const rect = ev.currentTarget.getBoundingClientRect();
    // Calculate offset from mouse position to card's top-left corner
    const offset = {
      x: ev.clientX - rect.left,
      y: ev.clientY - rect.top,
    };
    onDragStart(offset);
  };

  const handleResizeStart = (handle: ResizeHandle) => (ev: React.MouseEvent<HTMLDivElement>) => {
    ev.stopPropagation();
    ev.preventDefault();
    onResizeStart(handle, { x: ev.pageX, y: ev.pageY });
  };

  const [isHovered, setIsHovered] = useState(false);

  // Resize handle configuration
  const getHandleStyle = (handle: ResizeHandle): React.CSSProperties => {
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

  const resizeHandles: ResizeHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

  return (
    <div
      onMouseDown={handleDragStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="p-3 bg-white text-break position-absolute border rounded shadow-sm"
      style={{
        left: card.position.left,
        top: card.position.top,
        width: card.size.width,
        height: card.size.height,
        minWidth: '6.25rem',
        minHeight: '3.125rem',
        cursor: 'move',
        userSelect: 'none',
        fontSize: '1.125rem',
      }}
      key={card.id}
    >
      {card.label}
      {resizeHandles.map((handle) => (
        <div
          key={handle}
          onMouseDown={handleResizeStart(handle)}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = isHovered ? '0.8' : '0';
          }}
          style={getHandleStyle(handle)}
        />
      ))}
    </div>
  );
});
