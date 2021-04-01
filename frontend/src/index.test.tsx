describe('the entry point', () => {
  it('displays the app as loading initially', () => {
    jest.isolateModules(() => {
      require('./index');
    });
    expect(document.body).toHaveTextContent('Connecting...');
    expect(document.body.children).toHaveLength(1);
    document.body.firstChild!.remove();
  });
});
