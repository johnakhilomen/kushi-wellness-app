import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs, usePathname, useRouter } from 'expo-router';
import { TabBar } from '../../components/ui/TabBar';

export default function TabLayout() {
	const pathname = usePathname();
	const router = useRouter();

	const getActiveTab = ():
		| 'home'
		| 'fast'
		| 'cabinet'
		| 'ritual'
		| 'profile' => {
		if (pathname.includes('/fast')) return 'fast';
		if (pathname.includes('/cabinet')) return 'cabinet';
		if (pathname.includes('/rituals')) return 'ritual';
		if (pathname.includes('/profile')) return 'profile';
		return 'home';
	};

	return (
		<Tabs
			screenOptions={{ headerShown: false }}
			tabBar={() => (
				<View style={styles.tabBarContainer}>
					<TabBar
						activeTab={getActiveTab()}
						onTabPress={(tab) => {
							const routes: Record<string, string> = {
								home: '/(tabs)',
								fast: '/(tabs)/fast',
								cabinet: '/(tabs)/cabinet',
								ritual: '/(tabs)/rituals',
								profile: '/(tabs)/profile',
							};
							router.push(routes[tab] as any);
						}}
					/>
				</View>
			)}
		>
			<Tabs.Screen
				name="index"
				options={{ title: 'Home' }}
			/>
			<Tabs.Screen
				name="fast"
				options={{ title: 'Fast' }}
			/>
			<Tabs.Screen
				name="cabinet"
				options={{ title: 'Cabinet' }}
			/>
			<Tabs.Screen
				name="rituals"
				options={{ title: 'Rituals' }}
			/>
			<Tabs.Screen
				name="profile"
				options={{ title: 'Profile' }}
			/>
		</Tabs>
	);
}

const styles = StyleSheet.create({
	tabBarContainer: {
		position: 'absolute',
		bottom: 34,
		left: 24,
		right: 24,
	},
});
