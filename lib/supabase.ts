import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://taqzuzlmneodnsnwxmxf.supabase.co';
const SUPABASE_ANON_KEY =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhcXp1emxtbmVvZG5zbnd4bXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3NzQ1MjgsImV4cCI6MjA4NzM1MDUyOH0.KsyHyqB9pGKBYmnX6KNCIrs08FdFTiyipTnBQmd7CqE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
	auth: {
		storage: AsyncStorage,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
	},
});
