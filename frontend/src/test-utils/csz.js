// csz is only available as an ES module, which Jest does not transform in
// node_modules. This is basically just a unique string generator.

let className = 1000;

module.exports = () => String(className++);
