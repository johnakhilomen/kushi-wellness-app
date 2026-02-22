import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, typography } from '../../constants/theme';

interface TabBarProps {
	activeTab: 'home' | 'fast' | 'ritual' | 'profile';
	onTabPress: (tab: 'home' | 'fast' | 'ritual' | 'profile') => void;
}

const tabs = [
	{ key: 'home' as const, label: 'Home' },
	{ key: 'fast' as const, label: 'Fast' },
	{ key: 'ritual' as const, label: 'Ritual' },
	{ key: 'profile' as const, label: 'Profile' },
];

export function TabBar({ activeTab, onTabPress }: TabBarProps) {
	return (
		<View style={styles.container}>
			{tabs.map((tab) => {
				const isActive = activeTab === tab.key;
				return (
					<TouchableOpacity
						key={tab.key}
						onPress={() => onTabPress(tab.key)}
						style={[styles.tab, isActive && styles.activeTab]}
						activeOpacity={0.7}
					>
						<Text style={[styles.tabText, isActive && styles.activeTabText]}>
							{tab.label}
						</Text>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		backgroundColor: colors.surface,
		borderRadius: radius.xl,
		height: 52,
		padding: 6,
		paddingHorizontal: 8,
		gap: 8,
	},
	tab: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 18,
	},
	activeTab: {
		backgroundColor: colors.navy,
	},
	tabText: {
		...typography.metaSmall,
		color: colors.placeholder,
	},
	activeTabText: {
		color: colors.surface,
	},
});
