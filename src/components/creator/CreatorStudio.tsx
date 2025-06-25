
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Save, 
  Download, 
  Share2, 
  Users, 
  MessageSquare, 
  Layers, 
  Palette,
  Type,
  Square,
  Circle,
  Image,
  Undo2,
  Redo2,
  Play,
  Settings
} from 'lucide-react';
import { useCreatorStudio } from '@/hooks/useCreatorStudio';
import { DesignCanvas } from './studio/DesignCanvas';
import { LayerPanel } from './studio/LayerPanel';
import { ToolPalette } from './studio/ToolPalette';
import { PropertiesPanel } from './studio/PropertiesPanel';
import { CollaborationPanel } from './studio/CollaborationPanel';
import { ExportDialog } from './studio/ExportDialog';
import { toast } from 'sonner';

interface CreatorStudioProps {
  projectId?: string;
  templateId?: string;
}

export const CreatorStudio: React.FC<CreatorStudioProps> = ({ 
  projectId, 
  templateId 
}) => {
  const {
    currentProject,
    selectedLayers,
    activeTool,
    toolProperties,
    isLoading,
    isSaving,
    collaborators,
    comments,
    canUndo,
    canRedo,
    canvasRef,
    createProject,
    loadProject,
    saveProject,
    addLayer,
    updateLayer,
    deleteLayer,
    duplicateLayer,
    reorderLayers,
    setSelectedLayers,
    setActiveTool,
    setToolProperties,
    undo,
    redo,
    exportProject
  } = useCreatorStudio();

  const [showExportDialog, setShowExportDialog] = useState(false);
  const [activePanel, setActivePanel] = useState<'layers' | 'properties' | 'collaboration'>('layers');

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    } else {
      createProject('Untitled Project', templateId);
    }
  }, [projectId, templateId]);

  const handleSave = async () => {
    try {
      await saveProject();
      toast.success('Project saved successfully!');
    } catch (error) {
      toast.error('Failed to save project');
    }
  };

  const handleExport = async (format: 'png' | 'jpg' | 'svg' | 'pdf', quality: number) => {
    try {
      const dataUrl = await exportProject(format, quality);
      if (dataUrl) {
        const link = document.createElement('a');
        link.download = `${currentProject?.title || 'design'}.${format}`;
        link.href = dataUrl;
        link.click();
        toast.success('Project exported successfully!');
      }
    } catch (error) {
      toast.error('Failed to export project');
    }
  };

  const handleAddTextLayer = () => {
    addLayer({
      name: 'Text Layer',
      type: 'text',
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: 'normal',
      position: { x: 50, y: 50 },
      size: { width: 200, height: 40 },
      rotation: 0,
      properties: {
        text: 'Enter text here',
        fontFamily: 'Arial',
        fontSize: 24,
        color: '#000000',
        textAlign: 'left'
      },
      effects: []
    });
  };

  const handleAddImageLayer = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const src = event.target?.result as string;
          addLayer({
            name: 'Image Layer',
            type: 'image',
            visible: true,
            locked: false,
            opacity: 1,
            blendMode: 'normal',
            position: { x: 50, y: 50 },
            size: { width: 200, height: 200 },
            rotation: 0,
            properties: { src },
            effects: []
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleAddShapeLayer = (shapeType: 'rectangle' | 'circle') => {
    addLayer({
      name: `${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} Layer`,
      type: 'shape',
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: 'normal',
      position: { x: 50, y: 50 },
      size: { width: 100, height: 100 },
      rotation: 0,
      properties: {
        shapeType,
        fill: '#3b82f6',
        stroke: '#1e40af',
        strokeWidth: 2
      },
      effects: []
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Loading Creator Studio...</div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Failed to load project</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-white font-semibold">{currentProject.title}</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={!canUndo}
              className="text-white hover:bg-gray-700"
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={!canRedo}
              className="text-white hover:bg-gray-700"
            >
              <Redo2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="text-white hover:bg-gray-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowExportDialog(true)}
            className="text-white hover:bg-gray-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-700"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-700"
          >
            <Play className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Toolbar */}
        <div className="w-16 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 gap-2">
          <ToolPalette
            activeTool={activeTool}
            onToolSelect={setActiveTool}
            onAddText={handleAddTextLayer}
            onAddImage={handleAddImageLayer}
            onAddShape={handleAddShapeLayer}
          />
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 bg-gray-600 flex items-center justify-center p-8">
          <DesignCanvas
            project={currentProject}
            selectedLayers={selectedLayers}
            activeTool={activeTool}
            toolProperties={toolProperties}
            onLayerSelect={setSelectedLayers}
            onLayerUpdate={updateLayer}
            canvasRef={canvasRef}
          />
        </div>

        {/* Right Panels */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <Tabs value={activePanel} onValueChange={(value: any) => setActivePanel(value)} className="flex-1">
            <TabsList className="grid w-full grid-cols-3 bg-gray-700">
              <TabsTrigger value="layers" className="text-white">
                <Layers className="w-4 h-4 mr-2" />
                Layers
              </TabsTrigger>
              <TabsTrigger value="properties" className="text-white">
                <Settings className="w-4 h-4 mr-2" />
                Properties
              </TabsTrigger>
              <TabsTrigger value="collaboration" className="text-white">
                <Users className="w-4 h-4 mr-2" />
                Collaborate
              </TabsTrigger>
            </TabsList>

            <TabsContent value="layers" className="flex-1 p-4">
              <LayerPanel
                layers={currentProject.layers}
                selectedLayers={selectedLayers}
                onLayerSelect={setSelectedLayers}
                onLayerUpdate={updateLayer}
                onLayerDelete={deleteLayer}
                onLayerDuplicate={duplicateLayer}
                onLayersReorder={reorderLayers}
              />
            </TabsContent>

            <TabsContent value="properties" className="flex-1 p-4">
              <PropertiesPanel
                layers={currentProject.layers.filter(l => selectedLayers.includes(l.id))}
                onLayerUpdate={updateLayer}
                toolProperties={toolProperties}
                onToolPropertiesChange={setToolProperties}
              />
            </TabsContent>

            <TabsContent value="collaboration" className="flex-1 p-4">
              <CollaborationPanel
                projectId={currentProject.id}
                collaborators={collaborators}
                comments={comments}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        onExport={handleExport}
      />
    </div>
  );
};
