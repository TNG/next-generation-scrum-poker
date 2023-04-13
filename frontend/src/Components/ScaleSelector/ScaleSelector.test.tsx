import { createEvent, fireEvent, queryAllByRole, screen } from '@testing-library/preact';
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
    const { getByRole } = render();
    assertDropdownIsClosed();

    // when
    const changeScaleButton = getByRole('button', { name: 'Change Scale' });
    changeScaleButton.getBoundingClientRect = () =>
      ({
        bottom: window.innerHeight - 500,
      } as DOMRect);
    fireEvent.click(changeScaleButton);

    // then
    const dropdown = getDropdown();
    expect(dropdown).not.toHaveClass('onTop');
    expect(dropdown).toHaveFocus();
    expect(queryAllByRole(dropdown, 'option').map((option) => option.textContent)).toEqual([
      'Fibonacci',
      'Cohen',
      'Fixed Ratio',
      'Sizes',
    ]);
    expect(getSelectedOptions(dropdown)).toEqual(['Cohen']);
  });

  it('opens to the top if there is not enough space below', () => {
    // given
    const { getByRole } = render();

    // when
    const changeScaleButton = getByRole('button', { name: 'Change Scale' });
    changeScaleButton.getBoundingClientRect = () =>
      ({
        bottom: window.innerHeight,
      } as DOMRect);
    fireEvent.click(changeScaleButton);

    // then
    expect(getDropdown()).toHaveClass('onTop');
  });

  it('preselects the current scale', () => {
    // given
    const { getByRole } = render({ state: { scale: SCALES.SIZES_SCALE.values } });

    // when
    fireEvent.click(getByRole('button', { name: 'Change Scale' }));

    // then
    const dropdown = getDropdown();
    expect(getSelectedOptions(dropdown)).toEqual(['Sizes']);
  });

  it('does not preselect a scale if the scale is does not match', () => {
    // given
    const { getByRole } = render({
      state: { scale: SCALES.SIZES_SCALE.values.slice(0, -1) },
    });

    // when
    fireEvent.click(getByRole('button', { name: 'Change Scale' }));

    // then
    const dropdown = getDropdown();
    expect(getSelectedOptions(dropdown)).toEqual([]);
  });

  it('allows to select a scale', () => {
    // given
    const setScale = jest.fn();
    const { getByRole, getByText } = render({ setScale });

    // when
    fireEvent.click(getByRole('button', { name: 'Change Scale' }));
    fireEvent.click(getByText('Sizes'));

    // then
    expect(setScale).toHaveBeenCalledWith(SCALES.SIZES_SCALE.values);
    assertDropdownIsClosed();
  });

  it('supports keyboard navigation', () => {
    // given
    const setScale = jest.fn();
    const { getByRole } = render({ setScale });

    // when
    // As this is a real button, we cannot use synthetic events to trigger it
    const changeScaleButton = getByRole('button', { name: 'Change Scale' });
    fireEvent.click(changeScaleButton);

    // then
    const dropdown = getDropdown();
    expect(getSelectedOptions(dropdown)).toEqual(['Cohen']);

    fireEvent.keyDown(dropdown, { code: 'ArrowDown' });
    expect(getSelectedOptions(dropdown)).toEqual(['Fixed Ratio']);

    fireEvent.keyDown(dropdown, { code: 'ArrowDown' });
    expect(getSelectedOptions(dropdown)).toEqual(['Sizes']);

    fireEvent.keyDown(dropdown, { code: 'ArrowDown' });
    expect(getSelectedOptions(dropdown)).toEqual(['Fibonacci']);

    fireEvent.keyDown(dropdown, { code: 'ArrowUp' });
    expect(getSelectedOptions(dropdown)).toEqual(['Sizes']);

    fireEvent.keyDown(dropdown, { code: 'ArrowUp' });
    expect(getSelectedOptions(dropdown)).toEqual(['Fixed Ratio']);

    fireEvent.keyDown(dropdown, { code: 'PageUp' });
    expect(getSelectedOptions(dropdown)).toEqual(['Fibonacci']);

    fireEvent.keyDown(dropdown, { code: 'PageDown' });
    expect(getSelectedOptions(dropdown)).toEqual(['Sizes']);

    fireEvent.keyDown(dropdown, { code: 'Home' });
    expect(getSelectedOptions(dropdown)).toEqual(['Fibonacci']);

    fireEvent.keyDown(dropdown, { code: 'End' });
    expect(getSelectedOptions(dropdown)).toEqual(['Sizes']);

    expect(setScale).not.toHaveBeenCalled();
    const keyDownEnterEvent = createEvent.keyDown(dropdown, { code: 'Enter' });
    fireEvent(dropdown, keyDownEnterEvent);
    expect(keyDownEnterEvent.defaultPrevented).toBe(true);
    expect(setScale).toHaveBeenCalledWith(SCALES.SIZES_SCALE.values);
    assertDropdownIsClosed();
    expect(changeScaleButton).toHaveFocus();
  });

  it('supports selecting an element via space key', () => {
    // given
    const setScale = jest.fn();
    const { getByRole } = render({ setScale });

    // when
    const changeScaleButton = getByRole('button', { name: 'Change Scale' });
    fireEvent.click(changeScaleButton);
    const dropdown = getDropdown();
    fireEvent.keyDown(dropdown, { code: 'Space' });

    // then
    expect(setScale).toHaveBeenCalledWith(SCALES.COHEN_SCALE.values);
    assertDropdownIsClosed();
    expect(changeScaleButton).toHaveFocus();
  });

  it('combines mouse and keyboard selection', () => {
    // given
    const setScale = jest.fn();
    const { getByRole, getByText } = render({ setScale });

    // when
    const changeScaleButton = getByRole('button', { name: 'Change Scale' });
    fireEvent.click(changeScaleButton);
    const dropdown = getDropdown();

    // then
    fireEvent.mouseMove(getByText('Sizes'));
    expect(getSelectedOptions(dropdown)).toEqual(['Sizes']);

    fireEvent.keyDown(dropdown, { code: 'ArrowUp' });
    expect(getSelectedOptions(dropdown)).toEqual(['Fixed Ratio']);

    fireEvent.mouseMove(getByText('Sizes'));
    fireEvent.mouseLeave(getByText('Sizes'));
    expect(getSelectedOptions(dropdown)).toEqual([]);

    fireEvent.mouseMove(getByText('Cohen'));
    expect(getSelectedOptions(dropdown)).toEqual(['Cohen']);

    fireEvent.keyDown(dropdown, { code: 'Enter' });
    expect(setScale).toHaveBeenCalledWith(SCALES.COHEN_SCALE.values);
    assertDropdownIsClosed();
    expect(changeScaleButton).toHaveFocus();
  });

  it('closes the popup without selection when enter is pressed without a selected item', () => {
    // given
    const setScale = jest.fn();
    const { getByRole, getByText } = render({ setScale });

    // when
    const changeScaleButton = getByRole('button', { name: 'Change Scale' });
    fireEvent.click(changeScaleButton);
    const dropdown = getDropdown();
    fireEvent.mouseMove(getByText('Fibonacci'));
    fireEvent.mouseLeave(getByText('Fibonacci'));
    fireEvent.keyDown(dropdown, { code: 'Enter' });

    // then
    expect(setScale).not.toHaveBeenCalled();
    assertDropdownIsClosed();
    expect(changeScaleButton).toHaveFocus();
  });

  it('closes the popup without selection when escape is pressed', () => {
    // given
    const setScale = jest.fn();
    const { getByRole } = render({ setScale });

    // when
    const changeScaleButton = getByRole('button', { name: 'Change Scale' });
    fireEvent.click(changeScaleButton);
    const dropdown = getDropdown();
    fireEvent.keyDown(dropdown, { code: 'Escape' });

    // then
    expect(setScale).not.toHaveBeenCalled();
    assertDropdownIsClosed();
    expect(changeScaleButton).toHaveFocus();
  });

  it('closes the popup when clicking the button again', () => {
    // given
    const { getByRole } = render();

    // when
    const changeScaleButton = getByRole('button', { name: 'Change Scale' });
    fireEvent.click(changeScaleButton);
    fireEvent.click(changeScaleButton);

    // then
    assertDropdownIsClosed();
  });

  it('closes the popup and disables the button when the connection is lost', () => {
    // given
    const { getByRole, rerender } = render();

    // when
    const changeScaleButton = getByRole('button', { name: 'Change Scale' });
    fireEvent.click(changeScaleButton);
    rerender({ connected: false });

    // then
    assertDropdownIsClosed();
    expect(changeScaleButton).toBeDisabled();

    // when
    rerender({ connected: true });

    // then
    assertDropdownIsClosed();
    expect(changeScaleButton).toBeEnabled();
  });

  it('closes the popup when focus is lost', () => {
    // given
    const { getByRole } = render();

    // when
    const changeScaleButton = getByRole('button', { name: 'Change Scale' });
    fireEvent.click(changeScaleButton);
    fireEvent.blur(getDropdown());

    // then
    assertDropdownIsClosed();
  });

  it('does not close the popup when focus is lost to the button', () => {
    // given
    const { getByRole } = render();

    // when
    const changeScaleButton = getByRole('button', { name: 'Change Scale' });
    fireEvent.click(changeScaleButton);
    const dropdown = getDropdown();
    fireEvent.blur(dropdown, { relatedTarget: changeScaleButton });
    fireEvent.blur(changeScaleButton, { relatedTarget: dropdown });

    // then
    expect(dropdown).toBeVisible();
  });
});

const assertDropdownIsClosed = () =>
  expect(screen.queryByRole('listbox', { name: 'scales' })).not.toBeInTheDocument();

const getDropdown = () => screen.getByRole('listbox', { name: 'scales' });

const getSelectedOptions = (container: HTMLElement) =>
  queryAllByRole(container, 'option')
    .filter((option) => option.getAttribute('aria-selected') === 'true')
    .map((option) => option.textContent);
