const path = require("path");
const ExtractCSS = require("extract-text-webpack-plugin");
const autoprefixer = require("autoprefixer");

const MODE = process.env.WEBPACK_ENV;

const Entry_File = path.resolve(__dirname, "assets", "js", "Main.js");
const Output_Dir = path.join(__dirname, "static");

const config = {
  entry: [Entry_File, "@babel/polyfill"],
  mode: MODE,
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: ExtractCSS.extract([
          {
            loader: "css-loader"
          },
          {
            loader: "postcss-loader",
            options: {
              plugins() {
                return [autoprefixer({ browsers: "cover 99.5%" })];
              }
            }
          },
          {
            loader: "sass-loader"
          }
        ])
      },
      {
        test: /\.(js)$/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      }
    ]
  },
  output: {
    path: Output_Dir,
    filename: "[name].js"
  },
  plugins: [new ExtractCSS("styles.css")]
};

module.exports = config;
