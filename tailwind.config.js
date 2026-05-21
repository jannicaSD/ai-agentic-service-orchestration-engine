/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#0B1020',
        card: '#121A2B',
        cardLight: '#1A243A',
        primary: '#4F8CFF',
        secondary: '#9D60FF',
        accent: '#00D1FF',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        text: '#F8FAFC',
        textMuted: '#94A3B8',
        border: '#2A3655',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
