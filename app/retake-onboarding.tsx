import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	SafeAreaView,
	ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, radius } from '../constants/theme';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function RetakeOnboardingScreen() {
	const router = useRouter();

	const handleStart = () => {
		router.replace('/onboarding');
	};

	const handleCancel = () => {
		router.back();
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Title */}
				<Text style={styles.title}>Retake Onboarding</Text>
				<Text style={styles.subtitle}>
					Update your wellness preferences and{'\n'}
					fasting schedule
				</Text>

				{/* Hero Art */}
				<View style={styles.heroContainer}>
					<Image
						source={require('../assets/hero-retake.png')}
						style={styles.heroImage}
						resizeMode="contain"
					/>
				</View>

				{/* Steps Card */}
				<Card
					variant="white"
					style={styles.card}
				>
					<Text style={styles.sectionTitle}>What you'll review</Text>
					<View style={styles.stepItem}>
						<View style={styles.stepNumber}>
							<Text style={styles.stepNumberText}>1</Text>
						</View>
						<Text style={styles.stepText}>Diet philosophy</Text>
					</View>
					<View style={styles.stepItem}>
						<View style={styles.stepNumber}>
							<Text style={styles.stepNumberText}>2</Text>
						</View>
						<Text style={styles.stepText}>Primary wellness intention</Text>
					</View>
					<View style={styles.stepItem}>
						<View style={styles.stepNumber}>
							<Text style={styles.stepNumberText}>3</Text>
						</View>
						<Text style={styles.stepText}>Preferred fasting style</Text>
					</View>
				</Card>

				{/* Impact Card */}
				<View style={styles.impactCard}>
					<Text style={styles.impactTitle}>
						New schedule effective tomorrow
					</Text>
					<Text style={styles.impactMeta}>
						Progress history remains preserved
					</Text>
				</View>

				{/* CTAs */}
				<View style={styles.ctas}>
					<Button
						title="Start Retake Onboarding"
						onPress={handleStart}
					/>
					<Button
						title="Not now"
						variant="ghost"
						onPress={handleCancel}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F7F2EA',
	},
	scrollContent: {
		paddingHorizontal: spacing.screen,
		paddingTop: 30,
		paddingBottom: 40,
	},
	title: {
		fontFamily: 'Inter',
		fontWeight: '300',
		fontSize: 30,
		color: colors.text,
		marginBottom: 8,
	},
	subtitle: {
		...typography.body,
		color: colors.muted,
		lineHeight: 20,
	},
	heroContainer: {
		alignItems: 'center',
		marginVertical: 20,
	},
	heroImage: {
		width: 160,
		height: 130,
	},
	card: {
		padding: 18,
		marginBottom: 12,
	},
	sectionTitle: {
		...typography.section,
		color: colors.text,
		marginBottom: 16,
	},
	stepItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 14,
	},
	stepNumber: {
		width: 26,
		height: 26,
		borderRadius: 13,
		backgroundColor: colors.lightBlue3,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
	},
	stepNumberText: {
		...typography.metaSmall,
		color: colors.navy,
	},
	stepText: {
		...typography.body,
		color: colors.text,
	},
	impactCard: {
		backgroundColor: colors.impactBg,
		borderRadius: radius.lg,
		padding: 18,
		marginBottom: 20,
	},
	impactTitle: {
		...typography.section,
		color: colors.text,
		marginBottom: 4,
	},
	impactMeta: {
		...typography.meta,
		color: colors.muted,
	},
	ctas: {
		gap: 10,
	},
});
