import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../../constants/theme';

interface CardProps {
	children: React.ReactNode;
	variant?: 'white' | 'navy' | 'cream' | 'warm';
	borderRadius?: number;
	padding?: number;
	gap?: number;
	style?: ViewStyle;
}

export function Card({
	children,
	variant = 'white',
	borderRadius = radius.xl,
	padding = spacing.section,
	gap = spacing.lg,
	style,
}: CardProps) {
	const bgColor = {
		white: colors.surface,
		navy: colors.navy,
		cream: colors.bgCream,
		warm: colors.quoteBg,
	}[variant];

	return (
		<View
			style={[
				styles.base,
				{ backgroundColor: bgColor, borderRadius, padding, gap },
				style,
			]}
		>
			{children}
		</View>
	);
}

const styles = StyleSheet.create({
	base: {
		width: '100%',
	},
});
