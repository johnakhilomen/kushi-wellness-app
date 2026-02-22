import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../constants/theme';

interface StreakBadgeProps {
	days: number;
}

export function StreakBadge({ days }: StreakBadgeProps) {
	return (
		<View style={styles.container}>
			<View style={styles.dot} />
			<Text style={styles.text}>{days}-day balance streak</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.navy,
		borderRadius: 20,
		height: 32,
		paddingVertical: 8,
		paddingHorizontal: 12,
		gap: 8,
		alignSelf: 'flex-start',
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: colors.streakDot,
	},
	text: {
		...typography.metaSmall,
		color: colors.surface,
	},
});
