import { fireEvent } from '@testing-library/preact';
import { BUTTON_RESET_VOTES, BUTTON_CONNECTING } from '../../constants';
import { getRenderWithWebSocket } from '../../test-helpers/renderWithWebSocket';
import { ResetButton } from './ResetButton';

const render = getRenderWithWebSocket(<ResetButton />);

describe('The ResetButton', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
  });

  it('disables button if not connected', () => {
    const { getByRole } = render({
      connected: false,
    });

    expect(getByRole('button', { name: BUTTON_CONNECTING })).toBeDisabled();
  });

  it('enables button if connected', () => {
    const { getByRole } = render({
      connected: true,
    });

    expect(getByRole('button', { name: BUTTON_RESET_VOTES })).toBeEnabled();
  });

  it('asks the user to confirm on a quick reset', () => {
    const resetVotes = jest.fn();
    const confirm = jest.fn().mockReturnValue(true);
    window.confirm = confirm;
    const { getByRole } = render({
      resetVotes,
    });

    fireEvent.click(getByRole('button'));
    expect(confirm).toHaveBeenCalled();
    expect(resetVotes).toHaveBeenCalled();
  });

  it('does not reset without confirmation', () => {
    const resetVotes = jest.fn();
    const confirm = jest.fn().mockReturnValue(false);
    window.confirm = confirm;
    const { getByRole } = render({
      resetVotes,
    });

    fireEvent.click(getByRole('button'));
    expect(confirm).toHaveBeenCalled();
    expect(resetVotes).not.toHaveBeenCalled();
  });

  it('does not ask the user to confirm after grace period', () => {
    const resetVotes = jest.fn();
    const confirm = jest.fn().mockReturnValue(false);
    window.confirm = confirm;
    const { getByRole } = render({
      resetVotes,
    });

    jest.runOnlyPendingTimers();

    fireEvent.click(getByRole('button'));
    expect(confirm).not.toHaveBeenCalled();
    expect(resetVotes).toHaveBeenCalled();
  });
});
