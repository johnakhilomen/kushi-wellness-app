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
import { Button } from '../../components/ui/Button';
import { useStore } from '../../store/useStore';
import { DIET_DEFINITIONS } from '../../constants/diets';

export default function CabinetScreen() {
	const profile = useStore((s) => s.profile);
	const ai = useStore((s) => s.ai);
	const fetchCabinet = useStore((s) => s.fetchCabinet);

	const diet = DIET_DEFINITIONS[profile.dietPhilosophy ?? 'macrobiotic'];

	useEffect(() => {
		if (ai.cabinet.length === 0 && !ai.cabinetLoading) {
			fetchCabinet();
		}
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
			>
				{/* Header */}
				<Text style={styles.title}>Cabinet</Text>
				<Text style={styles.subtitle}>
					{diet.icon} Weekly groceries for your {diet.label} lifestyle
				</Text>

				{/* Loading State */}
				{ai.cabinetLoading && (
					<View style={styles.loadingContainer}>
						<ActivityIndicator
							size="large"
							color={colors.navy}
						/>
						<Text style={styles.loadingText}>
							Curating your {diet.label} grocery list…
						</Text>
					</View>
				)}

				{/* Empty State */}
				{!ai.cabinetLoading && ai.cabinet.length === 0 && (
					<Card
						variant="white"
						style={styles.emptyCard}
					>
						<Text style={styles.emptyIcon}>🛒</Text>
						<Text style={styles.emptyTitle}>Your cabinet is empty</Text>
						<Text style={styles.emptyText}>
							Generate a personalized grocery list based on your {diet.label}{' '}
							diet philosophy.
						</Text>
						<View style={{ marginTop: 16 }}>
							<Button
								title="Generate Grocery List"
								onPress={fetchCabinet}
							/>
						</View>
					</Card>
				)}

				{/* Category Cards */}
				{ai.cabinet.map((category, catIdx) => (
					<Card
						key={catIdx}
						variant="white"
						style={styles.categoryCard}
					>
						<View style={styles.categoryHeader}>
							<Text style={styles.categoryIcon}>{category.icon}</Text>
							<Text style={styles.categoryTitle}>{category.category}</Text>
						</View>
						{category.items.map((item, itemIdx) => (
							<View
								key={itemIdx}
								style={[
									styles.itemRow,
									itemIdx < category.items.length - 1 && styles.itemDivider,
								]}
							>
								<View style={styles.itemLeft}>
									<Text style={styles.itemName}>{item.name}</Text>
									<Text style={styles.itemNote}>{item.note}</Text>
								</View>
								<Text style={styles.itemQuantity}>{item.quantity}</Text>
							</View>
						))}
					</Card>
				))}

				{/* Refresh Button */}
				{ai.cabinet.length > 0 && (
					<View style={styles.refreshContainer}>
						<Button
							title="Regenerate List"
							variant="secondary"
							onPress={fetchCabinet}
						/>
					</View>
				)}

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
		...typography.display,
		color: colors.text,
		marginBottom: 6,
	},
	subtitle: {
		...typography.body,
		color: colors.muted,
		marginBottom: 20,
	},
	loadingContainer: {
		alignItems: 'center',
		paddingVertical: 60,
		gap: 12,
	},
	loadingText: {
		...typography.body,
		color: colors.muted,
	},
	emptyCard: {
		padding: 28,
		alignItems: 'center',
	},
	emptyIcon: {
		fontSize: 36,
		marginBottom: 12,
	},
	emptyTitle: {
		...typography.section,
		color: colors.text,
		marginBottom: 6,
	},
	emptyText: {
		...typography.body,
		color: colors.muted,
		textAlign: 'center',
		lineHeight: 20,
	},
	categoryCard: {
		padding: 18,
		marginBottom: 12,
	},
	categoryHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
		marginBottom: 14,
	},
	categoryIcon: {
		fontSize: 20,
	},
	categoryTitle: {
		...typography.section,
		color: colors.text,
	},
	itemRow: {
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		paddingVertical: 10,
	},
	itemDivider: {
		borderBottomWidth: 1,
		borderBottomColor: colors.stroke,
	},
	itemLeft: {
		flex: 1,
		marginRight: 12,
	},
	itemName: {
		...typography.body,
		color: colors.text,
		fontWeight: '500' as const,
		marginBottom: 2,
	},
	itemNote: {
		...typography.meta,
		color: colors.muted,
	},
	itemQuantity: {
		...typography.metaSmall,
		color: colors.navy,
		backgroundColor: colors.lightBlue3,
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: radius.pill,
		overflow: 'hidden',
	},
	refreshContainer: {
		marginTop: 4,
		marginBottom: 8,
	},
});
