import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, radius } from '../constants/theme';
import { Button } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import {
	useStore,
	type PrimaryIntention,
	type FastingStyle,
} from '../store/useStore';

const intentionOptions: { key: PrimaryIntention; label: string }[] = [
	{ key: 'digestion', label: 'Improve digestion' },
	{ key: 'weight', label: 'Manage weight naturally' },
	{ key: 'energy', label: 'Boost daily energy' },
];

const fastingOptions: { key: FastingStyle; label: string }[] = [
	{ key: '14:10', label: '14:10' },
	{ key: '16:8', label: '16:8' },
	{ key: '12:12', label: '12:12' },
];

export default function OnboardingScreen() {
	const router = useRouter();
	const completeOnboarding = useStore((s) => s.completeOnboarding);
	const [intention, setIntention] = useState<PrimaryIntention>('energy');
	const [fastingStyle, setFastingStyle] = useState<FastingStyle>('14:10');
	const [loading, setLoading] = useState(false);

	const handleContinue = async () => {
		setLoading(true);
		await completeOnboarding(intention, fastingStyle);
		setLoading(false);
		router.replace('/(tabs)');
	};

	const handleSkip = async () => {
		setLoading(true);
		await completeOnboarding('energy', '14:10');
		setLoading(false);
		router.replace('/(tabs)');
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Header */}
				<Text style={styles.title}>Welcome to Kushi</Text>

				{/* Progress */}
				<View style={styles.progressContainer}>
					<View style={styles.progressBar}>
						<View style={styles.progressFill} />
					</View>
					<Text style={styles.progressText}>Step 1 of 4</Text>
				</View>

				{/* Question 1 */}
				<View style={styles.questionSection}>
					<Text style={styles.questionTitle}>
						What is your primary intention?
					</Text>
					<View style={styles.optionsList}>
						{intentionOptions.map((opt) => (
							<View
								key={opt.key}
								style={styles.optionRow}
							>
								<Chip
									label={opt.label}
									selected={intention === opt.key}
									onPress={() => setIntention(opt.key)}
									style={{ flex: 1 }}
								/>
							</View>
						))}
					</View>
				</View>

				{/* Question 2 */}
				<View style={styles.questionSection}>
					<Text style={styles.questionTitle}>Preferred fasting style</Text>
					<View style={styles.chipRow}>
						{fastingOptions.map((opt) => (
							<Chip
								key={opt.key}
								label={opt.label}
								selected={fastingStyle === opt.key}
								onPress={() => setFastingStyle(opt.key)}
							/>
						))}
					</View>
				</View>

				{/* CTAs */}
				<View style={styles.ctas}>
					<Button
						title={loading ? 'Saving...' : 'Continue to Home'}
						onPress={handleContinue}
					/>
					<Button
						title="Skip for now"
						variant="ghost"
						onPress={handleSkip}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F8F3EC',
	},
	scrollContent: {
		paddingHorizontal: spacing.screen,
		paddingTop: 30,
		paddingBottom: 40,
	},
	title: {
		...typography.display,
		color: colors.text,
		marginBottom: 20,
	},
	progressContainer: {
		marginBottom: 30,
	},
	progressBar: {
		height: 4,
		backgroundColor: colors.stroke,
		borderRadius: 2,
		marginBottom: 8,
	},
	progressFill: {
		height: 4,
		width: '25%',
		backgroundColor: colors.navy,
		borderRadius: 2,
	},
	progressText: {
		...typography.meta,
		color: colors.muted,
	},
	questionSection: {
		marginBottom: 28,
	},
	questionTitle: {
		...typography.questionTitle,
		color: colors.text,
		marginBottom: 14,
	},
	optionsList: {
		gap: 10,
	},
	optionRow: {
		flexDirection: 'row',
	},
	chipRow: {
		flexDirection: 'row',
		gap: 10,
	},
	ctas: {
		gap: 10,
		marginTop: 20,
	},
});
