
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
