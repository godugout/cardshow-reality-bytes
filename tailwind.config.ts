
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
				// Brand contextual colors - Fixed RGB values
				collections: {
					DEFAULT: 'rgb(22 197 94)', /* #16C55E */
					primary: 'rgb(22 197 94)',
					secondary: 'rgb(187 247 208)', /* Green 200 */
					accent: 'rgb(220 252 231)', /* Green 100 */
				},
				cards: {
					DEFAULT: 'rgb(249 115 22)', /* #F97316 */
					primary: 'rgb(249 115 22)',
					secondary: 'rgb(254 215 170)', /* Orange 200 */
					accent: 'rgb(255 237 213)', /* Orange 100 */
				},
				marketplace: {
					DEFAULT: 'rgb(59 130 246)', /* #3B82F6 */
					primary: 'rgb(59 130 246)',
					secondary: 'rgb(191 219 254)', /* Blue 200 */
					accent: 'rgb(219 234 254)', /* Blue 100 */
				},
				currency: {
					DEFAULT: 'rgb(250 204 21)', /* #FACC15 */
					primary: 'rgb(250 204 21)',
					secondary: 'rgb(254 240 138)', /* Yellow 200 */
					accent: 'rgb(255 251 235)', /* Yellow 100 */
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
