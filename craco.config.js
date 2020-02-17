module.exports = {
    webpack: {
      plugins: [],
      configure: {
        output: {
          path: require('path').resolve(__dirname, 'build/')
        }
      }
    },
    babel: {
      plugins: ["babel-plugin-styled-components"]
    }
  };