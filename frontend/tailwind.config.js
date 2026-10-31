/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gym: {
          bg: '#0a0d12',
          surface: '#121820',
          card: '#161e28',
          border: '#222f3e',
          lime: '#ccff00',
          limeHover: '#b3e600',
          orange: '#ff5500',
          textMuted: '#94a3b8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-lime': '0 0 25px -5px rgba(204, 255, 0, 0.35)',
        'glow-lime-sm': '0 0 12px -2px rgba(204, 255, 0, 0.4)',
      }
    },
  },
  plugins: [],
}
