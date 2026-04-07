/**
 * Jest transformer for .gs files.
 *
 * GAS files use top-level function declarations (script scope).
 * In Node/CommonJS, these stay local to the module. This transformer
 * rewrites top-level `function name(` to `global.name = function(`
 * and `var name =` / `const name =` / `let name =` to `global.name =`
 * so they're accessible across test files — matching GAS behavior.
 */
module.exports = {
  process(src) {
    const code = src
      // Top-level function declarations → global
      .replace(/^function\s+(\w+)\s*\(/gm, 'global.$1 = function(')
      // Top-level var/const/let → global
      .replace(/^(var|const|let)\s+(\w+)\s*=/gm, 'global.$2 =');
    return { code };
  },
};
