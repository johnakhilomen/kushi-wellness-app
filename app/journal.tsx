import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	ScrollView,
	Pressable,
	TextInput,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, radius } from '../constants/theme';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useStore, type JournalEntry } from '../store/useStore';

const MOODS: { key: JournalEntry['mood']; emoji: string; label: string }[] = [
	{ key: 'great', emoji: '✨', label: 'Great' },
	{ key: 'good', emoji: '😊', label: 'Good' },
	{ key: 'okay', emoji: '😐', label: 'Okay' },
	{ key: 'low', emoji: '😔', label: 'Low' },
];

export default function JournalScreen() {
	const router = useRouter();
	const journal = useStore((s) => s.journal);
	const addJournalEntry = useStore((s) => s.addJournalEntry);
	const fetchJournal = useStore((s) => s.fetchJournal);

	const [mood, setMood] = useState<JournalEntry['mood']>('good');
	const [note, setNote] = useState('');
	const [saving, setSaving] = useState(false);

	const today = new Date().toISOString().split('T')[0];
	const todayEntry = journal.find((j) => j.date === today);

	useEffect(() => {
		fetchJournal();
	}, []);

	useEffect(() => {
		if (todayEntry) {
			setMood(todayEntry.mood);
			setNote(todayEntry.note);
		}
	}, [todayEntry?.id]);

	const handleSave = async () => {
		setSaving(true);
		await addJournalEntry(mood, note);
		setSaving(false);
	};

	const formatDate = (dateStr: string) => {
		const d = new Date(dateStr + 'T12:00:00');
		return d.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
		});
	};

	const moodEmoji = (m: string) =>
		MOODS.find((x) => x.key === m)?.emoji ?? '😊';

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				style={{ flex: 1 }}
			>
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
					<Text style={styles.title}>Journal</Text>
					<Text style={styles.subtitle}>
						Reflect on your day and track your wellness journey
					</Text>

					{/* Today's Entry */}
					<Card
						variant="white"
						style={styles.entryCard}
					>
						<Text style={styles.sectionTitle}>How are you feeling today?</Text>

						{/* Mood Selector */}
						<View style={styles.moodRow}>
							{MOODS.map((m) => (
								<Pressable
									key={m.key}
									style={[
										styles.moodBtn,
										mood === m.key && styles.moodBtnSelected,
									]}
									onPress={() => setMood(m.key)}
								>
									<Text style={styles.moodEmoji}>{m.emoji}</Text>
									<Text
										style={[
											styles.moodLabel,
											mood === m.key && styles.moodLabelSelected,
										]}
									>
										{m.label}
									</Text>
								</Pressable>
							))}
						</View>

						{/* Note */}
						<TextInput
							style={styles.noteInput}
							value={note}
							onChangeText={setNote}
							placeholder="Write a short reflection..."
							placeholderTextColor={colors.placeholder}
							multiline
							numberOfLines={4}
							textAlignVertical="top"
						/>

						<Button
							title={saving ? 'Saving...' : todayEntry ? 'Update Entry' : 'Save Entry'}
							onPress={handleSave}
							disabled={saving}
						/>
					</Card>

					{/* Past Entries */}
					{journal.length > 0 && (
						<Text style={styles.pastTitle}>Past Reflections</Text>
					)}
					{journal
						.filter((j) => j.date !== today)
						.slice(0, 14)
						.map((entry) => (
							<Card
								key={entry.id}
								variant="white"
								style={styles.pastCard}
							>
								<View style={styles.pastHeader}>
									<Text style={styles.pastEmoji}>{moodEmoji(entry.mood)}</Text>
									<View style={{ flex: 1 }}>
										<Text style={styles.pastDate}>
											{formatDate(entry.date)}
										</Text>
										<Text style={styles.pastMood}>
											Feeling {entry.mood}
										</Text>
									</View>
								</View>
								{entry.note ? (
									<Text style={styles.pastNote}>{entry.note}</Text>
								) : null}
							</Card>
						))}

					<View style={{ height: 40 }} />
				</ScrollView>
			</KeyboardAvoidingView>
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
	entryCard: {
		padding: 20,
		marginBottom: 20,
	},
	sectionTitle: {
		...typography.section,
		color: colors.text,
		marginBottom: 14,
	},
	moodRow: {
		flexDirection: 'row',
		gap: 10,
		marginBottom: 16,
	},
	moodBtn: {
		flex: 1,
		alignItems: 'center',
		paddingVertical: 12,
		borderRadius: radius.md,
		borderWidth: 2,
		borderColor: colors.stroke,
		backgroundColor: colors.surface,
	},
	moodBtnSelected: {
		borderColor: colors.navy,
		backgroundColor: '#F0F4FA',
	},
	moodEmoji: {
		fontSize: 22,
		marginBottom: 4,
	},
	moodLabel: {
		...typography.metaSmall,
		color: colors.muted,
	},
	moodLabelSelected: {
		color: colors.navy,
		fontWeight: '600',
	},
	noteInput: {
		backgroundColor: colors.chipBg,
		borderRadius: radius.sm,
		padding: 14,
		...typography.body,
		color: colors.text,
		minHeight: 100,
		marginBottom: 16,
	},
	pastTitle: {
		...typography.section,
		color: colors.text,
		marginBottom: 12,
	},
	pastCard: {
		padding: 16,
		marginBottom: 10,
	},
	pastHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 12,
	},
	pastEmoji: {
		fontSize: 24,
	},
	pastDate: {
		...typography.metaSmall,
		color: colors.muted,
	},
	pastMood: {
		...typography.body,
		color: colors.text,
		fontWeight: '500',
	},
	pastNote: {
		...typography.body,
		color: colors.muted,
		marginTop: 10,
		lineHeight: 20,
	},
});
