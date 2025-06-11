
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { profileService } from '../services/profileService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Production: Auth provider initializing');
    
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Production: Session error:', error);
        } else {
          console.log('Production: Session check completed', session ? 'Session found' : 'No session');
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await profileService.ensureProfile(session.user);
          }
        }
      } catch (error) {
        console.error('Production: Session check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes - only create one subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Production: Auth state changed:', event, session ? { user: session.user.id } : { value: 'undefined' });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event === 'SIGNED_IN') {
          await profileService.ensureProfile(session.user);
        }
        
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      console.log('Production: Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array to ensure this only runs once

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Production: Sign out error:', error);
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    isLoading: loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
