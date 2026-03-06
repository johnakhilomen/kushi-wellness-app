/**
 * OpenAI Service for Kushi
 *
 * Uses GPT-4o-mini for cost-effective, fast AI features.
 * NOTE: In production, proxy these calls through a backend (e.g. Supabase Edge Functions)
 * to avoid exposing the API key on the client.
 */

import type { UserProfile } from '../store/useStore';
import { DIET_DEFINITIONS } from '../constants/diets';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? '';

const MODEL = 'gpt-4o-mini';

// ─── Types ───

export interface MealItem {
	name: string;
	time: string;
	description: string;
	type: 'entry' | 'core' | 'snack' | 'closing';
}

export interface RitualItem {
	id: string;
	time: string;
	name: string;
	description: string;
	completed: boolean;
}

export interface EveningPractice {
	name: string;
	duration: string;
	description: string;
}

export interface DailyRitualsResponse {
	rituals: RitualItem[];
	quote: string;
	quoteAuthor: string;
	eveningPractice: EveningPractice;
}

// ─── Core Chat Function ───

interface ChatMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

async function chat(messages: ChatMessage[], json = true): Promise<string> {
	const body: Record<string, unknown> = {
		model: MODEL,
		messages,
		temperature: 0.7,
		max_tokens: 1024,
	};
	if (json) {
		body.response_format = { type: 'json_object' };
	}

	const res = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${OPENAI_API_KEY}`,
		},
		body: JSON.stringify(body),
	});

	if (!res.ok) {
		const err = await res.text();
		throw new Error(`OpenAI error ${res.status}: ${err}`);
	}

	const data = await res.json();
	return data.choices[0].message.content;
}

// ─── Helper: Profile Context ───

function profileContext(profile: UserProfile): string {
	const diet = DIET_DEFINITIONS[profile.dietPhilosophy ?? 'macrobiotic'];
	return [
		`Diet philosophy: ${diet.label} (${diet.tradition})`,
		`Fasting style: ${profile.fastingStyle}`,
		`Eating window: ${profile.eatingWindowStart} – ${profile.eatingWindowEnd}`,
		`Primary intention: ${profile.primaryIntention}`,
		`Streak days: ${profile.streakDays}`,
		`Gut harmony score: ${profile.gutHarmony}%`,
		`Meditation goal: ${profile.meditationGoal} minutes`,
	].join('\n');
}

function dietPrompt(profile: UserProfile): {
	guidance: string;
	keyFigure: string;
	label: string;
} {
	const diet = DIET_DEFINITIONS[profile.dietPhilosophy ?? 'macrobiotic'];
	return {
		guidance: diet.promptGuidance,
		keyFigure: diet.keyFigure,
		label: diet.label,
	};
}

// ─── 1. Generate Meal Plan ───

export async function generateMealPlan(
	profile: UserProfile,
): Promise<MealItem[]> {
	const { guidance, keyFigure, label } = dietPrompt(profile);
	const raw = await chat([
		{
			role: 'system',
			content: `You are a ${label} nutritionist following the philosophy of ${keyFigure}.
${guidance}
Generate a daily meal schedule that fits within the user's eating window.
Return JSON: { "meals": [{ "name": string, "time": string (e.g. "11:30 AM"), "description": string (short, ~10 words), "type": "entry"|"core"|"snack"|"closing" }] }
Generate 3-4 meals. Times must fall within the eating window.`,
		},
		{
			role: 'user',
			content: `Generate today's ${label} meal plan.\n\n${profileContext(profile)}`,
		},
	]);

	const parsed = JSON.parse(raw);
	return parsed.meals;
}

// ─── 2. Post-Fast Insight ───

export async function generatePostFastInsight(
	durationMinutes: number,
	profile: UserProfile,
): Promise<string> {
	const hours = Math.floor(durationMinutes / 60);
	const mins = durationMinutes % 60;
	const durationStr = hours > 0 ? `${hours}h ${mins}m` : `${mins} minutes`;

	const { guidance, keyFigure, label } = dietPrompt(profile);
	const raw = await chat(
		[
			{
				role: 'system',
				content: `You are a wellness coach specializing in ${label} fasting (${keyFigure} philosophy).
${guidance}
Give a brief, encouraging post-fast insight (2-3 sentences). 
Mention what the body accomplished during this fast, and a gentle suggestion for breaking the fast aligned with ${label} principles.
Keep it warm, personal, and grounded in ${label} wellness.`,
			},
			{
				role: 'user',
				content: `I just completed a fast of ${durationStr}.\n\n${profileContext(profile)}`,
			},
		],
		false,
	);

	return raw.trim();
}

// ─── 3. Generate Daily Rituals ───

export async function generateDailyRituals(
	profile: UserProfile,
): Promise<DailyRitualsResponse> {
	const { guidance, keyFigure, label } = dietPrompt(profile);
	const raw = await chat([
		{
			role: 'system',
			content: `You are a ${label} wellness guide following the philosophy of ${keyFigure}.
${guidance}
Generate a personalized set of daily rituals, an inspirational quote, and an evening wind-down practice.
The rituals should align with the user's ${label} lifestyle, intention, and fasting schedule.
Return JSON:
{
  "rituals": [{ "id": string (unique), "time": string (e.g. "06:30"), "name": string, "description": string (~15 words) }],
  "quote": string (a relevant ${label}/wellness quote),
  "quoteAuthor": string,
  "eveningPractice": { "name": string, "duration": string (e.g. "7 min"), "description": string (~15 words) }
}
Generate 3-5 rituals spanning morning to evening. Make them varied day to day.`,
		},
		{
			role: 'user',
			content: `Generate today's rituals for me.\n\n${profileContext(profile)}\nToday is ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.`,
		},
	]);

	const parsed = JSON.parse(raw);
	return {
		rituals: parsed.rituals.map((r: RitualItem) => ({
			...r,
			completed: false,
		})),
		quote: parsed.quote,
		quoteAuthor: parsed.quoteAuthor,
		eveningPractice: parsed.eveningPractice,
	};
}

// ─── 4. Gut Harmony Explanation ───

export async function generateGutHarmonyExplanation(
	score: number,
	profile: UserProfile,
): Promise<string> {
	const { guidance, label } = dietPrompt(profile);
	const raw = await chat(
		[
			{
				role: 'system',
				content: `You are a ${label} wellness analyst.
${guidance}
Explain what the user's gut harmony score means in 2-3 short sentences.
Base it on their fasting consistency (streak days) and overall lifestyle pattern.
Be encouraging but honest. Use ${label} language and concepts.`,
			},
			{
				role: 'user',
				content: `My gut harmony score is ${score}%.\n\n${profileContext(profile)}`,
			},
		],
		false,
	);

	return raw.trim();
}

// ─── 5. Generate Cabinet (Grocery List) ───

export interface GroceryCategory {
	category: string;
	icon: string;
	items: GroceryItem[];
}

export interface GroceryItem {
	name: string;
	quantity: string;
	note: string;
}

export async function generateCabinetList(
	profile: UserProfile,
): Promise<GroceryCategory[]> {
	const { guidance, keyFigure, label } = dietPrompt(profile);
	const raw = await chat([
		{
			role: 'system',
			content: `You are a ${label} nutritionist following the philosophy of ${keyFigure}.
${guidance}
Generate a weekly grocery/cabinet list organized by category, aligned with the user's ${label} diet philosophy and fasting schedule.
Return JSON: { "categories": [{ "category": string, "icon": string (single emoji), "items": [{ "name": string, "quantity": string (e.g. "500g", "1 bunch", "2 cups"), "note": string (brief tip, ~8 words, e.g. "great for morning miso soup") }] }] }
Generate 5-7 categories with 3-5 items each. Categories should be specific to the ${label} philosophy (e.g. for macrobiotic: "Whole Grains", "Sea Vegetables", "Fermented Foods"). Include seasonal and staple items.`,
		},
		{
			role: 'user',
			content: `Generate my weekly ${label} grocery list.\n\n${profileContext(profile)}\nCurrent season: ${getSeason()}.`,
		},
	]);

	const parsed = JSON.parse(raw);
	return parsed.categories;
}

function getSeason(): string {
	const month = new Date().getMonth();
	if (month >= 2 && month <= 4) return 'Spring';
	if (month >= 5 && month <= 7) return 'Summer';
	if (month >= 8 && month <= 10) return 'Autumn';
	return 'Winter';
}

// ─── 6. Compute Gut Harmony Score ───

export function computeGutHarmony(
	streakDays: number,
	ritualsCompletedToday: number,
	totalRitualsToday: number,
): number {
	// Base score from fasting consistency (max 60 points)
	const fastingScore = Math.min(streakDays * 3, 60);

	// Ritual adherence (max 40 points)
	const ritualScore =
		totalRitualsToday > 0
			? Math.round((ritualsCompletedToday / totalRitualsToday) * 40)
			: 20; // Default if no rituals loaded

	return Math.min(fastingScore + ritualScore, 100);
}
