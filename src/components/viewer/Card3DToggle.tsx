
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Box, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/providers/AuthProvider';

interface Card3DToggleProps {
  is3D: boolean;
  onToggle: (is3D: boolean) => void;
  disabled?: boolean;
}

export const Card3DToggle: React.FC<Card3DToggleProps> = ({
  is3D,
  onToggle,
  disabled = false
}) => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  // Load user preference on mount
  useEffect(() => {
    const loadPreference = async () => {
      if (!user?.id) return;

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('preferences')
          .eq('id', user.id)
          .single();

        if (profile?.preferences && typeof profile.preferences === 'object') {
          const preferences = profile.preferences as { prefer3D?: boolean };
          if (preferences.prefer3D !== undefined) {
            onToggle(preferences.prefer3D);
          }
        }
      } catch (error) {
        console.log('Could not load 3D preference:', error);
      }
    };

    loadPreference();
  }, [user?.id, onToggle]);

  // Save preference to Supabase
  const savePreference = async (prefer3D: boolean) => {
    if (!user?.id) return;

    setSaving(true);
    try {
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('id', user.id)
        .single();

      const currentPreferences = (currentProfile?.preferences && typeof currentProfile.preferences === 'object') 
        ? currentProfile.preferences as Record<string, any>
        : {};
      
      await supabase
        .from('profiles')
        .update({
          preferences: {
            ...currentPreferences,
            prefer3D
          }
        })
        .eq('id', user.id);
    } catch (error) {
      console.error('Failed to save 3D preference:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = () => {
    const newIs3D = !is3D;
    onToggle(newIs3D);
    savePreference(newIs3D);
  };

  return (
    <Button
      variant={is3D ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={disabled || saving}
      className="flex items-center gap-2 transition-all duration-200"
    >
      {is3D ? (
        <>
          <Box className="w-4 h-4" />
          3D View
        </>
      ) : (
        <>
          <Image className="w-4 h-4" />
          2D View
        </>
      )}
    </Button>
  );
};
