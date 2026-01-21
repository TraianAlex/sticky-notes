import { memo } from 'react';
import { Button } from 'react-bootstrap';

interface AddButtonProps {
  onClick: () => void;
}

export const AddButton = memo<AddButtonProps>(({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="rounded-circle bg-dark text-white position-absolute fs-5 top-0 end-0 mt-4 me-4"
      style={{
        height: '6rem',
        width: '6rem',
      }}
    >
      Add
    </Button>
  );
});
