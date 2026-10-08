/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10B981',
        'primary-dark': '#047857',
        secondary: '#F59E0B',
        background: '#F8FAFC',
        'dark-background': '#0F172A',
        surface: '#FFFFFF',
        'dark-surface': '#1E293B',
        text: '#0F172A',
        'text-secondary': '#64748B',
        success: '#22C55E',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}