describe('the entry point', () => {
  it('displays the login screen initially', () => {
    jest.isolateModules(() => {
      require('./index');
    });
    expect(document.body).toHaveTextContent('NEXT GENERATIONSCRUM POKER');
    expect(document.body.children).toHaveLength(1);
    document.body.firstChild!.remove();
  });
});
