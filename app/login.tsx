import React, { useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
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

export default function LoginScreen() {
	const router = useRouter();
	const login = useStore((s) => s.login);
	const authError = useStore((s) => s.authError);
	const isLoading = useStore((s) => s.isLoading);
	const setAuthError = useStore((s) => s.setAuthError);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [localError, setLocalError] = useState('');

	const handleLogin = async () => {
		setLocalError('');
		setAuthError(null);

		if (!email || !password) {
			setLocalError('Please fill in all fields');
			return;
		}

		const result = await login(email, password);
		if (result === ('verify' as unknown as boolean)) {
			router.push('/verify-email');
		}
		// Auth-gated navigation in _layout will redirect on success
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
					{/* Title */}
					<Text style={styles.title}>Welcome Back</Text>
					<Text style={styles.subtitle}>
						Continue your microbiotic wellness journey
					</Text>

					{/* Hero Art */}
					<View style={styles.heroContainer}>
						<Image
							source={require('../assets/hero-login.png')}
							style={styles.heroImage}
							resizeMode="contain"
						/>
					</View>

					{/* Form */}
					<View style={styles.form}>
						<Input
							placeholder="Email address"
							value={email}
							onChangeText={setEmail}
							keyboardType="email-address"
							autoCapitalize="none"
						/>
						<Input
							placeholder="Password"
							value={password}
							onChangeText={setPassword}
							secureTextEntry
						/>
					</View>

					{/* Error */}
					{localError || authError ? (
						<Text style={styles.errorText}>{localError || authError}</Text>
					) : null}

					{/* Forgot Password */}
					<TouchableOpacity
						style={styles.forgotBtn}
						onPress={() => router.push('/forgot-password')}
					>
						<Text style={styles.forgotText}>Forgot password?</Text>
					</TouchableOpacity>

					{/* Login CTA */}
					<Button
						title={isLoading ? 'Logging in...' : 'Log in'}
						onPress={handleLogin}
						disabled={isLoading}
					/>

					{/* Divider */}
					<View style={styles.divider}>
						<View style={styles.dividerLine} />
						<Text style={styles.dividerText}>or continue with</Text>
						<View style={styles.dividerLine} />
					</View>

					{/* Google Button */}
					<Button
						title="Continue with Google"
						variant="secondary"
						onPress={() => {}}
					/>

					{/* Footer */}
					<View style={styles.footer}>
						<Text style={styles.footerText}>New to Kushi? </Text>
						<TouchableOpacity onPress={() => router.push('/register')}>
							<Text style={styles.footerLink}>Create account</Text>
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
		backgroundColor: '#F6F2EB',
	},
	scrollContent: {
		paddingHorizontal: spacing.screen,
		paddingTop: 30,
		paddingBottom: 40,
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
	},
	heroContainer: {
		alignItems: 'center',
		marginVertical: 24,
	},
	heroImage: {
		width: 180,
		height: 140,
	},
	form: {
		gap: 10,
		marginBottom: 10,
	},
	forgotBtn: {
		alignSelf: 'flex-end',
		marginBottom: 20,
	},
	forgotText: {
		...typography.meta,
		color: colors.navy,
	},
	divider: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 20,
	},
	dividerLine: {
		flex: 1,
		height: 1,
		backgroundColor: colors.stroke,
	},
	dividerText: {
		...typography.meta,
		color: colors.placeholder,
		paddingHorizontal: 12,
	},
	footer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 20,
	},
	footerText: {
		...typography.body,
		color: colors.muted,
	},
	footerLink: {
		...typography.section,
		color: colors.navy,
	},
	errorText: {
		color: '#D32F2F',
		fontFamily: 'Inter',
		fontSize: 13,
		textAlign: 'center',
		marginBottom: 10,
	},
});
