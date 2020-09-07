module.exports = {
  purge: {
    mode: 'all',
    content: [
      "./src/**/*.svelte"
    ]
  },
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true,
  },
}
