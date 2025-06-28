
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
				'jetbrains': ['JetBrains Mono', 'monospace'],
			},
			colors: {
				// Enhanced color system
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					50: 'rgb(var(--primary-50))',
					100: 'rgb(var(--primary-100))',
					200: 'rgb(var(--primary-200))',
					300: 'rgb(var(--primary-300))',
					400: 'rgb(var(--primary-400))',
					500: 'rgb(var(--primary-500))',
					600: 'rgb(var(--primary-600))',
					700: 'rgb(var(--primary-700))',
					800: 'rgb(var(--primary-800))',
					900: 'rgb(var(--primary-900))',
					950: 'rgb(var(--primary-950))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))',
					50: 'rgb(var(--success-50))',
					500: 'rgb(var(--success-500))',
					600: 'rgb(var(--success-600))',
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))',
					50: 'rgb(var(--warning-50))',
					500: 'rgb(var(--warning-500))',
					600: 'rgb(var(--warning-600))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					purple: {
						500: 'rgb(var(--accent-purple-500))',
						600: 'rgb(var(--accent-purple-600))',
					},
					pink: {
						500: 'rgb(var(--accent-pink-500))',
						600: 'rgb(var(--accent-pink-600))',
					},
					emerald: {
						500: 'rgb(var(--accent-emerald-500))',
						600: 'rgb(var(--accent-emerald-600))',
					},
					amber: {
						500: 'rgb(var(--accent-amber-500))',
						600: 'rgb(var(--accent-amber-600))',
					},
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				neutral: {
					50: 'rgb(var(--neutral-50))',
					100: 'rgb(var(--neutral-100))',
					200: 'rgb(var(--neutral-200))',
					300: 'rgb(var(--neutral-300))',
					400: 'rgb(var(--neutral-400))',
					500: 'rgb(var(--neutral-500))',
					600: 'rgb(var(--neutral-600))',
					700: 'rgb(var(--neutral-700))',
					800: 'rgb(var(--neutral-800))',
					900: 'rgb(var(--neutral-900))',
					950: 'rgb(var(--neutral-950))',
				}
			},
			borderRadius: {
				lg: 'var(--radius-lg)',
				md: 'var(--radius-md)',
				sm: 'var(--radius-sm)',
				xl: 'var(--radius-xl)',
				'2xl': 'var(--radius-2xl)',
				'3xl': 'var(--radius-3xl)',
			},
			spacing: {
				'1': 'var(--space-1)',
				'2': 'var(--space-2)',
				'3': 'var(--space-3)',
				'4': 'var(--space-4)',
				'5': 'var(--space-5)',
				'6': 'var(--space-6)',
				'8': 'var(--space-8)',
				'10': 'var(--space-10)',
				'12': 'var(--space-12)',
				'16': 'var(--space-16)',
				'20': 'var(--space-20)',
				'24': 'var(--space-24)',
				'32': 'var(--space-32)',
			},
			fontSize: {
				'xs': 'var(--text-xs)',
				'sm': 'var(--text-sm)',
				'base': 'var(--text-base)',
				'lg': 'var(--text-lg)',
				'xl': 'var(--text-xl)',
				'2xl': 'var(--text-2xl)',
				'3xl': 'var(--text-3xl)',
				'4xl': 'var(--text-4xl)',
				'5xl': 'var(--text-5xl)',
				'6xl': 'var(--text-6xl)',
				'7xl': 'var(--text-7xl)',
				'8xl': 'var(--text-8xl)',
				'9xl': 'var(--text-9xl)',
			},
			boxShadow: {
				'xs': 'var(--shadow-xs)',
				'sm': 'var(--shadow-sm)',
				'md': 'var(--shadow-md)',
				'lg': 'var(--shadow-lg)',
				'xl': 'var(--shadow-xl)',
				'2xl': 'var(--shadow-2xl)',
				'inner': 'var(--shadow-inner)',
			},
			transitionTimingFunction: {
				'bounce': 'var(--ease-bounce)',
				'elastic': 'var(--ease-elastic)',
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fadeIn 0.3s ease-out forwards',
				'fade-out': 'fadeOut 0.3s ease-in forwards',
				'slide-in-up': 'slideInUp 0.4s ease-out forwards',
				'slide-in-down': 'slideInDown 0.4s ease-out forwards',
				'scale-in': 'scaleIn 0.2s ease-out forwards',
				'float': 'float 3s ease-in-out infinite',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fadeIn': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fadeOut': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},
				'slideInUp': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slideInDown': {
					'0%': { opacity: '0', transform: 'translateY(-20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scaleIn': {
					'0%': { opacity: '0', transform: 'scale(0.95)' },
					'100%': { opacity: '1', transform: 'scale(1)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				}
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
