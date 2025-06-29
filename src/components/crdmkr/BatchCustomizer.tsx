
import React, { useState } from 'react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Download, Play } from 'lucide-react';

interface BatchCustomizerProps {
  templateData: any;
}

export const BatchCustomizer: React.FC<BatchCustomizerProps> = ({
  templateData
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedCount, setGeneratedCount] = useState(0);

  const teams = [
    { id: 'lakers', name: 'Los Angeles Lakers', selected: true },
    { id: 'warriors', name: 'Golden State Warriors', selected: true },
    { id: 'celtics', name: 'Boston Celtics', selected: false },
    { id: 'bulls', name: 'Chicago Bulls', selected: true }
  ];

  const handleStartBatch = async () => {
    setIsProcessing(true);
    setProgress(0);
    setGeneratedCount(0);

    const selectedTeams = teams.filter(t => t.selected);
    const total = selectedTeams.length;

    for (let i = 0; i < total; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(((i + 1) / total) * 100);
      setGeneratedCount(i + 1);
    }

    setIsProcessing(false);
  };

  return (
    <div className="h-full space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-crd-white">Batch Customizer</h3>
        <div className="text-sm text-crd-lightGray">
          {teams.filter(t => t.selected).length} teams selected
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Selection */}
        <Card className="bg-crd-darker border-crd-mediumGray/30">
          <CardHeader>
            <CardTitle className="text-crd-white">Select Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {teams.map((team) => (
                <label key={team.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={team.selected}
                    onChange={() => {
                      // Handle team selection
                    }}
                    className="w-4 h-4 text-crd-green bg-crd-mediumGray/20 border-crd-mediumGray/30 rounded focus:ring-crd-green"
                  />
                  <span className="text-crd-white">{team.name}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card className="bg-crd-darker border-crd-mediumGray/30">
          <CardHeader>
            <CardTitle className="text-crd-white">Generation Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isProcessing ? (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-crd-lightGray">Generating templates...</span>
                  <span className="text-crd-white">{generatedCount}/{teams.filter(t => t.selected).length}</span>
                </div>
                <Progress value={progress} className="w-full" />
              </>
            ) : (
              <div className="text-center py-4">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-crd-mediumGray" />
                <p className="text-crd-lightGray mb-4">
                  Ready to generate {teams.filter(t => t.selected).length} team variations
                </p>
                <CRDButton onClick={handleStartBatch} variant="primary">
                  <Play className="w-4 h-4 mr-2" />
                  Start Batch Generation
                </CRDButton>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {generatedCount > 0 && (
        <Card className="bg-crd-darker border-crd-mediumGray/30">
          <CardHeader>
            <CardTitle className="text-crd-white">Generated Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {teams.filter(t => t.selected).slice(0, generatedCount).map((team) => (
                <div key={team.id} className="bg-crd-mediumGray/10 rounded-lg p-4 text-center">
                  <div className="w-full h-24 bg-crd-mediumGray/20 rounded mb-2"></div>
                  <p className="text-crd-white text-sm">{team.name}</p>
                  <CRDButton size="sm" variant="outline" className="mt-2">
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </CRDButton>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
