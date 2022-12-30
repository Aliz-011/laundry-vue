module.exports = {
  devServer: {
    proxy: "http://localhost:3080",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
};
