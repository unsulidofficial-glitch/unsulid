import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
    },
    extend: {
      colors: {
        brand: {
          burgundy: {
            DEFAULT: '#5B0F18',
            hover: '#741522',
            dark: '#400910',
            light: '#7D1A27',
          },
          cream: {
            DEFAULT: '#F8F1E7',
            light: '#FDFBF7',
            dark: '#EFE5D6',
          },
          black: {
            DEFAULT: '#0B0B0B',
            soft: '#171717',
            card: '#121212',
          },
          gold: {
            DEFAULT: '#C6A15B',
            hover: '#D4B372',
            light: '#E2CA97',
            dark: '#A68442',
          },
          white: '#FFFFFF',
          muted: '#8B8178',
          border: '#E6D9C9',
          'border-dark': '#262626',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-manrope)', 'Manrope', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['var(--font-cormorant)', 'Playfair Display', 'serif'],
      },
      letterSpacing: {
        widest: '.2em',
        luxury: '.25em',
        editorial: '.35em',
      },
      borderRadius: {
        luxury: '4px',
        pill: '9999px',
      },
      boxShadow: {
        luxury: '0 10px 30px -10px rgba(11, 11, 11, 0.08)',
        'luxury-hover': '0 20px 40px -15px rgba(91, 15, 24, 0.15)',
        'luxury-dark': '0 15px 35px -10px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};

export default config;

