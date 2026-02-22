/**
 * OpenAI Service for Kushi
 *
 * Uses GPT-4o-mini for cost-effective, fast AI features.
 * NOTE: In production, proxy these calls through a backend (e.g. Supabase Edge Functions)
 * to avoid exposing the API key on the client.
 */

import type { UserProfile } from '../store/useStore';

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
	return [
		`Fasting style: ${profile.fastingStyle}`,
		`Eating window: ${profile.eatingWindowStart} – ${profile.eatingWindowEnd}`,
		`Primary intention: ${profile.primaryIntention}`,
		`Streak days: ${profile.streakDays}`,
		`Gut harmony score: ${profile.gutHarmony}%`,
		`Meditation goal: ${profile.meditationGoal} minutes`,
	].join('\n');
}

// ─── 1. Generate Meal Plan ───

export async function generateMealPlan(
	profile: UserProfile,
): Promise<MealItem[]> {
	const raw = await chat([
		{
			role: 'system',
			content: `You are a macrobiotic nutritionist following the philosophy of Michio Kushi. 
Generate a daily meal schedule that fits within the user's eating window. 
Each meal should be plant-based, whole-grain focused, and aligned with macrobiotic principles.
Return JSON: { "meals": [{ "name": string, "time": string (e.g. "11:30 AM"), "description": string (short, ~10 words), "type": "entry"|"core"|"snack"|"closing" }] }
Generate 3-4 meals. Times must fall within the eating window.`,
		},
		{
			role: 'user',
			content: `Generate today's macrobiotic meal plan.\n\n${profileContext(profile)}`,
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

	const raw = await chat(
		[
			{
				role: 'system',
				content: `You are a wellness coach specializing in macrobiotic fasting (Michio Kushi philosophy).
Give a brief, encouraging post-fast insight (2-3 sentences). 
Mention what the body accomplished during this fast, and a gentle suggestion for breaking the fast.
Keep it warm, personal, and grounded in macrobiotic wellness.`,
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
	const raw = await chat([
		{
			role: 'system',
			content: `You are a macrobiotic wellness guide following the philosophy of Michio Kushi.
Generate a personalized set of daily rituals, an inspirational quote, and an evening wind-down practice.
The rituals should align with the user's intention and fasting schedule.
Return JSON:
{
  "rituals": [{ "id": string (unique), "time": string (e.g. "06:30"), "name": string, "description": string (~15 words) }],
  "quote": string (a relevant macrobiotic/wellness quote),
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
	const raw = await chat(
		[
			{
				role: 'system',
				content: `You are a macrobiotic wellness analyst. 
Explain what the user's gut harmony score means in 2-3 short sentences. 
Base it on their fasting consistency (streak days) and overall lifestyle pattern.
Be encouraging but honest. Use macrobiotic language.`,
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

// ─── 5. Compute Gut Harmony Score ───

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
