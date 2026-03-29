/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0f',
        surface: '#12121a',
        border: '#1e1e2e',
        cyan: { DEFAULT: '#00d4ff', dim: '#00d4ff33' },
        purple: { DEFAULT: '#8b5cf6', dim: '#8b5cf633' },
        green: { DEFAULT: '#10b981', dim: '#10b98133' },
        orange: { DEFAULT: '#f59e0b', dim: '#f59e0b33' },
        red: { DEFAULT: '#ef4444', dim: '#ef444433' },
      },
      fontFamily: { mono: ['JetBrains Mono', 'Fira Code', 'monospace'] },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flow': 'flow 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        flow: { '0%': { strokeDashoffset: '100' }, '100%': { strokeDashoffset: '0' } },
        glow: { '0%': { boxShadow: '0 0 5px #00d4ff44' }, '100%': { boxShadow: '0 0 20px #00d4ff88, 0 0 40px #00d4ff44' } },
      }
    }
  },
  plugins: []
}
