import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	ScrollView,
	ActivityIndicator,
	Modal,
	Pressable,
} from 'react-native';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { FastingRing } from '../../components/FastingRing';
import { Tooltip } from '../../components/ui/Tooltip';
import { useStore } from '../../store/useStore';

const WINDOW_PRESETS: {
	label: string;
	start: string;
	end: string;
	fast: string;
}[] = [
	{ label: '12:12', start: '8:00 AM', end: '8:00 PM', fast: '8 PM – 8 AM' },
	{ label: '14:10', start: '10:00 AM', end: '8:00 PM', fast: '8 PM – 10 AM' },
	{
		label: '16:8',
		start: '11:30 AM',
		end: '7:30 PM',
		fast: '7:30 PM – 11:30 AM',
	},
	{ label: '18:6', start: '12:00 PM', end: '6:00 PM', fast: '6 PM – 12 PM' },
];

export default function FastScreen() {
	const fasting = useStore((s) => s.fasting);
	const profile = useStore((s) => s.profile);
	const ai = useStore((s) => s.ai);
	const endFast = useStore((s) => s.endFast);
	const startFast = useStore((s) => s.startFast);
	const clearPostFastInsight = useStore((s) => s.clearPostFastInsight);
	const adjustWindow = useStore((s) => s.adjustWindow);

	const [showWindowModal, setShowWindowModal] = useState(false);
	const [adjusting, setAdjusting] = useState(false);

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
							<Tooltip
								term="Fasting Window"
								explanation="The period when you abstain from food, allowing your digestive system to rest and your body to enter repair mode through autophagy."
								style={styles.windowLabel}
							/>
							<Text style={styles.windowTime}>
								7:30 PM – {profile.eatingWindowStart}
							</Text>
						</View>
						<View style={styles.windowDivider} />
						<View style={styles.windowItem}>
							<Tooltip
								term="Eating Window"
								explanation="Your designated eating period, when meals are timed to optimize digestion and nutrient absorption aligned with your body's natural rhythm."
								style={styles.windowLabel}
							/>
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
						onPress={() => setShowWindowModal(true)}
					/>
				</View>

				{/* Post-Fast Insight */}
				{(ai.insightLoading || ai.postFastInsight) && (
					<Card
						variant="navy"
						style={styles.insightCard}
					>
						{ai.insightLoading ? (
							<View style={styles.insightLoading}>
								<ActivityIndicator
									size="small"
									color={colors.lightBlue}
								/>
								<Text style={styles.insightLoadingText}>
									Analyzing your fast…
								</Text>
							</View>
						) : (
							<>
								<View style={styles.insightTitleRow}>
									<Text style={styles.insightTitleEmoji}>✨ </Text>
									<Tooltip
										term="Post-Fast Insight"
										explanation="A personalised AI-generated reflection on what your body accomplished during your fast, with guidance on how to break your fast mindfully."
										style={styles.insightTitleText}
									/>
								</View>
								<Text style={styles.insightText}>{ai.postFastInsight}</Text>
								<View style={{ marginTop: 12 }}>
									<Button
										title="Dismiss"
										variant="ghost"
										onPress={clearPostFastInsight}
									/>
								</View>
							</>
						)}
					</Card>
				)}

				{/* Bottom spacer for tab bar */}
				<View style={{ height: 100 }} />
			</ScrollView>

			{/* Adjust Window Modal */}
			<Modal
				visible={showWindowModal}
				transparent
				animationType="slide"
				onRequestClose={() => setShowWindowModal(false)}
			>
				<Pressable
					style={styles.modalOverlay}
					onPress={() => setShowWindowModal(false)}
				>
					<Pressable
						style={styles.modalSheet}
						onPress={() => {}}
					>
						<Text style={styles.modalTitle}>Adjust Eating Window</Text>
						<Text style={styles.modalSubtitle}>
							Choose a fasting schedule that works for you
						</Text>

						{WINDOW_PRESETS.map((preset) => {
							const isActive =
								preset.start === profile.eatingWindowStart &&
								preset.end === profile.eatingWindowEnd;
							return (
								<Pressable
									key={preset.label}
									style={[styles.presetRow, isActive && styles.presetRowActive]}
									onPress={async () => {
										setAdjusting(true);
										await adjustWindow(preset.start, preset.end);
										setAdjusting(false);
										setShowWindowModal(false);
									}}
									disabled={adjusting}
								>
									<View style={styles.presetLeft}>
										<Text
											style={[
												styles.presetLabel,
												isActive && styles.presetLabelActive,
											]}
										>
											{preset.label}
										</Text>
										<Text style={styles.presetDetail}>
											Eat {preset.start} – {preset.end}
										</Text>
									</View>
									{isActive && <Text style={styles.presetCheck}>✓</Text>}
								</Pressable>
							);
						})}

						{adjusting && (
							<ActivityIndicator
								style={{ marginTop: 12 }}
								color={colors.navy}
							/>
						)}

						<Button
							title="Cancel"
							variant="ghost"
							onPress={() => setShowWindowModal(false)}
						/>
					</Pressable>
				</Pressable>
			</Modal>
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
	insightCard: {
		marginTop: 16,
		padding: 20,
	},
	insightLoading: {
		alignItems: 'center',
		paddingVertical: 12,
		gap: 8,
	},
	insightLoadingText: {
		...typography.meta,
		color: colors.lightBlue,
	},
	insightTitleRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	insightTitleEmoji: {
		fontSize: 16,
	},
	insightTitleText: {
		...typography.section,
		color: colors.surface,
	},
	insightText: {
		...typography.body,
		color: colors.lightBlue,
		lineHeight: 22,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.4)',
		justifyContent: 'flex-end',
	},
	modalSheet: {
		backgroundColor: colors.surface,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		padding: 24,
		paddingBottom: 40,
	},
	modalTitle: {
		...typography.section,
		color: colors.text,
		marginBottom: 4,
	},
	modalSubtitle: {
		...typography.meta,
		color: colors.muted,
		marginBottom: 20,
	},
	presetRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 16,
		borderRadius: radius.md,
		borderWidth: 1,
		borderColor: colors.stroke,
		marginBottom: 10,
	},
	presetRowActive: {
		borderColor: colors.navy,
		backgroundColor: '#F0EDE8',
	},
	presetLeft: {
		gap: 2,
	},
	presetLabel: {
		...typography.body,
		fontWeight: '600' as const,
		color: colors.text,
	},
	presetLabelActive: {
		color: colors.navy,
	},
	presetDetail: {
		...typography.metaSmall,
		color: colors.muted,
	},
	presetCheck: {
		fontSize: 18,
		color: colors.navy,
		fontWeight: '700' as const,
	},
});
