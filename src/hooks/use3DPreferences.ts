
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/providers/AuthProvider';

interface User3DPreferences {
  prefer3D: boolean;
  performanceMode: 'high' | 'medium' | 'low';
  autoRotate: boolean;
  showStats: boolean;
}

const defaultPreferences: User3DPreferences = {
  prefer3D: true,
  performanceMode: 'high',
  autoRotate: false,
  showStats: false,
};

export const use3DPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<User3DPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(true);

  // Load preferences from Supabase
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('preferences')
          .eq('id', user.id)
          .single();

        if (profile?.preferences) {
          const userPrefs = profile.preferences as any;
          setPreferences({
            prefer3D: userPrefs.prefer3D ?? defaultPreferences.prefer3D,
            performanceMode: userPrefs.performanceMode ?? defaultPreferences.performanceMode,
            autoRotate: userPrefs.autoRotate ?? defaultPreferences.autoRotate,
            showStats: userPrefs.showStats ?? defaultPreferences.showStats,
          });
        }
      } catch (error) {
        console.error('Failed to load 3D preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user?.id]);

  // Save preferences to Supabase
  const updatePreferences = async (updates: Partial<User3DPreferences>) => {
    if (!user?.id) return;

    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);

    try {
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', user.id)
        .single();

      const currentPrefs = currentProfile?.preferences || {};
      
      await supabase
        .from('profiles')
        .update({
          preferences: {
            ...currentPrefs,
            ...newPreferences,
          }
        })
        .eq('id', user.id);
    } catch (error) {
      console.error('Failed to save 3D preferences:', error);
      // Revert on error
      setPreferences(preferences);
    }
  };

  return {
    preferences,
    updatePreferences,
    loading,
  };
};
