const prod = !process.env.ROLLUP_WATCH;

module.exports = {
  plugins: [
    require('tailwindcss'),
    ...(prod
      ? [
          require('autoprefixer'),
          require('cssnano')({
            preset: ['default', { discardComments: { removeAll: true } }],
          }),
        ]
      : []),
  ],
};