/** @type {import('next').NextConfig} */

// next.config.js
const withLess = require("next-with-less");

module.exports = withLess({
  lessLoaderOptions: {
    /* ... */
    javascriptEnabled: true
  },
  reactStrictMode: true,


});