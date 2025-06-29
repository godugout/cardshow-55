
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas as FabricCanvas, Rect, Circle, FabricImage, IText } from 'fabric';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Eye, 
  EyeOff, 
  Code, 
  Palette,
  Type,
  Square,
  Circle as CircleIcon,
  Image as ImageIcon,
  Download,
  Copy,
  Refresh
} from 'lucide-react';
import { fabricToSVGConverter } from '@/lib/crdmkr/fabricToSVG';
import { templateParameterizer } from '@/lib/crdmkr/templateParameterizer';
import type { DetectedRegion } from '@/types/crdmkr';
import { toast } from 'sonner';

interface HybridTemplateEditorProps {
  imageUrl?: string;
  detectedRegions: DetectedRegion[];
  onTemplateGenerated?: (templateData: any) => void;
}

export const HybridTemplateEditor = ({ 
  imageUrl, 
  detectedRegions, 
  onTemplateGenerated 
}: HybridTemplateEditorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [selectedTool, setSelectedTool] = useState<'select' | 'rect' | 'circle' | 'text'>('select');
  const [generatedSVG, setGeneratedSVG] = useState<string>('');
  const [generatedCSS, setGeneratedCSS] = useState<string>('');
  const [generatedComponent, setGeneratedComponent] = useState<string>('');
  const [parameters, setParameters] = useState<any>({});
  const [parameterValues, setParameterValues] = useState<Record<string, any>>({});
  const [showPreview, setShowPreview] = useState(true);
  const [componentName, setComponentName] = useState('CustomCardTemplate');

  // Initialize fabric canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 350,
      height: 490,
      backgroundColor: '#f8f9fa',
      selection: true,
      preserveObjectStacking: true,
    });

    setFabricCanvas(canvas);

    // Handle object selection
    canvas.on('selection:created', handleObjectSelection);
    canvas.on('selection:updated', handleObjectSelection);
    canvas.on('selection:cleared', () => setParameters({}));

    // Handle object modifications
    canvas.on('object:modified', handleCanvasChange);
    canvas.on('object:added', handleCanvasChange);
    canvas.on('object:removed', handleCanvasChange);

    return () => {
      canvas.dispose();
    };
  }, []);

  // Load background image
  useEffect(() => {
    if (!fabricCanvas || !imageUrl) return;

    FabricImage.fromURL(imageUrl, {
      crossOrigin: 'anonymous'
    }).then((img) => {
      const scale = Math.min(
        fabricCanvas.width! / img.width!,
        fabricCanvas.height! / img.height!
      );
      
      img.scale(scale);
      img.set({
        left: 0,
        top: 0,
        selectable: false,
        evented: false,
        data: { isBackground: true }
      });

      fabricCanvas.clear();
      fabricCanvas.add(img);
      fabricCanvas.sendObjectToBack(img);
      fabricCanvas.renderAll();
    });
  }, [fabricCanvas, imageUrl]);

  const handleObjectSelection = useCallback((e: any) => {
    const activeObject = e.target;
    if (activeObject && !activeObject.data?.isBackground) {
      const objectParams = templateParameterizer.generateParameters(
        fabricCanvas!,
        detectedRegions
      );
      setParameters(objectParams);
    }
  }, [fabricCanvas, detectedRegions]);

  const handleCanvasChange = useCallback(() => {
    if (!fabricCanvas) return;
    
    // Debounce the regeneration
    setTimeout(() => {
      regenerateTemplate();
    }, 300);
  }, [fabricCanvas]);

  const regenerateTemplate = useCallback(async () => {
    if (!fabricCanvas) return;

    try {
      // Generate SVG
      const svgOutput = await fabricToSVGConverter.convertCanvasToSVG(fabricCanvas, {
        includeParameterPlaceholders: true,
        optimized: true
      });
      setGeneratedSVG(svgOutput);

      // Generate CSS
      const cssOutput = fabricToSVGConverter.generateCSSCustomProperties(fabricCanvas);
      setGeneratedCSS(cssOutput);

      // Generate React component
      const componentOutput = fabricToSVGConverter.generateReactComponent(
        fabricCanvas,
        componentName
      );
      setGeneratedComponent(componentOutput);

      // Generate parameters
      const templateParams = templateParameterizer.generateParameters(
        fabricCanvas,
        detectedRegions
      );
      setParameters(templateParams);

      // Initialize parameter values
      const initialValues: Record<string, any> = {};
      templateParams.parameters.forEach(param => {
        initialValues[param.id] = param.defaultValue;
      });
      setParameterValues(initialValues);

    } catch (error) {
      console.error('Template generation failed:', error);
      toast.error('Failed to generate template');
    }
  }, [fabricCanvas, componentName, detectedRegions]);

  const handleToolClick = (tool: typeof selectedTool) => {
    setSelectedTool(tool);

    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = false;
    fabricCanvas.selection = tool === 'select';

    if (tool === 'rect') {
      const rect = new Rect({
        left: 100,
        top: 100,
        width: 100,
        height: 100,
        fill: '#4299e1',
        stroke: '#2b6cb0',
        strokeWidth: 2,
        data: {
          regionId: `rect-${Date.now()}`,
          regionType: 'border'
        }
      });
      fabricCanvas.add(rect);
      fabricCanvas.setActiveObject(rect);
    } else if (tool === 'circle') {
      const circle = new Circle({
        left: 100,
        top: 100,
        radius: 50,
        fill: '#48bb78',
        stroke: '#38a169',
        strokeWidth: 2,
        data: {
          regionId: `circle-${Date.now()}`,
          regionType: 'decoration'
        }
      });
      fabricCanvas.add(circle);
      fabricCanvas.setActiveObject(circle);
    } else if (tool === 'text') {
      const text = new IText('Sample Text', {
        left: 100,
        top: 100,
        fontFamily: 'Arial',
        fontSize: 20,
        fill: '#2d3748',
        data: {
          regionId: `text-${Date.now()}`,
          regionType: 'text'
        }
      });
      fabricCanvas.add(text);
      fabricCanvas.setActiveObject(text);
    }

    fabricCanvas.renderAll();
  };

  const handleParameterChange = (paramId: string, value: any) => {
    const newValues = { ...parameterValues, [paramId]: value };
    setParameterValues(newValues);

    // Apply parameter to canvas
    if (fabricCanvas && parameters.fabricBindings) {
      templateParameterizer.applyParametersToCanvas(
        fabricCanvas,
        newValues,
        parameters.fabricBindings
      );
    }
  };

  const exportTemplate = useCallback(() => {
    const templateData = {
      name: componentName,
      svg: generatedSVG,
      css: generatedCSS,
      component: generatedComponent,
      parameters: parameters.parameters || [],
      fabricData: fabricCanvas?.toJSON(),
      detectedRegions
    };

    onTemplateGenerated?.(templateData);
    toast.success('Template generated successfully!');
  }, [componentName, generatedSVG, generatedCSS, generatedComponent, parameters, fabricCanvas, detectedRegions, onTemplateGenerated]);

  const copyToClipboard = async (content: string, type: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success(`${type} copied to clipboard!`);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const renderParameterControl = (param: any) => {
    const value = parameterValues[param.id] ?? param.defaultValue;

    switch (param.type) {
      case 'color':
        return (
          <div key={param.id} className="space-y-2">
            <Label className="text-crd-white">{param.name}</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={value}
                onChange={(e) => handleParameterChange(param.id, e.target.value)}
                className="w-12 h-8 rounded border-none cursor-pointer"
              />
              <Input
                value={value}
                onChange={(e) => handleParameterChange(param.id, e.target.value)}
                className="flex-1 bg-crd-darker border-crd-mediumGray/30 text-crd-white"
              />
            </div>
          </div>
        );

      case 'number':
        return (
          <div key={param.id} className="space-y-2">
            <Label className="text-crd-white">{param.name}</Label>
            <Slider
              value={[value]}
              onValueChange={([newValue]) => handleParameterChange(param.id, newValue)}
              min={param.constraints?.min || 0}
              max={param.constraints?.max || 100}
              step={0.1}
            />
            <div className="text-sm text-crd-lightGray">{value}</div>
          </div>
        );

      case 'text':
        return (
          <div key={param.id} className="space-y-2">
            <Label className="text-crd-white">{param.name}</Label>
            <Input
              value={value}
              onChange={(e) => handleParameterChange(param.id, e.target.value)}
              className="bg-crd-darker border-crd-mediumGray/30 text-crd-white"
            />
          </div>
        );

      case 'boolean':
        return (
          <div key={param.id} className="flex items-center justify-between">
            <Label className="text-crd-white">{param.name}</Label>
            <Switch
              checked={value}
              onCheckedChange={(checked) => handleParameterChange(param.id, checked)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
      {/* Canvas Area */}
      <div className="xl:col-span-2">
        <Card className="bg-crd-darker border-crd-mediumGray/20 h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-crd-white">Template Editor</CardTitle>
              <div className="flex items-center gap-2">
                <Input
                  value={componentName}
                  onChange={(e) => setComponentName(e.target.value)}
                  placeholder="Component Name"
                  className="w-48 bg-crd-darkest border-crd-mediumGray/30 text-crd-white"
                />
                <CRDButton
                  size="sm"
                  variant={showPreview ? "primary" : "outline"}
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </CRDButton>
                <CRDButton
                  size="sm"
                  variant="outline"
                  onClick={regenerateTemplate}
                >
                  <Refresh className="w-4 h-4" />
                </CRDButton>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Toolbar */}
            <div className="flex items-center gap-2 mb-4 p-3 bg-crd-darkest rounded-lg">
              <CRDButton
                size="sm"
                variant={selectedTool === 'select' ? "primary" : "outline"}
                onClick={() => handleToolClick('select')}
              >
                Select
              </CRDButton>
              <CRDButton
                size="sm"
                variant={selectedTool === 'rect' ? "primary" : "outline"}
                onClick={() => handleToolClick('rect')}
              >
                <Square className="w-4 h-4" />
              </CRDButton>
              <CRDButton
                size="sm"
                variant={selectedTool === 'circle' ? "primary" : "outline"}
                onClick={() => handleToolClick('circle')}
              >
                <CircleIcon className="w-4 h-4" />
              </CRDButton>
              <CRDButton
                size="sm"
                variant={selectedTool === 'text' ? "primary" : "outline"}
                onClick={() => handleToolClick('text')}
              >
                <Type className="w-4 h-4" />
              </CRDButton>
            </div>

            {/* Canvas */}
            <div className="relative border border-crd-mediumGray/30 rounded-lg">
              <canvas
                ref={canvasRef}
                className="max-w-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls & Code Panel */}
      <div className="space-y-6">
        {/* Parameters Panel */}
        {parameters.parameters?.length > 0 && (
          <Card className="bg-crd-darker border-crd-mediumGray/20">
            <CardHeader>
              <CardTitle className="text-crd-white text-sm">Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-64 overflow-y-auto">
              {parameters.parameters.map(renderParameterControl)}
            </CardContent>
          </Card>
        )}

        {/* Code View */}
        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardHeader>
            <CardTitle className="text-crd-white text-sm flex items-center gap-2">
              <Code className="w-4 h-4" />
              Generated Code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="svg" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-crd-darkest">
                <TabsTrigger value="svg">SVG</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
                <TabsTrigger value="component">Component</TabsTrigger>
              </TabsList>

              <TabsContent value="svg" className="space-y-2">
                <div className="flex justify-end">
                  <CRDButton
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(generatedSVG, 'SVG')}
                  >
                    <Copy className="w-3 h-3" />
                  </CRDButton>
                </div>
                <pre className="bg-crd-darkest p-3 rounded text-xs text-crd-lightGray overflow-x-auto max-h-32">
                  {generatedSVG}
                </pre>
              </TabsContent>

              <TabsContent value="css" className="space-y-2">
                <div className="flex justify-end">
                  <CRDButton
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(generatedCSS, 'CSS')}
                  >
                    <Copy className="w-3 h-3" />
                  </CRDButton>
                </div>
                <pre className="bg-crd-darkest p-3 rounded text-xs text-crd-lightGray overflow-x-auto max-h-32">
                  {generatedCSS}
                </pre>
              </TabsContent>

              <TabsContent value="component" className="space-y-2">
                <div className="flex justify-end">
                  <CRDButton
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(generatedComponent, 'Component')}
                  >
                    <Copy className="w-3 h-3" />
                  </CRDButton>
                </div>
                <pre className="bg-crd-darkest p-3 rounded text-xs text-crd-lightGray overflow-x-auto max-h-32">
                  {generatedComponent}
                </pre>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Export Button */}
        <CRDButton
          className="w-full"
          variant="primary"
          onClick={exportTemplate}
          disabled={!generatedSVG}
        >
          <Download className="w-4 h-4 mr-2" />
          Export Template
        </CRDButton>
      </div>
    </div>
  );
};
