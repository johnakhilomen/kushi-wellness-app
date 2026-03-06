import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radius, typography } from '../../constants/theme';

type TabKey = 'home' | 'fast' | 'cabinet' | 'ritual' | 'profile';

interface TabBarProps {
	activeTab: TabKey;
	onTabPress: (tab: TabKey) => void;
}

const tabs: { key: TabKey; label: string }[] = [
	{ key: 'home', label: 'Home' },
	{ key: 'fast', label: 'Fast' },
	{ key: 'cabinet', label: 'Cabinet' },
	{ key: 'ritual', label: 'Ritual' },
	{ key: 'profile', label: 'Profile' },
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
		paddingHorizontal: 6,
		gap: 4,
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
		fontFamily: 'Inter',
		fontWeight: '500' as const,
		fontSize: 10,
		color: colors.placeholder,
	},
	activeTabText: {
		color: colors.surface,
	},
});
