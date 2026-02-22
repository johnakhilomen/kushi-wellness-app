import React from 'react';
import { View, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, typography } from '../../constants/theme';

interface InputProps {
	placeholder: string;
	value: string;
	onChangeText: (text: string) => void;
	secureTextEntry?: boolean;
	style?: ViewStyle;
	autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
	keyboardType?: 'default' | 'email-address';
}

export function Input({
	placeholder,
	value,
	onChangeText,
	secureTextEntry = false,
	style,
	autoCapitalize = 'none',
	keyboardType = 'default',
}: InputProps) {
	return (
		<View style={[styles.container, style]}>
			<TextInput
				style={styles.input}
				placeholder={placeholder}
				placeholderTextColor={colors.placeholder}
				value={value}
				onChangeText={onChangeText}
				secureTextEntry={secureTextEntry}
				autoCapitalize={autoCapitalize}
				keyboardType={keyboardType}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: 46,
		backgroundColor: colors.surface,
		borderRadius: radius.sm,
		justifyContent: 'center',
		paddingHorizontal: 12,
	},
	input: {
		...typography.body,
		color: colors.text,
		height: '100%',
	},
});
