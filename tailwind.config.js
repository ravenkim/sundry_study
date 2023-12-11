/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens:{
      mobile: '414px',
      tablet:'750px',
      desktop:'1400px',
    },
    container: {
      padding: {
        DEFAULT: '2rem',
        tablet: '6rem',
        desktop: '8rem',
      },
    },
    extend: {},
  },
  plugins: [],
}
