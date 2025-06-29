
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'primary': ['Inter', 'sans-serif'],
				'sans': ['Inter', 'sans-serif'],
			},
			colors: {
				// Brand contextual colors
				collections: {
					DEFAULT: 'rgb(var(--color-collections))',
					primary: 'rgb(var(--collections-primary))',
					secondary: 'rgb(var(--collections-secondary))',
					accent: 'rgb(var(--collections-accent))',
				},
				cards: {
					DEFAULT: 'rgb(var(--color-cards))',
					primary: 'rgb(var(--cards-primary))',
					secondary: 'rgb(var(--cards-secondary))',
					accent: 'rgb(var(--cards-accent))',
				},
				marketplace: {
					DEFAULT: 'rgb(var(--color-marketplace))',
					primary: 'rgb(var(--marketplace-primary))',
					secondary: 'rgb(var(--marketplace-secondary))',
					accent: 'rgb(var(--marketplace-accent))',
				},
				currency: {
					DEFAULT: 'rgb(var(--color-currency))',
					primary: 'rgb(var(--currency-primary))',
					secondary: 'rgb(var(--currency-secondary))',
					accent: 'rgb(var(--currency-accent))',
				},
				// Core design system colors
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
			},
			spacing: {
				'xs': 'var(--space-xs)',
				'sm': 'var(--space-sm)', 
				'md': 'var(--space-md)',
				'lg': 'var(--space-lg)',
				'xl': 'var(--space-xl)',
			},
			borderRadius: {
				'sm': 'var(--radius-sm)',
				'md': 'var(--radius-md)', 
				'lg': 'var(--radius-lg)',
				'pill': 'var(--radius-pill)',
			},
			boxShadow: {
				'card': 'var(--shadow-card)',
				'hover': 'var(--shadow-hover)',
			},
			fontSize: {
				'xs': 'var(--font-size-xs)',
				'sm': 'var(--font-size-sm)',
				'base': 'var(--font-size-base)',
				'lg': 'var(--font-size-lg)',
				'xl': 'var(--font-size-xl)',
				'2xl': 'var(--font-size-2xl)',
				'3xl': 'var(--font-size-3xl)',
			},
			fontWeight: {
				'regular': 'var(--font-weight-regular)',
				'medium': 'var(--font-weight-medium)',
				'semibold': 'var(--font-weight-semibold)',
				'bold': 'var(--font-weight-bold)',
			},
			transitionDuration: {
				'fast': 'var(--duration-fast)',
				'normal': 'var(--duration-normal)',
				'slow': 'var(--duration-slow)',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
