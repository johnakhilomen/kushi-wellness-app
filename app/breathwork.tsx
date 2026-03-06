import React, { useEffect, useRef, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	Pressable,
	Animated,
	Easing,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, typography, spacing, radius } from '../constants/theme';

type BreathMode = '478' | 'awareness';

const CONFIGS: Record<BreathMode, {
	title: string;
	subtitle: string;
	inhale: number;
	hold: number;
	exhale: number;
	holdAfter: number;
	cycles: number;
}> = {
	'478': {
		title: '4-7-8 Breathwork',
		subtitle: 'Inhale 4s, Hold 7s, Exhale 8s',
		inhale: 4,
		hold: 7,
		exhale: 8,
		holdAfter: 0,
		cycles: 4,
	},
	awareness: {
		title: 'Breath Awareness',
		subtitle: '7 minutes of gentle breathing',
		inhale: 4,
		hold: 1,
		exhale: 6,
		holdAfter: 1,
		cycles: 35, // ~7 mins at 12s/cycle
	},
};

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'holdAfter' | 'done';

const PHASE_LABELS: Record<Phase, string> = {
	idle: 'Ready',
	inhale: 'Inhale',
	hold: 'Hold',
	exhale: 'Exhale',
	holdAfter: 'Hold',
	done: 'Complete',
};

const PHASE_COLORS: Record<Phase, string> = {
	idle: colors.navy,
	inhale: '#5DADE2',
	hold: colors.navy,
	exhale: colors.green,
	holdAfter: colors.navy,
	done: colors.green,
};

export default function BreathworkScreen() {
	const router = useRouter();
	const params = useLocalSearchParams<{ mode?: string }>();
	const mode: BreathMode = params.mode === 'awareness' ? 'awareness' : '478';
	const config = CONFIGS[mode];

	const [phase, setPhase] = useState<Phase>('idle');
	const [currentCycle, setCurrentCycle] = useState(0);
	const [countdown, setCountdown] = useState(0);
	const [isRunning, setIsRunning] = useState(false);

	const scaleAnim = useRef(new Animated.Value(0.5)).current;
	const opacityAnim = useRef(new Animated.Value(0.3)).current;
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const phaseRef = useRef<Phase>('idle');
	const cycleRef = useRef(0);
	const countRef = useRef(0);

	const totalCycleTime = config.inhale + config.hold + config.exhale + config.holdAfter;
	const totalTime = config.cycles * totalCycleTime;

	useEffect(() => {
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, []);

	const animateCircle = (toScale: number, duration: number) => {
		Animated.parallel([
			Animated.timing(scaleAnim, {
				toValue: toScale,
				duration: duration * 1000,
				easing: Easing.inOut(Easing.ease),
				useNativeDriver: true,
			}),
			Animated.timing(opacityAnim, {
				toValue: toScale > 0.7 ? 0.6 : 0.3,
				duration: duration * 1000,
				easing: Easing.inOut(Easing.ease),
				useNativeDriver: true,
			}),
		]).start();
	};

	const runPhase = (p: Phase, seconds: number) => {
		phaseRef.current = p;
		countRef.current = seconds;
		setPhase(p);
		setCountdown(seconds);

		if (p === 'inhale') animateCircle(1, seconds);
		else if (p === 'exhale') animateCircle(0.5, seconds);
	};

	const startSession = () => {
		setIsRunning(true);
		cycleRef.current = 0;
		setCurrentCycle(0);
		runPhase('inhale', config.inhale);

		timerRef.current = setInterval(() => {
			countRef.current -= 1;
			setCountdown(countRef.current);

			if (countRef.current <= 0) {
				const p = phaseRef.current;
				if (p === 'inhale') {
					if (config.hold > 0) {
						runPhase('hold', config.hold);
					} else {
						runPhase('exhale', config.exhale);
					}
				} else if (p === 'hold') {
					runPhase('exhale', config.exhale);
				} else if (p === 'exhale') {
					if (config.holdAfter > 0) {
						runPhase('holdAfter', config.holdAfter);
					} else {
						advanceCycle();
					}
				} else if (p === 'holdAfter') {
					advanceCycle();
				}
			}
		}, 1000);
	};

	const advanceCycle = () => {
		cycleRef.current += 1;
		setCurrentCycle(cycleRef.current);

		if (cycleRef.current >= config.cycles) {
			// Done
			if (timerRef.current) clearInterval(timerRef.current);
			phaseRef.current = 'done';
			setPhase('done');
			setIsRunning(false);
			animateCircle(0.75, 1);
		} else {
			runPhase('inhale', config.inhale);
		}
	};

	const stopSession = () => {
		if (timerRef.current) clearInterval(timerRef.current);
		setIsRunning(false);
		setPhase('idle');
		setCurrentCycle(0);
		setCountdown(0);
		scaleAnim.setValue(0.5);
		opacityAnim.setValue(0.3);
	};

	const elapsed = currentCycle * totalCycleTime;
	const formatTime = (s: number) => {
		const m = Math.floor(s / 60);
		const sec = s % 60;
		return `${m}:${sec.toString().padStart(2, '0')}`;
	};

	return (
		<SafeAreaView style={styles.container}>
			{/* Header */}
			<View style={styles.header}>
				<Pressable onPress={() => { stopSession(); router.back(); }}>
					<Text style={styles.backBtn}>← Back</Text>
				</Pressable>
			</View>

			<Text style={styles.title}>{config.title}</Text>
			<Text style={styles.subtitle}>{config.subtitle}</Text>

			{/* Breathing Circle */}
			<View style={styles.circleContainer}>
				<Animated.View
					style={[
						styles.outerCircle,
						{
							transform: [{ scale: scaleAnim }],
							opacity: opacityAnim,
							backgroundColor: PHASE_COLORS[phase],
						},
					]}
				/>
				<View style={styles.innerCircle}>
					{phase === 'idle' ? (
						<Text style={styles.circleLabel}>Tap to start</Text>
					) : phase === 'done' ? (
						<>
							<Text style={styles.circleCountdown}>✓</Text>
							<Text style={styles.circleLabel}>Well done</Text>
						</>
					) : (
						<>
							<Text style={styles.circleCountdown}>{countdown}</Text>
							<Text style={styles.circleLabel}>{PHASE_LABELS[phase]}</Text>
						</>
					)}
				</View>
			</View>

			{/* Progress */}
			<Text style={styles.progress}>
				{phase === 'idle'
					? `${config.cycles} cycles · ${formatTime(totalTime)}`
					: phase === 'done'
						? `${config.cycles} cycles complete`
						: `Cycle ${currentCycle + 1} of ${config.cycles}`}
			</Text>

			{/* Action Button */}
			<View style={styles.actionRow}>
				{phase === 'idle' && (
					<Pressable style={styles.startBtn} onPress={startSession}>
						<Text style={styles.startBtnText}>Begin</Text>
					</Pressable>
				)}
				{isRunning && (
					<Pressable style={styles.stopBtn} onPress={stopSession}>
						<Text style={styles.stopBtnText}>Stop</Text>
					</Pressable>
				)}
				{phase === 'done' && (
					<Pressable style={styles.startBtn} onPress={() => { stopSession(); startSession(); }}>
						<Text style={styles.startBtnText}>Again</Text>
					</Pressable>
				)}
			</View>

			{/* Tip */}
			{phase === 'idle' && (
				<Text style={styles.tip}>
					{mode === '478'
						? 'Place the tip of your tongue behind your upper front teeth. Breathe in through your nose and out through your mouth.'
						: 'Find a comfortable position. Close your eyes and simply observe your natural breath without trying to change it.'}
				</Text>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F7F4EE',
		paddingHorizontal: spacing.screen,
	},
	header: {
		marginTop: 14,
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
		marginBottom: 30,
	},
	circleContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		height: 260,
		marginBottom: 24,
	},
	outerCircle: {
		position: 'absolute',
		width: 240,
		height: 240,
		borderRadius: 120,
	},
	innerCircle: {
		width: 140,
		height: 140,
		borderRadius: 70,
		backgroundColor: colors.surface,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.08,
		shadowRadius: 12,
		elevation: 4,
	},
	circleCountdown: {
		fontFamily: 'Inter',
		fontWeight: '300',
		fontSize: 48,
		color: colors.navy,
	},
	circleLabel: {
		...typography.section,
		color: colors.muted,
		marginTop: 2,
	},
	progress: {
		...typography.meta,
		color: colors.muted,
		textAlign: 'center',
		marginBottom: 24,
	},
	actionRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		gap: 12,
	},
	startBtn: {
		backgroundColor: colors.navy,
		paddingVertical: 14,
		paddingHorizontal: 48,
		borderRadius: radius.lg,
	},
	startBtnText: {
		...typography.button,
		color: colors.surface,
	},
	stopBtn: {
		backgroundColor: colors.chipBg,
		paddingVertical: 14,
		paddingHorizontal: 48,
		borderRadius: radius.lg,
	},
	stopBtnText: {
		...typography.button,
		color: colors.text,
	},
	tip: {
		...typography.body,
		color: colors.muted,
		textAlign: 'center',
		marginTop: 32,
		lineHeight: 20,
		paddingHorizontal: 20,
	},
});
