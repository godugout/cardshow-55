
import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/providers/AuthProvider';

interface ToastPreferences {
  showToasts: boolean;
  duration: number;
}

const DEFAULT_PREFERENCES: ToastPreferences = {
  showToasts: true,
  duration: 3000,
};

export const useToastPreferences = () => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<ToastPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    if (user?.id) {
      try {
        const existingProfiles = JSON.parse(localStorage.getItem('cardshow_profiles') || '{}');
        const userProfile = existingProfiles[user.id];
        
        if (userProfile?.toastPreferences) {
          setPreferences({
            ...DEFAULT_PREFERENCES,
            ...userProfile.toastPreferences
          });
        }
      } catch (error) {
        console.error('Error loading toast preferences:', error);
      }
    }
  }, [user]);

  const updateToastPreferences = (newPreferences: Partial<ToastPreferences>) => {
    if (!user?.id) return;

    const updatedPreferences = { ...preferences, ...newPreferences };
    setPreferences(updatedPreferences);

    try {
      const existingProfiles = JSON.parse(localStorage.getItem('cardshow_profiles') || '{}');
      existingProfiles[user.id] = {
        ...existingProfiles[user.id],
        toastPreferences: updatedPreferences
      };
      localStorage.setItem('cardshow_profiles', JSON.stringify(existingProfiles));
    } catch (error) {
      console.error('Error saving toast preferences:', error);
    }
  };

  return {
    preferences,
    updateToastPreferences,
  };
};
