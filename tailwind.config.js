/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        minds: {
          bg: "#080C14",
          card: "#0F172A",
          border: "#1E293B",
          accent: "#3B82F6",
          purple: "#8B5CF6",
          emerald: "#10B981",
          amber: "#F59E0B"
        }
      }
    },
  },
  plugins: [],
}
