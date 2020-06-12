import { act, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { App } from './App.js';

const ConfigureMockWebSocket = () => {
  const instances: MockWebSocket[] = [];

  class MockWebSocket {
    onopen?(): void;

    onmessage?(event: MessageEvent): void;

    test_messages: string[] = [];

    constructor(public test_url: string) {
      instances.push(this);
    }

    send(message: string) {
      this.test_messages.push(message);
    }
  }

  window.WebSocket = MockWebSocket as any;
  return instances;
};

const loginUser = () => {
  window.history.pushState({}, 'Test Title', '?sessionId=xvdBFRA6FyLZFcKo');
  const socketInstances = ConfigureMockWebSocket();
  const rendered = render(<App />);
  const socket = socketInstances[0];

  act(() => socket.onopen!());
  fireEvent.change(rendered.container.querySelector('input.user-input')!, {
    target: { value: 'Happy User' },
  });
  fireEvent.click(rendered.container.querySelector('input.submit')!);

  expect(socket.test_messages).toEqual([
    '{"message":"sendmessage","data":{"type":"login","payload":{"user":"Happy User","session":"xvdBFRA6FyLZFcKo"}}}',
  ]);
  socket.test_messages = [];
  return { socket, ...rendered };
};

describe('The App component', () => {
  it('displays a loading indicator initially', () => {
    const { container } = render(<App />);
    expect(container).toHaveTextContent('Connecting...');
  });

  it('creates a socket connection and displays the login window with an autogenerated session link', () => {
    window.history.pushState({}, 'Test Title', '/');
    const socketInstances = ConfigureMockWebSocket();
    const { container } = render(<App />);
    expect(socketInstances).toHaveLength(1);
    const socket = socketInstances[0];
    expect(socket.test_url).toBe('wss://scrum-poker-backend.playground.aws.tngtech.com');
    expect(typeof socket.onopen).toBe('function');
    expect(typeof socket.onmessage).toBe('function');

    act(() => socket.onopen!());

    expect(container).not.toHaveTextContent('Connecting...');
    expect(container.querySelector('input.user-input')).toBeVisible();
    expect(container.querySelector('a.session-link')).toBeVisible();
    expect(container.querySelector('a.session-link')).toHaveTextContent(/^[a-zA-Z0-9]{16}$/i);
    expect(container.querySelector('input.submit')).toBeVisible();
  });

  it('logs the user in and displays the voting page, then displays the login page if the user is kicked out', () => {
    // given
    const { socket, container } = loginUser();

    expect(container).toHaveTextContent('Session ID: xvdBFRA6FyLZFcKo - User name: Happy User');
    expect(container.querySelectorAll('button.card')).toHaveLength(13);

    // when
    act(() =>
      socket.onmessage!({ data: JSON.stringify({ type: 'not-logged-in' }) } as MessageEvent)
    );

    // then
    expect(container).not.toHaveTextContent('Connecting...');
    expect(container.querySelector('input.user-input')).toHaveValue('Happy User');
    expect(container.querySelector('a.session-link')).toBeVisible();
    expect(container.querySelector('a.session-link')).toHaveTextContent(/^[a-zA-Z0-9]{16}$/i);
    expect(container.querySelector('input.submit')).toBeVisible();
  });

  it('updates, reveals and resets votes and kicks non-voting users optimistically', () => {
    // given
    const { socket, container, getByText } = loginUser();
    act(() =>
      socket.onmessage!({
        data: JSON.stringify({
          type: 'state',
          payload: {
            votes: {
              'Happy User': 'not-voted',
              'Voting User': '13',
              'Non-voting User': 'not-voted',
            },
            resultsVisible: false,
          },
        }),
      } as MessageEvent)
    );
    const selectedCard = container.querySelectorAll('button.card')[5];
    expect(selectedCard).toHaveTextContent('2');
    expect(selectedCard).not.toHaveClass('selected-card');
    expect(container.querySelector('tbody')).toHaveTextContent(
      'Non-voting User✗Happy User✗Voting User✔'
    );

    // when
    fireEvent.click(container.querySelectorAll('button.card')[5]);

    // then
    expect(selectedCard).toHaveClass('selected-card');
    expect(container.querySelector('tbody')).toHaveTextContent(
      'Non-voting User✗Happy User✔Voting User✔'
    );
    expect(socket.test_messages).toEqual([
      '{"message":"sendmessage","data":{"type":"set-vote","payload":{"vote":"2"}}}',
    ]);
    socket.test_messages = [];

    // when
    fireEvent.click(getByText('Kick users without vote', { selector: 'button' }));

    // then
    expect(container.querySelector('tbody')).toHaveTextContent('Happy User✔Voting User✔');
    expect(socket.test_messages).toEqual([
      '{"message":"sendmessage","data":{"type":"remove-users-not-voted"}}',
    ]);
    socket.test_messages = [];

    // when
    fireEvent.click(getByText('Reveal Votes', { selector: 'button' }));

    // then
    expect(container.querySelector('tbody')).toHaveTextContent('Happy User2Voting User13');
    expect(socket.test_messages).toEqual([
      '{"message":"sendmessage","data":{"type":"reveal-votes"}}',
    ]);
    socket.test_messages = [];

    // when
    fireEvent.click(getByText('Reset votes', { selector: 'button' }));

    // then
    expect(container.querySelector('tbody')).toHaveTextContent('Voting User✗Happy User✗');
    expect(socket.test_messages).toEqual([
      '{"message":"sendmessage","data":{"type":"reset-votes"}}',
    ]);
  });
});
