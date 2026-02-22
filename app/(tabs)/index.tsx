import React, { useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	ScrollView,
	ActivityIndicator,
} from 'react-native';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { Card } from '../../components/ui/Card';
import { StreakBadge } from '../../components/ui/StreakBadge';
import { useStore } from '../../store/useStore';

function getDayOfWeek() {
	const days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];
	return days[new Date().getDay()];
}

const mealTypeColors: Record<string, string> = {
	entry: colors.navy,
	core: colors.green,
	snack: '#B8860B',
	closing: colors.muted,
};

export default function HomeScreen() {
	const profile = useStore((s) => s.profile);
	const fasting = useStore((s) => s.fasting);
	const ai = useStore((s) => s.ai);
	const fetchMealPlan = useStore((s) => s.fetchMealPlan);

	// Fetch meal plan on mount
	useEffect(() => {
		if (profile.hasCompletedOnboarding) {
			fetchMealPlan();
		}
	}, [profile.hasCompletedOnboarding]);

	// Compute fasting time display
	const getTimerDisplay = () => {
		if (!fasting.fastStartTime) return '00:00';
		const elapsed = Date.now() - fasting.fastStartTime;
		const hours = Math.floor(elapsed / (1000 * 60 * 60));
		const mins = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
		return `${hours}:${mins.toString().padStart(2, '0')}`;
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Wordmark */}
				<Text style={styles.wordmark}>KUSHI</Text>

				{/* Greeting */}
				<Text style={styles.greeting}>
					Good {new Date().getHours() < 12 ? 'Morning' : 'Afternoon'},{' '}
					{getDayOfWeek()}
				</Text>

				{/* Streak Badge */}
				<View style={styles.badgeRow}>
					<StreakBadge days={profile.streakDays} />
				</View>

				{/* Fasting Card */}
				<Card
					variant="white"
					style={styles.card}
				>
					<Text style={styles.timerText}>{getTimerDisplay()}</Text>
					<Text style={styles.timerMeta}>
						Eating window opens at {profile.eatingWindowStart}
					</Text>
					<View style={styles.organRow}>
						<View style={styles.organItem}>
							<Text style={styles.organIcon}>🫁</Text>
							<Text style={styles.organLabel}>Liver</Text>
							<Text style={styles.organValue}>82%</Text>
						</View>
						<View style={styles.organItem}>
							<Text style={styles.organIcon}>🌿</Text>
							<Text style={styles.organLabel}>Gut</Text>
							<Text style={styles.organValue}>{profile.gutHarmony}%</Text>
						</View>
					</View>
				</Card>

				{/* Meal Card */}
				<Card
					variant="white"
					style={styles.card}
				>
					<Text style={styles.sectionTitle}>Dynamic Diet Schedule</Text>
					{ai.mealsLoading ? (
						<View style={styles.loadingContainer}>
							<ActivityIndicator
								size="small"
								color={colors.navy}
							/>
							<Text style={styles.loadingText}>Generating your meal plan…</Text>
						</View>
					) : ai.meals.length > 0 ? (
						ai.meals.map((meal, i) => (
							<View
								key={i}
								style={styles.mealItem}
							>
								<View
									style={[
										styles.mealDot,
										{
											backgroundColor: mealTypeColors[meal.type] ?? colors.navy,
										},
									]}
								/>
								<View style={styles.mealInfo}>
									<Text style={styles.mealName}>{meal.name}</Text>
									<Text style={styles.mealTime}>
										{meal.time} — {meal.description}
									</Text>
								</View>
							</View>
						))
					) : (
						<>
							<View style={styles.mealItem}>
								<View style={styles.mealDot} />
								<View style={styles.mealInfo}>
									<Text style={styles.mealName}>Miso soup with wakame</Text>
									<Text style={styles.mealTime}>
										11:30 AM — Light entry meal
									</Text>
								</View>
							</View>
							<View style={styles.mealItem}>
								<View
									style={[styles.mealDot, { backgroundColor: colors.green }]}
								/>
								<View style={styles.mealInfo}>
									<Text style={styles.mealName}>
										Steamed greens & brown rice
									</Text>
									<Text style={styles.mealTime}>
										1:00 PM — Core nourishment
									</Text>
								</View>
							</View>
						</>
					)}
				</Card>

				{/* Meditation Card */}
				<Card
					variant="navy"
					style={styles.card}
				>
					<Text style={styles.sectionTitleLight}>Mindful Practice</Text>
					<Text style={styles.medMeta}>Today's recommended session</Text>
					<View style={styles.medButtonsRow}>
						<View style={styles.medButton}>
							<Text style={styles.medButtonText}>4-7-8 Breathwork</Text>
						</View>
						<View style={styles.medButton}>
							<Text style={styles.medButtonText}>Body Scan</Text>
						</View>
					</View>
				</Card>

				{/* Bottom spacer for tab bar */}
				<View style={{ height: 100 }} />
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.bgCream,
	},
	scrollContent: {
		paddingHorizontal: spacing.screen,
		paddingTop: 14,
	},
	wordmark: {
		fontFamily: 'Inter',
		fontWeight: '300',
		fontSize: 38,
		letterSpacing: 1.4,
		color: colors.navy,
		marginBottom: 4,
	},
	greeting: {
		...typography.body,
		color: colors.muted,
		marginBottom: 12,
	},
	badgeRow: {
		flexDirection: 'row',
		marginBottom: 16,
	},
	card: {
		marginBottom: 12,
		padding: 18,
	},
	timerText: {
		...typography.timerLarge,
		color: colors.navy,
		textAlign: 'center',
		marginBottom: 4,
	},
	timerMeta: {
		...typography.meta,
		color: colors.muted,
		textAlign: 'center',
		marginBottom: 16,
	},
	organRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		gap: 32,
	},
	organItem: {
		alignItems: 'center',
	},
	organIcon: {
		fontSize: 20,
		marginBottom: 4,
	},
	organLabel: {
		...typography.metaSmall,
		color: colors.muted,
	},
	organValue: {
		...typography.section,
		color: colors.navy,
		marginTop: 2,
	},
	sectionTitle: {
		...typography.section,
		color: colors.text,
		marginBottom: 14,
	},
	sectionTitleLight: {
		...typography.section,
		color: colors.surface,
		marginBottom: 4,
	},
	mealItem: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		marginBottom: 12,
	},
	mealDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: colors.navy,
		marginTop: 4,
		marginRight: 12,
	},
	mealInfo: {
		flex: 1,
	},
	mealName: {
		...typography.body,
		color: colors.text,
		marginBottom: 2,
	},
	mealTime: {
		...typography.meta,
		color: colors.muted,
	},
	loadingContainer: {
		alignItems: 'center',
		paddingVertical: 20,
		gap: 8,
	},
	loadingText: {
		...typography.meta,
		color: colors.muted,
	},
	medMeta: {
		...typography.meta,
		color: colors.lightBlue,
		marginBottom: 14,
	},
	medButtonsRow: {
		flexDirection: 'row',
		gap: 10,
	},
	medButton: {
		flex: 1,
		backgroundColor: 'rgba(255,255,255,0.12)',
		borderRadius: radius.sm,
		paddingVertical: 12,
		alignItems: 'center',
	},
	medButtonText: {
		...typography.metaSmall,
		color: colors.surface,
	},
});
