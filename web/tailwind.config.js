module.exports = {
  purge: {
    mode: 'all',
    content: [
      "./src/**/*.svelte"
    ]
  },
  theme: {
    extend: {
      colors: {
        "dark-300": '#1d1f21',
        "dark-text-100": '#a5a8a7'
      }
    },
  },
  variants: {},
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true,
  },
  dark: 'class',
  experimental: {
    extendedSpacingScale: true,
    applyComplexClasses: true,
    darkModeVariant: true,
  },
}
