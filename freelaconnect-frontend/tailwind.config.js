/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00647c',
        'primary-container': '#007f9d',
        'primary-fixed': '#b7eaff',
        'on-primary': '#ffffff',
        background: '#f7f9fb',
        surface: '#f7f9fb',
        'surface-container': '#eceef0',
        'surface-container-lowest': '#ffffff',
        'surface-container-high': '#e6e8ea',
        'on-surface': '#191c1e',
        'on-surface-variant': '#3e484d',
        outline: '#6e797e',
        'outline-variant': '#bdc8ce',
        error: '#ba1a1a',
        'error-container': '#ffdad6',
      },
      boxShadow: {
        soft: '0 16px 40px rgba(0, 31, 40, 0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
