import { fireEvent } from '@testing-library/preact';
import { SCALES } from '../../constants';
import { getRenderWithWebSocket } from '../../test-helpers/renderWithWebSocket';
import { CardSelector } from './CardSelector';
import { VOTE_COFFEE, VOTE_NOTE_VOTED } from '../../shared/WebSocketMessages';

const render = getRenderWithWebSocket(<CardSelector />, {
  connected: true,
  loginData: { user: 'TheUser', session: 'TheSession123456' },
  loggedIn: true,
  state: {
    resultsVisible: false,
    votes: {
      TheUser: 'not-voted',
    },
    scale: SCALES.COHEN_SCALE.values,
  },
});

describe('The CardSelector', () => {
  it('lets the user pick different card values', () => {
    // given
    const setVote = jest.fn();
    const { getByText, getByTitle } = render({
      setVote,
      state: {
        votes: {
          TheUser: 'not-voted',
          OtherUser: '5',
        },
      },
    });

    // when
    fireEvent.click(getByText('1'));

    // then
    expect(setVote).toHaveBeenNthCalledWith(1, '1');

    // when
    fireEvent.click(getByTitle('Need a break'));

    // then
    expect(setVote).toHaveBeenNthCalledWith(2, 'coffee');
  });

  it('lets the user unselect a card', () => {
    // given
    const setVote = jest.fn();
    const { getByText, rerender } = render({
      setVote,
      state: {
        votes: {
          TheUser: 'not-voted',
          OtherUser: '5',
        },
      },
    });

    // when
    fireEvent.click(getByText('1'));

    // then
    expect(setVote).toHaveBeenNthCalledWith(1, '1');

    // when
    rerender({
      setVote,
      state: {
        votes: {
          TheUser: '1',
          OtherUser: '5',
        },
      },
    });

    // when
    fireEvent.click(getByText('1'));

    // then
    expect(setVote).toHaveBeenNthCalledWith(2, 'not-voted');
  });

  it('lets the user pick different card values with the keyboard', () => {
    // given
    const setVote = jest.fn();
    render({
      setVote,
      state: { votes: { TheUser: 'not-voted', OtherUser: '5' } },
    });

    // when
    fireEvent.keyDown(window, { key: '1' });

    // then
    expect(setVote).toHaveBeenNthCalledWith(1, '1');

    // when
    fireEvent.keyDown(window, { key: '2' });

    // then
    expect(setVote).toHaveBeenNthCalledWith(2, '2');

    // when
    fireEvent.keyDown(window, { key: '9' });

    // then
    expect(setVote).toHaveBeenCalledTimes(2);

    // when
    fireEvent.keyDown(window, { key: 'A' });

    // then
    expect(setVote).toHaveBeenCalledTimes(2);
  });

  it.each`
    key    | selectedCard
    ${'c'} | ${VOTE_COFFEE}
    ${'C'} | ${VOTE_COFFEE}
    ${'?'} | ${'?'}
  `('lets the user pick the $selectedCard card with the keyboard', ({ key, selectedCard }) => {
    // given
    const setVote = jest.fn();
    render({
      setVote,
      state: { votes: { TheUser: 'not-voted', OtherUser: '5' } },
    });

    // when
    fireEvent.keyDown(window, { key });

    // then
    expect(setVote).toHaveBeenCalledWith(selectedCard);
  });

  it('lets the user unselect cards with the keyboard', () => {
    // given
    const setVote = jest.fn();
    render({
      setVote,
      state: { votes: { TheUser: '3', OtherUser: '5' } },
    });

    // when
    fireEvent.keyDown(window, { key: '3' });

    // then
    expect(setVote).toHaveBeenCalledWith(VOTE_NOTE_VOTED);
  });

  it('lets the user cycle through cards with the keyboard', () => {
    // given
    const setVote = jest.fn();
    const { rerender } = render({
      setVote,
      state: { votes: { TheUser: 'not-voted', OtherUser: '5' } },
    });

    // when
    fireEvent.keyDown(window, { key: '1' });

    // then
    expect(setVote).toHaveBeenNthCalledWith(1, '1');

    // when
    rerender({ setVote, state: { votes: { TheUser: '1', OtherUser: '5' } } });

    // when
    fireEvent.keyDown(window, { key: '1' });

    // then
    expect(setVote).toHaveBeenNthCalledWith(2, '13');

    // when
    rerender({ setVote, state: { votes: { TheUser: '13', OtherUser: '5' } } });

    // when
    fireEvent.keyDown(window, { key: '1' });

    // then
    expect(setVote).toHaveBeenNthCalledWith(3, '100');

    // when
    rerender({
      setVote,
      state: { votes: { TheUser: '100', OtherUser: '5' } },
    });

    // when
    fireEvent.keyDown(window, { key: '1' });

    // then
    expect(setVote).toHaveBeenNthCalledWith(4, VOTE_NOTE_VOTED);

    // when
    rerender({
      setVote,
      state: { votes: { TheUser: '1', OtherUser: '5' } },
    });
  });

  it('behaves case-insensitive when user selects cards via keyboard', () => {
    // given
    const setVote = jest.fn();
    const { rerender } = render({
      setVote,
      state: { votes: { TheUser: 'not-voted', OtherUser: '5' }, scale: SCALES.SIZES_SCALE.values },
    });

    // when
    fireEvent.keyDown(window, { key: 's' });

    // then
    expect(setVote).toHaveBeenNthCalledWith(1, 'S');

    // when
    rerender({
      setVote,
      state: {
        votes: { TheUser: 'not-voted', OtherUser: '5' },
        scale: SCALES.SIZES_SCALE.values,
      },
    });

    // when
    fireEvent.keyDown(window, { key: 'S' });

    // then
    expect(setVote).toHaveBeenNthCalledWith(2, 'S');
  });
});
