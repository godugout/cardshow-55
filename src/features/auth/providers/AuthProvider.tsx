
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService } from '../services/authService';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  signInWithMagicLink: (email: string) => Promise<{ error: any }>;
  signInWithOAuth: (provider: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = authService.onAuthStateChange(
      (event, session) => {
        console.log('🔧 Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Then check for existing session
    authService.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authService.signIn(email, password);
      if (result.error) {
        toast.error('Sign in failed', {
          description: result.error.message
        });
      } else {
        toast.success('Welcome back!');
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    setIsLoading(true);
    try {
      const result = await authService.signUp(email, password, metadata);
      if (result.error) {
        toast.error('Sign up failed', {
          description: result.error.message
        });
      } else {
        toast.success('Account created!', {
          description: 'Please check your email to verify your account'
        });
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      toast.success('Signed out successfully');
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const result = await authService.resetPassword(email);
      if (result.error) {
        toast.error('Password reset failed', {
          description: result.error.message
        });
      } else {
        toast.success('Password reset email sent!', {
          description: 'Check your email for the reset link'
        });
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithMagicLink = async (email: string) => {
    setIsLoading(true);
    try {
      const result = await authService.signInWithMagicLink(email);
      if (result.error) {
        toast.error('Magic link failed', {
          description: result.error.message
        });
      } else {
        toast.success('Magic link sent!', {
          description: 'Check your email for the sign-in link'
        });
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithOAuth = async (provider: string) => {
    setIsLoading(true);
    try {
      const result = await authService.signInWithOAuth(provider as any);
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    signInWithMagicLink,
    signInWithOAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
