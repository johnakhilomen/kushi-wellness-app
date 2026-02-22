import React from 'react';
import {
	TouchableOpacity,
	Text,
	StyleSheet,
	ViewStyle,
	TextStyle,
} from 'react-native';
import { colors, radius, typography } from '../../constants/theme';

interface ButtonProps {
	title: string;
	onPress: () => void;
	variant?: 'primary' | 'secondary' | 'ghost';
	style?: ViewStyle;
	textStyle?: TextStyle;
	disabled?: boolean;
}

export function Button({
	title,
	onPress,
	variant = 'primary',
	style,
	textStyle,
	disabled = false,
}: ButtonProps) {
	return (
		<TouchableOpacity
			onPress={onPress}
			disabled={disabled}
			style={[
				styles.base,
				variant === 'primary' && styles.primary,
				variant === 'secondary' && styles.secondary,
				variant === 'ghost' && styles.ghost,
				disabled && styles.disabled,
				style,
			]}
			activeOpacity={0.8}
		>
			<Text
				style={[
					styles.text,
					variant === 'primary' && styles.primaryText,
					variant === 'secondary' && styles.secondaryText,
					variant === 'ghost' && styles.ghostText,
					textStyle,
				]}
			>
				{title}
			</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	base: {
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	primary: {
		backgroundColor: colors.navy,
		height: 52,
		borderRadius: radius.lg,
	},
	secondary: {
		backgroundColor: colors.secondaryBtn,
		height: 46,
		borderRadius: radius.md,
	},
	ghost: {
		backgroundColor: colors.chipAlt,
		height: 44,
		borderRadius: radius.md,
	},
	disabled: {
		opacity: 0.5,
	},
	text: {
		...typography.button,
	},
	primaryText: {
		color: colors.surface,
	},
	secondaryText: {
		color: colors.text,
	},
	ghostText: {
		color: colors.muted,
	},
});
