/**
 * Kushi Design Tokens
 * Extracted from the Kushi Design Spec (.pen file)
 */

export const colors = {
	bgCream: '#FAF8F5',
	surface: '#FFFFFF',
	navy: '#1E3A5F',
	navyLight: '#2D4D76',
	green: '#3D6B4F',
	text: '#1C1C1C',
	muted: '#6B6B6B',
	placeholder: '#9A9A9A',
	stroke: '#DDD7CF',
	warmBg: '#F8F3EC',
	warmBg2: '#F6F2EB',
	warmBg3: '#F7F4EE',
	warmBg4: '#F6F3EE',
	warmBg5: '#F7F2EA',
	warmBg6: '#F9F6F1',
	cardBg: '#F5F3F0',
	chipBg: '#F1ECE4',
	chipAlt: '#EDE7DF',
	quoteBg: '#EFE8DD',
	impactBg: '#EEE7DC',
	secondaryBtn: '#EAE3D8',
	secondaryBtn2: '#E9E2D6',
	secondaryBtn3: '#E8E1D7',
	streakDot: '#EED9AE',
	lightBlue: '#D7E3F1',
	lightBlue2: '#DCE6F2',
	lightBlue3: '#EAF0F6',
	whiteAlpha: '#FFFFFF1F',
} as const;

export const typography = {
	display: {
		fontFamily: 'Inter',
		fontWeight: '300' as const,
		fontSize: 34,
	},
	displayLarge: {
		fontFamily: 'Inter',
		fontWeight: '300' as const,
		fontSize: 38,
	},
	heading: {
		fontFamily: 'Inter',
		fontWeight: '300' as const,
		fontSize: 26,
	},
	section: {
		fontFamily: 'Inter',
		fontWeight: '500' as const,
		fontSize: 13,
	},
	body: {
		fontFamily: 'Inter',
		fontWeight: '400' as const,
		fontSize: 13,
	},
	bodyLarge: {
		fontFamily: 'Inter',
		fontWeight: '400' as const,
		fontSize: 14,
	},
	meta: {
		fontFamily: 'Inter',
		fontWeight: '400' as const,
		fontSize: 12,
	},
	metaSmall: {
		fontFamily: 'Inter',
		fontWeight: '500' as const,
		fontSize: 11,
	},
	button: {
		fontFamily: 'Inter',
		fontWeight: '500' as const,
		fontSize: 13,
	},
	timerLarge: {
		fontFamily: 'Inter',
		fontWeight: '300' as const,
		fontSize: 48,
	},
	timerMedium: {
		fontFamily: 'Inter',
		fontWeight: '500' as const,
		fontSize: 24,
	},
	questionTitle: {
		fontFamily: 'Inter',
		fontWeight: '500' as const,
		fontSize: 18,
	},
	stat: {
		fontFamily: 'Inter',
		fontWeight: '500' as const,
		fontSize: 26,
	},
} as const;

export const spacing = {
	xs: 6,
	sm: 8,
	md: 10,
	lg: 12,
	xl: 14,
	xxl: 16,
	section: 18,
	screen: 24,
	screenTop: 26,
} as const;

export const radius = {
	sm: 12,
	md: 14,
	lg: 16,
	xl: 20,
	xxl: 24,
	pill: 999,
	screen: 34,
} as const;

export const layout = {
	screenWidth: 390,
	screenHeight: 844,
	padding: 24,
	sectionGap: 12,
	navHeight: 52,
} as const;
