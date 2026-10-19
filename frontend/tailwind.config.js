/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        retro: {
          bg: 'var(--bg-primary)',
          card: 'var(--bg-card)',
          text: 'var(--text-primary)',
          muted: 'var(--text-muted)',
          accent: 'var(--accent-color)',
          'accent-hover': 'var(--accent-hover)',
          border: 'var(--border-color)',
          danger: 'var(--danger-color)',
          warning: 'var(--warning-color)',
          success: 'var(--success-color)',
        },
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'monospace'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'retro-sm': '1px 1px 0px 0px var(--border-color)',
        'retro': '2px 2px 0px 0px var(--border-color)',
        'retro-md': '4px 4px 0px 0px var(--border-color)',
        'retro-lg': '6px 6px 0px 0px var(--border-color)',
      },
    },
  },
  plugins: [],
}
