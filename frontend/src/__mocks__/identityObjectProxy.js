module.exports = {
  __esModule: true,
  default: new Proxy(
    {},
    {
      get(target, key) {
        return key;
      },
    }
  ),
};
