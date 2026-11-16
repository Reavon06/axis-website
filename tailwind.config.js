/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './works/index.html',
    './about/index.html',
    './gallery/index.html',
    './contact/index.html',
    './scripts/**/*.mjs',
  ],
  theme: {
    extend: {
      colors: {
        axis: {
          navy: '#252A7F',
          cyan: '#2EAEE3',
          green: '#28A870',
        },
        surface: {
          mist: '#EEF3F8',
          light: '#F5F7FA',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Satoshi', 'system-ui', 'Segoe UI', 'sans-serif'],
        display: ['"Clash Display"', 'Satoshi', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 80px -20px rgba(46, 174, 227, 0.35)',
        'glow-sm': '0 0 50px -24px rgba(46, 174, 227, 0.28)',
        lift: '0 30px 60px -28px rgba(15, 23, 42, 0.18)',
        soft: '0 18px 40px -24px rgba(15, 23, 42, 0.12)',
      },
      backgroundImage: {
        'grid-fine':
          'linear-gradient(to right, rgba(37,42,127,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(37,42,127,0.06) 1px, transparent 1px)',
        vignette:
          'radial-gradient(ellipse at center, transparent 0%, rgba(15,23,42,0.06) 65%, rgba(15,23,42,0.12) 100%)',
      },
    },
  },
  plugins: [],
}
