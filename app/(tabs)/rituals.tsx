import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, radius } from '../../constants/theme';
import { Card } from '../../components/ui/Card';

export default function RitualsScreen() {
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
					<Text style={styles.heroTitle}>Today's Sacred Arc</Text>
					<Text style={styles.heroMeta}>
						Morning to evening microbiotic rhythm
					</Text>
					<View style={styles.heroButtons}>
						<View style={styles.heroButton}>
							<Text style={styles.heroButtonText}>4-7-8 Breath</Text>
						</View>
						<View style={styles.heroButton}>
							<Text style={styles.heroButtonText}>Tea Reflection</Text>
						</View>
					</View>
				</Card>

				{/* Ritual Timeline Card */}
				<Card
					variant="white"
					style={styles.card}
				>
					<Text style={styles.sectionTitle}>Daily Rituals</Text>
					<View style={styles.timelineItem}>
						<Text style={styles.timelineTime}>06:30</Text>
						<View style={styles.timelineDot} />
						<Text style={styles.timelineText}>Warm water + umeboshi plum</Text>
					</View>
					<View style={styles.timelineConnector} />
					<View style={styles.timelineItem}>
						<Text style={styles.timelineTime}>20:30</Text>
						<View
							style={[styles.timelineDot, { backgroundColor: colors.green }]}
						/>
						<Text style={styles.timelineText}>Gratitude body scan</Text>
					</View>
				</Card>

				{/* Quote Card */}
				<View style={styles.quoteCard}>
					<Text style={styles.quoteText}>
						"The food you eat can be either the safest and most powerful form of
						medicine or the slowest form of poison."
					</Text>
					<Text style={styles.quoteAuthor}>— Michio Kushi</Text>
				</View>

				{/* Evening Card — Gradient */}
				<LinearGradient
					colors={[colors.navy, colors.green]}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={styles.eveningCard}
				>
					<Text style={styles.eveningTitle}>Evening Resonance</Text>
					<Text style={styles.eveningMeta}>
						Wind down with gentle belly breathing
					</Text>
					<View style={styles.eveningButton}>
						<Text style={styles.eveningButtonText}>7-min belly breathing</Text>
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
		marginBottom: 16,
	},
	heroButtons: {
		flexDirection: 'row',
		gap: 10,
	},
	heroButton: {
		flex: 1,
		backgroundColor: 'rgba(255,255,255,0.12)',
		borderRadius: radius.sm,
		paddingVertical: 12,
		alignItems: 'center',
	},
	heroButtonText: {
		...typography.metaSmall,
		color: colors.surface,
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
	timelineItem: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	timelineTime: {
		...typography.metaSmall,
		color: colors.muted,
		width: 44,
	},
	timelineDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: colors.navy,
		marginHorizontal: 10,
	},
	timelineText: {
		...typography.body,
		color: colors.text,
		flex: 1,
	},
	timelineConnector: {
		width: 1,
		height: 20,
		backgroundColor: colors.stroke,
		marginLeft: 47,
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
