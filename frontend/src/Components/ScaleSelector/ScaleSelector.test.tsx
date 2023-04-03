import {
  createEvent,
  fireEvent,
  getByRole,
  queryAllByRole,
  queryByRole,
} from '@testing-library/preact';
import { VOTE_NOTE_VOTED } from '../../../../shared/cards';
import { SCALES } from '../../../../shared/scales';
import { getRenderWithWebSocket } from '../../test-helpers/renderWithWebSocket';
import { ScaleSelector } from './ScaleSelector';

const render = getRenderWithWebSocket(<ScaleSelector />, {
  connected: true,
  loginData: { user: 'TheUser', session: 'TheSession123456' },
  loggedIn: true,
  state: {
    resultsVisible: false,
    votes: {
      TheUser: VOTE_NOTE_VOTED,
    },
    scale: SCALES.COHEN_SCALE.values,
  },
});

describe('The ScaleSelector', () => {
  beforeEach(() => {
    HTMLUListElement.prototype.scrollIntoView = jest.fn();
  });

  it('can be opened to display the list of available scales', () => {
    // given
    const { container, getByRole } = render();
    assertDropdownIsClosed(container);

    // when
    fireEvent.click(getByRole('button', { name: 'Change Scale' }));

    // then
    const dropdown = getDropdown(container);
    expect(dropdown.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'nearest',
    });
    expect(dropdown).toHaveFocus();
    expect(queryAllByRole(dropdown, 'option').map((option) => option.textContent)).toEqual([
      'Fibonacci',
      'Cohen',
      'Fixed Ratio',
      'Sizes',
    ]);
  });

  it('allows to select a scale', () => {
    // given
    const setScale = jest.fn();
    const { container, getByRole, getByText } = render({ setScale });

    // when
    fireEvent.click(getByRole('button', { name: 'Change Scale' }));
    fireEvent.click(getByText('Sizes'));

    // then
    expect(setScale).toHaveBeenCalledWith(SCALES.SIZES_SCALE.values);
    assertDropdownIsClosed(container);
  });

  it('supports keyboard navigation', () => {
    // given
    const setScale = jest.fn();
    const { container, getByRole } = render({ setScale });

    // when
    // As this is a real button, we cannot use synthetic events to trigger it
    const changeScaleButton = getByRole('button', { name: 'Change Scale' });
    fireEvent.click(changeScaleButton);

    // then
    const dropdown = getDropdown(container);
    expect(getSelectedOptions(dropdown)).toEqual(['Fibonacci']);

    fireEvent.keyDown(dropdown, { key: 'ArrowDown' });
    expect(getSelectedOptions(dropdown)).toEqual(['Cohen']);

    fireEvent.keyDown(dropdown, { key: 'ArrowDown' });
    expect(getSelectedOptions(dropdown)).toEqual(['Fixed Ratio']);

    fireEvent.keyDown(dropdown, { key: 'ArrowDown' });
    expect(getSelectedOptions(dropdown)).toEqual(['Sizes']);

    fireEvent.keyDown(dropdown, { key: 'ArrowDown' });
    expect(getSelectedOptions(dropdown)).toEqual(['Fibonacci']);

    fireEvent.keyDown(dropdown, { key: 'ArrowUp' });
    expect(getSelectedOptions(dropdown)).toEqual(['Sizes']);

    fireEvent.keyDown(dropdown, { key: 'ArrowUp' });
    expect(getSelectedOptions(dropdown)).toEqual(['Fixed Ratio']);

    fireEvent.keyDown(dropdown, { key: 'PageUp' });
    expect(getSelectedOptions(dropdown)).toEqual(['Fibonacci']);

    fireEvent.keyDown(dropdown, { key: 'PageDown' });
    expect(getSelectedOptions(dropdown)).toEqual(['Sizes']);

    fireEvent.keyDown(dropdown, { key: 'Home' });
    expect(getSelectedOptions(dropdown)).toEqual(['Fibonacci']);

    fireEvent.keyDown(dropdown, { key: 'End' });
    expect(getSelectedOptions(dropdown)).toEqual(['Sizes']);

    expect(setScale).not.toHaveBeenCalled();
    const keyDownEnterEvent = createEvent.keyDown(dropdown, { key: 'Enter' });
    fireEvent(dropdown, keyDownEnterEvent);
    expect(keyDownEnterEvent.defaultPrevented).toBe(true);
    expect(setScale).toHaveBeenCalledWith(SCALES.SIZES_SCALE.values);
    assertDropdownIsClosed(container);
    expect(changeScaleButton).toHaveFocus();
  });

  it('supports selecting an element via space key', () => {
    // given
    const setScale = jest.fn();
    const { container, getByRole } = render({ setScale });

    // when
    const changeScaleButton = getByRole('button', { name: 'Change Scale' });
    fireEvent.click(changeScaleButton);
    const dropdown = getDropdown(container);
    fireEvent.keyDown(dropdown, { key: ' ' });

    // then
    expect(setScale).toHaveBeenCalledWith(SCALES.FIBONACCI_SCALE.values);
    assertDropdownIsClosed(container);
    expect(changeScaleButton).toHaveFocus();
  });

  it('combines mouse and keyboard selection', () => {
    // given
    const setScale = jest.fn();
    const { container, getByRole, getByText } = render({ setScale });

    // when
    const changeScaleButton = getByRole('button', { name: 'Change Scale' });
    fireEvent.click(changeScaleButton);
    const dropdown = getDropdown(container);

    // then
    fireEvent.mouseMove(getByText('Sizes'));
    expect(getSelectedOptions(dropdown)).toEqual(['Sizes']);

    fireEvent.keyDown(dropdown, { key: 'ArrowUp' });
    expect(getSelectedOptions(dropdown)).toEqual(['Fixed Ratio']);

    fireEvent.mouseMove(getByText('Sizes'));
    fireEvent.mouseLeave(getByText('Sizes'));
    expect(getSelectedOptions(dropdown)).toEqual([]);

    fireEvent.mouseMove(getByText('Cohen'));
    expect(getSelectedOptions(dropdown)).toEqual(['Cohen']);

    fireEvent.keyDown(dropdown, { key: 'Enter' });
    expect(setScale).toHaveBeenCalledWith(SCALES.COHEN_SCALE.values);
    assertDropdownIsClosed(container);
    expect(changeScaleButton).toHaveFocus();
  });

  it('closes the popup without selection when enter is pressed without a selected item', () => {
    // given
    const setScale = jest.fn();
    const { container, getByRole, getByText } = render({ setScale });

    // when
    const changeScaleButton = getByRole('button', { name: 'Change Scale' });
    fireEvent.click(changeScaleButton);
    const dropdown = getDropdown(container);
    fireEvent.mouseMove(getByText('Fibonacci'));
    fireEvent.mouseLeave(getByText('Fibonacci'));
    fireEvent.keyDown(dropdown, { key: 'Enter' });

    // then
    expect(setScale).not.toHaveBeenCalled();
    assertDropdownIsClosed(container);
    expect(changeScaleButton).toHaveFocus();
  });

  it('closes the popup without selection when escape is pressed', () => {
    // given
    const setScale = jest.fn();
    const { container, getByRole } = render({ setScale });

    // when
    const changeScaleButton = getByRole('button', { name: 'Change Scale' });
    fireEvent.click(changeScaleButton);
    const dropdown = getDropdown(container);
    fireEvent.keyDown(dropdown, { key: 'Escape' });

    // then
    expect(setScale).not.toHaveBeenCalled();
    assertDropdownIsClosed(container);
    expect(changeScaleButton).toHaveFocus();
  });

  it('closes the popup when clicking the button again', () => {
    // given
    const { container, getByRole } = render();

    // when
    const changeScaleButton = getByRole('button', { name: 'Change Scale' });
    fireEvent.click(changeScaleButton);
    fireEvent.click(changeScaleButton);

    // then
    assertDropdownIsClosed(container);
  });

  it('closes the popup and disables the button when the connection is lost', () => {
    // given
    const { container, getByRole, rerender } = render();

    // when
    const changeScaleButton = getByRole('button', { name: 'Change Scale' });
    fireEvent.click(changeScaleButton);
    rerender({ connected: false });

    // then
    assertDropdownIsClosed(container);
    expect(changeScaleButton).toBeDisabled();

    // when
    rerender({ connected: true });

    // then
    assertDropdownIsClosed(container);
    expect(changeScaleButton).toBeEnabled();
  });

  it('closes the popup when focus is lost', () => {
    // given
    const { container, getByRole } = render();

    // when
    const changeScaleButton = getByRole('button', { name: 'Change Scale' });
    fireEvent.click(changeScaleButton);
    fireEvent.blur(getDropdown(container));

    // then
    assertDropdownIsClosed(container);
  });

  it('does not close the popup when focus is lost to the button', () => {
    // given
    const { container, getByRole } = render();

    // when
    const changeScaleButton = getByRole('button', { name: 'Change Scale' });
    fireEvent.click(changeScaleButton);
    const dropdown = getDropdown(container);
    fireEvent.blur(dropdown, { relatedTarget: changeScaleButton });
    fireEvent.blur(changeScaleButton, { relatedTarget: dropdown });

    // then
    expect(dropdown).toBeVisible();
  });
});

const assertDropdownIsClosed = (container: HTMLElement) =>
  expect(queryByRole(container, 'listbox', { name: 'scales' })).toBeNull();

const getDropdown = (container: HTMLElement) => getByRole(container, 'listbox', { name: 'scales' });

const getSelectedOptions = (container: HTMLElement) =>
  queryAllByRole(container, 'option')
    .filter((option) => option.getAttribute('aria-selected') === 'true')
    .map((option) => option.textContent);
