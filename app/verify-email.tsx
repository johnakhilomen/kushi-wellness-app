import React, { useState, useRef, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	ScrollView,
	TextInput,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, typography, spacing, radius } from '../constants/theme';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/useStore';

const CODE_LENGTH = 6;

export default function VerifyEmailScreen() {
	const router = useRouter();
	const pendingEmail = useStore((s) => s.pendingEmail);
	const verifyOtp = useStore((s) => s.verifyOtp);
	const resendOtp = useStore((s) => s.resendOtp);
	const authError = useStore((s) => s.authError);
	const isLoading = useStore((s) => s.isLoading);
	const setAuthError = useStore((s) => s.setAuthError);

	const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
	const [resendCooldown, setResendCooldown] = useState(0);
	const inputRefs = useRef<(TextInput | null)[]>([]);

	// Redirect if no pending email
	useEffect(() => {
		if (!pendingEmail) {
			router.replace('/register');
		}
	}, [pendingEmail]);

	// Resend cooldown timer
	useEffect(() => {
		if (resendCooldown <= 0) return;
		const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
		return () => clearTimeout(timer);
	}, [resendCooldown]);

	const handleChange = (text: string, index: number) => {
		const newCode = [...code];

		if (text.length > 1) {
			// Handle paste
			const chars = text
				.replace(/[^0-9]/g, '')
				.split('')
				.slice(0, CODE_LENGTH);
			chars.forEach((char, i) => {
				if (index + i < CODE_LENGTH) newCode[index + i] = char;
			});
			setCode(newCode);
			const nextIndex = Math.min(index + chars.length, CODE_LENGTH - 1);
			inputRefs.current[nextIndex]?.focus();
		} else {
			newCode[index] = text.replace(/[^0-9]/g, '');
			setCode(newCode);
			if (text && index < CODE_LENGTH - 1) {
				inputRefs.current[index + 1]?.focus();
			}
		}
	};

	const handleKeyPress = (key: string, index: number) => {
		if (key === 'Backspace' && !code[index] && index > 0) {
			const newCode = [...code];
			newCode[index - 1] = '';
			setCode(newCode);
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handleVerify = async () => {
		setAuthError(null);
		const token = code.join('');
		if (token.length !== CODE_LENGTH) return;

		const success = await verifyOtp(pendingEmail!, token);
		if (success) {
			router.replace('/onboarding');
		}
	};

	const handleResend = async () => {
		if (resendCooldown > 0 || !pendingEmail) return;
		const success = await resendOtp(pendingEmail);
		if (success) {
			setResendCooldown(60);
		}
	};

	const codeComplete = code.every((c) => c !== '');

	return (
		<SafeAreaView style={styles.container}>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
			>
				<ScrollView
					contentContainerStyle={styles.scrollContent}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
				>
					{/* Back */}
					<TouchableOpacity
						onPress={() => router.back()}
						style={styles.backBtn}
					>
						<Text style={styles.backText}>← Back</Text>
					</TouchableOpacity>

					{/* Title */}
					<Text style={styles.title}>Check your email</Text>
					<Text style={styles.subtitle}>
						We sent a 6-digit verification code to{'\n'}
						<Text style={styles.emailHighlight}>{pendingEmail}</Text>
					</Text>

					{/* Code Input */}
					<View style={styles.codeRow}>
						{code.map((digit, index) => (
							<TextInput
								key={index}
								ref={(ref) => {
									inputRefs.current[index] = ref;
								}}
								style={[
									styles.codeInput,
									digit ? styles.codeInputFilled : null,
								]}
								value={digit}
								onChangeText={(text) => handleChange(text, index)}
								onKeyPress={({ nativeEvent }) =>
									handleKeyPress(nativeEvent.key, index)
								}
								keyboardType="number-pad"
								maxLength={2}
								selectTextOnFocus
								textContentType="oneTimeCode"
							/>
						))}
					</View>

					{/* Error */}
					{authError ? <Text style={styles.errorText}>{authError}</Text> : null}

					{/* Verify Button */}
					<Button
						title={isLoading ? 'Verifying...' : 'Verify Email'}
						onPress={handleVerify}
					/>

					{/* Resend */}
					<View style={styles.resendRow}>
						<Text style={styles.resendText}>Didn't receive the code? </Text>
						<TouchableOpacity
							onPress={handleResend}
							disabled={resendCooldown > 0}
						>
							<Text
								style={[
									styles.resendLink,
									resendCooldown > 0 && styles.resendDisabled,
								]}
							>
								{resendCooldown > 0
									? `Resend in ${resendCooldown}s`
									: 'Resend code'}
							</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F9F6F1',
	},
	scrollContent: {
		paddingHorizontal: spacing.screen,
		paddingTop: 20,
		paddingBottom: 40,
	},
	backBtn: {
		marginBottom: 20,
	},
	backText: {
		...typography.body,
		color: colors.navy,
	},
	title: {
		fontFamily: 'Inter',
		fontWeight: '300',
		fontSize: 32,
		color: colors.text,
		marginBottom: 8,
	},
	subtitle: {
		...typography.body,
		color: colors.muted,
		lineHeight: 22,
		marginBottom: 32,
	},
	emailHighlight: {
		color: colors.navy,
		fontWeight: '600',
	},
	codeRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		gap: 10,
		marginBottom: 24,
	},
	codeInput: {
		width: 48,
		height: 56,
		borderRadius: radius.md,
		borderWidth: 1.5,
		borderColor: colors.stroke,
		backgroundColor: '#FFFFFF',
		textAlign: 'center',
		fontSize: 24,
		fontFamily: 'Inter',
		fontWeight: '600',
		color: colors.text,
	},
	codeInputFilled: {
		borderColor: colors.navy,
		backgroundColor: '#F0EDE7',
	},
	errorText: {
		color: '#D32F2F',
		fontFamily: 'Inter',
		fontSize: 13,
		textAlign: 'center',
		marginBottom: 10,
	},
	resendRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 24,
	},
	resendText: {
		...typography.body,
		color: colors.muted,
	},
	resendLink: {
		...typography.section,
		color: colors.navy,
	},
	resendDisabled: {
		color: colors.muted,
		fontWeight: '400',
	},
});
