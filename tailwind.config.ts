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
				sans: ['Noto Sans', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				
				// Tricolor Theme
				saffron: {
					DEFAULT: 'hsl(var(--saffron))',
					light: 'hsl(var(--saffron-light))'
				},
				green: {
					DEFAULT: 'hsl(var(--green))',
					light: 'hsl(var(--green-light))'
				},
				navy: {
					DEFAULT: 'hsl(var(--navy))',
					light: 'hsl(var(--navy-light))'
				},
				
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
				
				// Audio & Status Colors
				audio: {
					primary: 'hsl(var(--audio-primary))',
					secondary: 'hsl(var(--audio-secondary))',
					bg: 'hsl(var(--audio-bg))'
				},
				status: {
					connected: 'hsl(var(--status-connected))',
					listening: 'hsl(var(--status-listening))',
					thinking: 'hsl(var(--status-thinking))',
					error: 'hsl(var(--status-error))'
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
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				
				// Audio Visualizer Animations
				'audio-wave': {
					'0%, 100%': { transform: 'scaleY(0.5)' },
					'50%': { transform: 'scaleY(1.5)' }
				},
				'audio-pulse': {
					'0%, 100%': { opacity: '1', transform: 'scale(1)' },
					'50%': { opacity: '0.7', transform: 'scale(1.1)' }
				},
				
				// Chat Animations
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'slide-in-left': {
					'0%': { transform: 'translateX(-100%)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'fade-in-up': {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				
				// Status Animations
				'status-pulse': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				},
				'bounce-subtle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-2px)' }
				},
				
				// Mic Button Animation
				'mic-active': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				
				// Audio Animations
				'audio-wave': 'audio-wave 1s ease-in-out infinite',
				'audio-pulse': 'audio-pulse 2s ease-in-out infinite',
				
				// Chat Animations
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-in-left': 'slide-in-left 0.3s ease-out',
				'fade-in-up': 'fade-in-up 0.4s ease-out',
				
				// Status Animations
				'status-pulse': 'status-pulse 2s ease-in-out infinite',
				'bounce-subtle': 'bounce-subtle 1s ease-in-out infinite',
				
				// Mic Animation
				'mic-active': 'mic-active 1.5s ease-in-out infinite'
			},
			
			scale: {
				'102': '1.02',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
