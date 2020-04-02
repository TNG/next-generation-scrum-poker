describe('the entry point', () => {
  it('displays the app as loading initially', () => {
    const container = document.createElement('div');
    container.id = 'root';
    document.body.appendChild(container);
    jest.isolateModules(() => {
      require('./index.js');
    });
    const rootElement = document.getElementById('root');
    expect(rootElement).toHaveTextContent('Connecting...');
    container.remove();
  });
});
