// Empty shim: replaces next/dist/build/polyfills/polyfill-module in client
// builds via next.config.ts. Every feature it polyfills (Array.prototype.at,
// flat, flatMap; Object.fromEntries/hasOwn; String.prototype.trimStart/
// trimEnd; Promise.prototype.finally; URL.canParse) is natively supported
// by the browserslist target declared in package.json.
module.exports = {};
