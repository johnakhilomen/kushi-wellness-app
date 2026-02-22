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
import { colors, typography, spacing, radius } from '../constants/theme';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useStore } from '../store/useStore';

export default function RegisterScreen() {
	const router = useRouter();
	const register = useStore((s) => s.register);
	const authError = useStore((s) => s.authError);
	const isLoading = useStore((s) => s.isLoading);
	const setAuthError = useStore((s) => s.setAuthError);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [localError, setLocalError] = useState('');

	const handleRegister = async () => {
		setLocalError('');
		setAuthError(null);

		if (!name || !email || !password) {
			setLocalError('Please fill in all fields');
			return;
		}
		if (password !== confirmPassword) {
			setLocalError('Passwords do not match');
			return;
		}
		if (password.length < 6) {
			setLocalError('Password must be at least 6 characters');
			return;
		}

		const success = await register(name, email, password);
		if (success) {
			router.push('/onboarding');
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
					{/* Title */}
					<Text style={styles.title}>Create Account</Text>
					<Text style={styles.subtitle}>
						Join Kushi to begin your microbiotic{'\n'}wellness journey
					</Text>

					{/* Hero Art */}
					<View style={styles.heroContainer}>
						<Image
							source={require('../assets/hero-register.png')}
							style={styles.heroImage}
							resizeMode="contain"
						/>
					</View>

					{/* Form */}
					<View style={styles.form}>
						<Input
							placeholder="Full name"
							value={name}
							onChangeText={setName}
							autoCapitalize="words"
						/>
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
						<Input
							placeholder="Confirm password"
							value={confirmPassword}
							onChangeText={setConfirmPassword}
							secureTextEntry
						/>
					</View>

					{/* Error */}
					{localError || authError ? (
						<Text style={styles.errorText}>{localError || authError}</Text>
					) : null}

					{/* Consent */}
					<Text style={styles.consent}>
						By creating an account you agree to our Terms of{'\n'}Service and
						Privacy Policy
					</Text>

					{/* CTA */}
					<Button
						title={isLoading ? 'Creating Account...' : 'Create Account'}
						onPress={handleRegister}
					/>

					{/* Footer */}
					<View style={styles.footer}>
						<Text style={styles.footerText}>Already have an account? </Text>
						<TouchableOpacity onPress={() => router.push('/login')}>
							<Text style={styles.footerLink}>Log in</Text>
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
		marginVertical: 20,
	},
	heroImage: {
		width: 180,
		height: 140,
	},
	form: {
		gap: 10,
		marginBottom: 14,
	},
	consent: {
		...typography.meta,
		color: colors.placeholder,
		textAlign: 'center',
		lineHeight: 18,
		marginBottom: 18,
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
