
import React, { useState } from 'react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Users, Palette } from 'lucide-react';

interface TeamAssetManagerProps {
  selectedTeamId: string;
  onTeamSelect: (teamId: string) => void;
}

export const TeamAssetManager: React.FC<TeamAssetManagerProps> = ({
  selectedTeamId,
  onTeamSelect
}) => {
  const [teams] = useState([
    { id: 'lakers', name: 'Los Angeles Lakers', colors: ['#552583', '#FDB927'] },
    { id: 'warriors', name: 'Golden State Warriors', colors: ['#1D428A', '#FFC72C'] },
    { id: 'celtics', name: 'Boston Celtics', colors: ['#007A33', '#BA9653'] },
    { id: 'bulls', name: 'Chicago Bulls', colors: ['#CE1141', '#000000'] }
  ]);

  return (
    <div className="h-full space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-crd-white">Team Asset Manager</h3>
        <CRDButton variant="outline" size="sm">
          <Upload className="w-4 h-4 mr-2" />
          Upload Assets
        </CRDButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <Card 
            key={team.id}
            className={`cursor-pointer transition-all ${
              selectedTeamId === team.id 
                ? 'bg-crd-green/20 border-crd-green' 
                : 'bg-crd-darker border-crd-mediumGray/30 hover:border-crd-mediumGray/50'
            }`}
            onClick={() => onTeamSelect(team.id)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-crd-white text-sm flex items-center gap-2">
                <Users className="w-4 h-4" />
                {team.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <Palette className="w-4 h-4 text-crd-lightGray" />
                <span className="text-crd-lightGray text-xs">Team Colors</span>
              </div>
              <div className="flex gap-2">
                {team.colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border border-crd-mediumGray/30"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTeamId && (
        <Card className="bg-crd-darker border-crd-mediumGray/30">
          <CardHeader>
            <CardTitle className="text-crd-white">
              {teams.find(t => t.id === selectedTeamId)?.name} Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-crd-lightGray py-8">
              <Upload className="w-12 h-12 mx-auto mb-4 text-crd-mediumGray" />
              <p>Upload team logos, fonts, and other assets to customize templates.</p>
              <CRDButton variant="outline" className="mt-4">
                <Upload className="w-4 h-4 mr-2" />
                Upload Assets
              </CRDButton>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
