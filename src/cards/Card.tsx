import { memo, useState } from 'react';
import { getHandleStyle, type CardType, type ResizeHandle } from './utils';

interface CardProps {
  card: CardType;
  onDragStart: (dragOffset: { x: number; y: number }) => void;
  onResizeStart: (handle: ResizeHandle, startPos: { x: number; y: number }) => void;
}

const resizeHandles: ResizeHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

export const Card = memo<CardProps>(({ card, onDragStart, onResizeStart }) => {
  const [isHovered, setIsHovered] = useState(false);

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
          style={getHandleStyle(handle, isHovered)}
        />
      ))}
    </div>
  );
});
