import { createEvent, fireEvent, render, screen } from '@testing-library/preact';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';

describe('Modal', () => {
  const defaultProps = {
    title: 'Test Modal',
    onClose: vi.fn(),
  };

  it('should render the dialog with its title', () => {
    render(
      <Modal {...defaultProps}>
        <p>Content</p>
      </Modal>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should focus the close button when opened', () => {
    render(
      <Modal {...defaultProps}>
        <p>Content</p>
      </Modal>,
    );

    expect(screen.getByRole('button', { name: 'Close modal' })).toHaveFocus();
  });

  it('should call onClose when the close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal {...defaultProps} onClose={onClose}>
        <p>Content</p>
      </Modal>,
    );

    fireEvent.click(screen.getByRole('button', { name: /close modal/i }));

    expect(onClose).toHaveBeenCalled();
  });

  it('should call onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(
      <Modal {...defaultProps} onClose={onClose}>
        <p>Content</p>
      </Modal>,
    );

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });

    expect(onClose).toHaveBeenCalled();
  });

  it('should call onClose when the backdrop is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal {...defaultProps} onClose={onClose}>
        <p>Content</p>
      </Modal>,
    );

    fireEvent.click(screen.getByRole('dialog').parentElement!);

    expect(onClose).toHaveBeenCalled();
  });

  it('should not call onClose when clicking inside the dialog', () => {
    const onClose = vi.fn();
    render(
      <Modal {...defaultProps} onClose={onClose}>
        <p>Content</p>
      </Modal>,
    );

    fireEvent.click(screen.getByRole('dialog'));
    fireEvent.click(screen.getByText('Content'));

    expect(onClose).not.toHaveBeenCalled();
  });

  describe('Focus Trap', () => {
    it('should move focus to the first element when Tab is pressed on the last element', () => {
      render(
        <Modal {...defaultProps}>
          <button>Inside</button>
        </Modal>,
      );
      screen.getByRole('button', { name: 'Inside' }).focus();

      fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Tab' });

      expect(screen.getByRole('button', { name: 'Close modal' })).toHaveFocus();
    });

    it('should move focus to the last element when Shift+Tab is pressed on the first element', () => {
      render(
        <Modal {...defaultProps}>
          <button>Inside</button>
        </Modal>,
      );
      screen.getByRole('button', { name: 'Close modal' }).focus();

      fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Tab', shiftKey: true });

      expect(screen.getByRole('button', { name: 'Inside' })).toHaveFocus();
    });

    it('should not intercept Tab while focus is on a middle element', () => {
      render(
        <Modal {...defaultProps}>
          <button>First</button>
          <button>Second</button>
        </Modal>,
      );
      const dialog = screen.getByRole('dialog');
      const firstInsideButton = screen.getByRole('button', { name: 'First' });
      firstInsideButton.focus();

      const tabEvent = createEvent.keyDown(dialog, { key: 'Tab' });
      fireEvent(dialog, tabEvent);

      expect(tabEvent.defaultPrevented).toBe(false);
      expect(firstInsideButton).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('should be a modal dialog named after its title', () => {
      render(
        <Modal {...defaultProps}>
          <p>Content</p>
        </Modal>,
      );
      const dialog = screen.getByRole('dialog');

      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAccessibleName('Test Modal');
    });
  });
});
