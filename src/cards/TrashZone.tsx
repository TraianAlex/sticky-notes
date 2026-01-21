import { forwardRef } from 'react';

interface TrashZoneProps {
  isOverTrash: boolean;
}

const TRASH_ZONE_SIZE = '8rem';

export const TrashZone = forwardRef<HTMLDivElement, TrashZoneProps>(
  ({ isOverTrash }, ref) => {
    return (
      <div
        ref={ref}
        className={`position-absolute d-flex flex-column align-items-center justify-content-center border border-3 rounded ${isOverTrash ? 'border-danger' : 'border-secondary'}`}
        style={{
          bottom: '1.875rem',
          right: '1.875rem',
          width: TRASH_ZONE_SIZE,
          height: TRASH_ZONE_SIZE,
          fontSize: '2rem',
          transition: 'all 0.2s',
          pointerEvents: 'none',
          zIndex: 1000,
          transform: isOverTrash ? 'scale(1.4)' : 'scale(1)',
        }}
      >
        🗑️
        <div className={`small mt-2 text-center fw-bold ${isOverTrash ? 'text-danger mb-5' : 'text-secondary'}`}>
          {isOverTrash ? 'Drop to delete' : 'Trash'}
        </div>
      </div>
    );
  }
);

TrashZone.displayName = 'TrashZone';
