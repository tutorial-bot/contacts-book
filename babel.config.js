module.exports = {
  presets: [
    [
      '@babel/preset-env', {
        targets: process.env.NODE_ENV === 'development'
          ? { node: 12 }
          : {
            node: 12,
            edge: 13,
            firefox: 26,
            chrome: 39,
            safari: 10,
          },
        useBuiltIns: 'entry',
        corejs: 3,
      }
    ]
  ],
  plugins: [
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    '@babel/plugin-transform-modules-commonjs',
  ],
};
