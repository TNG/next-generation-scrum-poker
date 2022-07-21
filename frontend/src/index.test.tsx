describe('the entry point', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('displays the login screen initially', () => {
    jest.isolateModules(() => {
      require('./index');
    });
    expect(document.body).toHaveTextContent('NEXT GENERATIONSCRUM POKER');
    expect(document.body.children).toHaveLength(1);
    document.body.firstChild!.remove();
  });
});
