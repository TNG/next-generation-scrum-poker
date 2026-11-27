import { ComponentChildren, FunctionComponent } from 'preact';
import { useEffect, useId, useRef } from 'preact/hooks';
import classes from './Modal.module.css';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ComponentChildren;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export const Modal: FunctionComponent<ModalProps> = ({ title, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Tab' && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div class={classes.backdrop} onClick={handleBackdropClick}>
      <div
        class={classes.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={handleKeyDown}
        ref={modalRef}
      >
        <div class={classes.header}>
          <h2 id={titleId} class={classes.title}>
            {title}
          </h2>
          <button
            class={classes.closeButton}
            onClick={onClose}
            aria-label="Close modal"
            ref={closeButtonRef}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
