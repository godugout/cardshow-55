
import { useState, useEffect } from 'react';

export interface AppSettings {
  theme?: string;
  features?: string[];
  config?: Record<string, any>;
}

export const useAppSettings = () => {
  const [settings, setSettings] = useState<AppSettings>({});
  const [isLoading, setIsLoading] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem('app_settings');
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error('Error loading app settings:', error);
    }
  }, []);

  const saveSettings = (newSettings: Partial<AppSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      localStorage.setItem('app_settings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error saving app settings:', error);
    }
  };

  return {
    settings,
    isLoading,
    saveSettings
  };
};
