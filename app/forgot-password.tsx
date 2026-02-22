import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	SafeAreaView,
	ScrollView,
	TouchableOpacity,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors, typography, spacing } from '../constants/theme';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useStore } from '../store/useStore';

export default function ForgotPasswordScreen() {
	const router = useRouter();
	const resetPassword = useStore((s) => s.resetPassword);
	const authError = useStore((s) => s.authError);
	const setAuthError = useStore((s) => s.setAuthError);
	const [email, setEmail] = useState('');
	const [sent, setSent] = useState(false);
	const [loading, setLoading] = useState(false);
	const [localError, setLocalError] = useState('');

	const handleReset = async () => {
		setLocalError('');
		setAuthError(null);

		if (!email) {
			setLocalError('Please enter your email address');
			return;
		}

		setLoading(true);
		const success = await resetPassword(email);
		setLoading(false);

		if (success) {
			setSent(true);
		}
	};

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
						<Text style={styles.backText}>← Back to Login</Text>
					</TouchableOpacity>

					{/* Title */}
					<Text style={styles.title}>Reset Password</Text>
					<Text style={styles.subtitle}>
						Enter the email address associated with{'\n'}your account and we'll
						send a reset link.
					</Text>

					{sent ? (
						<View style={styles.successContainer}>
							<Text style={styles.successIcon}>✓</Text>
							<Text style={styles.successTitle}>Check your inbox</Text>
							<Text style={styles.successText}>
								We've sent a password reset link to{'\n'}
								{email}
							</Text>
							<View style={{ marginTop: 24 }}>
								<Button
									title="Back to Login"
									onPress={() => router.replace('/login')}
								/>
							</View>
						</View>
					) : (
						<>
							{/* Form */}
							<View style={styles.form}>
								<Input
									placeholder="Email address"
									value={email}
									onChangeText={setEmail}
									keyboardType="email-address"
									autoCapitalize="none"
								/>
							</View>

							{/* Error */}
							{localError || authError ? (
								<Text style={styles.errorText}>{localError || authError}</Text>
							) : null}

							{/* CTA */}
							<Button
								title={loading ? 'Sending...' : 'Send Reset Link'}
								onPress={handleReset}
							/>
						</>
					)}
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F6F2EB',
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
		lineHeight: 20,
		marginBottom: 30,
	},
	form: {
		gap: 10,
		marginBottom: 14,
	},
	errorText: {
		color: '#D32F2F',
		fontFamily: 'Inter',
		fontSize: 13,
		textAlign: 'center',
		marginBottom: 10,
	},
	successContainer: {
		alignItems: 'center',
		marginTop: 40,
	},
	successIcon: {
		fontSize: 48,
		color: colors.green,
		marginBottom: 16,
	},
	successTitle: {
		...typography.section,
		color: colors.text,
		fontSize: 20,
		marginBottom: 8,
	},
	successText: {
		...typography.body,
		color: colors.muted,
		textAlign: 'center',
		lineHeight: 20,
	},
});
