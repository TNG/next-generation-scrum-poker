import { fireEvent, render, screen } from '@testing-library/preact';
import { describe, expect, it, vi } from 'vitest';
import { CustomScaleModal } from './CustomScaleModal';

describe('CustomScaleModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSave: vi.fn(),
  };

  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      render(<CustomScaleModal {...defaultProps} isOpen={false} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render when isOpen is true', () => {
      render(<CustomScaleModal {...defaultProps} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Custom Scale')).toBeInTheDocument();
    });

    it('should render all sections', () => {
      render(<CustomScaleModal {...defaultProps} />);
      expect(screen.getByRole('textbox', { name: /card value/i })).toBeInTheDocument();
      expect(screen.getByText(/special cards/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save scale/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });
  });

  describe('Input Handling', () => {
    it('should convert lowercase to uppercase', () => {
      render(<CustomScaleModal {...defaultProps} />);
      const input = screen.getByRole('textbox', { name: /card value/i }) as HTMLInputElement;

      fireEvent.input(input, { target: { value: 'xs' } });
      expect(input.value).toBe('XS');
    });

    it('should limit input to 4 characters', () => {
      render(<CustomScaleModal {...defaultProps} />);
      const input = screen.getByRole('textbox', { name: /card value/i }) as HTMLInputElement;

      fireEvent.input(input, { target: { value: 'ABCDE' } });
      expect(input.value).toBe('ABCD');
    });

    it('should show character counter', () => {
      render(<CustomScaleModal {...defaultProps} />);
      const input = screen.getByRole('textbox', { name: /card value/i });

      expect(screen.getByText('0/4 characters')).toBeInTheDocument();

      fireEvent.input(input, { target: { value: 'XS' } });
      expect(screen.getByText('2/4 characters')).toBeInTheDocument();
    });

    it('should show error for invalid characters', () => {
      render(<CustomScaleModal {...defaultProps} />);
      const input = screen.getByRole('textbox', { name: /card value/i });

      fireEvent.input(input, { target: { value: 'A-B' } });
      expect(screen.getByText(/only alphanumeric characters allowed/i)).toBeInTheDocument();
    });
  });

  describe('Adding Cards', () => {
    it('should add card when Add button is clicked', () => {
      render(<CustomScaleModal {...defaultProps} />);
      const input = screen.getByRole('textbox', { name: /card value/i });
      const addButton = screen.getByRole('button', { name: /add card value/i });

      fireEvent.input(input, { target: { value: 'XS' } });
      fireEvent.click(addButton);

      expect(screen.getByText('XS')).toBeInTheDocument();
      expect(screen.getByText('Card Values (1/12)')).toBeInTheDocument();
    });

    it('should add card when Enter is pressed', () => {
      render(<CustomScaleModal {...defaultProps} />);
      const input = screen.getByRole('textbox', { name: /card value/i });

      fireEvent.input(input, { target: { value: 'M' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(screen.getByText('M')).toBeInTheDocument();
    });

    it('should clear input after adding card', () => {
      render(<CustomScaleModal {...defaultProps} />);
      const input = screen.getByRole('textbox', { name: /card value/i }) as HTMLInputElement;
      const addButton = screen.getByRole('button', { name: /add card value/i });

      fireEvent.input(input, { target: { value: 'L' } });
      fireEvent.click(addButton);

      expect(input.value).toBe('');
    });

    it('should disable Add button when input is empty', () => {
      render(<CustomScaleModal {...defaultProps} />);
      const addButton = screen.getByRole('button', { name: /add card value/i });

      expect(addButton).toBeDisabled();
    });

    it('should disable Add button when input has error', () => {
      render(<CustomScaleModal {...defaultProps} />);
      const input = screen.getByRole('textbox', { name: /card value/i });
      const addButton = screen.getByRole('button', { name: /add card value/i });

      fireEvent.input(input, { target: { value: 'A-B' } });
      expect(addButton).toBeDisabled();
    });

    it('should show error for duplicate values', () => {
      render(<CustomScaleModal {...defaultProps} />);
      const input = screen.getByRole('textbox', { name: /card value/i });
      const addButton = screen.getByRole('button', { name: /add card value/i });

      // Add first card
      fireEvent.input(input, { target: { value: 'XS' } });
      fireEvent.click(addButton);

      // Try to add duplicate
      fireEvent.input(input, { target: { value: 'XS' } });
      expect(screen.getByText(/this value already exists/i)).toBeInTheDocument();
      expect(addButton).toBeDisabled();
    });

    it('should show error when maximum cards reached', () => {
      render(<CustomScaleModal {...defaultProps} />);
      const input = screen.getByRole('textbox', { name: /card value/i });
      const addButton = screen.getByRole('button', { name: /add card value/i });

      // Add 12 cards
      for (let i = 0; i < 12; i++) {
        fireEvent.input(input, { target: { value: `C${i}` } });
        fireEvent.click(addButton);
      }

      expect(screen.getByText('Card Values (12/12)')).toBeInTheDocument();

      // Try to add one more
      fireEvent.input(input, { target: { value: 'NEW' } });
      expect(screen.getByText(/maximum 12 cards allowed/i)).toBeInTheDocument();
      expect(addButton).toBeDisabled();
    });
  });

  describe('Removing Cards', () => {
    it('should remove card when remove button is clicked', () => {
      render(<CustomScaleModal {...defaultProps} />);
      const input = screen.getByRole('textbox', { name: /card value/i });
      const addButton = screen.getByRole('button', { name: /add card value/i });

      fireEvent.input(input, { target: { value: 'XS' } });
      fireEvent.click(addButton);

      const removeButton = screen.getByRole('button', { name: /remove xs/i });
      fireEvent.click(removeButton);

      expect(screen.queryByText('XS')).not.toBeInTheDocument();
      expect(screen.getByText('No cards added yet')).toBeInTheDocument();
    });

    it('should update card count after removal', () => {
      render(<CustomScaleModal {...defaultProps} />);
      const input = screen.getByRole('textbox', { name: /card value/i });
      const addButton = screen.getByRole('button', { name: /add card value/i });

      // Add two cards
      fireEvent.input(input, { target: { value: 'XS' } });
      fireEvent.click(addButton);
      fireEvent.input(input, { target: { value: 'M' } });
      fireEvent.click(addButton);

      expect(screen.getByText('Card Values (2/12)')).toBeInTheDocument();

      // Remove one
      const removeButton = screen.getByRole('button', { name: /remove xs/i });
      fireEvent.click(removeButton);

      expect(screen.getByText('Card Values (1/12)')).toBeInTheDocument();
    });
  });

  describe('Special Cards', () => {
    it('should toggle infinite card', () => {
      render(<CustomScaleModal {...defaultProps} />);
      const infiniteButton = screen.getByRole('button', { name: /toggle infinite card/i });

      expect(infiniteButton).toHaveAttribute('aria-pressed', 'false');

      fireEvent.click(infiniteButton);
      expect(infiniteButton).toHaveAttribute('aria-pressed', 'true');

      fireEvent.click(infiniteButton);
      expect(infiniteButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('should toggle question card', () => {
      render(<CustomScaleModal {...defaultProps} />);
      const questionButton = screen.getByRole('button', { name: /toggle question card/i });

      fireEvent.click(questionButton);
      expect(questionButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should toggle coffee card', () => {
      render(<CustomScaleModal {...defaultProps} />);
      const coffeeButton = screen.getByRole('button', { name: /toggle coffee card/i });

      fireEvent.click(coffeeButton);
      expect(coffeeButton).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Save Functionality', () => {
    it('should disable Save button when no cards added', () => {
      render(<CustomScaleModal {...defaultProps} />);
      const saveButton = screen.getByRole('button', { name: /save scale/i });

      expect(saveButton).toBeDisabled();
    });

    it('should enable Save button when at least one card is added', () => {
      render(<CustomScaleModal {...defaultProps} />);
      const input = screen.getByRole('textbox', { name: /card value/i });
      const addButton = screen.getByRole('button', { name: /add card value/i });
      const saveButton = screen.getByRole('button', { name: /save scale/i });

      fireEvent.input(input, { target: { value: 'XS' } });
      fireEvent.click(addButton);

      expect(saveButton).not.toBeDisabled();
    });

    it('should call onSave with correct scale when Save is clicked', () => {
      const onSave = vi.fn();
      render(<CustomScaleModal {...defaultProps} onSave={onSave} />);
      const input = screen.getByRole('textbox', { name: /card value/i });
      const addButton = screen.getByRole('button', { name: /add card value/i });
      const saveButton = screen.getByRole('button', { name: /save scale/i });

      // Add cards
      fireEvent.input(input, { target: { value: 'XS' } });
      fireEvent.click(addButton);
      fireEvent.input(input, { target: { value: 'M' } });
      fireEvent.click(addButton);

      fireEvent.click(saveButton);

      expect(onSave).toHaveBeenCalledWith(['XS', 'M']);
    });

    it('should include special cards in correct order when saving', () => {
      const onSave = vi.fn();
      render(<CustomScaleModal {...defaultProps} onSave={onSave} />);
      const input = screen.getByRole('textbox', { name: /card value/i });
      const addButton = screen.getByRole('button', { name: /add card value/i });
      const saveButton = screen.getByRole('button', { name: /save scale/i });

      // Add card
      fireEvent.input(input, { target: { value: '1' } });
      fireEvent.click(addButton);

      // Toggle special cards
      fireEvent.click(screen.getByRole('button', { name: /toggle coffee card/i }));
      fireEvent.click(screen.getByRole('button', { name: /toggle infinite card/i }));

      fireEvent.click(saveButton);

      expect(onSave).toHaveBeenCalledWith(['1', '∞', 'coffee']);
    });
  });

  describe('Cancel Functionality', () => {
    it('should call onClose when Cancel is clicked', () => {
      const onClose = vi.fn();
      render(<CustomScaleModal {...defaultProps} onClose={onClose} />);
      const cancelButton = screen.getByRole('button', { name: /cancel/i });

      fireEvent.click(cancelButton);

      expect(onClose).toHaveBeenCalled();
    });

    it('should call onClose when close button is clicked', () => {
      const onClose = vi.fn();
      render(<CustomScaleModal {...defaultProps} onClose={onClose} />);
      const closeButton = screen.getByRole('button', { name: /close modal/i });

      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalled();
    });

    it('should call onClose when Escape is pressed', () => {
      const onClose = vi.fn();
      render(<CustomScaleModal {...defaultProps} onClose={onClose} />);
      const dialog = screen.getByRole('dialog');

      fireEvent.keyDown(dialog, { key: 'Escape' });

      expect(onClose).toHaveBeenCalled();
    });

    // Note: Backdrop click functionality is difficult to test in jsdom
    // The close functionality is already tested via close button and Escape key
  });

  describe('Keyboard Navigation', () => {
    it('should reorder cards with arrow keys', () => {
      render(<CustomScaleModal {...defaultProps} />);
      const input = screen.getByRole('textbox', { name: /card value/i });
      const addButton = screen.getByRole('button', { name: /add card value/i });

      // Add three cards
      fireEvent.input(input, { target: { value: 'A' } });
      fireEvent.click(addButton);
      fireEvent.input(input, { target: { value: 'B' } });
      fireEvent.click(addButton);
      fireEvent.input(input, { target: { value: 'C' } });
      fireEvent.click(addButton);

      const cardItems = screen.getAllByRole('listitem');
      expect(cardItems).toHaveLength(3);

      // Move second card down
      fireEvent.keyDown(cardItems[1], { key: 'ArrowDown' });

      const updatedItems = screen.getAllByRole('listitem');
      expect(updatedItems[1].textContent).toContain('C');
      expect(updatedItems[2].textContent).toContain('B');
    });

    it('should move card up with ArrowUp', () => {
      render(<CustomScaleModal {...defaultProps} />);
      const input = screen.getByRole('textbox', { name: /card value/i });
      const addButton = screen.getByRole('button', { name: /add card value/i });

      // Add two cards
      fireEvent.input(input, { target: { value: 'A' } });
      fireEvent.click(addButton);
      fireEvent.input(input, { target: { value: 'B' } });
      fireEvent.click(addButton);

      const cardItems = screen.getAllByRole('listitem');

      // Move second card up
      fireEvent.keyDown(cardItems[1], { key: 'ArrowUp' });

      const updatedItems = screen.getAllByRole('listitem');
      expect(updatedItems[0].textContent).toContain('B');
      expect(updatedItems[1].textContent).toContain('A');
    });

    it('should not move first card up', () => {
      render(<CustomScaleModal {...defaultProps} />);
      const input = screen.getByRole('textbox', { name: /card value/i });
      const addButton = screen.getByRole('button', { name: /add card value/i });

      fireEvent.input(input, { target: { value: 'A' } });
      fireEvent.click(addButton);
      fireEvent.input(input, { target: { value: 'B' } });
      fireEvent.click(addButton);

      const cardItems = screen.getAllByRole('listitem');

      // Try to move first card up
      fireEvent.keyDown(cardItems[0], { key: 'ArrowUp' });

      const updatedItems = screen.getAllByRole('listitem');
      expect(updatedItems[0].textContent).toContain('A');
    });

    it('should not move last card down', () => {
      render(<CustomScaleModal {...defaultProps} />);
      const input = screen.getByRole('textbox', { name: /card value/i });
      const addButton = screen.getByRole('button', { name: /add card value/i });

      fireEvent.input(input, { target: { value: 'A' } });
      fireEvent.click(addButton);
      fireEvent.input(input, { target: { value: 'B' } });
      fireEvent.click(addButton);

      const cardItems = screen.getAllByRole('listitem');

      // Try to move last card down
      fireEvent.keyDown(cardItems[1], { key: 'ArrowDown' });

      const updatedItems = screen.getAllByRole('listitem');
      expect(updatedItems[1].textContent).toContain('B');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<CustomScaleModal {...defaultProps} />);
      const dialog = screen.getByRole('dialog');

      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('should mark input as invalid when there is an error', () => {
      render(<CustomScaleModal {...defaultProps} />);
      const input = screen.getByRole('textbox', { name: /card value/i });

      fireEvent.input(input, { target: { value: 'A-B' } });

      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'input-error');
    });

    it('should have proper labels for all interactive elements', () => {
      render(<CustomScaleModal {...defaultProps} />);

      expect(screen.getByRole('textbox', { name: /card value/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add card value/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /close modal/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /toggle infinite card/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /toggle question card/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /toggle coffee card/i })).toBeInTheDocument();
    });
  });
});
