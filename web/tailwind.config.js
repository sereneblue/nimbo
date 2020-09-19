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
        "dark-100": "#4a4c4d",
        "dark-100-50": "rgba(74, 76, 77, 0.5)",
        "dark-200": "#343537",
        "dark-300": "#1d1f21",
        "dark-300-75": "rgba(29, 31, 33, 0.75)",
        "dark": "#a5a8a7",
        "light-100": "#f3f3f3",
        "light-100-50": "rgba(243, 243, 243, 0.5)",
        "light-200": "#e4e6f1",
        "light-300": "#dcdcdc",
        "light-300-75": "rgba(220, 220, 220, 0.75)",
        "light": "#848484"
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
    uniformColorPalette: true,
  },
}
