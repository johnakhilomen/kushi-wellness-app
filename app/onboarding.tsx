import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	ScrollView,
	Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, radius } from '../constants/theme';
import { Button } from '../components/ui/Button';
import { Chip } from '../components/ui/Chip';
import { Tooltip } from '../components/ui/Tooltip';
import {
	useStore,
	type PrimaryIntention,
	type FastingStyle,
} from '../store/useStore';
import { DIET_OPTIONS, type DietPhilosophy } from '../constants/diets';

const intentionOptions: {
	key: PrimaryIntention;
	label: string;
	icon: string;
}[] = [
	{ key: 'digestion', label: 'Improve digestion', icon: '🫁' },
	{ key: 'weight', label: 'Manage weight naturally', icon: '⚖️' },
	{ key: 'energy', label: 'Boost daily energy', icon: '⚡' },
];

const fastingOptions: { key: FastingStyle; label: string; desc: string }[] = [
	{ key: '14:10', label: '14:10', desc: '14h fast · 10h eating' },
	{ key: '16:8', label: '16:8', desc: '16h fast · 8h eating' },
	{ key: '12:12', label: '12:12', desc: '12h fast · 12h eating' },
];

const TOTAL_STEPS = 3;

export default function OnboardingScreen() {
	const router = useRouter();
	const completeOnboarding = useStore((s) => s.completeOnboarding);
	const [step, setStep] = useState(1);
	const [intention, setIntention] = useState<PrimaryIntention>('energy');
	const [fastingStyle, setFastingStyle] = useState<FastingStyle>('14:10');
	const [diet, setDiet] = useState<DietPhilosophy>('macrobiotic');
	const [loading, setLoading] = useState(false);

	const progressPercent = `${Math.round((step / TOTAL_STEPS) * 100)}%` as const;

	const handleNext = () => {
		if (step < TOTAL_STEPS) {
			setStep(step + 1);
		}
	};

	const handleBack = () => {
		if (step > 1) {
			setStep(step - 1);
		}
	};

	const handleFinish = async () => {
		setLoading(true);
		await completeOnboarding(intention, fastingStyle, diet);
		setLoading(false);
		router.replace('/(tabs)');
	};

	const handleSkip = async () => {
		setLoading(true);
		await completeOnboarding('energy', '14:10', 'macrobiotic');
		setLoading(false);
		router.replace('/(tabs)');
	};

	// ── Step 1: Diet Philosophy ──
	const renderStep1 = () => (
		<View style={styles.questionSection}>
			<Text style={styles.questionTitle}>Choose your diet philosophy</Text>
			<Text style={styles.questionSubtitle}>
				This shapes your meals, rituals, and AI guidance.
			</Text>
			<View style={styles.dietGrid}>
				{DIET_OPTIONS.map((d) => {
					const selected = diet === d.key;
					return (
						<Pressable
							key={d.key}
							style={[styles.dietCard, selected && styles.dietCardSelected]}
							onPress={() => setDiet(d.key)}
						>
							<View style={styles.dietCardHeader}>
								<Text style={styles.dietIcon}>{d.icon}</Text>
								{selected && <Text style={styles.dietCheck}>✓</Text>}
							</View>
							<Text
								style={[styles.dietLabel, selected && styles.dietLabelSelected]}
							>
								{d.label}
							</Text>
							<Text style={styles.dietTagline}>{d.tagline}</Text>
							<View style={styles.dietTooltipRow}>
								<Tooltip
									term="Learn more"
									explanation={d.tooltip}
								/>
							</View>
						</Pressable>
					);
				})}
			</View>
		</View>
	);

	// ── Step 2: Primary Intention ──
	const renderStep2 = () => (
		<View style={styles.questionSection}>
			<Text style={styles.questionTitle}>What is your primary intention?</Text>
			<Text style={styles.questionSubtitle}>
				We'll tailor your daily rituals and meal guidance around this goal.
			</Text>
			<View style={styles.intentionList}>
				{intentionOptions.map((opt) => {
					const selected = intention === opt.key;
					return (
						<Pressable
							key={opt.key}
							style={[
								styles.intentionCard,
								selected && styles.intentionCardSelected,
							]}
							onPress={() => setIntention(opt.key)}
						>
							<Text style={styles.intentionIcon}>{opt.icon}</Text>
							<Text
								style={[
									styles.intentionLabel,
									selected && styles.intentionLabelSelected,
								]}
							>
								{opt.label}
							</Text>
							{selected && <Text style={styles.intentionCheck}>✓</Text>}
						</Pressable>
					);
				})}
			</View>
		</View>
	);

	// ── Step 3: Fasting Style ──
	const renderStep3 = () => (
		<View style={styles.questionSection}>
			<Text style={styles.questionTitle}>Preferred fasting style</Text>
			<Text style={styles.questionSubtitle}>
				Choose a rhythm that matches your lifestyle. You can change it later.
			</Text>
			<View style={styles.fastingList}>
				{fastingOptions.map((opt) => {
					const selected = fastingStyle === opt.key;
					return (
						<Pressable
							key={opt.key}
							style={[
								styles.fastingCard,
								selected && styles.fastingCardSelected,
							]}
							onPress={() => setFastingStyle(opt.key)}
						>
							<View>
								<Text
									style={[
										styles.fastingLabel,
										selected && styles.fastingLabelSelected,
									]}
								>
									{opt.label}
								</Text>
								<Text style={styles.fastingDesc}>{opt.desc}</Text>
							</View>
							{selected && <Text style={styles.fastingCheck}>✓</Text>}
						</Pressable>
					);
				})}
			</View>
		</View>
	);

	const isLastStep = step === TOTAL_STEPS;

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
						<View
							style={[
								styles.progressFill,
								{ width: progressPercent as `${number}%` },
							]}
						/>
					</View>
					<Text style={styles.progressText}>
						Step {step} of {TOTAL_STEPS}
					</Text>
				</View>

				{/* Step Content */}
				{step === 1 && renderStep1()}
				{step === 2 && renderStep2()}
				{step === 3 && renderStep3()}

				{/* CTAs */}
				<View style={styles.ctas}>
					{isLastStep ? (
						<Button
							title={loading ? 'Saving...' : 'Get Started'}
							onPress={handleFinish}
							disabled={loading}
						/>
					) : (
						<Button
							title="Next"
							onPress={handleNext}
						/>
					)}

					<View style={styles.secondaryRow}>
						{step > 1 && (
							<Button
								title="Back"
								variant="secondary"
								onPress={handleBack}
							/>
						)}
						<Button
							title="Skip for now"
							variant="ghost"
							onPress={handleSkip}
							disabled={loading}
						/>
					</View>
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
		backgroundColor: colors.navy,
		borderRadius: 2,
	},
	progressText: {
		...typography.meta,
		color: colors.muted,
	},
	questionSection: {
		marginBottom: 12,
	},
	questionTitle: {
		...typography.questionTitle,
		color: colors.text,
		marginBottom: 6,
	},
	questionSubtitle: {
		...typography.body,
		color: colors.muted,
		marginBottom: 14,
	},

	// ── Diet Grid (Step 1) ──
	dietGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 10,
	},
	dietCard: {
		width: '48%',
		backgroundColor: colors.surface,
		borderRadius: radius.lg,
		padding: 14,
		borderWidth: 2,
		borderColor: colors.stroke,
	},
	dietCardSelected: {
		borderColor: colors.navy,
		backgroundColor: '#F0F4FA',
	},
	dietCardHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 6,
	},
	dietIcon: {
		fontSize: 24,
	},
	dietCheck: {
		fontSize: 16,
		fontWeight: '700',
		color: colors.navy,
	},
	dietLabel: {
		...typography.section,
		color: colors.text,
		marginBottom: 2,
	},
	dietLabelSelected: {
		color: colors.navy,
	},
	dietTagline: {
		...typography.meta,
		color: colors.muted,
		marginBottom: 6,
	},
	dietTooltipRow: {
		marginTop: 2,
	},

	// ── Intention List (Step 2) ──
	intentionList: {
		gap: 10,
	},
	intentionCard: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.surface,
		borderRadius: radius.lg,
		padding: 18,
		borderWidth: 2,
		borderColor: colors.stroke,
	},
	intentionCardSelected: {
		borderColor: colors.navy,
		backgroundColor: '#F0F4FA',
	},
	intentionIcon: {
		fontSize: 22,
		marginRight: 14,
	},
	intentionLabel: {
		...typography.body,
		color: colors.text,
		flex: 1,
	},
	intentionLabelSelected: {
		color: colors.navy,
		fontWeight: '600',
	},
	intentionCheck: {
		fontSize: 16,
		fontWeight: '700',
		color: colors.navy,
	},

	// ── Fasting List (Step 3) ──
	fastingList: {
		gap: 10,
	},
	fastingCard: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: colors.surface,
		borderRadius: radius.lg,
		padding: 18,
		borderWidth: 2,
		borderColor: colors.stroke,
	},
	fastingCardSelected: {
		borderColor: colors.navy,
		backgroundColor: '#F0F4FA',
	},
	fastingLabel: {
		...typography.section,
		color: colors.text,
		marginBottom: 2,
	},
	fastingLabelSelected: {
		color: colors.navy,
	},
	fastingDesc: {
		...typography.meta,
		color: colors.muted,
	},
	fastingCheck: {
		fontSize: 16,
		fontWeight: '700',
		color: colors.navy,
	},

	// ── CTA ──
	ctas: {
		gap: 10,
		marginTop: 20,
	},
	secondaryRow: {
		flexDirection: 'row',
		gap: 10,
	},
});
