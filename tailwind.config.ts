
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
				'inter': ['Inter', 'sans-serif'],
				'default': ['Inter', 'sans-serif'],
			},
			colors: {
				// Cardshow Brand Colors
				'brand-collections': 'hsl(var(--brand-collections))',
				'brand-cards': 'hsl(var(--brand-cards))',
				'brand-marketplace': 'hsl(var(--brand-marketplace))',
				'brand-currency': 'hsl(var(--brand-currency))',
				
				// Extended Brand Palette
				'blue-600': 'hsl(var(--blue-600))',
				'blue-500': 'hsl(var(--blue-500))',
				'blue-400': 'hsl(var(--blue-400))',
				'blue-300': 'hsl(var(--blue-300))',
				'blue-200': 'hsl(var(--blue-200))',
				'blue-100': 'hsl(var(--blue-100))',
				
				'green-500': 'hsl(var(--green-500))',
				'green-400': 'hsl(var(--green-400))',
				'green-300': 'hsl(var(--green-300))',
				'green-200': 'hsl(var(--green-200))',
				'green-100': 'hsl(var(--green-100))',
				
				'purple-600': 'hsl(var(--purple-600))',
				'purple-500': 'hsl(var(--purple-500))',
				'purple-400': 'hsl(var(--purple-400))',
				'purple-300': 'hsl(var(--purple-300))',
				
				'gray-900': 'hsl(var(--gray-900))',
				'gray-800': 'hsl(var(--gray-800))',
				'gray-700': 'hsl(var(--gray-700))',
				'gray-600': 'hsl(var(--gray-600))',
				'gray-500': 'hsl(var(--gray-500))',
				'gray-400': 'hsl(var(--gray-400))',
				'gray-300': 'hsl(var(--gray-300))',
				'gray-200': 'hsl(var(--gray-200))',
				'gray-100': 'hsl(var(--gray-100))',
				
				// Design system semantic colors
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				surface: 'hsl(var(--surface))',
				'surface-foreground': 'hsl(var(--surface-foreground))',
				
				primary: 'hsl(var(--primary))',
				'primary-foreground': 'hsl(var(--primary-foreground))',
				secondary: 'hsl(var(--secondary))',
				'secondary-foreground': 'hsl(var(--secondary-foreground))',
				
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
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
				sm: 'var(--radius-sm)',
				md: 'var(--radius-md)', 
				lg: 'var(--radius-lg)',
				pill: 'var(--radius-pill)',
				DEFAULT: 'var(--radius)',
			},
			boxShadow: {
				'card': 'var(--shadow-card)',
				'hover': 'var(--shadow-hover)',
				'elevation': 'var(--shadow-elevation)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
