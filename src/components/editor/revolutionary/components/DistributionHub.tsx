import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Share, QrCode, Download, Globe, 
  MessageSquare, Twitter, Instagram, 
  Video, Code, Smartphone, Monitor 
} from 'lucide-react';
import { InteractiveCardData } from '@/types/interactiveCard';

interface DistributionHubProps {
  cardData: InteractiveCardData;
  onPlatformUpdate: (platform: string, config: any) => void;
}

export const DistributionHub: React.FC<DistributionHubProps> = ({
  cardData,
  onPlatformUpdate
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('discord');
  const [qrCode, setQrCode] = useState<string>('');

  const platforms = [
    {
      id: 'discord',
      name: 'Discord',
      icon: MessageSquare,
      color: '#5865F2',
      features: ['Animated GIFs', 'Embed Cards', 'Bot Integration'],
      limitations: { maxSize: '8MB', format: 'GIF/WebP' }
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: Twitter,
      color: '#1DA1F2',
      features: ['Card Tweets', 'Thread Integration', 'Auto-Preview'],
      limitations: { maxSize: '5MB', format: 'MP4/GIF' }
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: '#E4405F',
      features: ['Story Format', 'Post Format', 'Reels Integration'],
      limitations: { maxSize: '100MB', format: 'MP4/MOV' }
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: Video,
      color: '#000000',
      features: ['Vertical Video', 'Effect Integration', 'Sound Sync'],
      limitations: { maxSize: '287MB', format: 'MP4' }
    },
    {
      id: 'web',
      name: 'Web Embed',
      icon: Globe,
      color: '#10B981',
      features: ['Iframe Embed', 'API Access', 'Custom Domain'],
      limitations: { maxSize: 'Unlimited', format: 'HTML5' }
    },
    {
      id: 'mobile',
      name: 'Mobile App',
      icon: Smartphone,
      color: '#8B5CF6',
      features: ['Native Performance', 'Offline Mode', 'Push Notifications'],
      limitations: { maxSize: '50MB', format: 'Native' }
    }
  ];

  const generateQRCode = () => {
    // Simulate QR code generation
    const qrData = `https://crd.app/card/${cardData.id}`;
    setQrCode(qrData);
  };

  const exportForPlatform = (platformId: string) => {
    // Simulate platform-specific export
    console.log(`Exporting card for ${platformId}:`, cardData);
  };

  const selectedPlatformData = platforms.find(p => p.id === selectedPlatform);

  return (
    <div className="space-y-4">
      <Card className="bg-crd-darker/80 border-crd-mediumGray/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-crd-white text-base flex items-center gap-2">
            <Share className="w-4 h-4" />
            Distribution Hub
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              const isSelected = selectedPlatform === platform.id;
              return (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`p-3 rounded-lg border transition-all text-left ${
                    isSelected
                      ? 'bg-crd-green/10 border-crd-green/50'
                      : 'bg-crd-mediumGray/10 border-crd-mediumGray/30 hover:border-crd-green/30'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon 
                      className="w-4 h-4" 
                      style={{ color: platform.color }} 
                    />
                    <span className="text-crd-white text-sm font-medium">{platform.name}</span>
                  </div>
                  <div className="text-xs text-crd-lightGray">
                    {platform.features.length} features
                  </div>
                </button>
              );
            })}
          </div>

          {selectedPlatformData && (
            <div className="space-y-4">
              <div className="p-3 bg-crd-mediumGray/20 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  {React.createElement(selectedPlatformData.icon, { 
                    className: "w-5 h-5",
                    style: { color: selectedPlatformData.color }
                  })}
                  <span className="text-crd-white font-medium">{selectedPlatformData.name}</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-crd-white text-sm font-medium mb-2">Features</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedPlatformData.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-crd-white text-sm font-medium mb-2">Limitations</h4>
                    <div className="text-xs text-crd-lightGray space-y-1">
                      <div>Max size: {selectedPlatformData.limitations.maxSize}</div>
                      <div>Format: {selectedPlatformData.limitations.format}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {selectedPlatform === 'discord' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-crd-white text-sm">Enable Animation</Label>
                          <Switch
                            checked={cardData.platform_optimizations.discord.animated}
                            onCheckedChange={(checked) => 
                              onPlatformUpdate('discord', { ...cardData.platform_optimizations.discord, animated: checked })
                            }
                          />
                        </div>
                        <div>
                          <Label className="text-crd-lightGray text-sm">Size Limit (MB)</Label>
                          <Input
                            type="number"
                            value={cardData.platform_optimizations.discord.size_limit}
                            onChange={(e) => 
                              onPlatformUpdate('discord', { ...cardData.platform_optimizations.discord, size_limit: Number(e.target.value) })
                            }
                            max={8}
                            min={1}
                            className="bg-crd-darkest/80 border-crd-mediumGray/40 text-crd-white mt-1"
                          />
                        </div>
                      </div>
                    )}

                    {selectedPlatform === 'tiktok' && (
                      <div className="flex items-center justify-between">
                        <Label className="text-crd-white text-sm">Enable Effects</Label>
                        <Switch
                          checked={cardData.platform_optimizations.tiktok.effects_enabled}
                          onCheckedChange={(checked) => 
                            onPlatformUpdate('tiktok', { ...cardData.platform_optimizations.tiktok, effects_enabled: checked })
                          }
                        />
                      </div>
                    )}
                  </div>

                  <CRDButton
                    onClick={() => exportForPlatform(selectedPlatform)}
                    variant="primary"
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export for {selectedPlatformData.name}
                  </CRDButton>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-crd-mediumGray/30 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-crd-white text-sm font-medium flex items-center gap-2">
                <QrCode className="w-4 h-4" />
                QR Code Integration
              </h4>
              <CRDButton onClick={generateQRCode} variant="secondary" size="sm">
                Generate QR
              </CRDButton>
            </div>

            {qrCode && (
              <div className="p-3 bg-crd-mediumGray/20 rounded-lg">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-32 h-32 bg-white rounded flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-black" />
                  </div>
                </div>
                <div className="text-xs text-crd-lightGray text-center font-mono">
                  {qrCode}
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-crd-blue/10 border border-crd-blue/30 rounded-lg">
            <h4 className="text-crd-white text-sm font-medium mb-2">API Integration</h4>
            <div className="space-y-1 text-xs text-crd-lightGray">
              <div>• REST API for card embedding</div>
              <div>• Webhook support for real-time updates</div>
              <div>• Custom domain hosting</div>
              <div>• Analytics and performance tracking</div>
            </div>
            <CRDButton variant="secondary" size="sm" className="w-full mt-2">
              <Code className="w-4 h-4 mr-2" />
              View API Docs
            </CRDButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};