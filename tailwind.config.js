/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}", // Scan files in the app directory (App Router)
      "./pages/**/*.{js,ts,jsx,tsx}", // Scan files in the pages directory (Pages Router, if you have it)
      "./components/**/*.{js,ts,jsx,tsx}", // Scan files in the components directory (if you have one)
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  };