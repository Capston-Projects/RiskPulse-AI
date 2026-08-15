/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 18px 45px -20px rgba(15, 23, 42, 0.33)',
      },
      colors: {
        panel: '#0f172a',
        ink: '#e2e8f0',
        slateglass: '#111827',
      },
    },
  },
  plugins: [],
};
