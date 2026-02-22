import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, typography } from '../constants/theme';

interface FastingRingProps {
	timeText: string;
	metaText: string;
	progress: number; // 0 to 1
	size?: number;
}

export function FastingRing({
	timeText,
	metaText,
	progress,
	size = 164,
}: FastingRingProps) {
	const strokeWidth = 20;
	const outerRadius = size / 2;
	const innerRadius = outerRadius - strokeWidth;
	const circumference = 2 * Math.PI * (outerRadius - strokeWidth / 2);
	const strokeDashoffset = circumference * (1 - progress);

	return (
		<View style={styles.container}>
			<View style={[styles.ringWrapper, { width: size, height: size }]}>
				<Svg
					width={size}
					height={size}
					style={styles.svg}
				>
					{/* Background circle */}
					<Circle
						cx={outerRadius}
						cy={outerRadius}
						r={outerRadius - strokeWidth / 2}
						stroke={colors.lightBlue2}
						strokeWidth={strokeWidth}
						fill="none"
					/>
					{/* Progress circle */}
					<Circle
						cx={outerRadius}
						cy={outerRadius}
						r={outerRadius - strokeWidth / 2}
						stroke={colors.navy}
						strokeWidth={strokeWidth}
						fill={colors.navy}
						strokeDasharray={`${circumference}`}
						strokeDashoffset={strokeDashoffset}
						strokeLinecap="round"
						transform={`rotate(-90, ${outerRadius}, ${outerRadius})`}
					/>
				</Svg>
				<View style={styles.timeContainer}>
					<Text style={styles.timeText}>{timeText}</Text>
				</View>
			</View>
			<Text style={styles.metaText}>{metaText}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		backgroundColor: colors.surface,
		borderRadius: 24,
		paddingVertical: 20,
		paddingHorizontal: 20,
		width: '100%',
		height: 250,
		justifyContent: 'center',
	},
	ringWrapper: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	svg: {
		position: 'absolute',
	},
	timeContainer: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	timeText: {
		...typography.timerMedium,
		color: colors.surface,
	},
	metaText: {
		...typography.meta,
		color: colors.muted,
		marginTop: 20,
	},
});
