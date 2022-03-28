export default new Proxy(
  {},
  {
    get(target, key) {
      return key;
    },
  }
);
