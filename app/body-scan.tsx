import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	ScrollView,
	Pressable,
	Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, radius } from '../constants/theme';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useStore, type BodyScanEntry } from '../store/useStore';
import {
	BodySilhouette,
	type BodyZone,
	type ZoneFeeling,
	ZONE_COLORS,
	getZoneLabel,
} from '../components/ui/BodySilhouette';

const FEELINGS: { key: ZoneFeeling; emoji: string; label: string }[] = [
	{ key: 'comfortable', emoji: '😌', label: 'Comfortable' },
	{ key: 'energized', emoji: '⚡', label: 'Energized' },
	{ key: 'tense', emoji: '😣', label: 'Tense' },
	{ key: 'sore', emoji: '🔴', label: 'Sore' },
	{ key: 'numb', emoji: '🫥', label: 'Numb' },
];

export default function BodyScanScreen() {
	const router = useRouter();
	const bodyScan = useStore((s) => s.bodyScan);
	const bodyScanHistory = useStore((s) => s.bodyScanHistory);
	const fetchBodyScan = useStore((s) => s.fetchBodyScan);
	const saveBodyScan = useStore((s) => s.saveBodyScan);
	const fetchBodyScanHistory = useStore((s) => s.fetchBodyScanHistory);

	const [zones, setZones] = useState<Partial<Record<BodyZone, ZoneFeeling>>>({});
	const [activeZone, setActiveZone] = useState<BodyZone | null>(null);
	const [saving, setSaving] = useState(false);

	const today = new Date().toISOString().split('T')[0];

	useEffect(() => {
		fetchBodyScan();
		fetchBodyScanHistory();
	}, []);

	useEffect(() => {
		if (bodyScan && bodyScan.date === today) {
			setZones(bodyScan.zones);
		}
	}, [bodyScan?.id]);

	const handleZonePress = (zone: BodyZone) => {
		setActiveZone(zone);
	};

	const handleFeelingSelect = (feeling: ZoneFeeling) => {
		if (!activeZone) return;
		setZones((prev) => ({ ...prev, [activeZone]: feeling }));
		setActiveZone(null);
	};

	const handleClearZone = () => {
		if (!activeZone) return;
		setZones((prev) => {
			const next = { ...prev };
			delete next[activeZone];
			return next;
		});
		setActiveZone(null);
	};

	const handleSave = async () => {
		setSaving(true);
		await saveBodyScan(zones);
		setSaving(false);
	};

	const filledCount = Object.keys(zones).length;

	const formatDate = (dateStr: string) => {
		const d = new Date(dateStr + 'T12:00:00');
		return d.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
		});
	};

	const feelingEmoji = (f: ZoneFeeling) =>
		FEELINGS.find((x) => x.key === f)?.emoji ?? '';

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Header */}
				<View style={styles.header}>
					<Pressable onPress={() => router.back()}>
						<Text style={styles.backBtn}>← Back</Text>
					</Pressable>
				</View>
				<Text style={styles.title}>Body Scan</Text>
				<Text style={styles.subtitle}>
					Tap each body zone to log how it feels today
				</Text>

				{/* Body Silhouette */}
				<Card variant="white" style={styles.bodyCard}>
					<BodySilhouette
						zones={zones}
						onZonePress={handleZonePress}
						size={240}
					/>

					{/* Legend */}
					<View style={styles.legend}>
						{FEELINGS.map((f) => (
							<View key={f.key} style={styles.legendItem}>
								<View
									style={[
										styles.legendDot,
										{ backgroundColor: ZONE_COLORS[f.key] },
									]}
								/>
								<Text style={styles.legendLabel}>{f.label}</Text>
							</View>
						))}
					</View>

					{/* Zone summary */}
					{filledCount > 0 && (
						<View style={styles.zoneSummary}>
							{(Object.entries(zones) as [BodyZone, ZoneFeeling][]).map(
								([zone, feeling]) => (
									<Pressable
										key={zone}
										style={styles.zonePill}
										onPress={() => setActiveZone(zone)}
									>
										<View
											style={[
												styles.zonePillDot,
												{ backgroundColor: ZONE_COLORS[feeling] },
											]}
										/>
										<Text style={styles.zonePillText}>
											{getZoneLabel(zone)}
										</Text>
										<Text style={styles.zonePillFeeling}>
											{feelingEmoji(feeling)} {feeling}
										</Text>
									</Pressable>
								),
							)}
						</View>
					)}

					{filledCount === 0 && (
						<Text style={styles.emptyHint}>
							Tap on a body part above to begin your scan
						</Text>
					)}

					<View style={{ marginTop: 16 }}>
						<Button
							title={
								saving
									? 'Saving...'
									: bodyScan?.date === today
										? 'Update Scan'
										: 'Save Scan'
							}
							onPress={handleSave}
							disabled={saving || filledCount === 0}
						/>
					</View>
				</Card>

				{/* History */}
				{bodyScanHistory.length > 0 && (
					<Text style={styles.historyTitle}>Recent Scans</Text>
				)}
				{bodyScanHistory
					.filter((s) => s.date !== today)
					.slice(0, 7)
					.map((scan) => (
						<HistoryCard key={scan.id} scan={scan} formatDate={formatDate} />
					))}

				<View style={{ height: 40 }} />
			</ScrollView>

			{/* Zone Feeling Picker Modal */}
			<Modal
				visible={activeZone !== null}
				transparent
				animationType="fade"
				onRequestClose={() => setActiveZone(null)}
			>
				<Pressable
					style={styles.overlay}
					onPress={() => setActiveZone(null)}
				>
					<Pressable style={styles.modal}>
						<Text style={styles.modalTitle}>
							{activeZone ? getZoneLabel(activeZone) : ''}
						</Text>
						<Text style={styles.modalSubtitle}>How does this area feel?</Text>

						{FEELINGS.map((f) => {
							const isSelected = activeZone ? zones[activeZone] === f.key : false;
							return (
								<Pressable
									key={f.key}
									style={[
										styles.feelingBtn,
										isSelected && styles.feelingBtnSelected,
									]}
									onPress={() => handleFeelingSelect(f.key)}
								>
									<Text style={styles.feelingEmoji}>{f.emoji}</Text>
									<Text
										style={[
											styles.feelingLabel,
											isSelected && styles.feelingLabelSelected,
										]}
									>
										{f.label}
									</Text>
									<View
										style={[
											styles.feelingColorBar,
											{ backgroundColor: ZONE_COLORS[f.key] },
										]}
									/>
								</Pressable>
							);
						})}

						{activeZone && zones[activeZone] && (
							<Pressable style={styles.clearBtn} onPress={handleClearZone}>
								<Text style={styles.clearBtnText}>Clear this zone</Text>
							</Pressable>
						)}
					</Pressable>
				</Pressable>
			</Modal>
		</SafeAreaView>
	);
}

function HistoryCard({
	scan,
	formatDate,
}: {
	scan: BodyScanEntry;
	formatDate: (d: string) => string;
}) {
	const entries = Object.entries(scan.zones) as [BodyZone, ZoneFeeling][];
	return (
		<Card variant="white" style={styles.historyCard}>
			<Text style={styles.historyDate}>{formatDate(scan.date)}</Text>
			<View style={styles.historyZones}>
				{entries.map(([zone, feeling]) => (
					<View key={zone} style={styles.historyZoneRow}>
						<View
							style={[
								styles.historyDot,
								{ backgroundColor: ZONE_COLORS[feeling] },
							]}
						/>
						<Text style={styles.historyZoneName}>{getZoneLabel(zone)}</Text>
						<Text style={styles.historyFeeling}>{feeling}</Text>
					</View>
				))}
				{entries.length === 0 && (
					<Text style={styles.historyEmpty}>No zones logged</Text>
				)}
			</View>
		</Card>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F7F4EE',
	},
	scrollContent: {
		paddingHorizontal: spacing.screen,
		paddingTop: 14,
	},
	header: {
		marginBottom: 8,
	},
	backBtn: {
		...typography.body,
		color: colors.navy,
	},
	title: {
		...typography.display,
		color: colors.text,
		marginBottom: 6,
	},
	subtitle: {
		...typography.body,
		color: colors.muted,
		marginBottom: 20,
	},
	bodyCard: {
		padding: 20,
		marginBottom: 20,
		alignItems: 'center',
	},
	legend: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 12,
		marginTop: 16,
		justifyContent: 'center',
	},
	legendItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 4,
	},
	legendDot: {
		width: 10,
		height: 10,
		borderRadius: 5,
	},
	legendLabel: {
		...typography.metaSmall,
		color: colors.muted,
	},
	zoneSummary: {
		marginTop: 16,
		width: '100%',
		gap: 6,
	},
	zonePill: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: colors.chipBg,
		paddingVertical: 10,
		paddingHorizontal: 14,
		borderRadius: radius.sm,
		gap: 8,
	},
	zonePillDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
	zonePillText: {
		...typography.section,
		color: colors.text,
		flex: 1,
	},
	zonePillFeeling: {
		...typography.meta,
		color: colors.muted,
	},
	emptyHint: {
		...typography.body,
		color: colors.placeholder,
		marginTop: 16,
		textAlign: 'center',
	},
	historyTitle: {
		...typography.section,
		color: colors.text,
		marginBottom: 12,
	},
	historyCard: {
		padding: 16,
		marginBottom: 10,
	},
	historyDate: {
		...typography.metaSmall,
		color: colors.muted,
		marginBottom: 8,
	},
	historyZones: {
		gap: 6,
	},
	historyZoneRow: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	historyDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
	historyZoneName: {
		...typography.body,
		color: colors.text,
		flex: 1,
	},
	historyFeeling: {
		...typography.meta,
		color: colors.muted,
	},
	historyEmpty: {
		...typography.body,
		color: colors.placeholder,
	},
	// Modal
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.45)',
		justifyContent: 'center',
		alignItems: 'center',
		padding: spacing.screen,
	},
	modal: {
		backgroundColor: colors.surface,
		borderRadius: radius.xl,
		padding: 24,
		width: '100%',
		maxWidth: 340,
	},
	modalTitle: {
		...typography.questionTitle,
		color: colors.text,
		marginBottom: 4,
	},
	modalSubtitle: {
		...typography.body,
		color: colors.muted,
		marginBottom: 16,
	},
	feelingBtn: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 12,
		paddingHorizontal: 14,
		borderRadius: radius.sm,
		borderWidth: 2,
		borderColor: colors.stroke,
		marginBottom: 8,
		gap: 10,
	},
	feelingBtnSelected: {
		borderColor: colors.navy,
		backgroundColor: '#F0F4FA',
	},
	feelingEmoji: {
		fontSize: 20,
	},
	feelingLabel: {
		...typography.body,
		color: colors.text,
		flex: 1,
	},
	feelingLabelSelected: {
		fontWeight: '600',
		color: colors.navy,
	},
	feelingColorBar: {
		width: 24,
		height: 6,
		borderRadius: 3,
	},
	clearBtn: {
		alignItems: 'center',
		paddingVertical: 10,
		marginTop: 4,
	},
	clearBtnText: {
		...typography.meta,
		color: colors.muted,
		textDecorationLine: 'underline',
	},
});
