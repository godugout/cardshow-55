import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, Image, Video, Music, Box, 
  Download, Scissors, Wand2, Link 
} from 'lucide-react';
import { InteractiveCardData } from '@/types/interactiveCard';
import { UniversalUploadComponent } from '@/components/media/UniversalUploadComponent';

interface MediaImportHubProps {
  assets: InteractiveCardData['assets'];
  onAssetsUpdate: (assets: InteractiveCardData['assets']) => void;
}

export const MediaImportHub: React.FC<MediaImportHubProps> = ({
  assets,
  onAssetsUpdate
}) => {
  const [processingFiles, setProcessingFiles] = useState<string[]>([]);
  const [importSource, setImportSource] = useState<'upload' | 'url' | 'tiktok' | 'ai'>('upload');

  const handleFilesSelected = useCallback(async (files: File[]) => {
    const newAssets = { ...assets };

    for (const file of files) {
      setProcessingFiles(prev => [...prev, file.name]);
      
      try {
        const url = URL.createObjectURL(file);
        const assetId = `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        if (file.type.startsWith('image/')) {
          newAssets.images.push({
            id: assetId,
            url,
            type: 'layer'
          });
        } else if (file.type.startsWith('video/')) {
          newAssets.videos.push({
            id: assetId,
            url,
            type: 'background'
          });
        } else if (file.type.startsWith('audio/')) {
          newAssets.audio.push({
            id: assetId,
            url,
            type: 'effect'
          });
        } else if (file.name.endsWith('.gltf') || file.name.endsWith('.glb')) {
          newAssets.models_3d.push({
            id: assetId,
            url,
            format: 'gltf'
          });
        }
      } catch (error) {
        console.error('Error processing file:', error);
      } finally {
        setProcessingFiles(prev => prev.filter(name => name !== file.name));
      }
    }

    onAssetsUpdate(newAssets);
  }, [assets, onAssetsUpdate]);

  const removeAsset = (assetType: keyof InteractiveCardData['assets'], assetId: string) => {
    const newAssets = { ...assets };
    (newAssets[assetType] as any[]) = (newAssets[assetType] as any[]).filter((asset: any) => asset.id !== assetId);
    onAssetsUpdate(newAssets);
  };

  const totalAssets = assets.images.length + assets.videos.length + assets.audio.length + assets.models_3d.length;

  return (
    <div className="space-y-4">
      <Card className="bg-crd-darker/80 border-crd-mediumGray/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-crd-white text-base flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Media Import Hub
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={importSource} onValueChange={(value: any) => setImportSource(value)}>
            <TabsList className="grid grid-cols-4 w-full bg-crd-mediumGray/20 p-1">
              <TabsTrigger value="upload" className="text-xs">Upload</TabsTrigger>
              <TabsTrigger value="url" className="text-xs">URL</TabsTrigger>
              <TabsTrigger value="tiktok" className="text-xs">TikTok</TabsTrigger>
              <TabsTrigger value="ai" className="text-xs">AI Gen</TabsTrigger>
            </TabsList>

            <div className="mt-4">
              <TabsContent value="upload" className="mt-0">
                <div className="p-4 border border-dashed border-crd-mediumGray/40 rounded-lg text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-crd-lightGray" />
                  <p className="text-crd-lightGray text-sm">Upload Component Removed</p>
                  <p className="text-xs text-crd-lightGray opacity-75">Upload functionality has been disabled</p>
                </div>
              </TabsContent>

              <TabsContent value="url" className="mt-0">
                <div className="space-y-4">
                  <div className="p-4 border border-dashed border-crd-mediumGray/40 rounded-lg text-center">
                    <Link className="w-8 h-8 mx-auto mb-2 text-crd-lightGray" />
                    <p className="text-crd-lightGray text-sm">Import from URL</p>
                    <p className="text-xs text-crd-lightGray opacity-75">Coming soon</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tiktok" className="mt-0">
                <div className="space-y-4">
                  <div className="p-4 border border-dashed border-crd-mediumGray/40 rounded-lg text-center">
                    <Video className="w-8 h-8 mx-auto mb-2 text-crd-lightGray" />
                    <p className="text-crd-lightGray text-sm">Import from TikTok</p>
                    <p className="text-xs text-crd-lightGray opacity-75">Paste TikTok URL to extract video</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ai" className="mt-0">
                <div className="space-y-4">
                  <div className="p-4 border border-dashed border-crd-mediumGray/40 rounded-lg text-center">
                    <Wand2 className="w-8 h-8 mx-auto mb-2 text-crd-lightGray" />
                    <p className="text-crd-lightGray text-sm">AI Generation</p>
                    <p className="text-xs text-crd-lightGray opacity-75">Generate images with AI</p>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {totalAssets > 0 && (
        <Card className="bg-crd-darker/80 border-crd-mediumGray/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-crd-white text-base">
              Assets Library ({totalAssets})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="images">
              <TabsList className="grid grid-cols-4 w-full bg-crd-mediumGray/20 p-1">
                <TabsTrigger value="images" className="text-xs">
                  Images ({assets.images.length})
                </TabsTrigger>
                <TabsTrigger value="videos" className="text-xs">
                  Videos ({assets.videos.length})
                </TabsTrigger>
                <TabsTrigger value="audio" className="text-xs">
                  Audio ({assets.audio.length})
                </TabsTrigger>
                <TabsTrigger value="models" className="text-xs">
                  3D ({assets.models_3d.length})
                </TabsTrigger>
              </TabsList>

              <div className="mt-4">
                <TabsContent value="images" className="mt-0">
                  <div className="grid grid-cols-2 gap-2">
                    {assets.images.map((image) => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-square bg-crd-mediumGray/20 rounded-lg overflow-hidden">
                          <img
                            src={image.url}
                            alt="Asset"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          onClick={() => removeAsset('images', image.id)}
                          className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                          {image.type}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="videos" className="mt-0">
                  <div className="space-y-2">
                    {assets.videos.map((video) => (
                      <div key={video.id} className="flex items-center justify-between p-2 bg-crd-mediumGray/20 rounded">
                        <div className="flex items-center gap-2">
                          <Video className="w-4 h-4 text-crd-lightGray" />
                          <span className="text-crd-white text-sm">Video Asset</span>
                          <span className="text-xs text-crd-lightGray bg-crd-mediumGray/30 px-2 py-1 rounded">
                            {video.type}
                          </span>
                        </div>
                        <button
                          onClick={() => removeAsset('videos', video.id)}
                          className="text-crd-lightGray hover:text-crd-red"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="audio" className="mt-0">
                  <div className="space-y-2">
                    {assets.audio.map((audio) => (
                      <div key={audio.id} className="flex items-center justify-between p-2 bg-crd-mediumGray/20 rounded">
                        <div className="flex items-center gap-2">
                          <Music className="w-4 h-4 text-crd-lightGray" />
                          <span className="text-crd-white text-sm">Audio Asset</span>
                          <span className="text-xs text-crd-lightGray bg-crd-mediumGray/30 px-2 py-1 rounded">
                            {audio.type}
                          </span>
                        </div>
                        <button
                          onClick={() => removeAsset('audio', audio.id)}
                          className="text-crd-lightGray hover:text-crd-red"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="models" className="mt-0">
                  <div className="space-y-2">
                    {assets.models_3d.map((model) => (
                      <div key={model.id} className="flex items-center justify-between p-2 bg-crd-mediumGray/20 rounded">
                        <div className="flex items-center gap-2">
                          <Box className="w-4 h-4 text-crd-lightGray" />
                          <span className="text-crd-white text-sm">3D Model</span>
                          <span className="text-xs text-crd-lightGray bg-crd-mediumGray/30 px-2 py-1 rounded">
                            {model.format}
                          </span>
                        </div>
                        <button
                          onClick={() => removeAsset('models_3d', model.id)}
                          className="text-crd-lightGray hover:text-crd-red"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {processingFiles.length > 0 && (
        <Card className="bg-crd-green/10 border-crd-green/30">
          <CardContent className="pt-4">
            <div className="space-y-2">
              <p className="text-crd-white text-sm font-medium">Processing files...</p>
              {processingFiles.map((fileName) => (
                <div key={fileName} className="text-crd-lightGray text-xs">
                  • {fileName}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};