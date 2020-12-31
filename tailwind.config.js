module.exports = {
  purge: {
    mode: 'all',
    content: [
      "./src/**/*.svelte"
    ],
    options: {
      defaultExtractor: (content) => {
        const regExp = new RegExp(/[A-Za-z0-9-_:\./]+/g)
        const matchedTokens = []
        let match = regExp.exec(content)

        while (match) {
          if (match[0].startsWith('class:')) {
            matchedTokens.push(match[0].substring(6))
          } else {
            matchedTokens.push(match[0])
          }
          match = regExp.exec(content)
        }
        return matchedTokens
      }
    }
  },
  theme: {
    customForms: theme => ({
      default: {
        checkbox: {
          '&:focus': {
            boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.5)',
            borderColor: theme('colors.indigo.400')
          }
        },
        select: {
          '&:focus': {
            boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.5)',
            borderColor: theme('colors.indigo.400')
          }
        }
      }
    }),
    extend: {
      colors: {
        "dark-100": "#4a4c4d",
        "dark-100-50": "rgba(74, 76, 77, 0.5)",
        "dark-200": "#343537",
        "dark-300": "#1d1f21",
        "dark-300-75": "rgba(29, 31, 33, 0.75)",
        "dark": "#a5a8a7",
        "light-100": "#e7e7e5",
        "light-100-50": "rgba(231, 231, 229, 0.5)",
        "light-200": "#dbdcdd",
        "light-300": "#fafbfd",
        "light": "#707070"
      },
      spacing: {
        '116': '29rem',
        '160': '40rem'
      }
    },
    truncate: {
      lines: {
        2: '2',
        3: '3'
      }
    }
  },
  variants: {
    display: ({ after }) => after(['group-hover']),
  },
  plugins: [
    require('@tailwindcss/custom-forms'),
    require('tailwindcss-truncate-multiline')(),
  ],
  future: {
    removeDeprecatedGapUtilities: true,
  },
  dark: 'class',
  experimental: {
    extendedSpacingScale: true,
    applyComplexClasses: true,
    darkModeVariant: true,
    purgeLayersByDefault: true
  },
}
