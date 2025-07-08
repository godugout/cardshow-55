import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TestTube, Play, Smartphone, Tablet, Monitor, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { InteractiveCardData, CardTestScenario } from '@/types/interactiveCard';

interface TestingArenaProps {
  cardData: InteractiveCardData;
  onRunTest: (results: any) => void;
}

export const TestingArena: React.FC<TestingArenaProps> = ({
  cardData,
  onRunTest
}) => {
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const testScenarios: CardTestScenario[] = [
    {
      id: 'mobile_interaction',
      name: 'Mobile Interaction Test',
      description: 'Test tap, swipe, and touch gestures on mobile devices',
      environment: {
        device_type: 'mobile',
        weather: 'clear',
        time_of_day: 'afternoon'
      },
      expected_outcomes: [
        { trigger: 'tap', expected_action: 'state_change', success_criteria: 'Visual feedback within 100ms' },
        { trigger: 'swipe', expected_action: 'animation', success_criteria: 'Smooth transition' }
      ]
    },
    {
      id: 'weather_response',
      name: 'Weather Response Test',
      description: 'Test environmental weather reactions',
      environment: {
        device_type: 'desktop',
        weather: 'rain',
        time_of_day: 'evening'
      },
      expected_outcomes: [
        { trigger: 'weather_rain', expected_action: 'particle_effect', success_criteria: 'Rain particles appear' }
      ]
    },
    {
      id: 'biometric_simulation',
      name: 'Biometric Simulation',
      description: 'Simulate biometric data changes',
      environment: {
        device_type: 'mobile',
        weather: 'clear',
        time_of_day: 'morning',
        user_biometrics: {
          heartbeat: 75,
          stress_level: 30
        }
      },
      expected_outcomes: [
        { trigger: 'heartbeat', expected_action: 'glow_effect', success_criteria: 'Sync with heart rate' }
      ]
    },
    {
      id: 'performance_stress',
      name: 'Performance Stress Test',
      description: 'Test card performance under load',
      environment: {
        device_type: 'mobile',
        weather: 'storm',
        time_of_day: 'night'
      },
      expected_outcomes: [
        { trigger: 'multiple_effects', expected_action: 'maintain_fps', success_criteria: '60fps maintained' }
      ]
    }
  ];

  const deviceIcons = {
    mobile: Smartphone,
    tablet: Tablet,
    desktop: Monitor
  };

  const runTest = async (scenarioId: string) => {
    setIsRunning(true);
    const scenario = testScenarios.find(s => s.id === scenarioId);
    if (!scenario) return;

    // Simulate test execution
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockResults = scenario.expected_outcomes.map((outcome, idx) => ({
      id: `result_${idx}`,
      test: outcome.expected_action,
      status: Math.random() > 0.3 ? 'passed' : Math.random() > 0.5 ? 'failed' : 'warning',
      message: Math.random() > 0.3 
        ? 'Test completed successfully'
        : 'Performance below expected threshold',
      duration: Math.floor(Math.random() * 500) + 50
    }));

    setTestResults(mockResults);
    onRunTest(mockResults);
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-crd-green" />;
      case 'failed': return <XCircle className="w-4 h-4 text-crd-red" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-crd-orange" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-crd-darker/80 border-crd-mediumGray/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-crd-white text-base flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            Testing Arena
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-crd-lightGray text-sm mb-2 block">Select Test Scenario</label>
            <Select value={selectedScenario} onValueChange={setSelectedScenario}>
              <SelectTrigger className="bg-crd-darkest/80 border-crd-mediumGray/40 text-crd-white">
                <SelectValue placeholder="Choose a test scenario..." />
              </SelectTrigger>
              <SelectContent className="bg-crd-darker border-crd-mediumGray/40">
                {testScenarios.map((scenario) => (
                  <SelectItem key={scenario.id} value={scenario.id}>
                    <div className="flex items-center gap-2">
                      {React.createElement(deviceIcons[scenario.environment.device_type], { 
                        className: "w-4 h-4" 
                      })}
                      <span>{scenario.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedScenario && (
            <div className="space-y-3">
              {(() => {
                const scenario = testScenarios.find(s => s.id === selectedScenario);
                if (!scenario) return null;
                
                const DeviceIcon = deviceIcons[scenario.environment.device_type];
                return (
                  <div className="p-3 bg-crd-mediumGray/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DeviceIcon className="w-4 h-4 text-crd-green" />
                      <span className="text-crd-white font-medium text-sm">{scenario.name}</span>
                    </div>
                    <p className="text-crd-lightGray text-xs mb-3">{scenario.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {scenario.environment.device_type}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {scenario.environment.weather}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {scenario.environment.time_of_day}
                      </Badge>
                    </div>

                    <div className="text-xs text-crd-lightGray">
                      <strong>Expected outcomes:</strong>
                      <ul className="mt-1 space-y-1">
                        {scenario.expected_outcomes.map((outcome, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span>•</span>
                            <span>{outcome.success_criteria}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })()}

              <CRDButton
                onClick={() => runTest(selectedScenario)}
                disabled={isRunning}
                variant="primary"
                className="w-full"
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? 'Running Test...' : 'Run Test'}
              </CRDButton>
            </div>
          )}

          {testResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-crd-white text-sm font-medium">Test Results</h4>
              {testResults.map((result) => (
                <div key={result.id} className="flex items-center justify-between p-2 bg-crd-mediumGray/20 rounded">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    <span className="text-crd-white text-sm">{result.test}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-crd-lightGray">{result.duration}ms</div>
                    <div className="text-xs text-crd-lightGray">{result.message}</div>
                  </div>
                </div>
              ))}
              
              <div className="mt-3 p-2 bg-crd-green/10 border border-crd-green/30 rounded">
                <div className="text-xs text-crd-lightGray">
                  Overall: {testResults.filter(r => r.status === 'passed').length}/{testResults.length} tests passed
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};