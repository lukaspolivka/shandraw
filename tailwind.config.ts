import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
        code: ['var(--font-source-code-pro)', 'ui-monospace', 'monospace'],
      },
      colors: {
        background: 'oklch(var(--background))',
        foreground: 'oklch(var(--foreground))',

        card: 'oklch(var(--card))',
        'card-foreground': 'oklch(var(--card-foreground))',

        popover: 'oklch(var(--popover))',
        'popover-foreground': 'oklch(var(--popover-foreground))',

        primary: 'oklch(var(--primary))',
        'primary-foreground': 'oklch(var(--primary-foreground))',

        secondary: 'oklch(var(--secondary))',
        'secondary-foreground': 'oklch(var(--secondary-foreground))',

        muted: 'oklch(var(--muted))',
        'muted-foreground': 'oklch(var(--muted-foreground))',

        accent: 'oklch(var(--accent))',
        'accent-foreground': 'oklch(var(--accent-foreground))',

        destructive: 'oklch(var(--destructive))',
        'destructive-foreground': 'oklch(var(--destructive-foreground))',

        border: 'oklch(var(--border))',
        input: 'oklch(var(--input))',
        ring: 'oklch(var(--ring))',

        chart: {
          1: 'oklch(var(--chart-1))',
          2: 'oklch(var(--chart-2))',
          3: 'oklch(var(--chart-3))',
          4: 'oklch(var(--chart-4))',
          5: 'oklch(var(--chart-5))',
        },

        sidebar: 'oklch(var(--sidebar))',
        'sidebar-foreground': 'oklch(var(--sidebar-foreground))',
        'sidebar-primary': 'oklch(var(--sidebar-primary))',
        'sidebar-primary-foreground': 'oklch(var(--sidebar-primary-foreground))',
        'sidebar-accent': 'oklch(var(--sidebar-accent))',
        'sidebar-accent-foreground': 'oklch(var(--sidebar-accent-foreground))',
        'sidebar-border': 'oklch(var(--sidebar-border))',
        'sidebar-ring': 'oklch(var(--sidebar-ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('tw-animate-css'),
  ],
};

export default config;
