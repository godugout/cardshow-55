
import { User, Session, AuthError } from '@supabase/supabase-js';
import { PostgrestError } from '@supabase/supabase-js';

export type OAuthProvider = 'google' | 'github' | 'discord' | 'facebook' | 'twitter';

export interface AuthUser {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
}

export interface AuthError {
  message: string;
  status?: number;
  name?: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}

export interface AuthContextType extends AuthState {
  isLoading: boolean;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  signInWithOAuth: (provider: OAuthProvider) => Promise<{ error: AuthError | null }>;
  signInWithMagicLink: (email: string) => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile?: (updates: Record<string, any>) => Promise<{ error: AuthError | PostgrestError | null }>;
}
