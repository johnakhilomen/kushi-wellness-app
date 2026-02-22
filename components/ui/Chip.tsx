import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, typography } from '../../constants/theme';

interface ChipProps {
	label: string;
	selected?: boolean;
	onPress: () => void;
	style?: ViewStyle;
}

export function Chip({ label, selected = false, onPress, style }: ChipProps) {
	return (
		<TouchableOpacity
			onPress={onPress}
			style={[
				styles.base,
				selected ? styles.selected : styles.unselected,
				style,
			]}
			activeOpacity={0.7}
		>
			<Text
				style={[
					styles.text,
					selected ? styles.selectedText : styles.unselectedText,
				]}
			>
				{label}
			</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	base: {
		flex: 1,
		height: 34,
		borderRadius: radius.pill,
		alignItems: 'center',
		justifyContent: 'center',
	},
	selected: {
		backgroundColor: colors.navy,
	},
	unselected: {
		backgroundColor: colors.chipBg,
	},
	text: {
		...typography.metaSmall,
	},
	selectedText: {
		color: colors.surface,
	},
	unselectedText: {
		color: colors.muted,
	},
});
