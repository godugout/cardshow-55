
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Download, 
  Eye, 
  Grid, 
  List,
  Search,
  Filter,
  Settings,
  Palette,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useTeamCustomization } from '@/hooks/useTeamCustomization';
import { toast } from 'sonner';

interface BatchCustomizerProps {
  templateData?: {
    id?: string;
    name?: string;
    svg?: string;
    css?: string;
    preview?: string;
    files?: any[];
  };
  onSettingsApplied?: (settings: any) => void;
}

export const BatchCustomizer = ({ templateData, onSettingsApplied }: BatchCustomizerProps) => {
  const {
    teams,
    teamBranding,
    customizationJobs,
    startBatchCustomization,
    exportVariations,
    searchTeams
  } = useTeamCustomization();

  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [colorFilter, setColorFilter] = useState('');
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [batchSettings, setBatchSettings] = useState({
    applyConsistentStyling: true,
    enhanceColors: true,
    autoOptimize: true,
    generateVariations: true
  });

  const filteredTeams = searchTeams(searchQuery).filter(team => {
    if (!colorFilter) return true;
    const branding = teamBranding[team.id];
    return branding?.colors.primary.toLowerCase().includes(colorFilter.toLowerCase());
  });

  const currentJob = currentJobId ? customizationJobs.find(job => job.id === currentJobId) : null;

  const handleTeamToggle = (teamId: string) => {
    setSelectedTeams(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTeams.length === filteredTeams.length) {
      setSelectedTeams([]);
    } else {
      setSelectedTeams(filteredTeams.map(team => team.id));
    }
  };

  const handleStartCustomization = async () => {
    if (!templateData) {
      toast.error('No template selected');
      return;
    }

    if (selectedTeams.length === 0) {
      toast.error('Please select at least one team');
      return;
    }

    // For batch processing workflow, use the onSettingsApplied callback
    if (onSettingsApplied) {
      const settings = {
        ...batchSettings,
        selectedTeams,
        templateData,
        totalFiles: templateData.files?.length || 0
      };
      onSettingsApplied(settings);
      return;
    }

    // For other workflows, use the customization hook
    try {
      const jobId = await startBatchCustomization(
        templateData.id || 'default-template',
        selectedTeams,
        {
          svg: templateData.svg || '',
          css: templateData.css || ''
        }
      );

      setCurrentJobId(jobId);
      toast.success(`Started batch customization for ${selectedTeams.length} teams`);
    } catch (error) {
      console.error('Failed to start batch customization:', error);
      toast.error('Failed to start batch customization');
    }
  };

  const handleExport = async (format: 'svg' | 'png' | 'json') => {
    if (!currentJob) return;

    try {
      await exportVariations(currentJob.id, format);
      toast.success(`Exported ${currentJob.variations.length} variations as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed');
    }
  };

  const renderTeamCard = (team: any) => {
    const branding = teamBranding[team.id];
    const isSelected = selectedTeams.includes(team.id);
    const variation = currentJob?.variations.find(v => v.teamId === team.id);

    return (
      <Card
        key={team.id}
        className={`cursor-pointer transition-all ${
          isSelected 
            ? 'bg-crd-green/20 border-crd-green ring-2 ring-crd-green/50' 
            : 'bg-crd-darker border-crd-mediumGray/20 hover:border-crd-green/50'
        }`}
        onClick={() => handleTeamToggle(team.id)}
      >
        <CardContent className={viewMode === 'grid' ? 'p-4' : 'p-3'}>
          <div className={`flex items-center gap-3 ${viewMode === 'grid' ? 'flex-col text-center' : ''}`}>
            <div className="flex items-center gap-3 flex-1">
              <Checkbox
                checked={isSelected}
                onChange={() => handleTeamToggle(team.id)}
                onClick={(e) => e.stopPropagation()}
              />
              
              <div
                className={`${viewMode === 'grid' ? 'w-12 h-12' : 'w-8 h-8'} rounded-full flex-shrink-0`}
                style={{ backgroundColor: branding?.colors.primary || team.primaryColor || '#1a365d' }}
              />
              
              <div className={`min-w-0 flex-1 ${viewMode === 'grid' ? 'text-center' : ''}`}>
                <p className="text-crd-white font-medium truncate">{team.name}</p>
                <p className="text-crd-lightGray text-sm">{team.abbreviation}</p>
                
                {branding && (
                  <div className="flex gap-1 mt-1 justify-center">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: branding.colors.primary }}
                      title="Primary Color"
                    />
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: branding.colors.secondary }}
                      title="Secondary Color"
                    />
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: branding.colors.accent }}
                      title="Accent Color"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Customization Status */}
            {currentJob && (
              <div className="flex items-center gap-2">
                {variation ? (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Complete
                  </Badge>
                ) : currentJob.status === 'processing' ? (
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    <Clock className="w-3 h-3 mr-1" />
                    Processing
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-crd-mediumGray border-crd-mediumGray/30">
                    Pending
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Preview for completed variations */}
          {variation && viewMode === 'grid' && (
            <div className="mt-3 aspect-[5/7] bg-crd-darkest rounded-lg overflow-hidden border border-crd-mediumGray/30">
              <div 
                className="w-full h-full flex items-center justify-center text-xs text-crd-lightGray"
                dangerouslySetInnerHTML={{ __html: variation.svgContent }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderControlPanel = () => (
    <Card className="bg-crd-darker border-crd-mediumGray/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-crd-white">Batch Customization</CardTitle>
          <div className="flex items-center gap-2">
            <CRDButton
              size="sm"
              variant="outline"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </CRDButton>
            <CRDButton
              size="sm"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
            </CRDButton>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Template Info */}
        {templateData && (
          <div className="flex items-center gap-3 p-3 bg-crd-darkest rounded-lg">
            <div className="w-12 h-16 bg-crd-mediumGray/20 rounded border flex items-center justify-center">
              <Palette className="w-6 h-6 text-crd-mediumGray" />
            </div>
            <div>
              <p className="text-crd-white font-medium">
                {templateData.name || `Batch Processing (${templateData.files?.length || 0} files)`}
              </p>
              <p className="text-crd-lightGray text-sm">Selected Template</p>
            </div>
          </div>
        )}

        {/* Batch Settings */}
        <div className="space-y-3 p-3 bg-crd-darkest rounded-lg">
          <h4 className="text-crd-white font-medium text-sm">Batch Settings</h4>
          <div className="space-y-2">
            {Object.entries(batchSettings).map(([key, value]) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={value}
                  onChange={(checked) => setBatchSettings(prev => ({ ...prev, [key]: checked }))}
                />
                <span className="text-crd-lightGray">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search teams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-crd-darkest border-crd-mediumGray/30 text-crd-white"
              />
            </div>
            <CRDButton
              variant="outline"
              onClick={handleSelectAll}
            >
              {selectedTeams.length === filteredTeams.length ? 'Deselect All' : 'Select All'}
            </CRDButton>
          </div>

          {showFilters && (
            <div className="p-3 bg-crd-darkest rounded-lg space-y-3">
              <div>
                <Label className="text-crd-white text-sm">Filter by Primary Color</Label>
                <Input
                  placeholder="Color hex or name..."
                  value={colorFilter}
                  onChange={(e) => setColorFilter(e.target.value)}
                  className="mt-1 bg-crd-darker border-crd-mediumGray/30 text-crd-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Selection Summary & Action */}
        <div className="flex items-center justify-between p-3 bg-crd-darkest rounded-lg">
          <div>
            <p className="text-crd-white font-medium">
              {selectedTeams.length} of {filteredTeams.length} teams selected
            </p>
            <p className="text-crd-lightGray text-sm">
              Ready for batch customization
            </p>
          </div>
          <CRDButton
            onClick={handleStartCustomization}
            disabled={selectedTeams.length === 0 || !templateData || (currentJob?.status === 'processing')}
          >
            <Play className="w-4 h-4 mr-2" />
            {onSettingsApplied ? 'Apply Settings' : 'Start Customization'}
          </CRDButton>
        </div>

        {/* Job Progress */}
        {currentJob && (
          <div className="space-y-3 p-3 bg-crd-darkest rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-crd-white font-medium">
                  {currentJob.status === 'completed' ? 'Completed' : 'Processing'} Customization
                </p>
                <p className="text-crd-lightGray text-sm">
                  {currentJob.variations.length} of {selectedTeams.length} teams processed
                </p>
              </div>
              <Badge 
                className={
                  currentJob.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  currentJob.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                  currentJob.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400'
                }
              >
                {currentJob.status}
              </Badge>
            </div>

            <Progress value={currentJob.progress} className="w-full" />

            {currentJob.status === 'completed' && (
              <div className="flex gap-2">
                <CRDButton size="sm" variant="outline" onClick={() => handleExport('json')}>
                  <Download className="w-3 h-3 mr-1" />
                  JSON
                </CRDButton>
                <CRDButton size="sm" variant="outline" onClick={() => handleExport('svg')}>
                  <Download className="w-3 h-3 mr-1" />
                  SVG
                </CRDButton>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {renderControlPanel()}

      {/* Teams Grid/List */}
      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardHeader>
          <CardTitle className="text-crd-white">Select Teams</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTeams.length > 0 ? (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                : 'space-y-2'
            }>
              {filteredTeams.map(renderTeamCard)}
            </div>
          ) : (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-crd-mediumGray mx-auto mb-4" />
              <p className="text-crd-lightGray">No teams found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Preview */}
      {currentJob?.variations.length > 0 && (
        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardHeader>
            <CardTitle className="text-crd-white">Generated Variations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {currentJob.variations.map((variation) => (
                <div key={variation.teamId} className="space-y-2">
                  <div className="aspect-[5/7] bg-crd-darkest rounded-lg overflow-hidden border border-crd-mediumGray/30">
                    <div 
                      className="w-full h-full"
                      dangerouslySetInnerHTML={{ __html: variation.svgContent }}
                    />
                  </div>
                  <p className="text-crd-white text-sm text-center truncate">
                    {variation.teamName}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
