import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { useStore } from '../store/useStore';

function useProtectedRoute() {
	const router = useRouter();
	const segments = useSegments();
	const session = useStore((s) => s.session);
	const profile = useStore((s) => s.profile);
	const isLoading = useStore((s) => s.isLoading);

	useEffect(() => {
		if (isLoading) return;

		const inAuthGroup = segments[0] === '(tabs)';
		const onOnboarding = segments[0] === 'onboarding';

		if (!session) {
			// Not signed in — allow splash, login, register, forgot-password
			if (inAuthGroup || onOnboarding) {
				router.replace('/');
			}
		} else if (!profile.hasCompletedOnboarding) {
			// Signed in but hasn't completed onboarding
			if (inAuthGroup) {
				router.replace('/onboarding');
			}
		} else {
			// Signed in + onboarded
			if (
				!inAuthGroup &&
				!onOnboarding &&
				segments[0] !== 'retake-onboarding'
			) {
				router.replace('/(tabs)');
			}
		}
	}, [session, profile.hasCompletedOnboarding, isLoading, segments]);
}

export default function RootLayout() {
	const initialize = useStore((s) => s.initialize);
	const isLoading = useStore((s) => s.isLoading);

	useEffect(() => {
		initialize();
	}, []);

	useProtectedRoute();

	if (isLoading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: '#F9F6F1',
				}}
			>
				<ActivityIndicator
					size="large"
					color="#1B2B3A"
				/>
			</View>
		);
	}

	return (
		<>
			<StatusBar style="dark" />
			<Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
				<Stack.Screen name="index" />
				<Stack.Screen name="register" />
				<Stack.Screen name="login" />
				<Stack.Screen name="forgot-password" />
				<Stack.Screen name="onboarding" />
				<Stack.Screen name="(tabs)" />
				<Stack.Screen name="retake-onboarding" />
			</Stack>
		</>
	);
}
