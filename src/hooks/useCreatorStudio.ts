
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import type { DesignProject, DesignLayer, CanvasSettings, DesignTool, ToolProperties } from '@/types/creator';

export const useCreatorStudio = (projectId?: string) => {
  const { user } = useAuth();
  const [currentProject, setCurrentProject] = useState<DesignProject | null>(null);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [activeTool, setActiveTool] = useState<DesignTool | null>(null);
  const [toolProperties, setToolProperties] = useState<ToolProperties>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [history, setHistory] = useState<DesignProject[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const createProject = useCallback(async (title: string, templateId?: string) => {
    if (!user) throw new Error('User not authenticated');

    setIsLoading(true);
    try {
      const newProject: DesignProject = {
        id: crypto.randomUUID(),
        creatorId: user.id,
        title,
        description: '',
        templateId,
        layers: [],
        canvas: {
          width: 320,
          height: 448,
          backgroundColor: '#ffffff',
          dpi: 300,
          format: 'card'
        },
        version: 1,
        status: 'draft',
        collaborators: [],
        lastModified: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        metadata: {
          category: 'trading-card',
          tags: [],
          difficulty: 'beginner',
          estimatedTime: 30
        }
      };

      // If template is provided, load template layers
      if (templateId) {
        const { data: template } = await supabase
          .from('creator_templates')
          .select('*')
          .eq('id', templateId)
          .single();
        
        if (template) {
          newProject.layers = (template.layers as DesignLayer[]) || [];
          newProject.canvas = (template.canvas as CanvasSettings) || newProject.canvas;
        }
      }

      setCurrentProject(newProject);
      addToHistory(newProject);
      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const loadProject = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const { data: project, error } = await supabase
        .from('design_projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Type cast the project data
      const typedProject: DesignProject = {
        id: project.id,
        creatorId: project.creator_id,
        title: project.title,
        description: project.description || '',
        templateId: project.template_id,
        layers: (project.layers as DesignLayer[]) || [],
        canvas: (project.canvas as CanvasSettings) || {
          width: 320,
          height: 448,
          backgroundColor: '#ffffff',
          dpi: 300,
          format: 'card'
        },
        version: project.version,
        status: project.status as 'draft' | 'published' | 'archived',
        collaborators: (project.collaborators as any[]) || [],
        lastModified: project.last_modified,
        createdAt: project.created_at,
        metadata: (project.metadata as any) || {
          category: 'trading-card',
          tags: [],
          difficulty: 'beginner',
          estimatedTime: 30
        }
      };

      setCurrentProject(typedProject);
      addToHistory(typedProject);
      
      // Load collaborators and comments
      loadCollaborators(id);
      loadComments(id);
      
      return typedProject;
    } catch (error) {
      console.error('Error loading project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveProject = useCallback(async () => {
    if (!currentProject || !user) return;

    setIsSaving(true);
    try {
      const updatedProject = {
        ...currentProject,
        lastModified: new Date().toISOString(),
        version: currentProject.version + 1
      };

      const { error } = await supabase
        .from('design_projects')
        .upsert({
          id: updatedProject.id,
          creator_id: updatedProject.creatorId,
          title: updatedProject.title,
          description: updatedProject.description,
          template_id: updatedProject.templateId,
          layers: updatedProject.layers,
          canvas: updatedProject.canvas,
          version: updatedProject.version,
          status: updatedProject.status,
          collaborators: updatedProject.collaborators,
          last_modified: updatedProject.lastModified,
          created_at: updatedProject.createdAt,
          metadata: updatedProject.metadata
        });

      if (error) throw error;

      setCurrentProject(updatedProject);
      console.log('Project saved successfully');
    } catch (error) {
      console.error('Error saving project:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [currentProject, user]);

  const addLayer = useCallback((layer: Omit<DesignLayer, 'id' | 'zIndex'>) => {
    if (!currentProject) return;

    const newLayer: DesignLayer = {
      ...layer,
      id: crypto.randomUUID(),
      zIndex: currentProject.layers.length
    };

    const updatedProject = {
      ...currentProject,
      layers: [...currentProject.layers, newLayer]
    };

    setCurrentProject(updatedProject);
    addToHistory(updatedProject);
    setSelectedLayers([newLayer.id]);
  }, [currentProject]);

  const updateLayer = useCallback((layerId: string, updates: Partial<DesignLayer>) => {
    if (!currentProject) return;

    const updatedProject = {
      ...currentProject,
      layers: currentProject.layers.map(layer =>
        layer.id === layerId ? { ...layer, ...updates } : layer
      )
    };

    setCurrentProject(updatedProject);
    addToHistory(updatedProject);
  }, [currentProject]);

  const deleteLayer = useCallback((layerId: string) => {
    if (!currentProject) return;

    const updatedProject = {
      ...currentProject,
      layers: currentProject.layers.filter(layer => layer.id !== layerId)
    };

    setCurrentProject(updatedProject);
    addToHistory(updatedProject);
    setSelectedLayers(prev => prev.filter(id => id !== layerId));
  }, [currentProject]);

  const duplicateLayer = useCallback((layerId: string) => {
    if (!currentProject) return;

    const layerToDuplicate = currentProject.layers.find(l => l.id === layerId);
    if (!layerToDuplicate) return;

    const duplicatedLayer: DesignLayer = {
      ...layerToDuplicate,
      id: crypto.randomUUID(),
      name: `${layerToDuplicate.name} Copy`,
      position: {
        x: layerToDuplicate.position.x + 10,
        y: layerToDuplicate.position.y + 10
      },
      zIndex: currentProject.layers.length
    };

    const updatedProject = {
      ...currentProject,
      layers: [...currentProject.layers, duplicatedLayer]
    };

    setCurrentProject(updatedProject);
    addToHistory(updatedProject);
  }, [currentProject]);

  const reorderLayers = useCallback((layerIds: string[]) => {
    if (!currentProject) return;

    const reorderedLayers = layerIds.map((id, index) => {
      const layer = currentProject.layers.find(l => l.id === id);
      return layer ? { ...layer, zIndex: index } : null;
    }).filter(Boolean) as DesignLayer[];

    const updatedProject = {
      ...currentProject,
      layers: reorderedLayers
    };

    setCurrentProject(updatedProject);
    addToHistory(updatedProject);
  }, [currentProject]);

  const addToHistory = useCallback((project: DesignProject) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(project);
      // Keep only last 50 states
      if (newHistory.length > 50) {
        newHistory.shift();
      }
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentProject(history[newIndex]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentProject(history[newIndex]);
    }
  }, [history, historyIndex]);

  const loadCollaborators = useCallback(async (projectId: string) => {
    try {
      const { data } = await supabase
        .from('project_collaborators')
        .select('*')
        .eq('project_id', projectId);
      
      setCollaborators(data || []);
    } catch (error) {
      console.error('Error loading collaborators:', error);
    }
  }, []);

  const loadComments = useCallback(async (projectId: string) => {
    try {
      const { data } = await supabase
        .from('collaboration_comments')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });
      
      setComments(data || []);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  }, []);

  // Helper function to map blend modes to Canvas API compatible values
  const getCanvasBlendMode = (blendMode: string): GlobalCompositeOperation => {
    const blendModeMap: Record<string, GlobalCompositeOperation> = {
      'normal': 'source-over',
      'multiply': 'multiply',
      'screen': 'screen',
      'overlay': 'overlay',
      'soft-light': 'soft-light',
      'hard-light': 'hard-light',
      'color-dodge': 'color-dodge',
      'color-burn': 'color-burn',
      'darken': 'darken',
      'lighten': 'lighten'
    };
    return blendModeMap[blendMode] || 'source-over';
  };

  // Helper function to map text align to Canvas API compatible values
  const getCanvasTextAlign = (textAlign: string): CanvasTextAlign => {
    const textAlignMap: Record<string, CanvasTextAlign> = {
      'left': 'left',
      'center': 'center',
      'right': 'right',
      'justify': 'left' // Canvas doesn't support justify, fallback to left
    };
    return textAlignMap[textAlign] || 'left';
  };

  const exportProject = useCallback(async (format: 'png' | 'jpg' | 'svg' | 'pdf', quality: number = 1) => {
    if (!currentProject || !canvasRef.current) return null;

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Set canvas size
      canvas.width = currentProject.canvas.width;
      canvas.height = currentProject.canvas.height;

      // Render all layers
      for (const layer of currentProject.layers.sort((a, b) => a.zIndex - b.zIndex)) {
        if (!layer.visible) continue;
        
        ctx.save();
        ctx.globalAlpha = layer.opacity;
        ctx.globalCompositeOperation = getCanvasBlendMode(layer.blendMode);
        
        // Apply transformations
        ctx.translate(layer.position.x + layer.size.width / 2, layer.position.y + layer.size.height / 2);
        ctx.rotate((layer.rotation * Math.PI) / 180);
        ctx.translate(-layer.size.width / 2, -layer.size.height / 2);

        // Render based on layer type
        switch (layer.type) {
          case 'image':
            if (layer.properties.src) {
              const img = new Image();
              img.src = layer.properties.src;
              await new Promise(resolve => {
                img.onload = () => {
                  ctx.drawImage(img, 0, 0, layer.size.width, layer.size.height);
                  resolve(null);
                };
              });
            }
            break;
          case 'text':
            if (layer.properties.text) {
              ctx.font = `${layer.properties.fontWeight || 'normal'} ${layer.properties.fontSize || 16}px ${layer.properties.fontFamily || 'Arial'}`;
              ctx.fillStyle = layer.properties.color || '#000000';
              ctx.textAlign = getCanvasTextAlign(layer.properties.textAlign || 'left');
              ctx.fillText(layer.properties.text, 0, layer.properties.fontSize || 16);
            }
            break;
          case 'shape':
            ctx.fillStyle = layer.properties.fill || '#000000';
            ctx.strokeStyle = layer.properties.stroke || '#000000';
            ctx.lineWidth = layer.properties.strokeWidth || 1;
            
            if (layer.properties.shapeType === 'rectangle') {
              if (layer.properties.fill) ctx.fillRect(0, 0, layer.size.width, layer.size.height);
              if (layer.properties.stroke) ctx.strokeRect(0, 0, layer.size.width, layer.size.height);
            } else if (layer.properties.shapeType === 'circle') {
              ctx.beginPath();
              ctx.arc(layer.size.width / 2, layer.size.height / 2, Math.min(layer.size.width, layer.size.height) / 2, 0, 2 * Math.PI);
              if (layer.properties.fill) ctx.fill();
              if (layer.properties.stroke) ctx.stroke();
            }
            break;
        }
        
        ctx.restore();
      }

      // Export canvas
      return canvas.toDataURL(`image/${format === 'jpg' ? 'jpeg' : format}`, quality);
    } catch (error) {
      console.error('Error exporting project:', error);
      return null;
    }
  }, [currentProject]);

  return {
    // State
    currentProject,
    selectedLayers,
    activeTool,
    toolProperties,
    isLoading,
    isSaving,
    collaborators,
    comments,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    canvasRef,

    // Actions
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
  };
};
