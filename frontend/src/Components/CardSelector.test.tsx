import { fireEvent } from '@testing-library/preact';
import { SCALES } from '../constants';
import { getRenderWithWebSocket } from '../test-helpers/renderWithWebSocker';
import { CardSelector } from './CardSelector';

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
    expect(setVote).toHaveBeenNthCalledWith(2,'coffee');
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
    expect(setVote).toHaveBeenNthCalledWith(2,'not-voted');
  });
});
