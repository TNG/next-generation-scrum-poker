describe.skip('the entry point', () => {
  it('displays the app component', () => {
    const container = document.createElement('div');
    container.id = 'root';
    document.body.appendChild(container);
    jest.isolateModules(() => {
      require('./index.js');
    });
    const rootElement = document.getElementById('root');
    console.log(rootElement);
    container.remove();
  });
});
