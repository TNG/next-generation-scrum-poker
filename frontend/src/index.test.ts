describe('the entry point', () => {
  it('displays the app component', () => {
    jest.isolateModules(() => {
      require('./index');
      const rootElement = document.getElementById('root');
      console.log(rootElement);
    });
  });
});
