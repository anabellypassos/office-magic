/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        docmind: {
          dark: '#0F172A',     // Azul fundo
          sidebar: '#1E293B',  // Azul sidebar
          accent: '#06B6D4',   // Ciano logo
          primary: '#3B82F6',  // Azul principal
        }
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}