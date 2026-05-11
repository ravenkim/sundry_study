/** @type {import('tailwindcss').Config} */
export default {
	important: true,
	mode: "jit",
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
    extend: {
		fontFamily: {
			'NotoSansKR-100': ['"NotoSansKR-100"'],
			'NotoSansKR-300': ['"NotoSansKR-300"'],
			'NotoSansKR-400': ['"NotoSansKR-400"'],
			'NotoSansKR-500': ['"NotoSansKR-500"'],
			'NotoSansKR-700': ['"NotoSansKR-700"'],
			'NotoSansKR-900': ['"NotoSansKR-900"'],
		}
	},
  },
  plugins: [],
}
