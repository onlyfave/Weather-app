/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        neutral900: 'hsl(243, 96%, 9%)',
        neutral800: 'hsl(243, 27%, 20%)',
        neutral700: 'hsl(243, 23%, 24%)',
        neutral600: 'hsl(243, 23%, 30%)',
        neutral300: 'hsl(240, 6%, 70%)',
        neutral200: 'hsl(250, 6%, 84%)',
        neutral0:   'hsl(0, 0%, 100%)',
        orange500: 'hsl(28, 100%, 52%)',
        blue500: 'hsl(233, 67%, 56%)',
        blue700: 'hsl(248, 70%, 36%)'
      },
      fontFamily: {
        dm: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        bricolage: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      container: {
        center: true,
        padding: '1rem'
      }
    },
  },
  plugins: [],
}

