describe('the entry point', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    Object.defineProperty(global, 'ResizeObserver', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      })),
    });
  });

  it('displays the login screen initially', async () => {
    await import(`./index`);
    expect(document.body).toHaveTextContent('NEXT GENERATIONSCRUM POKER');
    expect(document.body.children).toHaveLength(1);
    document.body.firstChild!.remove();
  });
});
