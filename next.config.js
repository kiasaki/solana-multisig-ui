const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  reactStrictMode: true,
  webpack: (config, options) => {
    config.optimization = {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_classnames: true,
            keep_fnames: true,
          },
        }),
      ],
    };
    return config;
  },
};
