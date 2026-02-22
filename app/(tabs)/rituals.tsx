import React, { useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	ScrollView,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { Card } from '../../components/ui/Card';
import { Tooltip } from '../../components/ui/Tooltip';
import { useStore } from '../../store/useStore';

export default function RitualsScreen() {
	const profile = useStore((s) => s.profile);
	const ai = useStore((s) => s.ai);
	const fetchDailyRituals = useStore((s) => s.fetchDailyRituals);
	const completeRitual = useStore((s) => s.completeRitual);

	useEffect(() => {
		if (profile.hasCompletedOnboarding) {
			fetchDailyRituals();
		}
	}, [profile.hasCompletedOnboarding]);

	const completedCount = ai.rituals.filter((r) => r.completed).length;
	const totalCount = ai.rituals.length;

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Title */}
				<Text style={styles.title}>Kushi Flow</Text>

				{/* Hero Card — Navy */}
				<Card
					variant="navy"
					style={styles.heroCard}
				>
					<Tooltip
						term="Today's Sacred Arc"
						explanation="Your personalised daily rhythm of rituals from morning to evening — designed to align body, mind, and spirit with your chosen diet philosophy."
						style={styles.heroTitle}
					/>
					<Text style={styles.heroMeta}>
						{ai.ritualsLoading
							? 'Generating your daily rhythm…'
							: totalCount > 0
								? `${completedCount} of ${totalCount} rituals completed`
								: 'Morning to evening microbiotic rhythm'}
					</Text>
					{totalCount > 0 && (
						<View style={styles.progressBarContainer}>
							<View
								style={[
									styles.progressBar,
									{
										width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
									},
								]}
							/>
						</View>
					)}
				</Card>

				{/* Ritual Timeline Card */}
				<Card
					variant="white"
					style={styles.card}
				>
					<Text style={styles.sectionTitle}>Daily Rituals</Text>
					{ai.ritualsLoading ? (
						<View style={styles.loadingContainer}>
							<ActivityIndicator
								size="small"
								color={colors.navy}
							/>
							<Text style={styles.loadingText}>
								Creating personalized rituals…
							</Text>
						</View>
					) : ai.rituals.length > 0 ? (
						ai.rituals.map((ritual, i) => (
							<React.Fragment key={ritual.id || i}>
								<TouchableOpacity
									style={styles.timelineItem}
									onPress={() => completeRitual(i)}
									activeOpacity={0.7}
								>
									<Text style={styles.timelineTime}>{ritual.time}</Text>
									<View
										style={[
											styles.timelineCheck,
											ritual.completed && styles.timelineCheckDone,
										]}
									>
										{ritual.completed && (
											<Text style={styles.checkMark}>✓</Text>
										)}
									</View>
									<View style={styles.timelineContent}>
										<Text
											style={[
												styles.timelineText,
												ritual.completed && styles.timelineTextDone,
											]}
										>
											{ritual.name}
										</Text>
										<Text style={styles.timelineDesc}>
											{ritual.description}
										</Text>
									</View>
								</TouchableOpacity>
								{i < ai.rituals.length - 1 && (
									<View style={styles.timelineConnector} />
								)}
							</React.Fragment>
						))
					) : (
						<>
							<View style={styles.timelineItem}>
								<Text style={styles.timelineTime}>06:30</Text>
								<View style={styles.timelineDot} />
								<View style={styles.timelineContent}>
									<Text style={styles.timelineText}>
										Warm water + umeboshi plum
									</Text>
								</View>
							</View>
							<View style={styles.timelineConnector} />
							<View style={styles.timelineItem}>
								<Text style={styles.timelineTime}>20:30</Text>
								<View
									style={[
										styles.timelineDot,
										{ backgroundColor: colors.green },
									]}
								/>
								<View style={styles.timelineContent}>
									<Text style={styles.timelineText}>Gratitude body scan</Text>
								</View>
							</View>
						</>
					)}
				</Card>

				{/* Quote Card */}
				<View style={styles.quoteCard}>
					<Text style={styles.quoteText}>
						{ai.ritualQuote
							? `"${ai.ritualQuote}"`
							: '"The food you eat can be either the safest and most powerful form of medicine or the slowest form of poison."'}
					</Text>
					<Text style={styles.quoteAuthor}>
						— {ai.ritualQuoteAuthor || 'Michio Kushi'}
					</Text>
				</View>

				{/* Evening Card — Gradient */}
				<LinearGradient
					colors={[colors.navy, colors.green]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={styles.eveningCard}
				>
					<Tooltip
						term="Evening Resonance"
						explanation="A gentle wind-down practice to close your day with intention — calming the nervous system and preparing the body for restorative sleep."
						style={styles.eveningTitle}
					/>
					<Text style={styles.eveningMeta}>
						{ai.eveningPractice
							? ai.eveningPractice.description
							: 'Wind down with gentle belly breathing'}
					</Text>
					<View style={styles.eveningButton}>
						<Text style={styles.eveningButtonText}>
							{ai.eveningPractice
								? `${ai.eveningPractice.duration} ${ai.eveningPractice.name}`
								: '7-min belly breathing'}
						</Text>
					</View>
				</LinearGradient>

				{/* Bottom spacer for tab bar */}
				<View style={{ height: 100 }} />
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F7F4EE',
	},
	scrollContent: {
		paddingHorizontal: spacing.screen,
		paddingTop: 30,
	},
	title: {
		fontFamily: 'Inter',
		fontWeight: '300',
		fontSize: 36,
		letterSpacing: -0.4,
		color: colors.text,
		marginBottom: 20,
	},
	heroCard: {
		padding: 20,
		marginBottom: 12,
	},
	heroTitle: {
		...typography.section,
		color: colors.surface,
		marginBottom: 4,
	},
	heroMeta: {
		...typography.meta,
		color: colors.lightBlue,
		marginBottom: 12,
	},
	progressBarContainer: {
		height: 6,
		backgroundColor: 'rgba(255,255,255,0.15)',
		borderRadius: 3,
		overflow: 'hidden',
	},
	progressBar: {
		height: '100%',
		backgroundColor: colors.green,
		borderRadius: 3,
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
	loadingContainer: {
		alignItems: 'center',
		paddingVertical: 24,
		gap: 8,
	},
	loadingText: {
		...typography.meta,
		color: colors.muted,
	},
	timelineItem: {
		flexDirection: 'row',
		alignItems: 'flex-start',
	},
	timelineTime: {
		...typography.metaSmall,
		color: colors.muted,
		width: 44,
		marginTop: 2,
	},
	timelineDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: colors.navy,
		marginHorizontal: 10,
		marginTop: 6,
	},
	timelineCheck: {
		width: 22,
		height: 22,
		borderRadius: 11,
		borderWidth: 2,
		borderColor: colors.stroke,
		marginHorizontal: 8,
		alignItems: 'center',
		justifyContent: 'center',
	},
	timelineCheckDone: {
		borderColor: colors.green,
		backgroundColor: colors.green,
	},
	checkMark: {
		color: colors.surface,
		fontSize: 12,
		fontWeight: '700',
	},
	timelineContent: {
		flex: 1,
	},
	timelineText: {
		...typography.body,
		color: colors.text,
	},
	timelineTextDone: {
		textDecorationLine: 'line-through',
		color: colors.muted,
	},
	timelineDesc: {
		...typography.meta,
		color: colors.muted,
		marginTop: 2,
	},
	timelineConnector: {
		width: 1,
		height: 20,
		backgroundColor: colors.stroke,
		marginLeft: 55,
	},
	quoteCard: {
		backgroundColor: colors.quoteBg,
		borderRadius: radius.lg,
		padding: 20,
		marginBottom: 12,
	},
	quoteText: {
		...typography.body,
		color: colors.text,
		fontStyle: 'italic',
		lineHeight: 20,
		marginBottom: 10,
	},
	quoteAuthor: {
		...typography.meta,
		color: colors.muted,
	},
	eveningCard: {
		borderRadius: radius.lg,
		padding: 20,
		marginBottom: 12,
	},
	eveningTitle: {
		...typography.section,
		color: colors.surface,
		marginBottom: 4,
	},
	eveningMeta: {
		...typography.meta,
		color: colors.lightBlue,
		marginBottom: 16,
	},
	eveningButton: {
		backgroundColor: 'rgba(255,255,255,0.15)',
		borderRadius: radius.sm,
		paddingVertical: 12,
		alignItems: 'center',
	},
	eveningButtonText: {
		...typography.metaSmall,
		color: colors.surface,
	},
});
