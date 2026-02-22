import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { FastingRing } from '../../components/FastingRing';
import { useStore } from '../../store/useStore';

export default function FastScreen() {
	const fasting = useStore((s) => s.fasting);
	const profile = useStore((s) => s.profile);
	const endFast = useStore((s) => s.endFast);
	const startFast = useStore((s) => s.startFast);

	// Compute time display
	const getTimerDisplay = () => {
		if (!fasting.fastStartTime) return '00:00';
		const elapsed = Date.now() - fasting.fastStartTime;
		const hours = Math.floor(elapsed / (1000 * 60 * 60));
		const mins = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
		return `${hours}:${mins.toString().padStart(2, '0')}`;
	};

	const progress = fasting.isFasting ? 0.65 : 0; // Simulated progress

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Title */}
				<Text style={styles.title}>Fasting</Text>

				{/* Circular Ring */}
				<FastingRing
					timeText={getTimerDisplay()}
					metaText="Next meal in 2h 12m"
					progress={progress}
				/>

				{/* Window Card */}
				<Card
					variant="white"
					style={styles.card}
				>
					<View style={styles.windowRow}>
						<View style={styles.windowItem}>
							<Text style={styles.windowLabel}>Fasting</Text>
							<Text style={styles.windowTime}>
								7:30 PM – {profile.eatingWindowStart}
							</Text>
						</View>
						<View style={styles.windowDivider} />
						<View style={styles.windowItem}>
							<Text style={styles.windowLabel}>Eating</Text>
							<Text style={styles.windowTime}>
								{profile.eatingWindowStart} – {profile.eatingWindowEnd}
							</Text>
						</View>
					</View>
				</Card>

				{/* Quick Actions */}
				<View style={styles.actions}>
					<Button
						title={fasting.isFasting ? 'End Fast' : 'Start Fast'}
						onPress={fasting.isFasting ? endFast : startFast}
					/>
					<Button
						title="Adjust Window"
						variant="secondary"
						onPress={() => {}}
					/>
				</View>

				{/* Bottom spacer for tab bar */}
				<View style={{ height: 100 }} />
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F8F4ED',
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
	card: {
		marginTop: 16,
		padding: 18,
	},
	windowRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	windowItem: {
		flex: 1,
	},
	windowDivider: {
		width: 1,
		height: 36,
		backgroundColor: colors.stroke,
		marginHorizontal: 14,
	},
	windowLabel: {
		...typography.metaSmall,
		color: colors.muted,
		marginBottom: 4,
	},
	windowTime: {
		...typography.body,
		color: colors.text,
	},
	actions: {
		gap: 10,
		marginTop: 20,
	},
});
