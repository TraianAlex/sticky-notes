import { forwardRef } from 'react';

interface TrashZoneProps {
  isOverTrash: boolean;
}

const TRASH_ZONE_SIZE = '7.5rem'; // 120px

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
          borderStyle: 'dashed',
          backgroundColor: isOverTrash ? 'rgba(220, 53, 69, 0.15)' : 'rgba(0, 0, 0, 0.05)',
          fontSize: '2rem',
          transition: 'all 0.2s',
          pointerEvents: 'none',
          zIndex: 1000,
          transform: isOverTrash ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        🗑️
        <div className={`small mt-2 text-center fw-bold ${isOverTrash ? 'text-danger' : 'text-secondary'}`}>
          {isOverTrash ? 'Drop to delete' : 'Trash'}
        </div>
      </div>
    );
  }
);

TrashZone.displayName = 'TrashZone';
