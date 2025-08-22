/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          bg: 'var(--color-bg)',
          fg: 'var(--color-fg)',
          subtle: 'var(--color-fg-subtle)',
          border: 'var(--color-border)'
        },
        brand: {
          primary: 'var(--color-primary)',
          primaryHover: 'var(--color-primary-hover)',
          accent: 'var(--color-accent)'
        },
        status: {
          pending: 'var(--color-status-pending)',
            inprogress: 'var(--color-status-inprogress)',
            completed: 'var(--color-status-completed)'
        }
      },
      boxShadow: {
        focus: '0 0 0 3px var(--color-focus-ring)'
      },
      screens: {
        'xs': '420px'
      }
    },
  },
  plugins: [],
};
