import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FastingStyle = '14:10' | '16:8' | '12:12';
export type PrimaryIntention = 'digestion' | 'weight' | 'energy';

interface UserProfile {
	name: string;
	email: string;
	fastingStyle: FastingStyle;
	primaryIntention: PrimaryIntention;
	meditationGoal: number; // minutes
	streakDays: number;
	gutHarmony: number; // percentage
}

interface FastingState {
	isFasting: boolean;
	fastStartTime: number | null;
	fastEndTime: number | null;
	eatingWindowStart: string; // "11:30 AM"
	eatingWindowEnd: string; // "7:30 PM"
}

interface AppState {
	isAuthenticated: boolean;
	hasCompletedOnboarding: boolean;
	user: UserProfile;
	fasting: FastingState;

	// Auth actions
	login: (email: string, password: string) => void;
	register: (name: string, email: string, password: string) => void;
	logout: () => void;

	// Onboarding actions
	completeOnboarding: (
		intention: PrimaryIntention,
		style: FastingStyle,
	) => void;
	retakeOnboarding: () => void;

	// Fasting actions
	startFast: () => void;
	endFast: () => void;
	adjustWindow: (start: string, end: string) => void;

	// Profile actions
	updateProfile: (updates: Partial<UserProfile>) => void;
}

const defaultUser: UserProfile = {
	name: '',
	email: '',
	fastingStyle: '14:10',
	primaryIntention: 'energy',
	meditationGoal: 12,
	streakDays: 27,
	gutHarmony: 91,
};

const defaultFasting: FastingState = {
	isFasting: true,
	fastStartTime: Date.now() - (14 * 60 + 32) * 60 * 1000, // 14:32 ago
	fastEndTime: null,
	eatingWindowStart: '11:30 AM',
	eatingWindowEnd: '7:30 PM',
};

export const useStore = create<AppState>((set, get) => ({
	isAuthenticated: false,
	hasCompletedOnboarding: false,
	user: defaultUser,
	fasting: defaultFasting,

	login: (email: string, _password: string) => {
		set({
			isAuthenticated: true,
			hasCompletedOnboarding: true,
			user: { ...get().user, email },
		});
	},

	register: (name: string, email: string, _password: string) => {
		set({
			isAuthenticated: true,
			hasCompletedOnboarding: false,
			user: { ...get().user, name, email },
		});
	},

	logout: () => {
		set({
			isAuthenticated: false,
			hasCompletedOnboarding: false,
			user: defaultUser,
		});
	},

	completeOnboarding: (intention: PrimaryIntention, style: FastingStyle) => {
		set({
			hasCompletedOnboarding: true,
			user: {
				...get().user,
				primaryIntention: intention,
				fastingStyle: style,
			},
		});
	},

	retakeOnboarding: () => {
		set({ hasCompletedOnboarding: false });
	},

	startFast: () => {
		set({
			fasting: {
				...get().fasting,
				isFasting: true,
				fastStartTime: Date.now(),
				fastEndTime: null,
			},
		});
	},

	endFast: () => {
		set({
			fasting: {
				...get().fasting,
				isFasting: false,
				fastEndTime: Date.now(),
			},
			user: {
				...get().user,
				streakDays: get().user.streakDays + 1,
			},
		});
	},

	adjustWindow: (start: string, end: string) => {
		set({
			fasting: {
				...get().fasting,
				eatingWindowStart: start,
				eatingWindowEnd: end,
			},
		});
	},

	updateProfile: (updates: Partial<UserProfile>) => {
		set({ user: { ...get().user, ...updates } });
	},
}));
