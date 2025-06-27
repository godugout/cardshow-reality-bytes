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
				'manrope': ['Manrope', 'sans-serif'],
				'open-sans': ['Open Sans', 'sans-serif'],
				'space-grotesk': ['Space Grotesk', 'monospace'],
			},
			colors: {
				// CDG Primary Colors - Updated to softer orange
				primary: {
					50: '#fef7f3',
					100: '#fde4d3', 
					200: '#fbc5a6',
					300: '#f69d6e',
					400: '#e8744a', // Updated main primary color
					500: '#e8744a',
					600: '#c85a38',
					700: '#a3472a',
					800: '#7d3520',
					900: '#5c2616',
					DEFAULT: '#e8744a',
					foreground: '#ffffff'
				},
				// CDG Secondary Colors
				secondary: {
					50: '#f4f1ff',
					100: '#c4aaff',
					200: '#8855ff',
					300: '#4d00ff',
					400: '#4d00ff',
					500: '#4d00ff',
					600: '#3c00c6',
					700: '#2a008c',
					800: '#1a0059',
					900: '#0d002c',
					DEFAULT: '#4d00ff',
					foreground: '#ffffff'
				},
				// CDG Neutral Colors
				neutral: {
					50: '#ffffff',
					100: '#e8e8e8',
					200: '#d2d2d2',
					300: '#bbbbbb',
					400: '#a4a4a4',
					500: '#8e8e8e',
					600: '#777777',
					700: '#606060',
					800: '#4a4a4a',
					900: '#333333',
					950: '#1a1a1a',
					DEFAULT: '#333333',
				},
				// CDG Feedback Colors - Updated to softer tones
				success: {
					50: '#f0fdf4',
					100: '#bbf7d0',
					500: '#22c55e', // Updated to softer green
					600: '#16a34a',
					DEFAULT: '#22c55e',
					foreground: '#ffffff'
				},
				warning: {
					50: '#fffbeb',
					100: '#fef3c7',
					500: '#f59e0b', // Updated to gold/amber
					600: '#d97706',
					DEFAULT: '#f59e0b',
					foreground: '#ffffff'
				},
				// New accent color for featured items
				accent: {
					50: '#f0fdfa',
					100: '#ccfbf1',
					500: '#14b8a6', // Teal for featured badges
					600: '#0d9488',
					DEFAULT: '#14b8a6',
					foreground: '#ffffff'
				},
				destructive: {
					50: '#fef2f2',
					100: '#fb3748',
					500: '#d00416',
					600: '#b91c1c',
					DEFAULT: '#fb3748',
					foreground: '#ffffff'
				},
				// Legacy color mappings for existing components
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			fontSize: {
				// CDG Typography System - Updated for Premium Collectibles Feel
				'hero': ['96px', { lineHeight: '96px', letterSpacing: '-0.02em', fontWeight: '800' }],
				'headline-1': ['64px', { lineHeight: '64px', letterSpacing: '-0.02em', fontWeight: '700' }],
				'headline-2': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '600' }],
				'headline-3': ['40px', { lineHeight: '48px', letterSpacing: '-0.01em', fontWeight: '700' }],
				'headline-4': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '600' }],
				'body-1': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '400' }],
				'body-1-bold': ['24px', { lineHeight: '32px', fontWeight: '600' }],
				'body-2': ['16px', { lineHeight: '24px', fontWeight: '400' }],
				'body-2-bold': ['16px', { lineHeight: '24px', fontWeight: '500' }],
				'caption': ['14px', { lineHeight: '24px', fontWeight: '400' }],
				'caption-bold': ['14px', { lineHeight: '24px', fontWeight: '500' }],
				'caption-2': ['12px', { lineHeight: '20px', fontWeight: '400' }],
				'caption-2-bold': ['12px', { lineHeight: '20px', fontWeight: '500' }],
				'hairline-1': ['16px', { lineHeight: '16px', fontWeight: '600', textTransform: 'uppercase' }],
				'hairline-2': ['12px', { lineHeight: '12px', fontWeight: '500', textTransform: 'uppercase' }],
				'button-1': ['18px', { lineHeight: '16px', fontWeight: '600' }],
				'button-2': ['14px', { lineHeight: '16px', fontWeight: '500' }],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
