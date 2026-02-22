import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, typography, spacing } from '../constants/theme';
import { Button } from '../components/ui/Button';

export default function SplashScreen() {
	const router = useRouter();

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				{/* Wordmark */}
				<Text style={styles.wordmark}>KUSHI</Text>
				<Text style={styles.tagline}>Microbiotic wellness by design</Text>

				{/* Hero Art */}
				<View style={styles.heroContainer}>
					<Image
						source={require('../assets/hero-splash.png')}
						style={styles.heroImage}
						resizeMode="contain"
					/>
				</View>

				{/* Lead Text */}
				<Text style={styles.leadText}>
					Align food, fasting, and mindfulness{'\n'}in one daily rhythm.
				</Text>

				{/* CTAs */}
				<View style={styles.ctas}>
					<Button
						title="Create New Account"
						onPress={() => router.push('/register')}
					/>
					<Button
						title="I already have an account"
						variant="secondary"
						onPress={() => router.push('/login')}
					/>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F8F3EC',
	},
	content: {
		flex: 1,
		paddingHorizontal: spacing.screen,
		paddingTop: 20,
		alignItems: 'center',
	},
	wordmark: {
		fontFamily: 'Inter',
		fontWeight: '300',
		fontSize: 38,
		letterSpacing: 1.2,
		color: colors.navy,
		marginTop: 10,
	},
	tagline: {
		...typography.meta,
		color: colors.muted,
		marginTop: 6,
	},
	heroContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		marginVertical: 20,
	},
	heroImage: {
		width: 240,
		height: 240,
	},
	leadText: {
		...typography.body,
		color: colors.muted,
		textAlign: 'center',
		lineHeight: 20,
		marginBottom: 24,
	},
	ctas: {
		width: '100%',
		gap: 10,
		paddingBottom: 30,
	},
});
