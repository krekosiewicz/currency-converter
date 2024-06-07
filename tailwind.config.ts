import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    'node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}',
    'node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}'

  ],
  theme: {
    extend: {
      colors: {
        terminal: '#0A1E24',
        fontOnTerminal: '#ECEFC1',
        primary: '#67A0CD',
        warning: '#FF8A39',
      },
      gridTemplateColumns: {
        'fr-min-min': 'minmax(80px, 1fr) min-content min-content',
      },
      screens: {
        'xs': '380px',  // Custom breakpoint at 380px
      }
    },
  },
  plugins: [],
};
export default config;
