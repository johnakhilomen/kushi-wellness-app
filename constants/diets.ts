/**
 * Diet Philosophy Definitions
 *
 * Each diet has a key, display label, short tagline, philosophical tradition,
 * and prompt guidance for the AI to generate appropriate meals/rituals.
 */

export type DietPhilosophy =
	| 'macrobiotic'
	| 'ayurvedic'
	| 'sattvic'
	| 'tcm'
	| 'wfpb'
	| 'alkaline';

export interface DietDefinition {
	key: DietPhilosophy;
	label: string;
	tagline: string;
	tradition: string;
	icon: string;
	/** Used by OpenAI prompts to guide meal/ritual generation */
	promptGuidance: string;
	/** Key figure or text associated with this philosophy */
	keyFigure: string;
	/** Tooltip explanation for onboarding */
	tooltip: string;
}

export const DIET_DEFINITIONS: Record<DietPhilosophy, DietDefinition> = {
	macrobiotic: {
		key: 'macrobiotic',
		label: 'Macrobiotic',
		tagline: 'Yin & Yang Balance',
		tradition: 'Zen Buddhism',
		icon: '☯️',
		keyFigure: 'Michio Kushi',
		promptGuidance:
			'Follow macrobiotic philosophy (Michio Kushi). Emphasize whole grains (especially brown rice), miso soup, sea vegetables (wakame, kombu), fermented foods, seasonal local produce. Avoid processed foods, dairy, refined sugar. Balance yin and yang in every meal. Cooking methods: steaming, boiling, pressing, pickling.',
		tooltip:
			'A whole-food diet rooted in Zen Buddhism that balances yin (expansive) and yang (contractive) energies through seasonal grains, vegetables, and fermented foods.',
	},
	ayurvedic: {
		key: 'ayurvedic',
		label: 'Ayurvedic',
		tagline: 'Dosha Harmony',
		tradition: 'Ancient Indian Medicine',
		icon: '🪷',
		keyFigure: 'Charaka',
		promptGuidance:
			'Follow Ayurvedic dietary principles. Balance the three doshas (Vata, Pitta, Kapha). Use the six tastes (sweet, sour, salty, pungent, bitter, astringent) in each meal. Emphasize warm cooked foods, ghee, turmeric, ginger, cumin, coriander. Include kitchari, dal, chapati. Avoid cold/raw foods during certain seasons. Align meals with digestive fire (agni).',
		tooltip:
			'A 5,000-year-old Indian healing system that tailors food to your body constitution (dosha) — Vata, Pitta, or Kapha — to optimize digestion and vitality.',
	},
	sattvic: {
		key: 'sattvic',
		label: 'Sattvic',
		tagline: 'Pure & Luminous',
		tradition: 'Yogic / Hindu',
		icon: '🕉️',
		keyFigure: 'Patanjali',
		promptGuidance:
			'Follow Sattvic dietary principles from yogic tradition. Focus on pure, light, nourishing foods that promote clarity, peace, and spiritual growth. Include fresh fruits, vegetables, whole grains, nuts, seeds, honey, milk, ghee. Avoid tamasic (heavy, stale) and rajasic (stimulating, spicy) foods. No onion, garlic, mushrooms, caffeine, or alcohol. Meals should be simple, freshly prepared, and eaten mindfully.',
		tooltip:
			'A yogic diet of pure, clean foods that nourish the body without agitating the mind — designed to cultivate inner peace, mental clarity, and spiritual awareness.',
	},
	tcm: {
		key: 'tcm',
		label: 'TCM',
		tagline: 'Qi & Five Elements',
		tradition: 'Traditional Chinese Medicine',
		icon: '🐉',
		keyFigure: 'Huang Di (Yellow Emperor)',
		promptGuidance:
			'Follow Traditional Chinese Medicine dietary principles. Balance the five elements (Wood, Fire, Earth, Metal, Water) and their corresponding flavors (sour, bitter, sweet, pungent, salty). Consider warming vs cooling foods based on constitution and season. Include congee, goji berries, jujube dates, lotus root, mung beans, green tea. Support qi flow and organ harmony. Align meals with the body clock (e.g., warm breakfast 7-9 AM for stomach qi).',
		tooltip:
			'A diet based on 2,500 years of Chinese medicine wisdom — balancing qi energy, the five elements, and warming/cooling foods to harmonize body and mind.',
	},
	wfpb: {
		key: 'wfpb',
		label: 'Whole Food Plant-Based',
		tagline: 'Compassion & Vitality',
		tradition: 'Evidence-Based Ethics',
		icon: '🌱',
		keyFigure: 'T. Colin Campbell',
		promptGuidance:
			'Follow whole food plant-based dietary principles. Focus on unprocessed or minimally processed plants: vegetables, fruits, whole grains, legumes, nuts, seeds. No animal products (meat, dairy, eggs). No refined oils, refined sugars, or heavily processed foods. Emphasize variety, colorful plates, adequate protein from legumes/grains. Include foods like lentils, quinoa, sweet potatoes, leafy greens, berries, oats, tempeh, nutritional yeast.',
		tooltip:
			'A diet centered on whole, unprocessed plants — driven by compassion for animals, environmental sustainability, and the most robust nutrition science.',
	},
	alkaline: {
		key: 'alkaline',
		label: 'Alkaline',
		tagline: 'pH Balance & Detox',
		tradition: 'pH Balance Theory',
		icon: '💎',
		keyFigure: 'Dr. Sebi',
		promptGuidance:
			'Follow alkaline dietary principles. Emphasize alkaline-forming foods: leafy greens, cucumbers, avocados, watermelon, lemons/limes, almonds, hemp seeds, quinoa, herbal teas. Avoid acid-forming foods: processed foods, refined sugar, dairy, red meat, caffeine, alcohol. Include spring water, sea moss, wild rice, dates, figs. Focus on cellular nourishment and natural detoxification.',
		tooltip:
			"A cleansing diet focused on alkaline-forming foods to restore your body's natural pH balance, reduce inflammation, and support cellular detoxification.",
	},
};

export const DIET_OPTIONS = Object.values(DIET_DEFINITIONS);
