/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
        "primary-fixed-dim": "#bfc2ff",
        "surface-container-highest": "#e0e3e6",
        "on-primary-fixed-variant": "#3037aa",
        "background": "#f7f9fc",
        "on-tertiary-fixed": "#410000",
        "on-tertiary-fixed-variant": "#842419",
        "surface-container-lowest": "#ffffff",
        "surface-tint": "#4951c3",
        "outline": "#767684",
        "on-primary-container": "#7981f5",
        "inverse-primary": "#bfc2ff",
        "on-surface-variant": "#454653",
        "inverse-on-surface": "#eff1f4",
        "on-primary": "#ffffff",
        "on-surface": "#191c1e",
        "on-secondary": "#ffffff",
        "tertiary": "#2c0000",
        "surface-variant": "#e0e3e6",
        "on-secondary-fixed-variant": "#5b4300",
        "secondary": "#785900",
        "tertiary-fixed": "#ffdad4",
        "on-primary-fixed": "#00006e",
        "tertiary-fixed-dim": "#ffb4a8",
        "primary-container": "#00008b",
        "surface-dim": "#d8dadd",
        "inverse-surface": "#2d3133",
        "on-tertiary-container": "#e06857",
        "primary-fixed": "#e0e0ff",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
        "secondary-fixed-dim": "#fabd00",
        "on-tertiary": "#ffffff",
        "outline-variant": "#c6c5d5",
        "surface-bright": "#f7f9fc",
        "tertiary-container": "#540000",
        "secondary-container": "#fdc003",
        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-background": "#191c1e",
        "surface-container": "#eceef1",
        "on-secondary-fixed": "#261a00",
        "surface-container-high": "#e6e8eb",
        "surface-container-low": "#f2f4f7",
        "primary": "#00004c",
        "surface": "#f7f9fc",
        "on-secondary-container": "#6c5000",
        "secondary-fixed": "#ffdf9e"
      },
      "borderRadius": {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      "spacing": {
        "margin-mobile": "20px",
        "game-gap": "16px",
        "card-padding": "24px",
        "margin-desktop": "64px",
        "base": "8px"
      },
      "fontFamily": {
        "headline-lg": ["Be Vietnam Pro", "sans-serif"],
        "quiz-option": ["Be Vietnam Pro", "sans-serif"],
        "headline-lg-mobile": ["Be Vietnam Pro", "sans-serif"],
        "body-md": ["Be Vietnam Pro", "sans-serif"],
        "label-lg": ["Be Vietnam Pro", "sans-serif"],
        "headline-xl": ["Be Vietnam Pro", "sans-serif"]
      },
      "fontSize": {
        "headline-lg": ["32px", { "lineHeight": "40px", "fontWeight": "700" }],
        "quiz-option": ["24px", { "lineHeight": "32px", "fontWeight": "700" }],
        "headline-lg-mobile": ["24px", { "lineHeight": "32px", "fontWeight": "700" }],
        "body-md": ["18px", { "lineHeight": "28px", "fontWeight": "400" }],
        "label-lg": ["16px", { "lineHeight": "24px", "letterSpacing": "0.05em", "fontWeight": "600" }],
        "headline-xl": ["48px", { "lineHeight": "56px", "fontWeight": "800" }]
      },
      "keyframes": {
        slideBg: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 40px' }
        },
        pulseRing: {
          '0%': { transform: 'scale(0.8)', opacity: '0.5' },
          '100%': { transform: 'scale(1.5)', opacity: '0' }
        },
        bounceDots: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        shine: {
          '100%': { left: '125%' }
        }
      },
      "animation": {
        'slide-bg': 'slideBg 3s linear infinite',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
        'bounce-dots': 'bounceDots 1s infinite',
        'shine': 'shine 1s infinite'
      }
    },
  },
  plugins: [],
}
