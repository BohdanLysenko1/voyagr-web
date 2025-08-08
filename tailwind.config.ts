import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Calendar event colors - safelist arbitrary values to prevent purging
    'bg-[#8EF0B9]',
    'bg-[#A8C8FF]', 
    'bg-[#FFE39A]',
    'bg-[#FFB3AE]',
    'bg-[#D6B7FF]',
    'text-[#4ADE80]',
    'text-[#60A5FA]',
    'text-[#FBBF24]', 
    'text-[#F87171]',
    'text-[#A855F7]',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#5271FF",
        secondary: "000000"
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
};
export default config;
