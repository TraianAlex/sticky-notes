import { useRef, useState, lazy, Suspense } from 'react';
import { v4 as uuid } from 'uuid';
import { useLocalStorageState } from './useLocalStorage';
import { Card } from './Card';
import { AddButton } from './AddButton';
import { TrashZone } from './TrashZone';
import { constrainToContainer, isPointInRect, type CardType, type DragState } from './utils';

const AddModal = lazy(() => import('./AddModal'));

const DEFAULT_SIZE = { width: 200, height: 150 };
const MIN_SIZE = { width: 100, height: 50 };
const HANDLE_OFFSET = 4;

const AppCards = () => {
  const [cards, setCards] = useLocalStorageState<Record<string, CardType>>('cards', {});
  const [dragState, setDragState] = useState<DragState>(null);
  const [isOverTrash, setIsOverTrash] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const trashRef = useRef<HTMLDivElement>(null);

  const updateCard = (id: string, updates: Partial<CardType>) => {
    setCards({ ...cards, [id]: { ...cards[id], ...updates } });
  };

  const checkTrashZone = (clientX: number, clientY: number): boolean => {
    if (!trashRef.current) return false;
    return isPointInRect(clientX, clientY, trashRef.current.getBoundingClientRect());
  };

  const handleMouseMove = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (!dragState || !boardRef.current) return;

    const container = boardRef.current;
    const containerRect = container.getBoundingClientRect();
    const { clientWidth, clientHeight } = container;

    // Check if dragging over trash zone
    if (dragState.type === 'drag') {
      setIsOverTrash(checkTrashZone(ev.clientX, ev.clientY));
    }

    if (dragState.type === 'resize') {
      const { card, handle, startPos, startSize } = dragState;
      const deltaX = ev.pageX - startPos.x;
      const deltaY = ev.pageY - startPos.y;

      let width = startSize.width;
      let height = startSize.height;
      let left = card.position.left;
      let top = card.position.top;

      // Calculate new dimensions based on handle
      if (handle.includes('e')) {
        width = Math.max(MIN_SIZE.width, startSize.width + deltaX);
      }
      if (handle.includes('w')) {
        width = Math.max(MIN_SIZE.width, startSize.width - deltaX);
        left = card.position.left + deltaX;
      }
      if (handle.includes('s')) {
        height = Math.max(MIN_SIZE.height, startSize.height + deltaY);
      }
      if (handle.includes('n')) {
        height = Math.max(MIN_SIZE.height, startSize.height - deltaY);
        top = card.position.top + deltaY;
      }

      // Constrain dimensions and position to container
      const maxWidth = clientWidth - left - HANDLE_OFFSET;
      const maxHeight = clientHeight - top - HANDLE_OFFSET;
      width = constrainToContainer(width, MIN_SIZE.width, maxWidth);
      height = constrainToContainer(height, MIN_SIZE.height, maxHeight);
      
      left = constrainToContainer(left, HANDLE_OFFSET, clientWidth - width - HANDLE_OFFSET);
      top = constrainToContainer(top, HANDLE_OFFSET, clientHeight - height - HANDLE_OFFSET);

      updateCard(card.id, { position: { top, left }, size: { width, height } });
    } else if (dragState.type === 'drag') {
      const { card, offset } = dragState;
      
      // Calculate new position relative to container
      const newLeft = ev.clientX - containerRect.left - offset.x;
      const newTop = ev.clientY - containerRect.top - offset.y;

      // Constrain to container bounds
      const maxLeft = clientWidth - card.size.width - HANDLE_OFFSET;
      const maxTop = clientHeight - card.size.height - HANDLE_OFFSET;
      
      const left = constrainToContainer(newLeft, HANDLE_OFFSET, maxLeft);
      const top = constrainToContainer(newTop, HANDLE_OFFSET, maxTop);

      updateCard(card.id, { position: { top, left } });
    }
  };

  const handleMouseUp = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (dragState?.type === 'drag' && checkTrashZone(ev.clientX, ev.clientY)) {
      deleteCard(dragState.card.id);
    }
    setDragState(null);
    setIsOverTrash(false);
  };

  const addCard = (label: string) => {
    const container = boardRef.current;
    const id = uuid();
    const position = container
      ? { left: container.clientWidth * 0.5, top: container.clientHeight * 0.5 }
      : { left: 400, top: 300 };

    updateCard(id, {
      id,
      label,
      position,
      size: DEFAULT_SIZE,
    });
    setIsAddOpen(false);
  };

  const deleteCard = (id: string) => {
    const newCards = { ...cards };
    delete newCards[id];
    setCards(newCards);
  };

  return (
    <div
      className="position-fixed start-0 w-100 bg-light overflow-hidden"
      style={{ top: '0', height: '100vh' }}
      ref={boardRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {Object.values(cards).map((card) => (
        <Card
          key={card.id}
          card={card}
          onDragStart={(offset) => setDragState({ type: 'drag', card, offset })}
          onResizeStart={(handle, startPos) =>
            setDragState({
              type: 'resize',
              card,
              handle,
              startPos,
              startSize: card.size,
            })
          }
        />
      ))}
      <TrashZone ref={trashRef} isOverTrash={isOverTrash} />
      <AddButton onClick={() => setIsAddOpen(true)} />
      {isAddOpen && (
        <Suspense fallback={<div>Loading...</div>}>
          <AddModal
            isOpen={isAddOpen}
            onClose={() => setIsAddOpen(false)}
            onAdd={addCard}
          />
        </Suspense>
      )}
    </div>
  );
};

export default AppCards;
