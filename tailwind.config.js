/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#374151',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      }
    },
  },
  plugins: [],
}

