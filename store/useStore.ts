import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';
import {
	generateMealPlan,
	generatePostFastInsight,
	generateDailyRituals,
	generateGutHarmonyExplanation,
	computeGutHarmony,
} from '../lib/openai';
import type { MealItem, RitualItem, EveningPractice } from '../lib/openai';

// ---------- Types ----------
export type FastingStyle = '14:10' | '16:8' | '12:12';
export type PrimaryIntention = 'digestion' | 'weight' | 'energy';

export interface UserProfile {
	name: string;
	email: string;
	fastingStyle: FastingStyle;
	primaryIntention: PrimaryIntention;
	meditationGoal: number;
	streakDays: number;
	gutHarmony: number;
	gutHarmonyExplanation: string;
	hasCompletedOnboarding: boolean;
	eatingWindowStart: string;
	eatingWindowEnd: string;
}

interface FastingState {
	isFasting: boolean;
	fastStartTime: number | null;
	fastEndTime: number | null;
	sessionId: string | null;
}

interface AIState {
	meals: MealItem[];
	mealsLoading: boolean;
	rituals: RitualItem[];
	ritualsLoading: boolean;
	ritualQuote: string;
	ritualQuoteAuthor: string;
	eveningPractice: EveningPractice | null;
	postFastInsight: string | null;
	insightLoading: boolean;
	gutHarmonyLoading: boolean;
}

interface AppState {
	// Auth
	session: Session | null;
	user: User | null;
	isLoading: boolean;
	authError: string | null;
	pendingEmail: string | null;

	// Profile
	profile: UserProfile;

	// Fasting
	fasting: FastingState;

	// AI
	ai: AIState;

	// Auth actions
	initialize: () => Promise<void>;
	login: (email: string, password: string) => Promise<boolean>;
	register: (name: string, email: string, password: string) => Promise<boolean>;
	verifyOtp: (email: string, token: string) => Promise<boolean>;
	resendOtp: (email: string) => Promise<boolean>;
	logout: () => Promise<void>;
	resetPassword: (email: string) => Promise<boolean>;
	setAuthError: (error: string | null) => void;

	// Profile actions
	fetchProfile: () => Promise<void>;
	completeOnboarding: (
		intention: PrimaryIntention,
		style: FastingStyle,
	) => Promise<void>;
	retakeOnboarding: () => Promise<void>;
	updateProfile: (updates: Partial<UserProfile>) => Promise<void>;

	// Fasting actions
	startFast: () => Promise<void>;
	endFast: () => Promise<void>;
	adjustWindow: (start: string, end: string) => Promise<void>;

	// AI actions
	fetchMealPlan: () => Promise<void>;
	fetchDailyRituals: () => Promise<void>;
	completeRitual: (index: number) => Promise<void>;
	refreshGutHarmony: () => Promise<void>;
	clearPostFastInsight: () => void;
}

const defaultProfile: UserProfile = {
	name: '',
	email: '',
	fastingStyle: '14:10',
	primaryIntention: 'energy',
	meditationGoal: 12,
	streakDays: 0,
	gutHarmony: 50,
	gutHarmonyExplanation: '',
	hasCompletedOnboarding: false,
	eatingWindowStart: '11:30 AM',
	eatingWindowEnd: '7:30 PM',
};

const defaultFasting: FastingState = {
	isFasting: false,
	fastStartTime: null,
	fastEndTime: null,
	sessionId: null,
};

const defaultAI: AIState = {
	meals: [],
	mealsLoading: false,
	rituals: [],
	ritualsLoading: false,
	ritualQuote: '',
	ritualQuoteAuthor: '',
	eveningPractice: null,
	postFastInsight: null,
	insightLoading: false,
	gutHarmonyLoading: false,
};

export const useStore = create<AppState>((set, get) => ({
	session: null,
	user: null,
	isLoading: true,
	authError: null,
	pendingEmail: null,
	profile: defaultProfile,
	fasting: defaultFasting,
	ai: defaultAI,

	// ─── Initialize: restore session + listen for auth changes ───
	initialize: async () => {
		try {
			const {
				data: { session },
			} = await supabase.auth.getSession();
			set({ session, user: session?.user ?? null, isLoading: false });

			if (session?.user) {
				await get().fetchProfile();
			}

			// Listen for auth state changes
			supabase.auth.onAuthStateChange(async (_event, session) => {
				set({ session, user: session?.user ?? null });
				if (session?.user) {
					await get().fetchProfile();
				} else {
					set({ profile: defaultProfile, fasting: defaultFasting });
				}
			});
		} catch {
			set({ isLoading: false });
		}
	},

	// ─── Login ───
	login: async (email: string, password: string) => {
		set({ authError: null, isLoading: true });
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			set({ authError: error.message, isLoading: false });
			return false;
		}

		set({
			session: data.session,
			user: data.user,
			isLoading: false,
		});
		await get().fetchProfile();
		return true;
	},

	// ─── Register (OTP-based email verification) ───
	register: async (name: string, email: string, password: string) => {
		set({ authError: null, isLoading: true });
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: { full_name: name },
			},
		});

		if (error) {
			set({ authError: error.message, isLoading: false });
			return false;
		}

		// Supabase sends a 6-digit OTP to the email when email confirmation is enabled.
		// data.session will be null until verification, so we store the pending email.
		set({
			pendingEmail: email,
			isLoading: false,
		});

		// If Supabase returned a session directly (e.g. email confirmation disabled),
		// handle it immediately
		if (data.session) {
			set({ session: data.session, user: data.user });
			await get().fetchProfile();
		}
		return true;
	},

	// ─── Verify OTP ───
	verifyOtp: async (email: string, token: string) => {
		set({ authError: null, isLoading: true });
		const { data, error } = await supabase.auth.verifyOtp({
			email,
			token,
			type: 'signup',
		});

		if (error) {
			set({ authError: error.message, isLoading: false });
			return false;
		}

		set({
			session: data.session,
			user: data.user,
			pendingEmail: null,
			isLoading: false,
		});

		if (data.session) {
			await get().fetchProfile();
		}
		return true;
	},

	// ─── Resend OTP ───
	resendOtp: async (email: string) => {
		set({ authError: null });
		const { error } = await supabase.auth.resend({
			email,
			type: 'signup',
		});
		if (error) {
			set({ authError: error.message });
			return false;
		}
		return true;
	},

	// ─── Logout ───
	logout: async () => {
		await supabase.auth.signOut();
		set({
			session: null,
			user: null,
			profile: defaultProfile,
			fasting: defaultFasting,
			ai: defaultAI,
		});
	},

	// ─── Reset Password ───
	resetPassword: async (email: string) => {
		set({ authError: null });
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: 'kushi://reset-password',
		});
		if (error) {
			set({ authError: error.message });
			return false;
		}
		return true;
	},

	setAuthError: (error: string | null) => set({ authError: error }),

	// ─── Fetch Profile from DB ───
	fetchProfile: async () => {
		const userId = get().user?.id;
		if (!userId) return;

		const { data, error } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', userId)
			.single();

		if (error || !data) return;

		set({
			profile: {
				name: data.full_name ?? '',
				email: data.email ?? '',
				fastingStyle: data.fasting_style as FastingStyle,
				primaryIntention: data.primary_intention as PrimaryIntention,
				meditationGoal: data.meditation_goal,
				streakDays: data.streak_days,
				gutHarmony: data.gut_harmony,
				gutHarmonyExplanation: data.gut_harmony_explanation ?? '',
				hasCompletedOnboarding: data.has_completed_onboarding,
				eatingWindowStart: data.eating_window_start,
				eatingWindowEnd: data.eating_window_end,
			},
		});
	},

	// ─── Complete Onboarding ───
	completeOnboarding: async (
		intention: PrimaryIntention,
		style: FastingStyle,
	) => {
		const userId = get().user?.id;
		if (!userId) return;

		const { error } = await supabase
			.from('profiles')
			.update({
				primary_intention: intention,
				fasting_style: style,
				has_completed_onboarding: true,
			})
			.eq('id', userId);

		if (!error) {
			set({
				profile: {
					...get().profile,
					primaryIntention: intention,
					fastingStyle: style,
					hasCompletedOnboarding: true,
				},
			});
		}
	},

	// ─── Retake Onboarding ───
	retakeOnboarding: async () => {
		const userId = get().user?.id;
		if (!userId) return;

		await supabase
			.from('profiles')
			.update({ has_completed_onboarding: false })
			.eq('id', userId);

		set({
			profile: { ...get().profile, hasCompletedOnboarding: false },
		});
	},

	// ─── Update Profile ───
	updateProfile: async (updates: Partial<UserProfile>) => {
		const userId = get().user?.id;
		if (!userId) return;

		const dbUpdates: Record<string, unknown> = {};
		if (updates.name !== undefined) dbUpdates.full_name = updates.name;
		if (updates.fastingStyle !== undefined)
			dbUpdates.fasting_style = updates.fastingStyle;
		if (updates.primaryIntention !== undefined)
			dbUpdates.primary_intention = updates.primaryIntention;
		if (updates.meditationGoal !== undefined)
			dbUpdates.meditation_goal = updates.meditationGoal;
		if (updates.streakDays !== undefined)
			dbUpdates.streak_days = updates.streakDays;
		if (updates.gutHarmony !== undefined)
			dbUpdates.gut_harmony = updates.gutHarmony;
		if (updates.eatingWindowStart !== undefined)
			dbUpdates.eating_window_start = updates.eatingWindowStart;
		if (updates.eatingWindowEnd !== undefined)
			dbUpdates.eating_window_end = updates.eatingWindowEnd;

		const { error } = await supabase
			.from('profiles')
			.update(dbUpdates)
			.eq('id', userId);

		if (!error) {
			set({ profile: { ...get().profile, ...updates } });
		}
	},

	// ─── Start Fast ───
	startFast: async () => {
		const userId = get().user?.id;
		if (!userId) return;

		const { data, error } = await supabase
			.from('fasting_sessions')
			.insert({ user_id: userId })
			.select('id')
			.single();

		if (!error && data) {
			set({
				fasting: {
					isFasting: true,
					fastStartTime: Date.now(),
					fastEndTime: null,
					sessionId: data.id,
				},
			});
		}
	},

	// ─── End Fast ───
	endFast: async () => {
		const { fasting, user, profile } = get();
		if (!user?.id || !fasting.sessionId) return;

		const duration = fasting.fastStartTime
			? Math.round((Date.now() - fasting.fastStartTime) / 60000)
			: 0;

		await supabase
			.from('fasting_sessions')
			.update({
				ended_at: new Date().toISOString(),
				duration_minutes: duration,
			})
			.eq('id', fasting.sessionId);

		const newStreak = profile.streakDays + 1;
		await supabase
			.from('profiles')
			.update({ streak_days: newStreak })
			.eq('id', user.id);

		set({
			fasting: {
				isFasting: false,
				fastStartTime: null,
				fastEndTime: Date.now(),
				sessionId: null,
			},
			profile: { ...profile, streakDays: newStreak },
		});

		// Generate AI post-fast insight in background
		set({ ai: { ...get().ai, insightLoading: true, postFastInsight: null } });
		try {
			const insight = await generatePostFastInsight(duration, get().profile);

			// Save to DB
			await supabase.from('fasting_insights').insert({
				user_id: user.id,
				fasting_session_id: fasting.sessionId,
				duration_minutes: duration,
				insight,
			});

			set({
				ai: { ...get().ai, postFastInsight: insight, insightLoading: false },
			});
		} catch {
			set({ ai: { ...get().ai, insightLoading: false } });
		}

		// Refresh gut harmony after fast
		get().refreshGutHarmony();
	},

	// ─── Adjust Eating Window ───
	adjustWindow: async (start: string, end: string) => {
		const userId = get().user?.id;
		if (!userId) return;

		await supabase
			.from('profiles')
			.update({
				eating_window_start: start,
				eating_window_end: end,
			})
			.eq('id', userId);

		set({
			profile: {
				...get().profile,
				eatingWindowStart: start,
				eatingWindowEnd: end,
			},
		});
	},

	// ═══════════════════════════════════════════
	// AI-Powered Features
	// ═══════════════════════════════════════════

	// ─── Fetch / Generate Meal Plan ───
	fetchMealPlan: async () => {
		const userId = get().user?.id;
		if (!userId) return;

		set({ ai: { ...get().ai, mealsLoading: true } });

		try {
			const today = new Date().toISOString().split('T')[0];

			// Check if we already have today's plan
			const { data: existing } = await supabase
				.from('meal_plans')
				.select('meals')
				.eq('user_id', userId)
				.eq('plan_date', today)
				.single();

			if (existing?.meals) {
				set({
					ai: {
						...get().ai,
						meals: existing.meals as MealItem[],
						mealsLoading: false,
					},
				});
				return;
			}

			// Generate new plan via LLM
			const meals = await generateMealPlan(get().profile);

			// Save to DB (upsert)
			await supabase
				.from('meal_plans')
				.upsert(
					{ user_id: userId, plan_date: today, meals },
					{ onConflict: 'user_id,plan_date' },
				);

			set({ ai: { ...get().ai, meals, mealsLoading: false } });
		} catch {
			set({ ai: { ...get().ai, mealsLoading: false } });
		}
	},

	// ─── Fetch / Generate Daily Rituals ───
	fetchDailyRituals: async () => {
		const userId = get().user?.id;
		if (!userId) return;

		set({ ai: { ...get().ai, ritualsLoading: true } });

		try {
			const today = new Date().toISOString().split('T')[0];

			// Check if we already have today's rituals
			const { data: existing } = await supabase
				.from('daily_rituals')
				.select('*')
				.eq('user_id', userId)
				.eq('ritual_date', today)
				.single();

			if (existing) {
				set({
					ai: {
						...get().ai,
						rituals: existing.rituals as RitualItem[],
						ritualQuote: existing.quote ?? '',
						ritualQuoteAuthor: existing.quote_author ?? '',
						eveningPractice:
							existing.evening_practice as EveningPractice | null,
						ritualsLoading: false,
					},
				});
				return;
			}

			// Generate new rituals via LLM
			const result = await generateDailyRituals(get().profile);

			// Save to DB
			await supabase.from('daily_rituals').upsert(
				{
					user_id: userId,
					ritual_date: today,
					rituals: result.rituals,
					quote: result.quote,
					quote_author: result.quoteAuthor,
					evening_practice: result.eveningPractice,
				},
				{ onConflict: 'user_id,ritual_date' },
			);

			set({
				ai: {
					...get().ai,
					rituals: result.rituals,
					ritualQuote: result.quote,
					ritualQuoteAuthor: result.quoteAuthor,
					eveningPractice: result.eveningPractice,
					ritualsLoading: false,
				},
			});
		} catch {
			set({ ai: { ...get().ai, ritualsLoading: false } });
		}
	},

	// ─── Complete a Ritual ───
	completeRitual: async (index: number) => {
		const userId = get().user?.id;
		if (!userId) return;

		const rituals = [...get().ai.rituals];
		rituals[index] = {
			...rituals[index],
			completed: !rituals[index].completed,
		};

		set({ ai: { ...get().ai, rituals } });

		// Update in DB
		const today = new Date().toISOString().split('T')[0];
		await supabase
			.from('daily_rituals')
			.update({ rituals })
			.eq('user_id', userId)
			.eq('ritual_date', today);

		// Refresh gut harmony
		get().refreshGutHarmony();
	},

	// ─── Refresh Gut Harmony Score ───
	refreshGutHarmony: async () => {
		const userId = get().user?.id;
		if (!userId) return;

		set({ ai: { ...get().ai, gutHarmonyLoading: true } });

		try {
			const { rituals } = get().ai;
			const completedCount = rituals.filter((r) => r.completed).length;
			const newScore = computeGutHarmony(
				get().profile.streakDays,
				completedCount,
				rituals.length,
			);

			// Get LLM explanation
			const explanation = await generateGutHarmonyExplanation(
				newScore,
				get().profile,
			);

			// Save to DB
			await supabase
				.from('profiles')
				.update({
					gut_harmony: newScore,
					gut_harmony_explanation: explanation,
				})
				.eq('id', userId);

			set({
				profile: {
					...get().profile,
					gutHarmony: newScore,
					gutHarmonyExplanation: explanation,
				},
				ai: { ...get().ai, gutHarmonyLoading: false },
			});
		} catch {
			set({ ai: { ...get().ai, gutHarmonyLoading: false } });
		}
	},

	// ─── Clear Post-Fast Insight ───
	clearPostFastInsight: () => {
		set({ ai: { ...get().ai, postFastInsight: null } });
	},
}));
