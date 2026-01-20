/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        carbon: '#121212',
        graphite: '#1E1E1E',
        platinum: '#E0E0E0',
        gold: '#FFD700',
        electricBlue: '#00F0FF',
      },
      fontFamily: {
        heading: ['PlayfairDisplay-Bold'],
        body: ['Inter-Regular'],
        ui: ['Oswald-Medium'],
      },
    },
  },
  plugins: [],
}

