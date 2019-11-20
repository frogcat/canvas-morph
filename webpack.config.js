const path = require('path');

module.exports = {
  mode: "production",
  entry: "./main.js",
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "canvas-morph.js"
  },
};
