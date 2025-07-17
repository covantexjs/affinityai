/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#e0ddfc',
          200: '#c2bcf9',
          300: '#a39af6',
          400: '#8579f3',
          500: '#6c5ce7',
          600: '#5649c9',
          700: '#4136ab',
          800: '#2c238d',
          900: '#17116f',
        },
        secondary: {
          50: '#fff0f5',
          100: '#ffe6ef',
          200: '#ffcce0',
          300: '#ffb3d1',
          400: '#ff99c2',
          500: '#fd79a8',
          600: '#d4608a',
          700: '#ab486d',
          800: '#83304f',
          900: '#5a1832',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to))',
      },
      boxShadow: {
        card: '0 4px 20px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};