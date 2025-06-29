
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Team } from '@/types/team';

interface TeamAsset {
  id: string;
  teamId: string;
  assetType: 'logo' | 'wordmark' | 'icon';
  assetUrl: string;
  isDefault: boolean;
  metadata?: {
    width?: number;
    height?: number;
    format?: string;
  };
}

interface TeamBranding {
  id: string;
  teamId: string;
  teamName: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  typography: {
    primaryFont: string;
    secondaryFont: string;
    headingWeight: string;
    bodyWeight: string;
  };
  assets: TeamAsset[];
}

interface BatchCustomizationJob {
  id: string;
  templateId: string;
  teams: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  variations: TeamVariation[];
  createdAt: Date;
}

interface TeamVariation {
  teamId: string;
  teamName: string;
  svgContent: string;
  cssContent: string;
  previewUrl?: string;
}

export const useTeamCustomization = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamBranding, setTeamBranding] = useState<Record<string, TeamBranding>>({});
  const [customizationJobs, setCustomizationJobs] = useState<BatchCustomizationJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  // Load teams and their branding data
  const loadTeams = useCallback(async () => {
    setIsLoading(true);
    try {
      // This would typically fetch from your teams table
      // For now, using mock data structure
      const mockTeams: Team[] = [
        { id: '1', name: 'Los Angeles Lakers', abbreviation: 'LAL', primaryColor: '#552583', secondaryColor: '#FDB927' },
        { id: '2', name: 'Boston Celtics', abbreviation: 'BOS', primaryColor: '#007A33', secondaryColor: '#BA9653' },
        { id: '3', name: 'Chicago Bulls', abbreviation: 'CHI', primaryColor: '#CE1141', secondaryColor: '#000000' },
      ];

      setTeams(mockTeams);

      // Load branding data for each team
      const brandingData: Record<string, TeamBranding> = {};
      for (const team of mockTeams) {
        brandingData[team.id] = {
          id: `branding-${team.id}`,
          teamId: team.id,
          teamName: team.name,
          colors: {
            primary: team.primaryColor || '#1a365d',
            secondary: team.secondaryColor || '#2d3748',
            accent: '#4299e1',
            text: '#ffffff',
            background: '#f7fafc'
          },
          typography: {
            primaryFont: 'Inter',
            secondaryFont: 'Inter',
            headingWeight: '700',
            bodyWeight: '400'
          },
          assets: []
        };
      }

      setTeamBranding(brandingData);
    } catch (error) {
      console.error('Failed to load teams:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Upload team asset
  const uploadTeamAsset = useCallback(async (
    teamId: string,
    file: File,
    assetType: 'logo' | 'wordmark' | 'icon'
  ): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${teamId}/${assetType}-${Date.now()}.${fileExt}`;

      setUploadProgress(prev => ({ ...prev, [fileName]: 0 }));

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('team-assets')
        .upload(fileName, file, {
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(prev => ({ ...prev, [fileName]: percent }));
          }
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('team-assets')
        .getPublicUrl(data.path);

      // Update team branding with new asset
      setTeamBranding(prev => ({
        ...prev,
        [teamId]: {
          ...prev[teamId],
          assets: [
            ...prev[teamId].assets,
            {
              id: `asset-${Date.now()}`,
              teamId,
              assetType,
              assetUrl: urlData.publicUrl,
              isDefault: prev[teamId].assets.filter(a => a.assetType === assetType).length === 0,
              metadata: {
                format: fileExt,
              }
            }
          ]
        }
      }));

      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileName];
        return newProgress;
      });

      return urlData.publicUrl;
    } catch (error) {
      console.error('Asset upload failed:', error);
      return null;
    }
  }, []);

  // Update team colors
  const updateTeamColors = useCallback((teamId: string, colors: Partial<TeamBranding['colors']>) => {
    setTeamBranding(prev => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        colors: {
          ...prev[teamId].colors,
          ...colors
        }
      }
    }));
  }, []);

  // Update typography settings
  const updateTeamTypography = useCallback((teamId: string, typography: Partial<TeamBranding['typography']>) => {
    setTeamBranding(prev => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        typography: {
          ...prev[teamId].typography,
          ...typography
        }
      }
    }));
  }, []);

  // Start batch customization job
  const startBatchCustomization = useCallback(async (
    templateId: string,
    selectedTeams: string[],
    baseTemplate: { svg: string; css: string }
  ): Promise<string> => {
    const jobId = `job-${Date.now()}`;
    
    const newJob: BatchCustomizationJob = {
      id: jobId,
      templateId,
      teams: selectedTeams,
      status: 'pending',
      progress: 0,
      variations: [],
      createdAt: new Date()
    };

    setCustomizationJobs(prev => [...prev, newJob]);

    // Start processing in background
    processBatchCustomization(jobId, selectedTeams, baseTemplate);

    return jobId;
  }, [teamBranding]);

  // Process batch customization
  const processBatchCustomization = useCallback(async (
    jobId: string,
    selectedTeams: string[],
    baseTemplate: { svg: string; css: string }
  ) => {
    try {
      setCustomizationJobs(prev => 
        prev.map(job => 
          job.id === jobId 
            ? { ...job, status: 'processing' }
            : job
        )
      );

      const variations: TeamVariation[] = [];
      const totalTeams = selectedTeams.length;

      for (let i = 0; i < selectedTeams.length; i++) {
        const teamId = selectedTeams[i];
        const branding = teamBranding[teamId];
        
        if (branding) {
          // Apply team colors to template
          let customizedSvg = baseTemplate.svg;
          let customizedCss = baseTemplate.css;

          // Replace color variables in SVG
          Object.entries(branding.colors).forEach(([colorType, colorValue]) => {
            const pattern = new RegExp(`var\\(--team-${colorType}-color\\)`, 'g');
            customizedSvg = customizedSvg.replace(pattern, colorValue);
            customizedCss = customizedCss.replace(pattern, colorValue);
          });

          // Replace logo placeholders
          const defaultLogo = branding.assets.find(asset => 
            asset.assetType === 'logo' && asset.isDefault
          );
          
          if (defaultLogo) {
            customizedSvg = customizedSvg.replace(
              /data-team-logo="placeholder"/g,
              `href="${defaultLogo.assetUrl}"`
            );
          }

          variations.push({
            teamId,
            teamName: branding.teamName,
            svgContent: customizedSvg,
            cssContent: customizedCss
          });
        }

        // Update progress
        const progress = ((i + 1) / totalTeams) * 100;
        setCustomizationJobs(prev => 
          prev.map(job => 
            job.id === jobId 
              ? { ...job, progress, variations: [...variations] }
              : job
          )
        );
      }

      // Mark job as completed
      setCustomizationJobs(prev => 
        prev.map(job => 
          job.id === jobId 
            ? { ...job, status: 'completed', progress: 100 }
            : job
        )
      );

    } catch (error) {
      console.error('Batch customization failed:', error);
      setCustomizationJobs(prev => 
        prev.map(job => 
          job.id === jobId 
            ? { ...job, status: 'failed' }
            : job
        )
      );
    }
  }, [teamBranding]);

  // Export variations
  const exportVariations = useCallback(async (jobId: string, format: 'svg' | 'png' | 'json') => {
    const job = customizationJobs.find(j => j.id === jobId);
    if (!job) return null;

    if (format === 'json') {
      const dataStr = JSON.stringify(job.variations, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `team-variations-${jobId}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    // For SVG/PNG exports, we'd implement individual file downloads
    // This would require additional canvas conversion for PNG
  }, [customizationJobs]);

  // Get team branding by ID
  const getTeamBranding = useCallback((teamId: string) => {
    return teamBranding[teamId] || null;
  }, [teamBranding]);

  // Search teams
  const searchTeams = useCallback((query: string) => {
    if (!query.trim()) return teams;
    
    const lowercaseQuery = query.toLowerCase();
    return teams.filter(team => 
      team.name.toLowerCase().includes(lowercaseQuery) ||
      team.abbreviation.toLowerCase().includes(lowercaseQuery)
    );
  }, [teams]);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  return {
    teams,
    teamBranding,
    customizationJobs,
    isLoading,
    uploadProgress,
    uploadTeamAsset,
    updateTeamColors,
    updateTeamTypography,
    startBatchCustomization,
    exportVariations,
    getTeamBranding,
    searchTeams,
    loadTeams
  };
};
