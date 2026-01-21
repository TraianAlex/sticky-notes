import { useState } from 'react';
import Modal from 'react-modal';
import { Button } from 'react-bootstrap';

Modal.setAppElement('#root');

interface AddModalProps {
  isOpen: boolean;
  onAdd: (text: string) => void;
  onClose: () => void;
}

export default function AddModal({ isOpen, onAdd, onClose }: AddModalProps) {
  const [cardText, setCardText] = useState('');

  const handleSubmit = () => {
    if (cardText.trim()) {
      onAdd(cardText.trim());
      setCardText('');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldFocusAfterRender={true}
      shouldReturnFocusAfterClose={true}
      ariaHideApp={true}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          transform: 'translate(-50%, -50%)',
          width: '18.75rem',
          padding: '1.25rem',
        },
      }}
      contentLabel="Add Card"
    >
      <h4>Add a new card</h4>
      <input
        type="text"
        className="form-control mt-3 mb-3"
        value={cardText}
        onChange={(e) => setCardText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        autoFocus
        placeholder="Enter card text..."
      />
      <div className="d-flex gap-2">
        <Button onClick={handleSubmit} className="btn-primary flex-fill">
          Add
        </Button>
        <Button onClick={onClose} className="btn-secondary flex-fill">
          Cancel
        </Button>
      </div>
    </Modal>
  );
}
