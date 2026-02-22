import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

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
}

const defaultProfile: UserProfile = {
	name: '',
	email: '',
	fastingStyle: '14:10',
	primaryIntention: 'energy',
	meditationGoal: 12,
	streakDays: 0,
	gutHarmony: 50,
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

export const useStore = create<AppState>((set, get) => ({
	session: null,
	user: null,
	isLoading: true,
	authError: null,
	pendingEmail: null,
	profile: defaultProfile,
	fasting: defaultFasting,

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
				emailRedirectTo: undefined,
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
}));
