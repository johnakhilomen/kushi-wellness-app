import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useStore } from '../../store/useStore';

export default function ProfileScreen() {
	const router = useRouter();
	const user = useStore((s) => s.user);
	const retakeOnboarding = useStore((s) => s.retakeOnboarding);

	const handleRetake = () => {
		retakeOnboarding();
		router.push('/retake-onboarding');
	};

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Title */}
				<Text style={styles.title}>Your Profile</Text>

				{/* Stats Row */}
				<View style={styles.statsRow}>
					<View style={[styles.statCard, { backgroundColor: colors.navy }]}>
						<Text style={styles.statValueLight}>{user.streakDays}</Text>
						<Text style={styles.statLabelLight}>Streak Days</Text>
					</View>
					<View style={[styles.statCard, { backgroundColor: colors.green }]}>
						<Text style={styles.statValueLight}>{user.gutHarmony}%</Text>
						<Text style={styles.statLabelLight}>Gut Harmony</Text>
					</View>
				</View>

				{/* Preferences Card */}
				<Card
					variant="white"
					style={styles.prefsCard}
				>
					<Text style={styles.sectionTitle}>Your Preferences</Text>
					<View style={styles.prefRow}>
						<Text style={styles.prefLabel}>Fasting style</Text>
						<Text style={styles.prefValue}>{user.fastingStyle}</Text>
					</View>
					<View style={styles.prefDivider} />
					<View style={styles.prefRow}>
						<Text style={styles.prefLabel}>Meditation goal</Text>
						<Text style={styles.prefValue}>{user.meditationGoal} min</Text>
					</View>
					<View style={styles.prefDivider} />
					<View style={styles.prefRow}>
						<Text style={styles.prefLabel}>Primary focus</Text>
						<Text style={styles.prefValue}>
							{user.primaryIntention.charAt(0).toUpperCase() +
								user.primaryIntention.slice(1)}
						</Text>
					</View>
				</Card>

				{/* Retake Onboarding */}
				<Button
					title="Retake Onboarding"
					variant="secondary"
					onPress={handleRetake}
				/>

				{/* Bottom spacer for tab bar */}
				<View style={{ height: 100 }} />
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F6F3EE',
	},
	scrollContent: {
		paddingHorizontal: spacing.screen,
		paddingTop: 30,
	},
	title: {
		...typography.display,
		color: colors.text,
		marginBottom: 20,
	},
	statsRow: {
		flexDirection: 'row',
		gap: 12,
		marginBottom: 16,
	},
	statCard: {
		flex: 1,
		borderRadius: radius.lg,
		padding: 18,
		alignItems: 'center',
	},
	statValueLight: {
		...typography.stat,
		color: colors.surface,
		marginBottom: 4,
	},
	statLabelLight: {
		...typography.metaSmall,
		color: colors.lightBlue,
	},
	prefsCard: {
		padding: 18,
		marginBottom: 16,
	},
	sectionTitle: {
		...typography.section,
		color: colors.text,
		marginBottom: 16,
	},
	prefRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 4,
	},
	prefLabel: {
		...typography.body,
		color: colors.muted,
	},
	prefValue: {
		...typography.section,
		color: colors.text,
	},
	prefDivider: {
		height: 1,
		backgroundColor: colors.stroke,
		marginVertical: 12,
	},
});
